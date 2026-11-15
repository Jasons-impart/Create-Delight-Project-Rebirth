package cdprfps;

import net.minecraft.resources.ResourceLocation;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 运行期统计：区块上限拒绝次数，按维度累计，每 100 tick 由主世界汇总打印一次。
 */
public final class CdprFpsStats {

    private static final Map<ResourceLocation, AtomicInteger> REJECTED = new ConcurrentHashMap<>();

    private CdprFpsStats() {
    }

    public static void reject(ResourceLocation dimensionId) {
        REJECTED.computeIfAbsent(dimensionId, key -> new AtomicInteger()).incrementAndGet();
    }

    /** 取出并清零当前计数，返回本次有内容的维度。 */
    public static Map<ResourceLocation, Integer> drainRejected() {
        Map<ResourceLocation, Integer> out = new LinkedHashMap<>();
        for (Map.Entry<ResourceLocation, AtomicInteger> entry : REJECTED.entrySet()) {
            int value = entry.getValue().getAndSet(0);
            if (value > 0) {
                out.put(entry.getKey(), value);
            }
        }
        return out;
    }

    public static String format(Map<ResourceLocation, Integer> counts) {
        StringBuilder builder = new StringBuilder();
        counts.forEach((id, count) -> {
            if (builder.length() > 0) {
                builder.append(", ");
            }
            builder.append(id).append('=').append(count);
        });
        return builder.length() == 0 ? "无" : builder.toString();
    }
}
