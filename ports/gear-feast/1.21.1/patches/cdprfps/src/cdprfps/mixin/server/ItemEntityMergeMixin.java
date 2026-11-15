package cdprfps.mixin.server;

import cdprfps.CdprFpsConfig;
import net.minecraft.world.entity.item.ItemEntity;
import net.minecraft.world.item.ItemStack;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import java.util.List;

/**
 * 掉落物合并。
 *
 * 原版 ItemEntity.tick() 自带 mergeWithNeighbours()，但只在实体碰撞盒接触时才合并，
 * 刷怪塔/农场里成堆掉落物往往差半格到一格就永远合不起来。这里每 40 tick
 * （可用 itemMergeIntervalTicks 调整）做一次半径 2 格的同类合并，
 * 只合并物品与组件完全一致且总量不超过最大堆叠的掉落物，不做任何删除。
 */
@Mixin(value = ItemEntity.class, remap = false)
public abstract class ItemEntityMergeMixin {

    @Inject(method = "tick", at = @At("HEAD"), remap = false)
    private void cdprfps$mergeNearbyItems(CallbackInfo ci) {
        if (!CdprFpsConfig.enabled || !CdprFpsConfig.itemEntityMerge) {
            return;
        }
        ItemEntity self = (ItemEntity) (Object) this;
        if (self.level().isClientSide() || !self.isAlive() || self.tickCount < 20) {
            return;
        }
        int interval = Math.max(5, CdprFpsConfig.itemMergeIntervalTicks);
        if ((self.level().getGameTime() + self.getId()) % interval != 0L) {
            return;
        }
        ItemStack stack = self.getItem();
        if (stack.isEmpty() || stack.getCount() >= stack.getMaxStackSize()) {
            return;
        }
        double radius = Math.max(0.5D, CdprFpsConfig.itemMergeRadius);
        List<ItemEntity> nearby = self.level().getEntitiesOfClass(
                ItemEntity.class,
                self.getBoundingBox().inflate(radius),
                other -> other != self && other.isAlive()
                        && ItemStack.isSameItemSameComponents(stack, other.getItem()));
        if (nearby.isEmpty()) {
            return;
        }
        int max = stack.getMaxStackSize();
        for (ItemEntity other : nearby) {
            if (stack.getCount() >= max) {
                break;
            }
            ItemStack otherStack = other.getItem();
            int space = max - stack.getCount();
            int moved = Math.min(space, otherStack.getCount());
            if (moved <= 0) {
                continue;
            }
            stack.grow(moved);
            otherStack.shrink(moved);
            if (otherStack.isEmpty()) {
                other.discard();
            } else {
                other.setItem(otherStack);
            }
        }
        self.setItem(stack);
    }
}
