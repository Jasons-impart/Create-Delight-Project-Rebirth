package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import cdprfps.CdprFpsMod;
import cdprfps.CdprFpsStats;
import cdprfps.DimensionGate;
import cdprfps.EntityLimiter;
import cdprfps.TicketDiagnostics;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.level.Level;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import java.util.Map;
import java.util.function.BooleanSupplier;

/**
 * 维度闸门（1.2.0）。
 *
 * 在 ServerLevel.tick 最外层按维度档位决定是否继续执行整个 tick：
 *  - always  ：完全不干预
 *  - throttle：仅在 gameTime % 分母 == 0 的 tick 执行，区块照常加载，农场变慢但不停摆
 *  - freeze  ：直接取消 tick
 *
 * 主世界固定 always；维度内有玩家时临时按 always 处理（避免玩家进入后行为异常）。
 * 冻结/降频只影响该维度的 tick，不改变其它维度的执行。
 *
 * 注意：冻结/降频会把整段 tick 一起跳过（含区块刻、方块实体、实体、时间推进、天气），
 * 这是「省 tick」的代价，README 中有说明。
 */
@Mixin(value = ServerLevel.class, remap = false)
public abstract class DimensionModeMixin {

    private static long cdprfps$lastSummaryTick = -1L;

    @Inject(method = "tick", at = @At("HEAD"), cancellable = true, remap = false)
    private void cdprfps$applyDimensionMode(BooleanSupplier hasTimeLeft, CallbackInfo ci) {
        ServerLevel level = (ServerLevel) (Object) this;
        ResourceLocation id = level.dimension().location();
        long now = level.getGameTime();

        cdprfps$logRejectedSummary(id, now);
        cdprfps$enforceChunkLimit(level, now);

        if (!CdprFpsConfig.enabled) {
            if (DimensionGate.thaw(id)) {
                CdprFpsMod.LOG.info("[CDPRFPS] 维度 {} -> always(闸门关闭)", id);
            }
            return;
        }

        boolean overworld = level.dimension().equals(Level.OVERWORLD);
        boolean hasPlayers = !level.players().isEmpty();
        CdprFpsConfig.Mode mode = (overworld || hasPlayers)
                ? CdprFpsConfig.Mode.ALWAYS
                : CdprFpsConfig.resolveDimensionMode(id);

        if (mode != CdprFpsConfig.Mode.FREEZE) {
            EntityLimiter.tick(level);
        }

        if (mode == CdprFpsConfig.Mode.ALWAYS) {
            if (DimensionGate.thaw(id)) {
                CdprFpsMod.LOG.info("[CDPRFPS] 维度 {} -> always", id);
            }
            return;
        }

        // 刚收到 ticket 的维度处于临时解冻期，先让它正常跑完传送/加载
        if (DimensionGate.inGrace(id, now)) {
            return;
        }

        if (mode == CdprFpsConfig.Mode.FREEZE) {
            if (DimensionGate.freeze(id) && DimensionGate.markModeLogged(id, "freeze")) {
                CdprFpsMod.LOG.info("[CDPRFPS] 维度 {} -> freeze", id);
            }
            ci.cancel();
            return;
        }

        int divisor = Math.max(2, CdprFpsConfig.dimensionThrottleDivisor);
        if (now % divisor != 0L) {
            if (DimensionGate.markModeLogged(id, "throttle/" + divisor)) {
                CdprFpsMod.LOG.info("[CDPRFPS] 维度 {} -> throttle(1/{})", id, divisor);
            }
            ci.cancel();
        }
    }

    /** 每 100 tick 检查一次区块上限，超限则从最远的非保留票据开始回收。 */
    private static void cdprfps$enforceChunkLimit(ServerLevel level, long now) {
        if (now % 100 != 0L) {
            return;
        }
        Map<String, Integer> removed = TicketDiagnostics.enforce(level);
        if (!removed.isEmpty()) {
            CdprFpsMod.LOG.info("[CDPRFPS] 回收 {}：{}", TicketDiagnostics.formatRemoved(removed),
                    level.dimension().location());
        }
    }

    /** 由主世界每 100 tick 汇总一次被拒 ticket 数量。 */
    private static void cdprfps$logRejectedSummary(ResourceLocation id, long now) {
        if (!id.equals(Level.OVERWORLD.location())) {
            return;
        }
        if (now % 100 != 0L || now == cdprfps$lastSummaryTick) {
            return;
        }
        cdprfps$lastSummaryTick = now;
        Map<ResourceLocation, Integer> rejected = CdprFpsStats.drainRejected();
        if (!rejected.isEmpty()) {
            CdprFpsMod.LOG.info("[CDPRFPS] 区块上限拒绝汇总（近100tick）: {}", CdprFpsStats.format(rejected));
        }
    }
}
