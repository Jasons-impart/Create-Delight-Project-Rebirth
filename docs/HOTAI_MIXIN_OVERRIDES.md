# Hotai Mixin Overrides

This document records local Hotai bytecode overrides used while testing
ByePregen compatibility in CDPR. Hotai reads patched classes from the game
directory's `hotai/` tree, applies them during class transformation, then
converts full `.class` replacements into `.badiff` files after startup.

## Current Context

- Minecraft: `1.21.1`
- NeoForge: `21.1.228`
- ByePregen: `byepregen-1.0.7.jar`
- ServerCore: `servercore-neoforge-1.5.19+1.21.1.jar`
- Hotai: `hotai-2.0.jar`

The active ByePregen test config is:

```json
{
  "enablePlacedFeatureMixin": true,
  "enableFastTickChunks": true,
  "enableYALightEngine": true
}
```

## Active Hotai Overrides

### Supplementaries LevelRendererMixin

Hotai file:

```text
hotai/net/mehvahdjukaar/supplementaries/mixins/neoforge/LevelRendererMixin.badiff
```

Target class:

```text
net/mehvahdjukaar/supplementaries/mixins/neoforge/LevelRendererMixin
```

Reason:

```text
Supplementaries LevelRendererMixin failed after ByePregen YALight rewrote
LevelRenderer light handling.
```

Effect:

```text
Disables the Supplementaries client light/Lumisene-related injection by
making its injection annotation unrecognizable to the mixin processor.
```

Validation log:

```text
Patched class: net/mehvahdjukaar/supplementaries/mixins/neoforge/LevelRendererMixin
```

### ServerCore Ticking Chunk Broadcast

Hotai files:

```text
hotai/me/wesley1808/servercore/mixin/optimizations/ticking/chunk/broadcast/ServerChunkCacheMixin.badiff
hotai/me/wesley1808/servercore/mixin/optimizations/ticking/chunk/broadcast/ChunkHolderMixin.badiff
```

Target classes:

```text
me/wesley1808/servercore/mixin/optimizations/ticking/chunk/broadcast/ServerChunkCacheMixin
me/wesley1808/servercore/mixin/optimizations/ticking/chunk/broadcast/ChunkHolderMixin
```

Reason:

```text
ServerCore broadcast.ServerChunkCacheMixin redirected
ServerChunkCache.tickChunks(), but ByePregen enableFastTickChunks replaces the
same method with ServerChunkCacheTickChunksMixin.
```

Observed crash:

```text
servercore.common.mixins.json:optimizations.ticking.chunk.broadcast.ServerChunkCacheMixin
cannot inject into ServerChunkCache::tickChunks()V
merged by com.moepus.byepregen.mixin.ServerChunkCacheTickChunksMixin
```

Effect:

```text
ServerChunkCacheMixin: @Redirect -> invalid annotation name.
ChunkHolderMixin: @Inject -> invalid annotation name.
```

`ChunkHolderMixin` is disabled with the redirect because it only feeds the
broadcast set used by `ServerChunkCacheMixin`.

Validation log:

```text
Patched class: me/wesley1808/servercore/mixin/optimizations/ticking/chunk/broadcast/ChunkHolderMixin
Patched class: me/wesley1808/servercore/mixin/optimizations/ticking/chunk/broadcast/ServerChunkCacheMixin
```

### ServerCore Ticking Chunk Random

Hotai files:

```text
hotai/me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/ServerChunkCacheMixin.badiff
hotai/me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/ServerLevelMixin.class
hotai/me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/LevelChunkMixin.class
```

Target classes:

```text
me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/ServerChunkCacheMixin
me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/ServerLevelMixin
me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/LevelChunkMixin
```

Reason:

```text
ServerCore random.ServerChunkCacheMixin injects servercore$resetIceAndSnowTick
into ServerChunkCache.tickChunks(), but ByePregen enableFastTickChunks replaces
the same method.

ServerCore random.ServerLevelMixin and random.LevelChunkMixin are part of the
same random chunk ticking optimization path. ServerLevelMixin redirects weather
random checks inside ServerLevel.tickChunk(), while ByePregen also redirects the
precipitation path in ServerLevel.tickChunk(). After ServerChunkCacheMixin is
disabled, leaving the rest of this ServerCore random group partially active is
unnecessary risk, so the remaining injection points are disabled as well.
```

Observed crash:

```text
servercore.common.mixins.json:optimizations.ticking.chunk.random.ServerChunkCacheMixin
cannot inject into ServerChunkCache::tickChunks()V
merged by com.moepus.byepregen.mixin.ServerChunkCacheTickChunksMixin
```

Effect:

```text
ServerChunkCacheMixin: @Inject -> invalid annotation name.
ServerLevelMixin: @Redirect -> invalid annotation name.
LevelChunkMixin: @Inject -> invalid annotation name.
```

Notes:

```text
ServerChunkCacheMixin has already been converted by Hotai to a .badiff file.
ServerLevelMixin and LevelChunkMixin are currently full .class replacements.
On the next successful Hotai startup they should be converted into .badiff files
by Hotai.

config/servercore/optimizations.yml also keeps cancel-duplicate-fluid-ticks=false,
which disables random.LiquidBlockMixin through ServerCore's own mixin plugin.
```

Expected validation log:

```text
Patched class: me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/ServerChunkCacheMixin
Patched class: me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/ServerLevelMixin
Patched class: me/wesley1808/servercore/mixin/optimizations/ticking/chunk/random/LevelChunkMixin
```

## Related Non-Hotai Config Changes

These are not Hotai patches, but they are part of the current ByePregen
compatibility test state.

File:

```text
config/servercore/optimizations.yml
```

Current values:

```yaml
cache-ticking-chunks: false
cancel-duplicate-fluid-ticks: false
```

Reason:

```text
cache-ticking-chunks=false disables ServerCore's ticking.chunk.cache mixin,
which also injects ServerChunkCache.tickChunks().

cancel-duplicate-fluid-ticks=false was tested because it belongs to the
ticking.chunk.random group, but it did not disable random.ServerChunkCacheMixin.
It only controls the duplicate fluid tick optimization path.
```

## Current Conflict Scan Notes

The ServerCore and ByePregen mixin target overlap currently covers:

```text
net.minecraft.server.level.ServerChunkCache
net.minecraft.server.level.ServerLevel
net.minecraft.world.level.chunk.LevelChunk
net.minecraft.server.level.ChunkMap
net.minecraft.world.level.NaturalSpawner
```

Handled overlap:

```text
ServerChunkCache.tickChunks(): handled by disabling ServerCore broadcast/random
Hotai injection points and setting cache-ticking-chunks=false.

ServerLevel.tickChunk() weather/random path: ServerCore random ServerLevelMixin
is disabled with Hotai because ByePregen redirects the precipitation path there
and the rest of ServerCore's random group was already partially disabled.

LevelChunk random lightning init: ServerCore random LevelChunkMixin injection is
disabled with Hotai as part of the same random group cleanup.
```

No current Hotai override:

```text
ChunkMap: ServerCore dynamic view distance uses playerIsCloseEnoughForSpawning(),
while ByePregen gc-free save injects ChunkMap.save().

NaturalSpawner: ServerCore spawn/biome/ticket mixins target different methods.
ByePregen's SableNaturalSpawnerMixin is gated on Sable and no Sable jar is
currently present in mods/.
```

## Troubleshooting Checklist

After each startup, check `logs/latest.log` for:

```text
Reading patched classes
Patched class: ...
```

If a class listed in this document does not appear as patched, verify:

- `hotai-2.0.jar` exists in `mods/`.
- The patch path under `hotai/` matches the target class internal name.
- The patch file extension is `.class` or `.badiff`.
- The game was fully restarted after changing Hotai files.

If a new crash still reports `ServerChunkCache::tickChunks()V merged by
com.moepus.byepregen.mixin.ServerChunkCacheTickChunksMixin`, identify the
new `servercore.common.mixins.json:...` class in the crash report and record
the next override here before patching it.
