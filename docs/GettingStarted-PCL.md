# 开发环境快速开始（PCL版）

本文用于通过 PCL 从空目录配置 Create Delight Project Rebirth 本地开发实例。

`<MC_VERSION>` 与 `<NEOFORGE_VERSION>` 分别表示 `pack/pack.toml` `[versions]` 中的 `minecraft`、`neoforge`；部署脚本会直接读取该基线。

## 基线

- Minecraft: `<MC_VERSION>`
- Loader: `NeoForge <NEOFORGE_VERSION>`
- Java: `21`
- 版本名：`Create-Delight-Project-Rebirth`

PCL 中显示的 NeoForge 版本标识以 `<NEOFORGE_VERSION>` 为准。版本名必须保持为 `Create-Delight-Project-Rebirth`，因为仓库内已有同名的版本 JSON：

```text
Create-Delight-Project-Rebirth.json
```

## 推荐流程：交互式部署脚本

脚本不能替你在 PCL 里点击安装 NeoForge，但可以在安装完成后接管剩余步骤：校验路径、克隆仓库、覆盖版本目录、初始化 devtool、同步 mod 和资源文件。

### 1. 用 PCL 创建 NeoForge 版本

在 PCL 中手动下载并安装：

- Minecraft `<MC_VERSION>`
- NeoForge `<NEOFORGE_VERSION>`

安装时把版本名设置为：

```text
Create-Delight-Project-Rebirth
```

安装完成后，PCL 的版本目录大致应为：

```text
.minecraft\
└── versions\
    └── Create-Delight-Project-Rebirth\
        ├── Create-Delight-Project-Rebirth.json
        └── Create-Delight-Project-Rebirth.jar
```

如果版本名不是这个，后面覆盖仓库文件后可能出现启动器找不到版本、版本 JSON 名称不匹配、游戏目录不一致等问题。

### 2. 下载并运行部署脚本

打开 PowerShell，直接拉取并执行部署脚本：

```powershell
irm "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Project-Rebirth/main/scripts/Install-PCL.ps1" | iex
```

这就是 Windows PowerShell 里的 `curl | bash` 写法。其中 `irm` 是 `Invoke-RestMethod`，`iex` 是 `Invoke-Expression`。

如果想先看脚本内容再执行，可以下载到临时目录：

```powershell
$script = Join-Path $env:TEMP "Install-CDPR-PCL.ps1"
Invoke-WebRequest -UseBasicParsing `
  -Uri "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Project-Rebirth/main/scripts/Install-PCL.ps1" `
  -OutFile $script
powershell -NoProfile -ExecutionPolicy Bypass -File $script
```

脚本会要求输入 PCL 版本目录路径，例如：

```text
E:\minecraft\Client\PCL\.minecraft\versions\Create-Delight-Project-Rebirth
```

之后脚本会自动执行：

- 检查版本目录名是否为 `Create-Delight-Project-Rebirth`
- 检查 PCL 已安装 `Minecraft <MC_VERSION> + NeoForge <NEOFORGE_VERSION>`
- 克隆仓库到 `tmp`
- 把 `tmp` 内容覆盖到版本目录，包括隐藏的 `.git`
- 运行 `npm install`
- 运行 `.\devtool.bat setup-tools`
- 运行 `.\devtool.bat prepare-pack`
- 运行 `.\devtool.bat check`
- 运行 `.\devtool.bat install-files-headless 5 5`

如果只想先部署仓库、不下载 mod 和资源文件，可以这样运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File $script -SkipInstallFiles
```

## 手动流程

如果不想运行脚本，可以按下面步骤手动处理。

### 1. 进入版本目录并克隆到 tmp

打开 PCL 当前使用的游戏目录，进入：

```text
.minecraft\versions\Create-Delight-Project-Rebirth
```

在这个目录里新建 `tmp`，并把仓库克隆到 `tmp`：

```powershell
mkdir tmp
cd tmp
git clone --depth 1 https://github.com/Jasons-impart/Create-Delight-Project-Rebirth.git .
```

此时目录形态应为：

```text
Create-Delight-Project-Rebirth\
├── Create-Delight-Project-Rebirth.json      # PCL 生成的文件
├── Create-Delight-Project-Rebirth.jar       # PCL 生成的文件
└── tmp\
    ├── .git\
    ├── config\
    ├── kubejs\
    ├── mods\
    ├── pack\
    ├── Create-Delight-Project-Rebirth.json
    └── ...
```

### 2. 把 tmp 内容剪切到上一级并覆盖

仍在 `tmp` 目录中执行：

```powershell
cd ..
Get-ChildItem -LiteralPath ".\tmp" -Force | Move-Item -Destination "." -Force
```

这一步要点：

- 移动的是 `tmp` 里面的全部内容，不是移动 `tmp` 文件夹本身。
- 必须包含隐藏目录 `.git`，所以命令里用了 `-Force`。
- 遇到同名文件选择覆盖，让仓库里的 `Create-Delight-Project-Rebirth.json` 覆盖 PCL 生成的同名文件。

确认 `tmp` 为空后可以删除：

```powershell
Remove-Item -LiteralPath ".\tmp" -Force
```

最终版本目录应直接包含仓库内容：

```text
Create-Delight-Project-Rebirth\
├── .git\
├── config\
├── kubejs\
├── mods\
├── pack\
├── Create-Delight-Project-Rebirth.json
├── Create-Delight-Project-Rebirth.jar
├── devtool.bat
└── ...
```

### 3. 初始化仓库文件

在版本目录执行：

```powershell
npm install
.\devtool.bat setup-tools
.\devtool.bat prepare-pack
.\devtool.bat check
```

`prepare-pack` 会把 `pack/` 模板展开到根目录，并刷新本地 `pack.toml`、`index.toml`、`.packwizignore` 等文件。

### 4. 同步 mod 和资源文件

继续在版本目录执行：

```powershell
.\devtool.bat install-files-headless 5 5
```

成功后：

- `mods/` 中应出现实际 `*.jar`
- `resourcepacks/` 中应出现实际资源包文件
- 这些运行文件已被 `.gitignore` 忽略，不提交

不要手工维护 `mods/*.jar` 列表；整合包列表以 `mods/*.pw.toml`、`resourcepacks/*.pw.toml`、`shaderpacks/*.pw.toml` 为准。

## 启动前检查

在版本目录执行：

```powershell
.\devtool.bat check
git status --short --untracked-files=all
```

检查版本 JSON：

```powershell
(Get-Content .\Create-Delight-Project-Rebirth.json -Raw | ConvertFrom-Json) |
  Select-Object id,mainClass,clientVersion
```

期望结果：

- `id` 为 `Create-Delight-Project-Rebirth`
- `mainClass` 为 `cpw.mods.bootstraplauncher.BootstrapLauncher`
- `clientVersion` 为 `<MC_VERSION>`
- PCL 中该版本使用 Java 21

## 常见问题

### PCL 里版本名不对

删除错误版本，重新用 PCL 安装 `<MC_VERSION> + NeoForge <NEOFORGE_VERSION>`，版本名填：

```text
Create-Delight-Project-Rebirth
```

不要后面再手动改成别的名字。

### 移动后没有 .git

说明移动时没有包含隐藏文件。重新检查 `tmp\.git` 是否还在；如果还在，回到版本目录执行：

```powershell
Get-ChildItem -LiteralPath ".\tmp" -Force | Move-Item -Destination "." -Force
```

### 找不到 bkmpw

先确认 Node.js LTS / npm 已安装，然后执行：

```powershell
.\devtool.bat setup-tools
```

### 启动后没有加载整合包 mod

确认 PCL 启动的是版本：

```text
Create-Delight-Project-Rebirth
```

并确认版本目录下已有实际 mod jar：

```powershell
Get-ChildItem .\mods -Filter *.jar -File | Measure-Object
```
