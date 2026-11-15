package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import net.minecraft.server.level.ServerPlayer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * 按玩家视距上限（1.3.0）：截断玩家请求的处理半径。
 *
 * 玩家在客户端把视距调大时，请求值会被这里压到配置上限，
 * 后续 ChunkMap 的票据半径、区块发送半径都随之缩小。
 */
@Mixin(value = ServerPlayer.class, remap = false)
public abstract class PlayerViewDistanceMixin {

    @Inject(method = "requestedViewDistance", at = @At("RETURN"), cancellable = true, remap = false)
    private void cdprfps$capRequestedViewDistance(CallbackInfoReturnable<Integer> cir) {
        if (!CdprFpsConfig.enabled) {
            return;
        }
        int cap = CdprFpsConfig.effectiveViewDistanceCap();
        if (cir.getReturnValueI() > cap) {
            cir.setReturnValue(cap);
        }
    }
}
