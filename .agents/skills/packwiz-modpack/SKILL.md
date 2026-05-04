---
name: packwiz-modpack
description: Maintain packwiz-managed Minecraft modpack repositories. Use when adding, updating, removing, refreshing, exporting, validating, or structuring packwiz modpack files; when deciding what should be tracked in git versus ignored; when working with bundled packwiz.exe/devtool scripts in Create Delight Project Rebirth or similar Windows-focused modpack repos.
---

# Packwiz Modpack

Use this skill for packwiz-based Minecraft modpack repository work.

## Repository Rules

- Treat the repository as modpack source, not a completed Minecraft instance.
- Do not commit mod jars, generated NeoForge libraries, worlds, logs, crash reports, or local server state.
- Track packwiz metadata: `pack.toml`, `index.toml`, `.packwizignore`, and `*.pw.toml`.
- In this repository, use the root `devtool.bat` entry point first. It prefers the vendored `scripts/bin/packwiz.exe`.
- The only allowed vendored binary is `scripts/bin/packwiz.exe`.
- If `scripts/bin/packwiz.exe` changes, update `LICENSE` and `scripts/bin/packwiz.VERSION.txt` with source/version/SHA256.
- Run `packwiz refresh` after adding, removing, moving, or editing pack files.

## Common Commands

From the repository root:

```powershell
devtool.bat check
devtool.bat refresh
devtool.bat list
devtool.bat update --all
devtool.bat add-modrinth <project>
devtool.bat add-curseforge <project>
devtool.bat add-url <url>
devtool.bat add-github <owner/repo-or-url>
devtool.bat download-files
devtool.bat detect-curseforge
devtool.bat modlist
devtool.bat serve -p 8080
devtool.bat export-modrinth
devtool.bat export-curseforge
```

If `devtool.bat` is unavailable but `packwiz` is installed:

```powershell
packwiz refresh
packwiz list
packwiz update --all
```

## Workflow

1. Inspect `pack.toml`, `.packwizignore`, `.gitignore`, and `index.toml`.
2. Use `devtool.bat check` before changing pack metadata.
3. Add mods through packwiz commands, not by copying jars into `mods/`.
   - Exception: for migration/import work, local jars may be placed in `mods/` temporarily and scanned with `devtool.bat detect-curseforge`.
   - After detection, review generated `*.pw.toml`; do not commit the jars.
4. Keep descriptors under the expected folders:
   - `mods/*.pw.toml`
   - `resourcepacks/*.pw.toml`
   - `shaderpacks/*.pw.toml`
5. Run `devtool.bat refresh`.
6. Review `pack.toml`, `index.toml`, and any generated `*.pw.toml` before finalizing.
7. Verify git ignores:

```powershell
git check-ignore --quiet mods/example.jar
git check-ignore --quiet mods/example.pw.toml
```

`mods/example.jar` should be ignored. `mods/example.pw.toml` should be trackable.

## Local Downloads

Use `devtool.bat download-files` to download files referenced by `*.pw.toml` into their `file` / `filename` paths. This helper:

- reads `file` / `filename`, `download.url`, `hash`, and `hash-format` from packwiz meta files
- downloads missing files only by default
- supports `-Force` to overwrite existing files
- validates SHA1/SHA256/SHA512 when metadata provides a supported hash
- never deletes unrelated local files

Avoid modinstaller-style sync commands unless the user explicitly accepts cleanup behavior; some installers remove files that are not in the manifest.

## Mod List

Use `devtool.bat modlist` to generate human-readable mod lists from packwiz metadata and temporary local jars.

Default outputs:

- `docs/generated/modlist.md`
- `docs/generated/modlist.csv`

The command is for review/documentation. Do not treat generated lists as the source of truth; packwiz metadata remains authoritative.

## Scanning Existing Jars

Use `devtool.bat detect-curseforge` for the experimental `packwiz curseforge detect` workflow. It is intended for migration/import when jars already exist in `mods/`.

Rules:

- Warn before running unless the user explicitly requested it.
- Run `devtool.bat refresh` afterward.
- Review generated metadata before finalizing.
- Keep `mods/*.jar` ignored.

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

- `scripts/bin/packwiz.exe`
- `scripts/bin/packwiz.VERSION.txt`
- `mods/*.pw.toml`
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

If `refresh` changes `index.toml` or `pack.toml`, mention that in the final response.
