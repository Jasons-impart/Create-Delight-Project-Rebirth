package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import cdprfps.CdprFpsMod;
import cdprfps.CdprFpsStats;
import cdprfps.DimensionGate;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerChunkCache;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.TicketType;
import net.minecraft.world.level.ChunkPos;
import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * 单维度区块上限 + 冻结维度收到 ticket 时的临时解冻。
 *
 * 两件事共用一个注入点（addRegionTicket 的 HEAD），不重复注入：
 *  1) 冻结中的维度一旦有人/装置请求 chunk ticket，立即临时解冻，避免传送与装置加载卡死；
 *  2) 该维度已加载区块数达到上限时拒绝新 ticket，并按维度累计被拒次数，
 *     由 DimensionModeMixin 每 100 tick 汇总打印。
 */
@Mixin(value = ServerChunkCache.class, remap = false)
public abstract class ChunkTicketLimitMixin {

    @Shadow
    @Final
    ServerLevel level;

    @Inject(method = "addRegionTicket", at = @At("HEAD"), cancellable = true, remap = false)
    private void cdprfps$gateTickets(TicketType<?> type, ChunkPos pos, int distance, Object value, CallbackInfo ci) {
        if (!CdprFpsConfig.enabled) {
            return;
        }
        ServerLevel level = this.level;
        ResourceLocation id = level.dimension().location();

        if (CdprFpsConfig.unfreezeOnTicket && DimensionGate.isFrozen(id)) {
            long until = level.getGameTime() + Math.max(20, CdprFpsConfig.dimensionUnfreezeGraceTicks);
            DimensionGate.grace(id, until);
            if (DimensionGate.markModeLogged(id, "grace")) {
                CdprFpsMod.LOG.info("[CDPRFPS] 维度 {} 收到 ticket，临时解冻 {} tick", id,
                        Math.max(20, CdprFpsConfig.dimensionUnfreezeGraceTicks));
            }
        }

        if (!CdprFpsConfig.chunkLimitEnabled) {
            return;
        }
        int limit = cdprfps$effectiveLimit(level);
        if (limit <= 0) {
            return;
        }
        if (((ServerChunkCache) (Object) this).getLoadedChunksCount() >= limit) {
            CdprFpsStats.reject(id);
            ci.cancel();
        }
    }

    /** 主世界按视距+模拟距离抬高上限，避免把自己卡死。 */
    private int cdprfps$effectiveLimit(ServerLevel level) {
        int configured = CdprFpsConfig.chunkLimitPerDimension;
        if (configured <= 0) {
            return 0;
        }
        try {
            var playerList = level.getServer().getPlayerList();
            int viewDistance = playerList.getViewDistance();
            int simulationDistance = playerList.getSimulationDistance();
            int needed = (2 * viewDistance + 1) * (2 * viewDistance + 1)
                    + (2 * simulationDistance + 1) * (2 * simulationDistance + 1) + 128;
            return Math.max(configured, needed);
        } catch (Throwable ignored) {
            return configured;
        }
    }
}
