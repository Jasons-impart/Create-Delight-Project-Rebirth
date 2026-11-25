---
name: packwiz-modpack
description: Maintain CDPR pack metadata, synchronize managed files, verify integrity manifests, update the loader baseline, and export or validate release artifacts.
---

# Pack metadata maintenance

Run the root `devtool.bat` on Windows or `./devtool.sh` on Linux/macOS. Install the global `@bro-know-my/packwiz` package with `setup-tools`. Keep tool binaries, downloaded archives and runtime state outside Git.

1. Run `check` before changing metadata. Inspect the relevant descriptors and [pack workflow](../../../docs/development/pack.md). Take version and side from actual source files.
2. Use the supported devtool commands to add, update or remove a mod. Place descriptors in the appropriate side directory. For direct metadata edits and moves, refresh the index. Check the diff for changes to sources, IDs, pins and hashes.
3. Sync the managed runtime files with `install-files`. It attempts a Core update before syncing. Preserve any local development build needed for comparison and verify release behavior with the descriptor's artifact.
4. After changes to managed mods or IDs, regenerate `kubejs/config/createdelight_pack_integrity_expected.json`, then run `refresh` and `check`. Verify the relevant launch, reload and client behavior. Review `git status --short --untracked-files=all` before handoff.
5. For exports, version changes or CI validation, follow the [release guide](../../../docs/release/README.md). For NeoForge updates, follow the [loader checklist](../../../docs/development/pack.md#升级-neoforge).

Track `*.pw.toml`, `pack/` templates, `.packwizignore` and intentional shared content. Root `pack.toml` and `index.toml` are generated locally. The [developer guide](../../../docs/DevGuide.md#文件放在哪里) describes the other tracked and runtime directories.
