package cdprfps.mixin;

import com.mojang.blaze3d.vertex.PoseStack;
import cdprfps.CdprFpsConfig;
import net.minecraft.client.renderer.MultiBufferSource;
import net.minecraft.client.renderer.entity.EntityRenderDispatcher;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.item.ItemEntity;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * 掉落物实体渲染距离剔除。
 *
 * 刷怪塔/农场/死亡掉落会让掉落物成百上千地堆在一起，原版仍会逐个渲染。
 * 这里只对 ItemEntity 做距离剔除，其它实体完全不动。
 */
@Mixin(value = EntityRenderDispatcher.class, remap = false)
public abstract class ItemEntityDistanceCullingMixin {

    @Inject(
            method = "render(Lnet/minecraft/world/entity/Entity;DDDFFLcom/mojang/blaze3d/vertex/PoseStack;Lnet/minecraft/client/renderer/MultiBufferSource;I)V",
            at = @At("HEAD"),
            cancellable = true,
            remap = false
    )
    private void cdprfps$cullFarItemEntities(Entity entity, double x, double y, double z,
                                             float entityYaw, float partialTick,
                                             PoseStack poseStack, MultiBufferSource bufferSource,
                                             int packedLight, CallbackInfo ci) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.itemEntityCulling) {
            return;
        }
        if (!(entity instanceof ItemEntity)) {
            return;
        }
        double maxDistance = CdprFpsConfig.itemEntityDistance;
        if (maxDistance <= 0.0D) {
            return;
        }
        // 这里的 x/y/z 已经是相对相机的坐标
        if (x * x + y * y + z * z > maxDistance * maxDistance) {
            ci.cancel();
        }
    }
}
