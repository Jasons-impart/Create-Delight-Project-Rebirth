package cdprfps.mixin.server;

import net.minecraft.server.level.ChunkMap;
import net.minecraft.server.level.ServerChunkCache;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.gen.Accessor;

/** 取 ServerChunkCache 内部的 ChunkMap。 */
@Mixin(ServerChunkCache.class)
public interface ServerChunkCacheAccessor {

    @Accessor("chunkMap")
    ChunkMap cdprfps$chunkMap();
}
