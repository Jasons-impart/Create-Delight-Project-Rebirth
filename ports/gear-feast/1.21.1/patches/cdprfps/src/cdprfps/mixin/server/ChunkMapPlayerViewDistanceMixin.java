package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import net.minecraft.server.level.ChunkMap;
import net.minecraft.server.level.ServerPlayer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * ChunkMap 计算玩家视距时再兜一层闸：即使有别的路径绕过了 ServerPlayer 的请求值，
 * 最终用于票据半径的数值也不会超过配置上限（含「每玩家票据上限」换算出的半径）。
 */
@Mixin(value = ChunkMap.class, remap = false)
public abstract class ChunkMapPlayerViewDistanceMixin {

    @Inject(method = "getPlayerViewDistance", at = @At("RETURN"), cancellable = true, remap = false)
    private void cdprfps$capChunkMapViewDistance(ServerPlayer player, CallbackInfoReturnable<Integer> cir) {
        if (!CdprFpsConfig.enabled) {
            return;
        }
        int cap = CdprFpsConfig.effectiveViewDistanceCap();
        if (cir.getReturnValueI() > cap) {
            cir.setReturnValue(cap);
        }
    }
}
