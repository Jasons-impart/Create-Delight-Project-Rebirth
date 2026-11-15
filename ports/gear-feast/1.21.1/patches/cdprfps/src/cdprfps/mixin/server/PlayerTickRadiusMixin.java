package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.level.chunk.LevelChunk;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * 每玩家 tick 半径（1.3.0）。
 *
 * 超出半径的区块跳过 tickChunk：随机刻、冰霜积雪、雷击等区块级运算不再执行。
 * 玩家自身脚下区块永远在半径内，不会出现掉区块。
 */
@Mixin(value = ServerLevel.class, remap = false)
public abstract class PlayerTickRadiusMixin {

    @Inject(method = "tickChunk", at = @At("HEAD"), cancellable = true, remap = false)
    private void cdprfps$limitChunkTickRadius(LevelChunk chunk, int randomTickSpeed, CallbackInfo ci) {
        if (!CdprFpsConfig.enabled) {
            return;
        }
        int radius = CdprFpsConfig.effectiveTickRadius();
        if (radius <= 0) {
            return;
        }
        ServerLevel level = (ServerLevel) (Object) this;
        if (level.players().isEmpty()) {
            return;
        }
        int centerX = chunk.getPos().x * 16 + 8;
        int centerZ = chunk.getPos().z * 16 + 8;
        int limit = radius * 16 + 8;
        for (ServerPlayer player : level.players()) {
            if (Math.abs(player.getBlockX() - centerX) <= limit
                    && Math.abs(player.getBlockZ() - centerZ) <= limit) {
                return;
            }
        }
        ci.cancel();
    }
}
