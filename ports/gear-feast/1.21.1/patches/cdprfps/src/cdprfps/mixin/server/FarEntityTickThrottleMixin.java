package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.entity.player.Player;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * 远距离生物 tick 节流。
 *
 * 只作用于 64 格以外的普通生物，并且：
 *  - 玩家、载具（有乘客/被骑乘）、强制持久化实体（命名怪、Boss）不节流
 *  - Create / 模拟 / 航空学 / 女仆 / 灾变 / Alex's Caves 等机制复杂或多部件实体的命名空间默认排除
 *  - 用 (gameTime + entityId) 错峰，避免同一 tick 全部跳过造成节奏抖动
 *
 * 被跳过的只是实体自身 tick（移动、AI、碰撞），区块与方块实体逻辑完全不受影响。
 */
@Mixin(value = ServerLevel.class, remap = false)
public abstract class FarEntityTickThrottleMixin {

    @Inject(
            method = "tickNonPassenger(Lnet/minecraft/world/entity/Entity;)V",
            at = @At("HEAD"),
            cancellable = true,
            remap = false
    )
    private void cdprfps$throttleFarEntities(Entity entity, CallbackInfo ci) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.farEntityTickThrottle) {
            return;
        }
        int divisor = CdprFpsConfig.farEntityTickDivisor;
        if (divisor <= 1) {
            return;
        }
        if (!(entity instanceof Mob) || entity instanceof Player) {
            return;
        }
        Mob mob = (Mob) entity;
        if (mob.isPersistenceRequired() || mob.isVehicle() || !mob.getPassengers().isEmpty()) {
            return;
        }
        if (CdprFpsConfig.isEntityBlacklisted(mob.getType())) {
            return;
        }
        ServerLevel level = (ServerLevel) (Object) this;
        if (level.getNearestPlayer(mob, CdprFpsConfig.farEntityTickDistance) != null) {
            return;
        }
        long schedule = level.getGameTime() + mob.getId();
        if (schedule % divisor != 0L) {
            ci.cancel();
        }
    }
}
