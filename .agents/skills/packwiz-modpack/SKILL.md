---
name: packwiz-modpack
description: Maintain this bkmpw-managed Minecraft modpack repository. Use when adding, updating, removing, refreshing, exporting, validating, or structuring pack metadata; when deciding what should be tracked in git versus ignored; when working with the devtool scripts in Create Delight Project Rebirth.
---

# Pack Metadata Workflow

Use this skill for Create Delight Project Rebirth pack metadata work.

## Repository Rules

- Treat the repository as modpack source, not a completed Minecraft instance.
- Do not commit mod jars, generated NeoForge libraries, worlds, logs, crash reports, or local server state.
- Track bkmpw/packwiz-style metadata: `*.pw.toml` and the release-root templates in `pack/`, including `pack/.packwizignore.source`.
- Root `pack.toml`, `index.toml`, and `.packwizignore` are generated local files.
- In this repository, use the root `devtool.bat` entry point first. It calls the vendored `scripts/bin/bkmpw.exe`.
- The only allowed vendored pack management binary is `scripts/bin/bkmpw.exe`.
- Do not reintroduce `packwiz.exe`, `packwiz-old.exe`, `packwiz-installer-bootstrap.jar`, or their VERSION files.
- Run `devtool.bat refresh` after adding, removing, moving, or editing pack files.

## Common Commands

From the repository root:

```powershell
devtool.bat check
devtool.bat refresh
devtool.bat list
devtool.bat update --all
devtool.bat add-curseforge <project>
devtool.bat add-url <side> <name> <filename> <url> <sha256>
devtool.bat add-github <owner/repo-or-url>
devtool.bat remove-mod <name-or-metadata-file>
devtool.bat install-files
devtool.bat install-files-headless
devtool.bat install-files-retry
devtool.bat download-files
devtool.bat modlist
devtool.bat generate-integrity-manifest
devtool.bat export-curseforge
```

Removed commands are intentional: do not use `install-packwiz`, `add-modrinth`, `detect-curseforge`, `serve`, or `export-modrinth`.

## Workflow

1. Inspect `pack/pack.toml`, `pack/.packwizignore.source`, `.gitignore`, and generated `.packwizignore` / `index.toml` when present.
2. Use `devtool.bat check` before changing pack metadata.
3. Add mods through `devtool.bat add-*` or `bkmpw` commands, not by copying jars into `mods/`.
4. Keep descriptors under the expected folders:
   - `mods/*.pw.toml` for newly added mod metadata before manual side placement.
   - `mods/common/*.pw.toml` for common mods.
   - `mods/client/*.pw.toml` for client-only mods.
   - `mods/server/*.pw.toml` for server-only mods.
   - `resourcepacks/*.pw.toml`
   - `shaderpacks/*.pw.toml`
5. Runtime mod jars stay in `mods/*.jar`, not under `mods/common`, `mods/client`, or `mods/server`.
6. Run `devtool.bat refresh`.
7. Review `pack/pack.toml`, `pack/.packwizignore.source`, and any generated `*.pw.toml` before finalizing.
8. Verify git ignores:

```powershell
git check-ignore --quiet mods/example.jar
git check-ignore --quiet mods/example.pw.toml
```

`mods/example.jar` should be ignored. `mods/example.pw.toml` should be trackable.

`devtool.bat add-*`, `devtool.bat update`, and `devtool.bat remove-mod` auto-run `refresh`; run `refresh` manually after direct file edits or moves.

## Local Sync And Downloads

Use `devtool.bat install-files` or `devtool.bat install-files-headless` to synchronize managed files through `bkmpw`.

Use `devtool.bat download-files` to download missing files referenced by metadata. This command:

- downloads missing files only by default
- supports `--force` to overwrite existing files
- validates hashes when metadata provides a supported hash
- never deletes unrelated local files

Cleanup commands only clean files recorded in the previous `bkmpw:1` `packwiz.json` manifest under `mods/`, `resourcepacks/`, and `shaderpacks/`. Manual jars that were never recorded in that manifest must not be deleted.

## Mod List

Use `devtool.bat modlist` to generate human-readable mod lists from metadata.

Default outputs:

- `docs/generated/modlist.md`
- `docs/generated/modlist.csv`

The command is for review/documentation. Do not treat generated lists as the source of truth; metadata remains authoritative.

## Pack Integrity Manifest

The pack has a client-side mod list integrity warning. Keep these files together:

- `scripts/pack-integrity.ps1`: release-time manifest generation helpers.
- `scripts/devtool.ps1`: exposes `generate-integrity-manifest`; `export-curseforge` calls it before refresh/export.
- `kubejs/config/createdelight_pack_integrity_expected.json`: generated expected mod id manifest.
- `kubejs/config/createdelight_pack_integrity.json`: runtime config, including `allowedExtraModIds`.
- `kubejs/client_scripts/pack_integrity_check.js`: client runtime check and title-screen warning.

Generation workflow:

```powershell
devtool.bat install-files
devtool.bat generate-integrity-manifest
```

Manifest generation scans `mods/**/*.pw.toml`, resolves managed jars from local `mods/*.jar`, and extracts actual loaded mod ids from `META-INF/neoforge.mods.toml`, `META-INF/mods.toml`, compatible `fabric.mod.json`, and nested jars. It records expected ids by `common`, `client`, and `server` side. If a managed jar is missing or cannot be parsed, the command should fail and tell the user to synchronize files first.

Runtime check behavior:

- Client compares `expected.common + expected.client` against `Platform.getList()`.
- Reports are written to `logs/createdelight_pack_integrity.json`.
- KubeJS logs missing mods, extra mods, and allowed extra mods.
- Title-screen warning state is stored in `local/createdelight_pack_integrity_state.json`; delete this local file to force the same fingerprint warning again during testing.
- This is diagnostics only, not tamper resistance.

Known export caveat:

`devtool.bat export-curseforge ... client` currently exports a CurseForge-style `manifest.json` plus overrides. CurseForge manifests only express CurseForge `projectID/fileID` entries. URL-managed jars are not automatically represented unless the export flow places them under `overrides/mods/`.

As of the pack-integrity work, a client test export installed without manual changes reported these missing URL-managed common mods:

- `collectorsreap`
- `mutil`
- `silentsdelight`
- `tetra`
- `vintagedelight`

Those jars existed in the source workspace but were absent from the installed test instance and from `overrides/mods/` in the exported zip. Treat this as a packaging-flow issue, not a false positive in the integrity checker. The investigation was recorded on GitHub issue #12.

## Ignore Policy

Keep these ignored:

- `mods/*.jar`
- `*.mrpack`
- generated export zips
- `libraries/`, `versions/`, `downloads/`
- `logs/`, `crash-reports/`, `saves/`, `world*`
- `run.bat`, `run.sh`, `user_jvm_args.txt`, `server.properties`, `eula.txt`
- `neoforge.jar`, `minecraft_server*.jar`

Allow these when relevant:

- `scripts/bin/bkmpw.exe`
- `mods/*.pw.toml`
- `mods/common/*.pw.toml`
- `mods/client/*.pw.toml`
- `mods/server/*.pw.toml`
- curated config/KubeJS/resource files

## Create Delight Project Rebirth Notes

- Target Minecraft: `1.21.1`
- Target NeoForge: `21.1.228`
- Required Java: `21`
- Windows is the primary development environment.
- Source reference repository: `Create-Delight-Remake` Forge `1.20.1`
- Do not bulk-copy old KubeJS/configs without checking target mod availability, IDs, loader API, and config schema changes.

## Validation

Before finishing, run:

```powershell
devtool.bat check
devtool.bat refresh
git status --short --untracked-files=all
```

Root `index.toml` and `pack.toml` are generated local files; mention changes to tracked metadata source files instead.
