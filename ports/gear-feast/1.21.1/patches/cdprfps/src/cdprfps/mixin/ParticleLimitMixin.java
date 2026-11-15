package cdprfps.mixin;

import cdprfps.CdprFpsConfig;
import net.minecraft.client.particle.Particle;
import net.minecraft.client.particle.ParticleEngine;
import net.minecraft.client.particle.ParticleRenderType;
import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import java.util.Map;
import java.util.Queue;

/**
 * 客户端粒子总量封顶。
 *
 * 原版的上限是「每种渲染层 16384」，四种层叠起来可以堆到几万个粒子，
 * 在 Create 风扇、季节粒子、爆炸/火焰场景下会直接压满渲染线程。
 * 这里改成全局计数，超过阈值就不再接收新粒子（已有粒子正常衰减消失）。
 */
@Mixin(value = ParticleEngine.class, remap = false)
public abstract class ParticleLimitMixin {

    @Shadow
    @Final
    private Map<ParticleRenderType, Queue<Particle>> particles;

    @Inject(method = "add", at = @At("HEAD"), cancellable = true, remap = false)
    private void cdprfps$capParticles(Particle particle, CallbackInfo ci) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.particleLimit) {
            return;
        }
        int limit = CdprFpsConfig.maxParticles;
        if (limit <= 0) {
            return;
        }
        int count = 0;
        for (Queue<Particle> queue : this.particles.values()) {
            count += queue.size();
            if (count >= limit) {
                ci.cancel();
                return;
            }
        }
    }
}
