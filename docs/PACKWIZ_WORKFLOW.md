# bkmpw 工作流

AI agent 修改 pack 元数据前，也应该阅读 `.agents/skills/packwiz-modpack/SKILL.md`。

`bkmpw` 是本仓库的 mod 管理工具，用于维护 packwiz-style `*.pw.toml`、下载来源和发布索引，不是游戏启动器。根目录 `pack.toml`、`index.toml`、`.packwizignore` 由 `devtool.bat prepare-pack` 或 `devtool.bat refresh` 生成，不作为源码提交；源码侧维护 `pack/pack.toml` 和 `pack/.packwizignore.source` 模板。

## 开发者同步

1. 安装 Java 21。
2. 安装 Node.js LTS / npm。
3. 克隆仓库。
4. 安装仓库 hook 和全局 bkmpw：

```powershell
npm install
devtool.bat setup-tools
```

5. 首次拉取后先展开本地发布根目录文件：

```powershell
devtool.bat prepare-pack
```

6. 双击或运行根目录开发工具：

```powershell
devtool.bat
```

Linux/macOS 使用 `./devtool.sh`。Windows 下不要从 PowerShell 运行 `devtool.sh`，统一使用 `.\devtool.bat`。仓库不再内置 pack 管理二进制，`bkmpw` 由全局 npm 包 `@bro-know-my/packwiz` 提供。旧 `packwiz.exe`、`packwiz-installer-bootstrap.jar`、`serve`、`export-modrinth` 和 `detect-curseforge` 工作流已经移除。

## 常用命令

```powershell
devtool.bat check
devtool.bat setup-tools
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
devtool.bat export-curseforge [output.zip] [client|server|both]
```

Removed commands are intentional: do not use `install-packwiz`, `add-modrinth`, `detect-curseforge`, `serve`, or `export-modrinth`.

## 元数据位置

新增 mod 元数据默认写入 `mods/*.pw.toml`。需要分侧时手动移动后再运行 `devtool.bat refresh`：

- `mods/common/*.pw.toml`
- `mods/client/*.pw.toml`
- `mods/server/*.pw.toml`

当前已有 mod 元数据集中在 `mods/common`。运行用 jar 仍放在 `mods/*.jar`，不要移动到 `mods/common`、`mods/client` 或 `mods/server`。

## 增删 Mod 开发流程

添加、删除、更新 mod 都以 metadata 为准。不要把 `mods/*.jar` 当作源文件提交。

添加 CurseForge mod：

```powershell
devtool.bat add-curseforge <slug-or-url-or-project-id>
devtool.bat install-files
devtool.bat check
git status --short --untracked-files=all
```

添加直链或 GitHub Release 文件：

```powershell
devtool.bat add-url both "Mod Name" "mod.jar" "https://example/mod.jar" "<sha256>"
devtool.bat add-github <owner/repo-or-url>
devtool.bat install-files
devtool.bat check
```

删除 mod：

```powershell
devtool.bat remove-mod <name-or-metadata-file>
devtool.bat install-files
devtool.bat check
```

`<name-or-metadata-file>` 可以是列表里的名称，也可以是 `mods/common/example.pw.toml` 这类元数据文件路径。删除后要让本地 `mods/` 文件夹同步清理受管旧 jar，运行 `devtool.bat install-files`。手动塞入且从未记录进 `bkmpw:1` manifest 的 jar 不应被清理。

提交前重点检查：

```powershell
git status --short --untracked-files=all
git diff -- pack mods
```

应该提交的是 `mods/*.pw.toml`、`mods/common/*.pw.toml`、`mods/client/*.pw.toml`、`mods/server/*.pw.toml`、`pack/` 模板，以及确认要共享的 `config/`、`defaultconfigs/`、`kubejs/` 等源码文件。不要提交根目录生成的 `pack.toml`、`index.toml`、`.packwizignore`、`PCL/`、`mods/*.jar`、导出 zip、`.mrpack`、NeoForge 运行文件、世界、日志或本地配置。

## 本地文件安装和下载

```powershell
devtool.bat install-files
devtool.bat install-files-headless
devtool.bat install-files-retry
devtool.bat download-files
```

`install-files` 调用 `bkmpw install-files-headless`。`download-files` 只补缺失文件，不删除本地无关文件。

清理只针对上一次 `bkmpw:1` `packwiz.json` manifest 记录过的 `mods/`、`resourcepacks/`、`shaderpacks/` 文件；手动塞入且未记录的 jar 不应被删除。

## Mod 清单

```powershell
devtool.bat modlist
```

默认输出：

```text
docs/generated/modlist.md
docs/generated/modlist.csv
```

## 发布导出

当前只保留 CurseForge 导出：

```powershell
devtool.bat export-curseforge [output.zip] [client|server|both]
```

Modrinth export 已移除。

## 服务端启动

Windows：

```powershell
.\start.bat
```

Linux/macOS：

```bash
./start.sh
```

如果缺少 `neoforge.jar`，启动脚本会按 `variables.txt` 中的 `NEOFORGE_INSTALLER_URL` 自动下载。缺少 NeoForge 生成的 args 文件时，脚本会自动安装 NeoForge，然后使用配置的 `JAVA` 通过 `win_args.txt` 或 `unix_args.txt` 启动。

## 当前目标

- Minecraft: `1.21.1`
- NeoForge: `21.1.228`
- Java: `21`
