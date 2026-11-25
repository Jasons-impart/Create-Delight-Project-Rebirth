# 安装整合包

## 从 Releases 下载

在 [GitHub Releases](https://github.com/Jasons-impart/Create-Delight-Project-Rebirth/releases) 选择版本，再按文件名前缀下载一个 ZIP。联机时，客户端和服务端选同一版本。

| 文件名前缀 | 用途 |
| --- | --- |
| `[Client]` | 客户端安装包。将 ZIP 导入支持 CurseForge 格式的启动器，由启动器按清单下载模组。 |
| `[Client-Full]` | 客户端全量包，已包含模组。新建匹配该版本的 Minecraft / NeoForge 实例，把压缩包内层的 `mods/`、`kubejs/` 等内容解压到实例游戏目录。 |
| `[Server]` | 服务端全量包，已包含开服所需的模组。解压到独立目录，用 Java 21 运行随包的 `start.bat` 或 `bash ./start.sh`。 |
| `[Server-Installer]` | 下载型服务端安装包。解压后先运行 `install-server.bat` 或 `sh install-server.sh` 下载模组，再运行 `start.bat` 或 `bash ./start.sh` 开服。 |

## 从 CurseForge 安装

由于部分必需模组尚未在 CurseForge（CF）上架，本整合包暂未在该平台发布，目前无法在 CurseForge 客户端内搜索并安装。使用 CurseForge 客户端的玩家可以从上方 Releases 下载 `[Client]` ZIP，再通过「导入」选择该文件。

## 从源码部署

准备 Git、Node.js LTS（含 npm）和 Java 21。当前源码对应 Minecraft 1.21.1、NeoForge 21.1.251。按启动器选择部署步骤：

- [HMCL](../GettingStarted-HMCL.md) — 在版本目录克隆源码，安装 NeoForge 并配置版本隔离。
- [PCL](../GettingStarted-PCL.md) — 创建指定名称的 NeoForge 版本，再把源码复制到版本目录并初始化。
- [Prism Launcher](../GettingStarted-Prism.md) — 创建 NeoForge 实例，再运行 Bash 部署脚本。

已有源码工作区的初始化与同步见[开发指南](../DevGuide.md#初始化工作区)。
