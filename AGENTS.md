# Agent Notes

This repository is a packwiz-managed modpack source tree for Create Delight Project Rebirth.

Shared repository skills live under `.agents/skills/`.

- For packwiz maintenance, read `.agents/skills/packwiz-modpack/SKILL.md` before changing pack metadata.
- For broader repository conventions, read `docs/DevGuide.md`.

## Hard Rules

- Do not commit mod jars, downloaded shader/resource pack zips, generated NeoForge libraries, worlds, logs, or runtime state.
- The only allowed vendored binary is `scripts/bin/packwiz.exe`.
- When `scripts/bin/packwiz.exe` changes, update `LICENSE` and `scripts/bin/packwiz.VERSION.txt` with version/source/SHA256.
- Track packwiz descriptors such as `mods/*.pw.toml` and refresh `index.toml` after packwiz changes.
- Prefer the root `devtool.bat` entry point for local packwiz operations in this repository.
- Keep Minecraft `1.21.1`, NeoForge `21.1.228`, and Java `21` aligned across `pack.toml`, `variables.txt`, and documented examples.
- Treat `Create-Delight-Remake` as source reference only. Do not bulk-copy old Forge `1.20.1` KubeJS/configs into this repo without checking target mod availability and schema/API changes.

## Migration Approach

1. Maintain repository structure and pack metadata first.
2. Add or update mods through packwiz descriptors.
3. Port configs from a working 1.21.1 NeoForge instance where possible.
4. Port KubeJS by layer: utilities, registrations, tags, recipes, client scripts, then optional integrations.
5. Verify with server boot or focused reload after each layer.

## Current Unknowns

- Final 1.21.1 mod list.
- First playable milestone scope.
- Replacement mapping for removed or loader-changed mods.
