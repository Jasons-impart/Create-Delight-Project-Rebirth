package cdprfps;

import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.entity.MobCategory;
import net.minecraft.world.entity.OwnableEntity;
import net.minecraft.world.entity.item.ItemEntity;
import net.minecraft.world.entity.projectile.Projectile;
import net.minecraft.world.phys.Vec3;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 实体硬上限 + 超距清理（1.4.0）。
 *
 * 与 1.1.0 的 entityChunkCap 不同：这里按「整维度实体总数」计数并真正移除超出部分，
 * 而不是按单区块 64 的高阈值只降频；399 这种分布在几百个区块里的实体，
 * 单区块根本到不了 64，所以旧逻辑不会触发。
 */
public final class EntityLimiter {

    /** 单次统计与清理结果，用于日志。 */
    private static int lastRemoved = 0;
    private static String lastSummary = "";

    private EntityLimiter() {
    }

    public static void tick(ServerLevel level) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.entityCapsEnabled) {
            return;
        }
        long gameTime = level.getGameTime();
        int interval = Math.max(20, CdprFpsConfig.entityCapCheckInterval);
        if (gameTime % interval != 0L) {
            return;
        }

        List<ServerPlayer> players = level.players();
        List<Entity> all = new ArrayList<>();
        level.getAllEntities().forEach(all::add);

        Map<String, List<Entity>> buckets = new LinkedHashMap<>();
        Map<String, Integer> caps = new LinkedHashMap<>();
        put(buckets, caps, "monster", CdprFpsConfig.entityCapMonster);
        put(buckets, caps, "creature", CdprFpsConfig.entityCapCreature);
        put(buckets, caps, "ambient", CdprFpsConfig.entityCapAmbient);
        put(buckets, caps, "water", CdprFpsConfig.entityCapWater);
        put(buckets, caps, "item", CdprFpsConfig.entityCapItem);
        put(buckets, caps, "projectile", CdprFpsConfig.entityCapProjectile);

        int despawnDistance = CdprFpsConfig.entityDespawnEnabled
                ? CdprFpsConfig.entityDespawnDistanceBlocks : 0;

        int removed = 0;
        for (Entity entity : all) {
            if (!(entity instanceof Mob) && !(entity instanceof ItemEntity) && !(entity instanceof Projectile)) {
                continue;
            }
            if (isProtected(entity)) {
                continue;
            }
            String bucket = bucketOf(entity);
            if (bucket == null) {
                continue;
            }
            double distance = nearestPlayerDistance(players, entity);
            if (despawnDistance > 0 && distance > despawnDistance) {
                entity.discard();
                removed++;
                continue;
            }
            buckets.get(bucket).add(entity);
            // 记录距离用于「远的先删」
            DISTANCE.put(entity, distance);
        }

        for (Map.Entry<String, List<Entity>> entry : buckets.entrySet()) {
            List<Entity> list = entry.getValue();
            int cap = caps.get(entry.getKey());
            if (cap <= 0 || list.size() <= cap) {
                continue;
            }
            list.sort(Comparator.comparingDouble((Entity e) -> DISTANCE.getOrDefault(e, 0.0)).reversed());
            for (Entity entity : list.subList(0, list.size() - cap)) {
                entity.discard();
                removed++;
            }
        }
        DISTANCE.clear();

        if (removed > 0) {
            lastRemoved = removed;
            lastSummary = describe(buckets);
            CdprFpsMod.LOG.info("[CDPRFPS] 实体上限清理 {} 个：剩余 {}", removed, lastSummary);
        }
    }

    private static final Map<Entity, Double> DISTANCE = new java.util.WeakHashMap<>();

    private static void put(Map<String, List<Entity>> buckets, Map<String, Integer> caps, String key, int cap) {
        buckets.put(key, new ArrayList<>());
        caps.put(key, cap);
    }

    private static String bucketOf(Entity entity) {
        if (entity instanceof ItemEntity) {
            return "item";
        }
        if (entity instanceof Projectile) {
            return "projectile";
        }
        if (entity instanceof Mob mob) {
            MobCategory category = mob.getType().getCategory();
            if (category == MobCategory.MONSTER) {
                return "monster";
            }
            if (category == MobCategory.CREATURE || category == MobCategory.AXOLOTLS) {
                return "creature";
            }
            if (category == MobCategory.AMBIENT || category == MobCategory.UNDERGROUND_WATER_CREATURE) {
                return "ambient";
            }
            if (category == MobCategory.WATER_CREATURE || category == MobCategory.WATER_AMBIENT) {
                return "water";
            }
        }
        return null;
    }

    private static boolean isProtected(Entity entity) {
        if (entity instanceof ServerPlayer) {
            return true;
        }
        if (entity instanceof Mob mob && mob.isPersistenceRequired()) {
            return true;
        }
        if (entity.hasCustomName()) {
            return true;
        }
        if (entity instanceof OwnableEntity ownable && ownable.getOwnerUUID() != null) {
            return true;
        }
        ResourceLocation id = net.minecraft.core.registries.BuiltInRegistries.ENTITY_TYPE.getKey(entity.getType());
        if (id != null) {
            String namespace = id.getNamespace();
            for (String entry : CdprFpsConfig.entityProtectList) {
                if (entry.equals(namespace) || entry.equals(id.toString()) || entry.equals(namespace + ":")) {
                    return true;
                }
            }
        }
        return false;
    }

    private static double nearestPlayerDistance(List<ServerPlayer> players, Entity entity) {
        if (players.isEmpty()) {
            return 0.0;
        }
        Vec3 pos = entity.position();
        double best = Double.MAX_VALUE;
        for (ServerPlayer player : players) {
            if (player.level() != entity.level()) {
                continue;
            }
            best = Math.min(best, player.position().distanceToSqr(pos));
        }
        return best == Double.MAX_VALUE ? 0.0 : Math.sqrt(best);
    }

    private static String describe(Map<String, List<Entity>> buckets) {
        StringBuilder text = new StringBuilder();
        buckets.forEach((key, list) -> {
            if (text.length() > 0) {
                text.append(", ");
            }
            text.append(key).append('=').append(list.size());
        });
        return text.toString();
    }

    public static int lastRemoved() {
        return lastRemoved;
    }

    public static String lastSummary() {
        return lastSummary;
    }
}
