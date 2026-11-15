package cdprfps.mixin;

import com.mojang.blaze3d.vertex.PoseStack;
import cdprfps.CdprFpsConfig;
import net.minecraft.client.Camera;
import net.minecraft.client.renderer.MultiBufferSource;
import net.minecraft.client.renderer.blockentity.BlockEntityRenderDispatcher;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.phys.Vec3;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * 方块实体渲染距离剔除。
 *
 * 原版只要方块实体落在视锥与已加载区块内就会渲染，机器/箱子/告示牌/展示框之类的
 * 方块实体在工厂区会堆出很高的一笔开销。这里在真正下发渲染指令前按距离直接跳过，
 * 只影响画面，不影响方块实体逻辑与服务端。
 */
@Mixin(value = BlockEntityRenderDispatcher.class, remap = false)
public abstract class BlockEntityDistanceCullingMixin {

    @Shadow
    public Camera camera;

    @Inject(
            method = "render(Lnet/minecraft/world/level/block/entity/BlockEntity;FLcom/mojang/blaze3d/vertex/PoseStack;Lnet/minecraft/client/renderer/MultiBufferSource;)V",
            at = @At("HEAD"),
            cancellable = true,
            remap = false
    )
    private void cdprfps$cullFarBlockEntities(BlockEntity blockEntity, float partialTick,
                                              PoseStack poseStack, MultiBufferSource bufferSource,
                                              CallbackInfo ci) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.blockEntityCulling) {
            return;
        }
        Camera cam = this.camera;
        if (cam == null || blockEntity == null) {
            return;
        }
        ResourceLocation id = BuiltInRegistries.BLOCK_ENTITY_TYPE.getKey(blockEntity.getType());
        if (id != null && CdprFpsConfig.blockEntitySkipList.contains(id.toString())) {
            return;
        }
        double maxDistance = CdprFpsConfig.blockEntityDistance;
        if (maxDistance <= 0.0D) {
            return;
        }
        BlockPos pos = blockEntity.getBlockPos();
        if (Vec3.atCenterOf(pos).distanceToSqr(cam.getPosition()) > maxDistance * maxDistance) {
            ci.cancel();
        }
    }
}
