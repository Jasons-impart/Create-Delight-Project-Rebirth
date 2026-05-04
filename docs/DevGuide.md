# Create Delight Project Rebirth 开发指南

本仓库是 1.21.1 NeoForge 版本的整合包源码仓库。仓库只维护可审查、可复现的源码和元数据；mod 本体通过 packwiz 管理，不直接提交 jar。

## 项目基线

- Minecraft: `1.21.1`
- Loader: `NeoForge 21.1.228`
- Java: `21`
- Pack manager: `packwiz`，用于管理仓库中的 mod 元数据、下载来源和文件索引。

## 基础环境

- Windows
- Java 21
- Git
- 推荐编辑器：VSCode / IntelliJ IDEA Community Edition / 其他支持 TOML、JSON、JavaScript 的编辑器

根目录内置开发工具：

```powershell
devtool.bat
```

双击使用：

```text
devtool.bat
```

开发工具优先使用仓库内置的 `scripts/bin/packwiz.exe`。

直接命令模式：

```powershell
devtool.bat check
devtool.bat refresh
devtool.bat list
devtool.bat update --all
```

## 仓库结构原则

- `mods/*.jar` 不提交。
- `mods/*.pw.toml` 提交。
- `pack.toml`、`index.toml`、`.packwizignore` 提交。
- `config/`、`defaultconfigs/` 只放确认要共享的配置。
- `kubejs/` 只放已确认适配 1.21.1 NeoForge 和目标模组集合的脚本、数据与资源。
- `scripts/bin/packwiz.exe` 是唯一允许内置的二进制工具。
- 服务端运行产物不提交，包括 `libraries/`、`world*`、`logs/`、`run.bat`、`run.sh`、`server.properties`、`eula.txt`、`user_jvm_args.txt`。

AI 相关共享工作流放在：

```text
.agents/skills/packwiz-modpack/SKILL.md
```

处理 packwiz 元数据前应先阅读该文件。

完整结构说明见：

```text
docs/REPOSITORY_STRUCTURE.md
docs/PACKWIZ_WORKFLOW.md
```

## packwiz 常用操作

检查仓库：

```powershell
devtool.bat check
```

刷新索引：

```powershell
devtool.bat refresh
```

查看当前 packwiz 管理文件：

```powershell
devtool.bat list
```

更新全部外部文件：

```powershell
devtool.bat update --all
```

添加项目：

```powershell
devtool.bat add-modrinth <project>
devtool.bat add-curseforge <project>
devtool.bat add-github <owner/repo-or-url>
devtool.bat add-url <url>
```

下载 packwiz 管理的文件到本地：

```powershell
devtool.bat download-files
```

该命令只下载 `*.pw.toml` 中声明的文件，不删除本地无关文件。需要覆盖已有文件时：

```powershell
devtool.bat download-files -Force
```

扫描临时放入 `mods/` 的 jar 并生成 CurseForge meta：

```powershell
devtool.bat detect-curseforge
```

注意：这是迁移/导入阶段使用的实验流程。执行后必须检查生成的 `*.pw.toml` 和 `index.toml`，不要提交 `mods/*.jar`。

生成 Markdown / CSV 模组清单：

```powershell
devtool.bat modlist
```

默认输出到 `docs/generated/`。它会读取 `*.pw.toml`，也会识别本地临时存在的 `mods/*.jar`。

## 关于 modinstaller / 同步器

部分 mod 同步器会按照 manifest 清理目录，删除不在清单中的文件。开发仓库中优先使用 `devtool.bat download-files`，因为它不会删除无关文件。

如果确实需要使用会清理文件的同步器，先确认：

- 当前目录不是唯一工作副本。
- 本地改动已经提交或备份。
- 清理范围只包含可再生成的运行文件。

## KubeJS 开发规范

当前阶段不要直接批量搬运旧仓库 KubeJS。旧仓库是 Forge 1.20.1，新仓库目标是 NeoForge 1.21.1，模组 ID、标签、配方类型、KubeJS API 和配置结构都可能变化。

通用规范：

- 文件结尾保留空行。
- 缩进使用 2 或 4 个空格，但同一目录内保持一致。
- 使用 `let` / `const`，不要使用 `var`。
- ResourceLocation 使用小写，避免空格和非法字符。
- 自定义配方必须有明确 id。
- 优先按层迁移：工具函数、注册、标签、配方、客户端脚本、可选联动。
- 每迁移一层都启动或 reload 验证，不要一次性塞入大量旧脚本。

建议迁移顺序：

1. `kubejs/startup_scripts` 中的基础常量和注册。
2. `kubejs/server_scripts` 中的标签。
3. 已确认存在的模组配方。
4. 语言文件和资源。
5. 客户端 tooltip / render / keybind。
6. 任务和大型联动。

## 配置迁移规范

- 优先使用 1.21.1 NeoForge 实例生成的新配置。
- 不直接覆盖旧 Forge 配置。
- 只迁移同 mod id、同配置项语义明确的内容。
- 服务端默认配置放 `defaultconfigs/`。
- 客户端或通用配置放 `config/`，但要确认是否适合团队共享。

## 启动脚本

服务端启动模板：

```powershell
.\start.bat
```

Linux/macOS：

```bash
./start.sh
```

默认 NeoForge installer 文件名：

```text
neoforge.jar
```

如果根目录没有 `neoforge.jar`，启动脚本会按 `variables.txt` 中的 `NEOFORGE_INSTALLER_URL` 自动下载。运行服务端需要 Java 21。`neoforge.jar`、生成的 `run.bat` / `run.sh` 和 `libraries/` 都不提交。

首次启动时，脚本会用变量文件里的 `JVM_ARGS` 创建 `user_jvm_args.txt`。之后不会覆盖这个文件，服主可以直接修改 `user_jvm_args.txt` 调整内存；如果要恢复仓库默认值，删除 `user_jvm_args.txt` 后重新启动即可。

`variables.txt` 中的服务端行为开关：

```text
ACCEPT_EULA=true
AUTO_RESTART=false
RESTART_DELAY_SECONDS=10
```

默认不自动重启。需要崩服后自动拉起时，服主可以把 `AUTO_RESTART` 改成 `true`。

## 版本与发布

正式发布前至少检查：

1. 修改 `pack.toml` 版本号。
2. 执行 `devtool.bat refresh`。
3. 执行 `devtool.bat check`。
4. 检查 `git status --short --untracked-files=all`。
5. 确认没有 `mods/*.jar`、导出 zip、`.mrpack`、服务端运行产物进入提交。
6. 更新发布说明。

导出命令：

```powershell
devtool.bat export-modrinth
devtool.bat export-curseforge
```

导出产物默认不提交。

## 协议与第三方声明

本项目代码默认 MIT。第三方声明集中在：

```text
LICENSE
scripts/bin/packwiz.VERSION.txt
```

如果更新 `scripts/bin/packwiz.exe`，必须同步更新版本、来源和 SHA256。

SHA256 计算命令：

```powershell
Get-FileHash .\scripts\bin\packwiz.exe -Algorithm SHA256
```

## 提交规范

建议参考 Conventional Commits：

```text
feat: 添加某功能
fix: 修复某问题
docs: 更新文档
chore: 调整构建或仓库维护文件
refactor: 重构但不改变行为
```

packwiz 操作导致的提交应说明影响范围，例如：

```text
chore(packwiz): add create mod metadata
chore(packwiz): refresh index
```

## 常用检查

```powershell
devtool.bat check
devtool.bat refresh
git status --short --untracked-files=all
git check-ignore --quiet mods/example.jar
git check-ignore --quiet mods/example.pw.toml
```

期望结果：

- `mods/example.jar` 被忽略。
- `mods/example.pw.toml` 不被忽略。
