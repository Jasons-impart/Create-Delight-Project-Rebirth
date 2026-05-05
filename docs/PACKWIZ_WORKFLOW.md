# packwiz 工作流

AI agent 修改 packwiz 元数据前，也应该阅读 `.agents/skills/packwiz-modpack/SKILL.md`。

`packwiz` 是本仓库的 mod 管理工具，用于维护 `*.pw.toml`、下载来源和 `index.toml`，不是游戏启动器。

## 开发者同步

1. 安装 Java 21。
2. 克隆仓库。
3. 双击或运行根目录开发工具：

```powershell
devtool.bat
```

仓库内置 `scripts/bin/packwiz.exe` 后，开发者可以直接使用 packwiz 相关命令。

## 常用命令

刷新索引：

```powershell
devtool.bat refresh
```

添加或更新 mod：

```powershell
devtool.bat add-curseforge <project>
devtool.bat add-modrinth <project>
devtool.bat add-url <url>
devtool.bat add-github <owner/repo-or-url>
devtool.bat remove-mod <name-or-metadata-file>
devtool.bat update <mod-slug>
devtool.bat update --all
```

## 增删 Mod 开发流程

添加、删除、更新 mod 都以 packwiz 元数据为准。不要把 `mods/*.jar` 当作源文件提交。
`devtool.bat add-*`、`devtool.bat update` 和 `devtool.bat remove-mod` 会在操作成功后自动运行 `devtool.bat refresh`。

添加 CurseForge mod：

```powershell
devtool.bat add-curseforge <slug-or-url-or-project-id>
devtool.bat install-files
devtool.bat check
git status --short --untracked-files=all
```

添加 Modrinth mod：

```powershell
devtool.bat add-modrinth <slug-or-url-or-project-id>
devtool.bat install-files
devtool.bat check
git status --short --untracked-files=all
```

添加直链或 GitHub Release 文件：

```powershell
devtool.bat add-url <download-url>
devtool.bat add-github <owner/repo-or-url>
devtool.bat install-files
devtool.bat check
```

删除 mod：

```powershell
devtool.bat remove-mod <name-or-metadata-file>
devtool.bat install-files
devtool.bat check
git status --short --untracked-files=all
```

`<name-or-metadata-file>` 可以是 packwiz 列表里的名称，也可以是 `mods/example.pw.toml` 这类元数据文件路径。删除后如果本地 `mods/` 里还残留旧 jar，手动删掉对应 jar 即可；它是本地运行文件，不进 Git。
菜单 `11` / `devtool.bat remove-mod` 只修改 packwiz 清单并刷新索引；要让本地 `mods/` 文件夹也同步删除旧 jar，必须再运行菜单 `12` 或 `13`，也就是 `devtool.bat install-files` 或 `devtool.bat install-files-headless`。

更新单个 mod：

```powershell
devtool.bat update <mod-slug>
devtool.bat install-files
devtool.bat check
```

更新全部 mod：

```powershell
devtool.bat update --all
devtool.bat install-files
devtool.bat check
```

提交前重点检查：

```powershell
git status --short --untracked-files=all
git diff -- pack.toml index.toml mods
```

应该提交的是 `mods/*.pw.toml`、`pack.toml`、`index.toml`，以及确认要共享的 `config/`、`defaultconfigs/`、`kubejs/` 等源码文件。不要提交 `mods/*.jar`、导出 zip、`.mrpack`、NeoForge 运行文件、世界、日志或本地配置。

下载 packwiz 元数据声明的本地文件：

```powershell
devtool.bat install-files
```

该命令使用内置的 `scripts/bin/packwiz-installer-bootstrap.jar`，会先刷新 packwiz 索引，再按 `pack.toml` 安装 `mods/*.jar` 等本地开发文件。默认是 GUI 模式，适合本机开发；遇到需要手动下载的 CurseForge 文件时会弹出页面。安装失败会自动重试，默认 5 次、每次间隔 10 秒。下载得到的 `mods/*.jar` 只作为本地开发文件保留，仍然由 `.gitignore` 忽略。

CI、服务器或无桌面环境使用无 GUI 模式：

```powershell
devtool.bat install-files-headless
```

该命令默认传入 `-g -s both`，只在终端输出手动下载链接，不会弹浏览器页面。
`install-files-headless` 同样会自动重试，默认 5 次、每次间隔 10 秒。

也可以指定重试次数和等待秒数：

```powershell
devtool.bat install-files 5 10
devtool.bat install-files-headless 5 10
```

第一个数字是最大尝试次数，第二个数字是失败后等待秒数。packwiz-installer 会校验已存在文件，重跑时只会补缺或重试失败项。`devtool.bat install-files-retry` 仍可使用，等同于无 GUI 重试安装。

仅当元数据里有直链 `download.url`，也可以使用直链下载器：

```powershell
devtool.bat download-files
```

该命令不会删除本地无关文件。谨慎使用会按 manifest 清理目录的 mod 同步器。

直链下载器的 CurseForge API 兜底：

如果不用 `install-files`，而是直接运行 `download-files` 处理 `metadata:curseforge`：

```toml
[download]
mode = "metadata:curseforge"
```

下载前需要在当前终端提供 CurseForge API Key：

```powershell
$env:CURSEFORGE_API_KEY="你的 key"
devtool.bat download-files
```

也可以只对单次命令传入：

```powershell
devtool.bat download-files -CurseForgeApiKey "你的 key"
```

API Key 不要写入仓库。下载得到的 `mods/*.jar` 只作为本地开发文件保留，仍然由 `.gitignore` 忽略。

迁移阶段扫描临时 jar 并生成 CurseForge meta：

```powershell
devtool.bat detect-curseforge
```

执行后必须人工检查生成的 `*.pw.toml` 和 `index.toml`，不要提交 `mods/*.jar`。

生成给人看的 mod 清单：

```powershell
devtool.bat modlist
```

默认输出：

```text
docs/generated/modlist.md
docs/generated/modlist.csv
```

检查仓库：

```powershell
devtool.bat check
devtool.bat list
devtool.bat serve -p 8080
```

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

`user_jvm_args.txt` 只在不存在时由 `JVM_ARGS` 创建，已有的本地内存配置不会被覆盖。

以下开关在 `variables.txt` 中配置：

```text
ACCEPT_EULA=true
AUTO_RESTART=false
RESTART_DELAY_SECONDS=10
```

## 当前目标

- Minecraft: `1.21.1`
- NeoForge: `21.1.228`
- Java: `21`
