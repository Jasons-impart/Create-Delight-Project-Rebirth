package cdprfps;

import cdprfps.mixin.server.DistanceManagerAccessor;
import cdprfps.mixin.server.ServerChunkCacheAccessor;
import it.unimi.dsi.fastutil.longs.Long2ObjectMap;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.server.level.Ticket;
import net.minecraft.server.level.TicketType;
import net.minecraft.util.SortedArraySet;
import net.minecraft.world.level.ChunkPos;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 票据诊断与超限回收（1.3.1）。
 *
 * 诊断：按票据类型统计数量并给出样例区块坐标，能直接看出是谁在持有。
 * 回收：超过上限时，从「离玩家最远、且不属于保留类型」的票据开始撤，
 *       保留 PLAYER / START / POST_TELEPORT / PORTAL / DRAGON 以及玩家半径内的全部票据。
 */
public final class TicketDiagnostics {

    private static final List<TicketType<?>> KEEP_TYPES = List.of(
            TicketType.PLAYER,
            TicketType.START,
            TicketType.POST_TELEPORT,
            TicketType.PORTAL,
            TicketType.DRAGON
    );

    private TicketDiagnostics() {
    }

    private static Long2ObjectMap<SortedArraySet<Ticket<?>>> tickets(ServerLevel level) {
        return ((DistanceManagerAccessor) ((ServerChunkCacheAccessor) level.getChunkSource())
                .cdprfps$chunkMap().getDistanceManager()).cdprfps$tickets();
    }

    private static DistanceManagerAccessor distanceManager(ServerLevel level) {
        return (DistanceManagerAccessor) ((ServerChunkCacheAccessor) level.getChunkSource())
                .cdprfps$chunkMap().getDistanceManager();
    }

    /** 该维度实际生效的区块上限：主世界会按视距/模拟距离抬高。 */
    public static int limitFor(ServerLevel level) {
        int configured = CdprFpsConfig.chunkLimitPerDimension;
        if (configured <= 0) {
            return 0;
        }
        try {
            var playerList = level.getServer().getPlayerList();
            int view = playerList.getViewDistance();
            int sim = playerList.getSimulationDistance();
            int needed = (2 * view + 1) * (2 * view + 1)
                    + (2 * sim + 1) * (2 * sim + 1) + 128;
            return Math.max(configured, needed);
        } catch (Throwable ignored) {
            return configured;
        }
    }

    /** 按票据类型统计，附带最多 3 个样例区块坐标。 */
    public static Map<String, int[]> summary(ServerLevel level) {
        Map<String, int[]> out = new LinkedHashMap<>();
        for (Long2ObjectMap.Entry<SortedArraySet<Ticket<?>>> entry : tickets(level).long2ObjectEntrySet()) {
            int x = ChunkPos.getX(entry.getLongKey());
            int z = ChunkPos.getZ(entry.getLongKey());
            for (Ticket<?> ticket : entry.getValue()) {
                String key = String.valueOf(ticket.getType());
                int[] stat = out.computeIfAbsent(key, k -> new int[]{0, 0, 0, 0});
                stat[0]++;
                if (stat[1] < 3) {
                    int slot = 1 + stat[1] * 2;
                    stat[slot] = x;
                    stat[slot + 1] = z;
                    stat[1]++;
                }
            }
        }
        return out;
    }

    public static String describe(ServerLevel level) {
        Map<String, int[]> stats = summary(level);
        StringBuilder text = new StringBuilder();
        text.append("已加载=").append(level.getChunkSource().getLoadedChunksCount())
                .append(", 上限=").append(limitFor(level))
                .append(", 强加载(forceload)=").append(level.getForcedChunks().size())
                .append(", 票据类型=").append(stats.size());
        stats.forEach((type, stat) -> {
            text.append("\n  - ").append(type).append(": ").append(stat[0]).append(" 个");
            for (int i = 0; i < stat[1]; i++) {
                text.append(" (").append(stat[2 + i * 2]).append(',').append(stat[3 + i * 2]).append(')');
            }
        });
        return text.toString();
    }

    /**
     * 超限回收。返回按类型统计的回收数量。
     */
    public static Map<String, Integer> enforce(ServerLevel level) {
        Map<String, Integer> removed = new LinkedHashMap<>();
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.chunkEvictionEnabled) {
            return removed;
        }
        int limit = limitFor(level);
        if (limit <= 0) {
            return removed;
        }
        int loaded = level.getChunkSource().getLoadedChunksCount();
        if (loaded <= limit) {
            return removed;
        }

        int keepBlocks = Math.max(2, CdprFpsConfig.ticketEvictionKeepRadiusChunks) * 16;
        List<ServerPlayer> players = level.players();
        List<long[]> candidates = new ArrayList<>();
        List<Ticket<?>> candidateTickets = new ArrayList<>();

        for (Long2ObjectMap.Entry<SortedArraySet<Ticket<?>>> entry : tickets(level).long2ObjectEntrySet()) {
            long key = entry.getLongKey();
            int x = ChunkPos.getX(key);
            int z = ChunkPos.getZ(key);
            int centerX = x * 16 + 8;
            int centerZ = z * 16 + 8;
            boolean keep = false;
            for (ServerPlayer player : players) {
                if (Math.abs(player.getBlockX() - centerX) <= keepBlocks
                        && Math.abs(player.getBlockZ() - centerZ) <= keepBlocks) {
                    keep = true;
                    break;
                }
            }
            if (keep) {
                continue;
            }
            long distance = Long.MAX_VALUE;
            for (ServerPlayer player : players) {
                long dx = player.getBlockX() - centerX;
                long dz = player.getBlockZ() - centerZ;
                distance = Math.min(distance, dx * dx + dz * dz);
            }
            for (Ticket<?> ticket : entry.getValue()) {
                if (KEEP_TYPES.contains(ticket.getType())) {
                    continue;
                }
                if (TicketType.FORCED.equals(ticket.getType()) && !CdprFpsConfig.evictForcedChunks) {
                    continue;
                }
                candidates.add(new long[]{key, distance});
                candidateTickets.add(ticket);
            }
        }

        Integer[] order = new Integer[candidates.size()];
        for (int i = 0; i < order.length; i++) {
            order[i] = i;
        }
        java.util.Arrays.sort(order, Comparator.comparingLong(i -> -candidates.get((int) i)[1]));

        int excess = loaded - limit;
        int removedCount = 0;
        for (Integer index : order) {
            if (removedCount >= excess) {
                break;
            }
            long key = candidates.get(index)[0];
            Ticket<?> ticket = candidateTickets.get(index);
            distanceManager(level).cdprfps$removeTicket(key, ticket);
            removed.merge(String.valueOf(ticket.getType()), 1, Integer::sum);
            removedCount++;
        }
        return removed;
    }

    public static String formatRemoved(Map<String, Integer> removed) {
        StringBuilder builder = new StringBuilder();
        int total = 0;
        for (Map.Entry<String, Integer> entry : removed.entrySet()) {
            total += entry.getValue();
            if (builder.length() > 0) {
                builder.append(", ");
            }
            builder.append(entry.getKey()).append('=').append(entry.getValue());
        }
        return total + " 个票据（" + builder + "）";
    }
}
