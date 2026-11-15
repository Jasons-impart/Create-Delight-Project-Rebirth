package cdprfps.mixin.server;

import it.unimi.dsi.fastutil.longs.Long2ObjectMap;
import net.minecraft.server.level.DistanceManager;
import net.minecraft.server.level.Ticket;
import net.minecraft.util.SortedArraySet;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.gen.Accessor;
import org.spongepowered.asm.mixin.gen.Invoker;

/** 只读/定向删除票据用的访问器。 */
@Mixin(DistanceManager.class)
public interface DistanceManagerAccessor {

    @Accessor("tickets")
    Long2ObjectMap<SortedArraySet<Ticket<?>>> cdprfps$tickets();

    @Invoker("removeTicket")
    void cdprfps$removeTicket(long chunkPos, Ticket<?> ticket);
}
