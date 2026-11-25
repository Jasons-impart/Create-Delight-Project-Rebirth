# 开发指南

本仓库是可以部署到启动器实例中的整合包源码。首次从实例开始开发，请选择 [从源码部署](install/README.md#从源码部署)。已经克隆仓库的开发者从下面开始。

## 初始化工作区

安装 Git、Java 21、Node.js LTS（含 npm）。从源码根目录执行以下命令。Windows PowerShell 将 `./devtool.sh` 换成 `.\devtool.bat`。

```sh
npm install
./devtool.sh setup-tools
./devtool.sh prepare-pack
./devtool.sh check
./devtool.sh install-files
```

`setup-tools` 安装全局 npm 包 `@bro-know-my/packwiz`。`prepare-pack` 展开发布模板并生成本地索引。`check` 检查工具、元数据、仓库结构与忽略规则；`install-files` 同步本机运行文件，并会先尝试更新 Core 描述符。同步后查看 `git status --short`，确认描述符变动符合预期。只想使用交互菜单时直接运行平台对应的 devtool。

## 文件放在哪里

| 内容 | 维护位置与约定 |
| --- | --- |
| 版本与发布根文件 | 编辑 `pack/` 下的模板和根目录 `.packwizignore`。本机根目录的 `pack.toml`、`index.toml`、`PCL/` 和启动文件由工具生成。 |
| 模组、资源包、光影包 | 提交 `*.pw.toml` 描述符，分端及完整性清单见 [模组维护](development/pack.md)。本机的 JAR 和下载的 ZIP 由工具管理。 |
| 共享配置 | `config/` 的白名单见 [config/.gitignore](../config/.gitignore)。优先从 NeoForge 实例生成适配当前版本的配置，再移入有意共享的值。 |
| 服务端配置 | 本包的 SERVER 配置可由根 `config/` 分发，已有世界的 `serverconfig/` 同名文件优先。`defaultconfigs/` 提供新世界默认模板，维护时保留服主对已有世界的设置。 |
| 游戏内容 | 脚本、配方、标签和语言资源在 `kubejs/`。其它受管数据按所属模组放入 `ldlib/`、`tacz/`、`schematics/`、`minemenu/` 等目录。 |
| 启动器或服务端附带文件 | `roots/common/` 放共享覆盖文件，`roots/client/` 和 `roots/server/` 放分端覆盖文件。菜单布局与窗口设置在 `config/fancymenu/`。 |

世界、日志、NeoForge 库、导出包和个人工具留在本机。可用 `git check-ignore -v -- 路径` 查询具体规则。本机目录的变量写法见 [文档规范](README.md#本机路径)。

## 提交和验证

1. 在带 `needs-claim` 的 issue 下评论 `/claim`，自动化会设置负责人和 `claimed` 标签。[认领工作流](../.github/workflows/issue-claim.yml)
2. 修改前选定验证入口。模组或加载器变更查 [模组维护](development/pack.md)，脚本查 [KubeJS 指南](development/kubejs.md)，旧包内容查 [迁移流程](migration/README.md)。
3. 按变更范围检查启动、`/reload`、客户端显示或实际游玩。记录采用的版本及尚待实测的部分。检查 `git diff` 和 `git status --short --untracked-files=all`，把需要共享的配置和资源一同纳入变更。
4. 提交标题说明类型、范围和结果，例如 `fix(kubejs): 修正茶饮灌装配方`。工具或导出代码变更运行 `npm run test:devtool`。打 tag 前另走 [发布流程](release/README.md)。

## Hotai 补丁

确需共享字节码修复时，将确认过的 `.badiff` 放在 `hotai/`。在历史记录中写清来源 JAR 和版本、目标类、修复的问题、补丁路径、做过的修改及启动日志证据。执行 `./devtool.sh refresh` 后检查补丁进入 `index.toml`。上游修复后移除失效补丁，同时登记替代版本。
