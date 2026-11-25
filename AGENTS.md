# Agent Notes

Create Delight Project Rebirth is a bkmpw-managed Minecraft 1.21.1 modpack. Java 21 and the NeoForge version in [the pack template](pack/pack.toml) must match the launchers, server variables and examples.

- For repository layout, shared configs or contribution checks, read the [developer guide](docs/DevGuide.md).
- For mod metadata, file synchronization, integrity manifests or exports, follow the [packwiz-modpack skill](.agents/skills/packwiz-modpack/SKILL.md). Use the root devtool for the current platform. Track descriptors, templates and `.packwizignore`. Keep downloaded JARs, pack-management binaries, generated root files, worlds and server runtime state out of Git.
- For recipe IDs, schemas or reloads, read the [KubeJS guide](docs/development/kubejs.md).
- For legacy ports, consult the [migration procedure](docs/migration/README.md) and [current status](docs/migration/status.md). `CDPR_LEGACY_REPO` is a read-only reference. Cleanup applies only to the designated `CDPR_0488_SOURCE` working copy after its scope and backup are verified.
- For documents, use the [documentation convention and path variables](docs/README.md). Read actual machine paths from the ignored `docs/local/paths.md` when the task needs them.
- For launcher deployment, use the [installation guide](docs/install/README.md). For tags, CI or publishing, use the [release guide](docs/release/README.md).
