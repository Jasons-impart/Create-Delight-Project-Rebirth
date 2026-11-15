package cdprfps;

import net.minecraft.resources.ResourceLocation;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 维度闸门的共享状态：冻结集合、临时解冻截止 tick、档位日志去重。
 * 由 DimensionModeMixin 与 ChunkTicketLimitMixin 共同读写。
 */
public final class DimensionGate {

    private static final Set<ResourceLocation> FROZEN = ConcurrentHashMap.newKeySet();
    private static final Map<ResourceLocation, Long> UNFREEZE_UNTIL = new ConcurrentHashMap<>();
    private static final Map<ResourceLocation, String> LAST_LOGGED_MODE = new ConcurrentHashMap<>();

    private DimensionGate() {
    }

    public static boolean isFrozen(ResourceLocation id) {
        return FROZEN.contains(id);
    }

    /** 标记为冻结，返回 true 表示本次是新冻结。 */
    public static boolean freeze(ResourceLocation id) {
        return FROZEN.add(id);
    }

    /** 解除冻结，返回 true 表示之前确实处于冻结状态。 */
    public static boolean thaw(ResourceLocation id) {
        UNFREEZE_UNTIL.remove(id);
        return FROZEN.remove(id);
    }

    /** 临时解冻到指定 tick：从冻结集合移除，且在截止前不再冻结。 */
    public static void grace(ResourceLocation id, long untilTick) {
        FROZEN.remove(id);
        UNFREEZE_UNTIL.put(id, untilTick);
    }

    public static boolean inGrace(ResourceLocation id, long now) {
        Long until = UNFREEZE_UNTIL.get(id);
        return until != null && now < until;
    }

    /** 清除某维度的冻结/临时解冻/日志状态，用于指令改档后立即生效。 */
    public static void reset(ResourceLocation id) {
        FROZEN.remove(id);
        UNFREEZE_UNTIL.remove(id);
        LAST_LOGGED_MODE.remove(id);
    }

    public static int frozenCount() {
        return FROZEN.size();
    }

    public static Set<ResourceLocation> frozenIds() {
        return Set.copyOf(FROZEN);
    }

    /**
     * 档位日志去重：只有在「首次」或「档位发生变化」时返回 true，
     * 避免临时解冻后重新冻结反复刷日志。
     */
    public static boolean markModeLogged(ResourceLocation id, String modeKey) {
        String previous = LAST_LOGGED_MODE.put(id, modeKey);
        return !modeKey.equals(previous);
    }
}
