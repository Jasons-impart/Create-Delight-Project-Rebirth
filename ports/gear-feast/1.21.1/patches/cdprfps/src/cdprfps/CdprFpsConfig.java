package cdprfps;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.EntityType;
import org.slf4j.Logger;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * 配置文件读写。文件位置：.minecraft/config/cdprfps.json
 * 客户端与服务端共用一个文件；服务端专用项在专用服务端也生效。
 */
public final class CdprFpsConfig {

    public static final Path PATH = Paths.get("config", "cdprfps.json");
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create();

    /** 主开关，F6 切换。关闭时所有优化项全部失效，等同于未安装。 */
    public static boolean enabled = true;

    // ---------------- 客户端 ----------------

    /** 方块实体（机器、箱子、告示牌、Create 装置等）远距离剔除。 */
    public static boolean blockEntityCulling = true;
    /** 默认 32 格：渲染距离 8 区块时，48 格几乎覆盖了全部可加载范围，等于没剔除。 */
    public static double blockEntityDistance = 32.0D;
    /** 永远不做距离剔除的方块实体类型。 */
    public static final List<String> blockEntitySkipList = new ArrayList<>(List.of(
            "minecraft:beacon",
            "minecraft:end_gateway",
            "minecraft:conduit",
            "minecraft:bell"
    ));

    /** 掉落物实体远距离剔除。 */
    public static boolean itemEntityCulling = true;
    public static double itemEntityDistance = 40.0D;

    /** 客户端粒子总量上限。实测只有 127 个粒子，默认关闭。 */
    public static boolean particleLimit = false;
    public static int maxParticles = 1200;

    // ---------------- 服务端 ----------------

    /** 远距离生物 tick 节流：距离外的生物隔 tick 执行。 */
    public static boolean farEntityTickThrottle = true;
    /** 超过这个距离（格）才开始节流。 */
    public static double farEntityTickDistance = 64.0D;
    /** 节流倍率：2 = 每 2 tick 一次，3 = 每 3 tick 一次。 */
    public static int farEntityTickDivisor = 2;
    /** 不参与节流的实体命名空间或完整 id（如 create、minecraft:zombie）。 */
    public static final List<String> farTickBlacklist = new ArrayList<>(List.of(
            "create",
            "simulated",
            "sable",
            "aerowarptics",
            "valkyrienskies",
            "touhou_little_maid",
            "carryon",
            "cataclysm",
            "alexscaves"
    ));

    /** 附近同类掉落物合并（原版只在碰撞盒接触时合并，这里放大到可配置半径）。 */
    public static boolean itemEntityMerge = true;
    /** 合并检查间隔（tick）。 */
    public static int itemMergeIntervalTicks = 40;
    /** 合并半径（格）。 */
    public static double itemMergeRadius = 2.0D;

    /** 每区块普通生物硬上限（默认关闭，防止误伤机制）。 */
    public static boolean entityChunkCap = false;
    public static int entityChunkCapLimit = 64;
    /** 区块计数刷新间隔（tick）。 */
    public static int entityChunkCapInterval = 60;

    // ---------------- 维度闸门（1.2.0） ----------------

    /** 维度处理档位。 */
    public enum Mode {
        /** 不干预。 */
        ALWAYS,
        /** 区块照常加载，tick 降频。 */
        THROTTLE,
        /** 完全不 tick。 */
        FREEZE
    }

    /** 维度档位表：key 为维度 id 或前缀，value 为 always / throttle / freeze。 */
    public static final Map<String, String> dimensionModes = new LinkedHashMap<>();
    /** throttle 档的分母：4 表示每 4 tick 跑一次。 */
    public static int dimensionThrottleDivisor = 4;
    /** 无玩家维度默认档位（always 除外时才会生效）。 */
    public static String defaultDimensionMode = "freeze";
    /** always 的简写形式，等价于 dimensionModes 里写 always。 */
    public static final List<String> dimensionWhitelist = new ArrayList<>(List.of(
            "minecraft:overworld"
    ));
    /** 冻结中的维度收到新 chunk ticket 时临时解冻，避免传送/装置加载卡死。 */
    public static boolean unfreezeOnTicket = true;
    /** 临时解冻持续 tick 数。 */
    public static int dimensionUnfreezeGraceTicks = 200;

    /** 单维度区块上限，超限后拒绝新增 ticket。 */
    public static boolean chunkLimitEnabled = true;
    /** 默认上限；主世界会按视距+模拟距离自动抬高，避免自锁。 */
    public static int chunkLimitPerDimension = 600;
    /** 超限时主动回收票据（默认开）。 */
    public static boolean chunkEvictionEnabled = true;
    /** 是否连 forceload 的强加载票据一起回收（默认关）。 */
    public static boolean evictForcedChunks = false;
    /** 回收时保留的玩家半径（区块）。 */
    public static int ticketEvictionKeepRadiusChunks = 8;

    // ---------------- 按玩家限距（1.3.0） ----------------

    /** 按玩家限距总开关。 */
    public static boolean perPlayerLimitsEnabled = true;
    /** 服务端下发给玩家的视距上限（区块）。 */
    public static int playerViewDistanceCap = 8;
    /** 服务端模拟距离上限（区块）。 */
    public static int playerSimulationDistanceCap = 5;
    /** 每玩家区块票据硬上限，换算成半径后与视距上限取更小者。 */
    public static int playerTicketLimit = 300;
    /** 每玩家 tick 半径（区块）：超出后该区块的随机刻/冰霜/雷击不再执行。 */
    public static int playerTickRadiusChunks = 5;

    // ---------------- 实体硬上限（1.4.0） ----------------

    public static boolean entityCapsEnabled = true;
    public static int entityCapMonster = 40;
    public static int entityCapCreature = 25;
    public static int entityCapAmbient = 8;
    public static int entityCapWater = 8;
    public static int entityCapItem = 15;
    public static int entityCapProjectile = 10;
    public static int entityCapCheckInterval = 40;
    /** 超距清理：普通生物/掉落物超出该距离直接移除。 */
    public static boolean entityDespawnEnabled = true;
    public static int entityDespawnDistanceBlocks = 96;
    /** 永不清理的命名空间（载具、装置、任务实体等）。 */
    public static final List<String> entityProtectList = new ArrayList<>(List.of(
            "create", "simulated", "sable", "aerowarptics", "valkyrienskies",
            "touhou_little_maid", "carryon", "cataclysm", "alexscaves"
    ));

    /** 实际生效的视距上限：视距配置与「票据上限换算半径」取更小者。 */
    public static int effectiveViewDistanceCap() {
        if (!perPlayerLimitsEnabled) {
            return Integer.MAX_VALUE;
        }
        int cap = Math.max(2, playerViewDistanceCap);
        if (playerTicketLimit > 0) {
            int byTicket = (int) Math.floor((Math.sqrt(playerTicketLimit) - 1.0) / 2.0);
            cap = Math.min(cap, Math.max(2, byTicket));
        }
        return cap;
    }

    /** 实际生效的 tick 半径（区块）；0 表示不限。 */
    public static int effectiveTickRadius() {
        if (!perPlayerLimitsEnabled) {
            return 0;
        }
        int radius = Math.max(1, playerTickRadiusChunks);
        if (playerSimulationDistanceCap > 0) {
            radius = Math.min(radius, playerSimulationDistanceCap);
        }
        return radius;
    }

    private CdprFpsConfig() {
    }

    public static void load(Logger log) {
        try {
            if (Files.notExists(PATH)) {
                save(log);
                log.info("[CDPRFPS] 未找到配置文件，已生成默认配置：{}", PATH.toAbsolutePath());
                return;
            }
            String text = Files.readString(PATH, StandardCharsets.UTF_8);
            JsonObject json = JsonParser.parseString(text).getAsJsonObject();

            enabled = readBool(json, "enabled", enabled);

            blockEntityCulling = readBool(json, "blockEntityCulling", blockEntityCulling);
            blockEntityDistance = readDouble(json, "blockEntityDistance", blockEntityDistance);
            itemEntityCulling = readBool(json, "itemEntityCulling", itemEntityCulling);
            itemEntityDistance = readDouble(json, "itemEntityDistance", itemEntityDistance);
            particleLimit = readBool(json, "particleLimit", particleLimit);
            maxParticles = (int) readDouble(json, "maxParticles", maxParticles);

            farEntityTickThrottle = readBool(json, "farEntityTickThrottle", farEntityTickThrottle);
            farEntityTickDistance = readDouble(json, "farEntityTickDistance", farEntityTickDistance);
            farEntityTickDivisor = (int) readDouble(json, "farEntityTickDivisor", farEntityTickDivisor);

            itemEntityMerge = readBool(json, "itemEntityMerge", itemEntityMerge);
            itemMergeIntervalTicks = (int) readDouble(json, "itemMergeIntervalTicks", itemMergeIntervalTicks);
            itemMergeRadius = readDouble(json, "itemMergeRadius", itemMergeRadius);

            entityChunkCap = readBool(json, "entityChunkCap", entityChunkCap);
            entityChunkCapLimit = (int) readDouble(json, "entityChunkCapLimit", entityChunkCapLimit);
            entityChunkCapInterval = (int) readDouble(json, "entityChunkCapInterval", entityChunkCapInterval);

            unfreezeOnTicket = readBool(json, "unfreezeOnTicket", unfreezeOnTicket);
            dimensionUnfreezeGraceTicks = (int) readDouble(json, "dimensionUnfreezeGraceTicks", dimensionUnfreezeGraceTicks);
            chunkLimitEnabled = readBool(json, "chunkLimitEnabled", chunkLimitEnabled);
            chunkLimitPerDimension = (int) readDouble(json, "chunkLimitPerDimension", chunkLimitPerDimension);
            chunkEvictionEnabled = readBool(json, "chunkEvictionEnabled", chunkEvictionEnabled);
            evictForcedChunks = readBool(json, "evictForcedChunks", evictForcedChunks);
            ticketEvictionKeepRadiusChunks = (int) readDouble(json, "ticketEvictionKeepRadiusChunks", ticketEvictionKeepRadiusChunks);
            perPlayerLimitsEnabled = readBool(json, "perPlayerLimitsEnabled", perPlayerLimitsEnabled);
            playerViewDistanceCap = (int) readDouble(json, "playerViewDistanceCap", playerViewDistanceCap);
            playerSimulationDistanceCap = (int) readDouble(json, "playerSimulationDistanceCap", playerSimulationDistanceCap);
            playerTicketLimit = (int) readDouble(json, "playerTicketLimit", playerTicketLimit);
            playerTickRadiusChunks = (int) readDouble(json, "playerTickRadiusChunks", playerTickRadiusChunks);
            entityCapsEnabled = readBool(json, "entityCapsEnabled", entityCapsEnabled);
            entityCapMonster = (int) readDouble(json, "entityCapMonster", entityCapMonster);
            entityCapCreature = (int) readDouble(json, "entityCapCreature", entityCapCreature);
            entityCapAmbient = (int) readDouble(json, "entityCapAmbient", entityCapAmbient);
            entityCapWater = (int) readDouble(json, "entityCapWater", entityCapWater);
            entityCapItem = (int) readDouble(json, "entityCapItem", entityCapItem);
            entityCapProjectile = (int) readDouble(json, "entityCapProjectile", entityCapProjectile);
            entityCapCheckInterval = (int) readDouble(json, "entityCapCheckInterval", entityCapCheckInterval);
            entityDespawnEnabled = readBool(json, "entityDespawnEnabled", entityDespawnEnabled);
            entityDespawnDistanceBlocks = (int) readDouble(json, "entityDespawnDistanceBlocks", entityDespawnDistanceBlocks);
            readList(json, "entityProtectList", entityProtectList);
            dimensionThrottleDivisor = (int) readDouble(json, "dimensionThrottleDivisor", dimensionThrottleDivisor);
            if (json.has("defaultDimensionMode")) {
                defaultDimensionMode = json.get("defaultDimensionMode").getAsString();
            }
            if (json.has("dimensionModes") && json.get("dimensionModes").isJsonObject()) {
                dimensionModes.clear();
                for (Map.Entry<String, JsonElement> entry : json.getAsJsonObject("dimensionModes").entrySet()) {
                    dimensionModes.put(entry.getKey(), entry.getValue().getAsString());
                }
            }

            readList(json, "blockEntitySkipList", blockEntitySkipList);
            readList(json, "farTickBlacklist", farTickBlacklist);
            readList(json, "dimensionWhitelist", dimensionWhitelist);

            log.info("[CDPRFPS] 配置已加载：enabled={}, 方块实体剔除={}({}格), 掉落物剔除={}({}格), 粒子上限={}({})",
                    enabled, blockEntityCulling, blockEntityDistance,
                    itemEntityCulling, itemEntityDistance,
                    particleLimit, maxParticles);
            log.info("[CDPRFPS] 服务端配置：远距离tick节流={}(>{}格, 1/{}), 掉落物合并={}({}格/{}tick), 区块上限={}({})",
                    farEntityTickThrottle, farEntityTickDistance, farEntityTickDivisor,
                    itemEntityMerge, itemMergeRadius, itemMergeIntervalTicks,
                    entityChunkCap, entityChunkCapLimit);
            log.info("[CDPRFPS] 维度闸门：区块上限={}({}/维度), throttle 分母={}, 默认档位={}, 覆盖规则={} 条",
                    chunkLimitEnabled, chunkLimitPerDimension,
                    dimensionThrottleDivisor, defaultDimensionMode, dimensionModes.size());
            log.info("[CDPRFPS] 按玩家限距：总开关={}, 视距上限={} 区块(票据上限{}), 模拟距离上限={} 区块, tick 半径={} 区块",
                    perPlayerLimitsEnabled, effectiveViewDistanceCap(), playerTicketLimit,
                    playerSimulationDistanceCap, effectiveTickRadius());
            log.info("[CDPRFPS] 实体上限：开关={}, 怪物={}, 生物={}, 环境={}, 水生={}, 掉落物={}, 投射物={}, 超距清理={}({}格)",
                    entityCapsEnabled, entityCapMonster, entityCapCreature, entityCapAmbient,
                    entityCapWater, entityCapItem, entityCapProjectile,
                    entityDespawnEnabled, entityDespawnDistanceBlocks);
        } catch (Exception e) {
            log.error("[CDPRFPS] 配置读取失败，改用默认值继续", e);
        }
    }

    public static void save(Logger log) {
        JsonObject json = new JsonObject();
        json.addProperty("enabled", enabled);

        json.addProperty("blockEntityCulling", blockEntityCulling);
        json.addProperty("blockEntityDistance", blockEntityDistance);
        json.addProperty("itemEntityCulling", itemEntityCulling);
        json.addProperty("itemEntityDistance", itemEntityDistance);
        json.addProperty("particleLimit", particleLimit);
        json.addProperty("maxParticles", maxParticles);
        json.add("blockEntitySkipList", GSON.toJsonTree(blockEntitySkipList));

        json.addProperty("farEntityTickThrottle", farEntityTickThrottle);
        json.addProperty("farEntityTickDistance", farEntityTickDistance);
        json.addProperty("farEntityTickDivisor", farEntityTickDivisor);
        json.add("farTickBlacklist", GSON.toJsonTree(farTickBlacklist));

        json.addProperty("itemEntityMerge", itemEntityMerge);
        json.addProperty("itemMergeIntervalTicks", itemMergeIntervalTicks);
        json.addProperty("itemMergeRadius", itemMergeRadius);

        json.addProperty("entityChunkCap", entityChunkCap);
        json.addProperty("entityChunkCapLimit", entityChunkCapLimit);
        json.addProperty("entityChunkCapInterval", entityChunkCapInterval);

        json.add("dimensionWhitelist", GSON.toJsonTree(dimensionWhitelist));
        json.add("dimensionModes", GSON.toJsonTree(dimensionModes));
        json.addProperty("defaultDimensionMode", defaultDimensionMode);
        json.addProperty("dimensionThrottleDivisor", dimensionThrottleDivisor);
        json.addProperty("unfreezeOnTicket", unfreezeOnTicket);
        json.addProperty("dimensionUnfreezeGraceTicks", dimensionUnfreezeGraceTicks);
        json.addProperty("chunkLimitEnabled", chunkLimitEnabled);
        json.addProperty("chunkLimitPerDimension", chunkLimitPerDimension);
        json.addProperty("chunkEvictionEnabled", chunkEvictionEnabled);
        json.addProperty("evictForcedChunks", evictForcedChunks);
        json.addProperty("ticketEvictionKeepRadiusChunks", ticketEvictionKeepRadiusChunks);
        json.addProperty("perPlayerLimitsEnabled", perPlayerLimitsEnabled);
        json.addProperty("playerViewDistanceCap", playerViewDistanceCap);
        json.addProperty("playerSimulationDistanceCap", playerSimulationDistanceCap);
        json.addProperty("playerTicketLimit", playerTicketLimit);
        json.addProperty("playerTickRadiusChunks", playerTickRadiusChunks);
        json.addProperty("entityCapsEnabled", entityCapsEnabled);
        json.addProperty("entityCapMonster", entityCapMonster);
        json.addProperty("entityCapCreature", entityCapCreature);
        json.addProperty("entityCapAmbient", entityCapAmbient);
        json.addProperty("entityCapWater", entityCapWater);
        json.addProperty("entityCapItem", entityCapItem);
        json.addProperty("entityCapProjectile", entityCapProjectile);
        json.addProperty("entityCapCheckInterval", entityCapCheckInterval);
        json.addProperty("entityDespawnEnabled", entityDespawnEnabled);
        json.addProperty("entityDespawnDistanceBlocks", entityDespawnDistanceBlocks);
        json.add("entityProtectList", GSON.toJsonTree(entityProtectList));

        try {
            Files.createDirectories(PATH.getParent());
            Files.writeString(PATH, GSON.toJson(json), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("[CDPRFPS] 配置写入失败", e);
        }
    }

    /** 实体是否命中远距离节流黑名单（支持命名空间或完整 id）。 */
    public static boolean isEntityBlacklisted(EntityType<?> type) {
        ResourceLocation id = BuiltInRegistries.ENTITY_TYPE.getKey(type);
        if (id == null) {
            return false;
        }
        String full = id.toString();
        String namespace = id.getNamespace();
        for (String entry : farTickBlacklist) {
            if (entry.equals(full) || entry.equals(namespace)) {
                return true;
            }
        }
        return false;
    }

    /** 维度是否在免冻结白名单里（支持完整 id 或前缀，如 "northstar:"）。 */
    public static boolean isDimensionWhitelisted(ResourceLocation id) {
        String full = id.toString();
        for (String entry : dimensionWhitelist) {
            if (full.equals(entry) || full.startsWith(entry)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 解析维度最终档位，优先级：
     * dimensionModes 精确匹配 > dimensionModes 最长前缀 > dimensionWhitelist(always) > defaultDimensionMode。
     */
    public static Mode resolveDimensionMode(ResourceLocation id) {
        String full = id.toString();
        String matched = null;
        if (dimensionModes.containsKey(full)) {
            matched = full;
        } else {
            for (String key : dimensionModes.keySet()) {
                if (!key.isEmpty() && full.startsWith(key) && (matched == null || key.length() > matched.length())) {
                    matched = key;
                }
            }
        }
        if (matched != null) {
            return parseMode(dimensionModes.get(matched));
        }
        if (isDimensionWhitelisted(id)) {
            return Mode.ALWAYS;
        }
        return parseMode(defaultDimensionMode);
    }

    public static Mode parseMode(String raw) {
        if (raw == null) {
            return Mode.FREEZE;
        }
        switch (raw.toLowerCase(Locale.ROOT)) {
            case "always":
                return Mode.ALWAYS;
            case "throttle":
                return Mode.THROTTLE;
            case "freeze":
            default:
                return Mode.FREEZE;
        }
    }

    /** 该维度是否被 dimensionModes 显式配置过（用于 list 显示「默认(...)」）。 */
    public static boolean hasExplicitMode(ResourceLocation id) {
        String full = id.toString();
        if (dimensionModes.containsKey(full)) {
            return true;
        }
        for (String key : dimensionModes.keySet()) {
            if (!key.isEmpty() && full.startsWith(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 只更新 config/cdprfps.json 里的 dimensionModes 一段，其余键原样保留。
     * 使用与初次生成相同的 Gson 格式，不会重排其它键。
     */
    public static void persistDimensionMode(Logger log) {
        try {
            JsonObject root;
            if (Files.exists(PATH)) {
                root = JsonParser.parseString(Files.readString(PATH, StandardCharsets.UTF_8)).getAsJsonObject();
            } else {
                root = new JsonObject();
            }
            root.add("dimensionModes", GSON.toJsonTree(dimensionModes));
            Files.createDirectories(PATH.getParent());
            Files.writeString(PATH, GSON.toJson(root), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("[CDPRFPS] 写回 dimensionModes 失败", e);
        }
    }

    private static void readList(JsonObject json, String key, List<String> target) {
        if (json.has(key) && json.get(key).isJsonArray()) {
            target.clear();
            for (JsonElement element : json.getAsJsonArray(key)) {
                target.add(element.getAsString());
            }
        }
    }

    private static boolean readBool(JsonObject json, String key, boolean def) {
        return json.has(key) ? json.get(key).getAsBoolean() : def;
    }

    private static double readDouble(JsonObject json, String key, double def) {
        return json.has(key) ? json.get(key).getAsDouble() : def;
    }
}
