package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.level.ChunkPos;
import net.minecraft.world.phys.AABB;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 每区块普通生物硬上限（默认关闭）。
 *
 * 某个区块内普通生物数量超过阈值时，按比例抽稀 tick，而不是删除实体，
 * 因此不会丢失存档数据，只是超载区块的生物行为变慢。
 * 命名怪、强制持久化实体、玩家与载具不受影响。
 *
 * 计数按区块缓存，默认 60 tick 刷新一次，避免每 tick 全量查询。
 */
@Mixin(value = ServerLevel.class, remap = false)
public abstract class EntityChunkCapMixin {

    private static final Map<Long, long[]> CDPRFPS$CHUNK_CACHE = new ConcurrentHashMap<>();

    @Inject(
            method = "tickNonPassenger(Lnet/minecraft/world/entity/Entity;)V",
            at = @At("HEAD"),
            cancellable = true,
            remap = false
    )
    private void cdprfps$capChunkEntities(Entity entity, CallbackInfo ci) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.entityChunkCap) {
            return;
        }
        int limit = CdprFpsConfig.entityChunkCapLimit;
        if (limit <= 0 || !(entity instanceof Mob)) {
            return;
        }
        Mob mob = (Mob) entity;
        if (mob.isPersistenceRequired() || mob.isVehicle() || !mob.getPassengers().isEmpty()) {
            return;
        }
        ServerLevel level = (ServerLevel) (Object) this;
        ChunkPos chunkPos = new ChunkPos(mob.blockPosition());
        long key = chunkPos.toLong();
        long now = level.getGameTime();
        int interval = Math.max(20, CdprFpsConfig.entityChunkCapInterval);

        long[] cached = CDPRFPS$CHUNK_CACHE.get(key);
        int count;
        if (cached == null || now - cached[0] >= interval) {
            AABB box = new AABB(
                    chunkPos.getMinBlockX(), level.getMinBuildHeight(), chunkPos.getMinBlockZ(),
                    chunkPos.getMaxBlockX() + 1, level.getMaxBuildHeight(), chunkPos.getMaxBlockZ() + 1);
            count = level.getEntitiesOfClass(Mob.class, box).size();
            if (CDPRFPS$CHUNK_CACHE.size() > 4096) {
                CDPRFPS$CHUNK_CACHE.clear();
            }
            CDPRFPS$CHUNK_CACHE.put(key, new long[]{now, count});
        } else {
            count = (int) cached[1];
        }

        if (count <= limit) {
            return;
        }
        int step = (count / limit) + 1;
        if (mob.getId() % step != 0) {
            ci.cancel();
        }
    }
}
