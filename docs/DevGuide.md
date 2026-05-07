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
- Node.js / npm，用于 KubeJS 脚本格式化和 Git hook
- 推荐编辑器：VSCode / IntelliJ IDEA Community Edition / 其他支持 TOML、JSON、JavaScript 的编辑器

根目录内置开发工具：

```powershell
devtool.bat
```

双击使用：

```text
devtool.bat
```

开发工具优先使用仓库内置的 `scripts/bin/packwiz.exe` 和 `scripts/bin/packwiz-installer-bootstrap.jar`。

开发者日常操作优先使用交互式菜单，不需要记忆 packwiz 参数命令。

## 仓库结构原则

- `mods/*.jar` 不提交。
- `mods/*.pw.toml` 提交。
- `pack.toml`、`index.toml`、`.packwizignore` 提交。
- `config/`、`defaultconfigs/` 只放确认要共享的配置。
- `kubejs/` 只放已确认适配 1.21.1 NeoForge 和目标模组集合的脚本、数据与资源。
- `scripts/bin/packwiz.exe` 和 `scripts/bin/packwiz-installer-bootstrap.jar` 是允许内置的二进制开发工具。
- 服务端运行产物不提交，包括 `libraries/`、`world*`、`logs/`、`run.bat`、`run.sh`、`server.properties`、`eula.txt`、`user_jvm_args.txt`。

AI 相关共享工作流放在：

```text
.agents/skills/packwiz-modpack/SKILL.md
```

处理 packwiz 元数据前应先阅读该文件。

完整结构说明见：

```text
docs/REPOSITORY_STRUCTURE.md
```

## mod 管理方式

mod 本体由 packwiz 元数据管理，但开发者一般不直接手写命令。需要添加、更新、下载或生成 mod 清单时，运行：

```powershell
devtool.bat
```

菜单里已经封装了仓库检查、刷新索引、添加项目、更新项目、用 packwiz-installer 安装/同步本地 mod 文件、下载直链文件、扫描临时 jar 和生成 mod 清单等操作。
参数式命令主要给 AI agent、自动化脚本或维护者排查问题使用，相关细节放在 `.agents/skills/packwiz-modpack/SKILL.md` 和 `docs/PACKWIZ_WORKFLOW.md`。

## 初始化 mod 下载

首次准备开发环境时：

1. 从开发群文件下载需要手动补齐的 mod jar。
2. 把这些 jar 放进仓库根目录的 `mods/` 文件夹。
3. 双击根目录的 `devtool.bat`。
4. 在菜单里选择 `12` 或 `13` 安装/同步 packwiz 管理的本地 mod 文件：
   - `12. 安装/同步 mod 文件到本地（GUI，自动重试）`：推荐本机开发使用。需要手动下载的 CurseForge 文件会弹页面；网络不稳时会自动重试。
   - `13. 安装/同步 mod 文件到本地（无 GUI，自动重试）`：适合服务器、远程终端或不想弹窗口时使用。

下载完成后，`mods/` 里会出现本地运行用的 `*.jar`。这些 jar 不提交，只保留在本机开发环境。以后如果误删某个 jar，再运行菜单 `12` 即可补回来。

增删 mod 的基本规则：

- 不要直接通过删除或复制 `mods/*.jar` 来调整整合包 mod 列表。jar 只是本地运行文件，真正的 mod 列表由 `mods/*.pw.toml` 管理。
- 新增 CurseForge mod 使用菜单 `8. 添加 CurseForge 项目`，或命令 `devtool.bat add-curseforge <project>`。
- 新增 Modrinth mod 使用菜单 `7. 添加 Modrinth 项目`，或命令 `devtool.bat add-modrinth <project>`。
- 新增直链或 GitHub Release 文件使用菜单 `9` 或 `10`。
- 删除 mod 使用菜单 `11. 移除 packwiz 管理文件`，或命令 `devtool.bat remove-mod <name-or-metadata-file>`。菜单 `11` 只会修改 packwiz 清单；删除后必须再运行菜单 `12` 或 `13` 同步本地文件夹，旧 jar 才会从本机 `mods/` 中清掉。
- `add-*`、`update`、`remove-mod` 会自动刷新 `index.toml`；之后运行 `devtool.bat install-files`。无桌面环境使用 `devtool.bat install-files-headless`；网络不稳时使用 `devtool.bat install-files-retry`。
- 提交 `mods/*.pw.toml`、`pack.toml`、`index.toml` 的变化，不提交 `mods/*.jar`。

## 关于 modinstaller / 同步器

部分 mod 同步器会按照 manifest 清理目录，删除不在清单中的文件。开发仓库中优先使用开发工具菜单里的“用 packwiz-installer 安装/同步 mod 文件到本地”或“下载 packwiz 管理文件到本地”。

如果确实需要使用会清理文件的同步器，先确认：

- 当前目录不是唯一工作副本。
- 本地改动已经提交或备份。
- 清理范围只包含可再生成的运行文件。

## KubeJS 开发规范

当前阶段不要直接批量搬运旧仓库 KubeJS。旧仓库是 Forge 1.20.1，新仓库目标是 NeoForge 1.21.1，模组 ID、标签、配方类型、KubeJS API 和配置结构都可能变化。

### KubeJS JS 格式化

仓库根目录提供 `.prettierrc`，用于统一 KubeJS JavaScript 的基础格式。VSCode 用户建议安装工作区推荐插件里的 `Prettier - Code formatter`。

首次拉取仓库后运行：

```powershell
npm install
```

`npm install` 会通过 Husky 安装 Git hook。之后提交时，`pre-commit` 会对本次暂存的 `kubejs/**/*.js` 自动执行 Prettier 格式化，并把格式化后的结果重新加入提交。该 hook 只处理 KubeJS JavaScript，不格式化 packwiz TOML、JSON 配置或其他资源文件。

也可以手动运行：

```powershell
npm run format:js
npm run format:js:check
```

本仓库不提交 `.vscode/settings.json`，避免把个人编辑器设置、插件生成配置或本机偏好带给其他开发者。需要保存时自动格式化的开发者，可以在自己的 VSCode 用户设置或本地工作区设置中加入：

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

也可以在打开 `kubejs/**/*.js` 后手动执行 `Format Document`。Prettier 只负责格式化，不会把现代 JavaScript 语法转换成 KubeJS/Rhino 可用语法；脚本写法仍需按当前 KubeJS 运行环境保持兼容。

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

如果更新 `scripts/bin/packwiz.exe` 或 `scripts/bin/packwiz-installer-bootstrap.jar`，必须同步更新版本、来源和 SHA256。

SHA256 计算命令：

```powershell
Get-FileHash .\scripts\bin\packwiz.exe -Algorithm SHA256
Get-FileHash .\scripts\bin\packwiz-installer-bootstrap.jar -Algorithm SHA256
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
