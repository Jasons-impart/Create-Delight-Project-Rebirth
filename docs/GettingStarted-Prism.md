# 开发环境快速开始（Prism Launcher版）

本文用于通过 Linux 上的 Prism Launcher 配置 Create Delight Project Rebirth 本地开发实例。

## 基线

- Minecraft: `1.21.1`
- Loader: `NeoForge 21.1.242`
- Java: `21`
- Prism 实例名：可自定义

Prism 与 PCL/HMCL 不同：实例根目录通常包含 `mmc-pack.json`，真正的游戏目录是实例下的 `minecraft/`。仓库内容应部署到 `minecraft/` 目录，而不是直接覆盖 Prism 实例根目录。Git 是否识别为仓库只取决于 `minecraft/.git` 是否存在，不取决于 Prism 实例名。

## 推荐流程：交互式部署脚本

脚本不能替你在 Prism 里创建实例和安装 NeoForge，但可以在安装完成后接管剩余步骤：校验实例、克隆仓库、覆盖游戏目录、初始化 devtool、同步 mod 和资源文件。

### 1. 用 Prism 创建实例

在 Prism Launcher 中创建新实例：

- Minecraft `1.21.1`
- NeoForge `21.1.242`
- Java 选择 Java `21`
- 实例名可以自定义

创建完成后，实例目录大致是：

```text
~/.local/share/PrismLauncher/instances/<你的实例名>/
├── instance.cfg
├── mmc-pack.json
└── minecraft/
```

Flatpak 版 Prism 的实例目录可能在：

```text
~/.var/app/org.prismlauncher.PrismLauncher/data/PrismLauncher/instances/<你的实例名>/
```

### 2. 拉取并运行脚本

在终端执行：

```bash
curl -fsSL "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Project-Rebirth/main/scripts/install-prism.sh" | bash
```

脚本会要求输入 Prism 实例目录或实例内的 `minecraft` 目录，例如：

```text
~/.local/share/PrismLauncher/instances/<你的实例名>
```

也可以直接把路径作为参数传入：

```bash
curl -fsSL "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Project-Rebirth/main/scripts/install-prism.sh" | bash -s -- "$HOME/.local/share/PrismLauncher/instances/<你的实例名>"
```

如果只想先部署仓库、不下载 mod 和资源文件：

```bash
curl -fsSL "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Project-Rebirth/main/scripts/install-prism.sh" | bash -s -- --skip-install-files
```

脚本会自动执行：

- 检查实例目录中的 `mmc-pack.json`
- 检查 Prism 实例已安装 `Minecraft 1.21.1 + NeoForge 21.1.242`
- 克隆仓库到 `minecraft/tmp`
- 把 `tmp` 内容覆盖到 `minecraft/`，包括隐藏的 `.git`
- 运行 `npm install`
- 运行 `sh ./devtool.sh setup-tools`
- 运行 `sh ./devtool.sh prepare-pack`
- 运行 `sh ./devtool.sh check`
- 运行 `sh ./devtool.sh install-files-headless 5 5`

## 前置依赖

系统需要能运行：

```bash
git --version
node -v
npm -v
java -version
```

Java 需要是 `21`。`bkmpw` 不需要手动预装，脚本会通过 `devtool.sh setup-tools` 安装。

## 启动前检查

脚本完成后，进入 Prism 实例的 `minecraft/` 目录：

```bash
cd "$HOME/.local/share/PrismLauncher/instances/<你的实例名>/minecraft"
sh ./devtool.sh check
git status --short --untracked-files=all
```

检查实际 mod 文件：

```bash
find mods -maxdepth 1 -name "*.jar" -type f | wc -l
```

期望结果：

- `devtool.sh check` 通过
- `mods/` 中有实际 `*.jar`
- Prism 实例使用 Java `21`
- Prism 实例组件中有 Minecraft `1.21.1` 和 NeoForge `21.1.242`

## 常见问题

### 脚本说找不到 mmc-pack.json

你输入的不是 Prism 实例目录，也不是实例内的 `minecraft` 目录。应输入类似：

```text
~/.local/share/PrismLauncher/instances/<你的实例名>
```

或：

```text
~/.local/share/PrismLauncher/instances/<你的实例名>/minecraft
```

### 脚本说版本不对

回到 Prism Launcher，检查实例组件：

- Minecraft 必须是 `1.21.1`
- NeoForge 必须是 `21.1.242`

修正后重新运行脚本。

### 找不到 node 或 npm

先安装 Node.js LTS 和 npm。不同发行版命令不同，例如：

```bash
node -v
npm -v
```

确认命令可用后重新运行脚本。

### 不想直接 curl 到 bash

可以先下载再查看：

```bash
curl -fsSL "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Project-Rebirth/main/scripts/install-prism.sh" -o /tmp/install-cdpr-prism.sh
less /tmp/install-cdpr-prism.sh
bash /tmp/install-cdpr-prism.sh
```
