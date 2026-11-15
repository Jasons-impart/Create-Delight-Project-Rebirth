package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import net.minecraft.server.players.PlayerList;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * 模拟距离钳制（1.3.0）。
 *
 * 1.21.1 的模拟距离是服务端全局值，没有原生的「按玩家」上限，
 * 因此这里在读取处统一压到配置上限：超出半径的区块不再进入 entity-ticking 状态，
 * 远处机器/方块实体/生物随之停止逐刻运算。多人服上等于对所有玩家生效。
 */
@Mixin(value = PlayerList.class, remap = false)
public abstract class PlayerListDistanceMixin {

    @Inject(method = "getSimulationDistance", at = @At("RETURN"), cancellable = true, remap = false)
    private void cdprfps$capSimulationDistance(CallbackInfoReturnable<Integer> cir) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.perPlayerLimitsEnabled) {
            return;
        }
        int cap = CdprFpsConfig.playerSimulationDistanceCap;
        if (cap > 0 && cir.getReturnValueI() > cap) {
            cir.setReturnValue(cap);
        }
    }

    @Inject(method = "getViewDistance", at = @At("RETURN"), cancellable = true, remap = false)
    private void cdprfps$capViewDistance(CallbackInfoReturnable<Integer> cir) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.perPlayerLimitsEnabled) {
            return;
        }
        int cap = CdprFpsConfig.effectiveViewDistanceCap();
        if (cap > 0 && cir.getReturnValueI() > cap) {
            cir.setReturnValue(cap);
        }
    }
}
