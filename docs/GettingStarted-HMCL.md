# 开发环境快速开始（HMCL版）

本文用于从空目录配置 Create Delight Project Rebirth 本地开发实例。

## 基线和路径

- Minecraft: `1.21.1`
- Loader: `NeoForge 21.1.228`
- Java: `21`
- 示例 HMCL 目录：`E:\minecraft\Client\HMCL`
- 示例实例名：`CDPR`
- 示例实例目录：`E:\minecraft\Client\HMCL\.minecraft\versions\CDPR`

下文命令默认在 PowerShell 中执行。路径不同的机器请先替换示例路径，也可以先在当前终端约定变量：

```powershell
$HmclDir = "E:\minecraft\Client\HMCL"
$MinecraftDir = Join-Path $HmclDir ".minecraft"
$InstanceName = "CDPR"
$InstanceDir = Join-Path $MinecraftDir "versions\$InstanceName"
```

## 关键约定

本仓库既是源码仓库，也是 HMCL 的版本隔离实例目录。最终目录形态应为：

```text
E:\minecraft\Client\HMCL\.minecraft\
├── libraries\                         # HMCL 全局库，普通版本启动时会读取这里
├── versions\
│   ├── 1.21.1\                         # CDPR.json 的 inherited parent
│   │   ├── 1.21.1.json
│   │   └── 1.21.1.jar
│   └── CDPR\
│       ├── .git\
│       ├── CDPR.json                   # 让 HMCL 左侧识别 CDPR 的根版本 JSON
│       ├── config\
│       ├── kubejs\
│       ├── mods\
│       ├── pack.toml
│       ├── resourcepacks\
│       └── ...
```

需要同时满足两件事：

- **普通版本识别**：`versions/CDPR/CDPR.json` 存在，并且 `id` 等于目录名 `CDPR`。
- **版本隔离启动**：HMCL 启动参数中的 `--gameDir` 必须是 `...\versions\CDPR`，否则会读取全局 `.minecraft\mods`，而不是本实例的 `mods`。

## 前置依赖

安装并确认可用：

- Git
- Java 21
- Node.js LTS / npm
- Windows 推荐 PowerShell 7，命令为 `pwsh`
- Python 3
- HMCL

检查命令：

```powershell
git --version
java -version
pwsh -NoProfile -Command '$PSVersionTable.PSVersion'
node -v
npm -v
npm install -g @bro-know-my/packwiz
python --version
```

如果网络访问 GitHub、Mojang、NeoForge Maven、CurseForge/ForgeCDN 较慢，可准备本地代理，例如 `127.0.0.1:7890`。

## 克隆仓库

推荐浅克隆到实例目录：

```powershell
cd "$MinecraftDir\versions"
mkdir $InstanceName
cd $InstanceName
git clone --depth 1 https://github.com/Jasons-impart/Create-Delight-Project-Rebirth.git .
```

如果已经普通克隆完成，不需要删除重来，继续后续步骤。

## 初始化仓库

在 `CDPR` 目录执行：

```powershell
npm install
.\devtool.bat setup-tools
.\devtool.bat prepare-pack
.\devtool.bat check
```

Windows 下不要从 PowerShell 运行 `devtool.sh`；`.sh` 是 Linux/macOS 入口。

`prepare-pack` 会把 `pack/` 模板展开到根目录，并生成/刷新本地 `pack.toml`、`index.toml`、`.packwizignore` 等文件。

## 同步 mod 和资源文件

推荐通过 devtool 同步：

```powershell
.\devtool.bat install-files-headless 5 5
```

成功后：

- `mods/` 中应出现实际 `*.jar`
- `resourcepacks/` 中应出现实际资源包文件
- 这些运行文件已被 `.gitignore` 忽略，不提交

不要用手工复制/删除 `mods/*.jar` 来管理整合包列表；mod 列表以 `mods/*.pw.toml` 为准。

## 安装 NeoForge 到当前实例目录

下载 installer：

```powershell
Invoke-WebRequest -UseBasicParsing `
  -Uri "https://maven.neoforged.net/releases/net/neoforged/neoforge/21.1.228/neoforge-21.1.228-installer.jar" `
  -OutFile ".\neoforge.jar"
```

NeoForge installer 要求目标目录存在 `launcher_profiles.json`。如果当前目录没有该文件，创建一个最小文件：

```powershell
@'
{
  "profiles": {},
  "version": 3
}
'@ | Set-Content .\launcher_profiles.json -Encoding UTF8
```

安装到当前目录。不要把目标设成 HMCL 全局 `.minecraft`：

```powershell
java -jar .\neoforge.jar --install-client .
```

如果下载太慢，使用本地代理重跑。已下载文件会校验后跳过：

```powershell
java "-Dhttp.proxyHost=127.0.0.1" "-Dhttp.proxyPort=7890" `
     "-Dhttps.proxyHost=127.0.0.1" "-Dhttps.proxyPort=7890" `
     -jar .\neoforge.jar --install-client .
```

成功时 installer 会输出：

```text
Successfully installed client into launcher.
```

此时当前实例目录内会生成：

```text
libraries/
versions/1.21.1/
versions/neoforge-21.1.228/
launcher_profiles.json
```

这些是 installer 生成的“独立 Minecraft 根目录”结构。为了让 HMCL 左侧把 `CDPR` 当普通版本识别，还需要执行下一节。

## 注册为 HMCL 普通版本

在 `CDPR` 目录执行。

先把基础 `1.21.1` 放到 HMCL 全局版本目录，因为 `CDPR.json` 会 `inheritsFrom = "1.21.1"`：

```powershell
New-Item -ItemType Directory -Force "$MinecraftDir\versions\1.21.1" | Out-Null
Copy-Item ".\versions\1.21.1\1.21.1.json" "$MinecraftDir\versions\1.21.1\1.21.1.json" -Force
Copy-Item ".\versions\1.21.1\1.21.1.jar" "$MinecraftDir\versions\1.21.1\1.21.1.jar" -Force
```

再把 NeoForge libraries 同步到 HMCL 全局 libraries。普通版本启动时 HMCL 会从全局 `.minecraft\libraries` 解析库：

```powershell
robocopy ".\libraries" "$MinecraftDir\libraries" /E /NFL /NDL /NJH /NJS /NP
```

`robocopy` 返回码 `1` 表示“有文件被复制”，属于成功结果。

最后生成根目录版本 JSON：

```powershell
$instanceName = Split-Path -Leaf (Get-Location)
$json = Get-Content ".\versions\neoforge-21.1.228\neoforge-21.1.228.json" -Raw | ConvertFrom-Json
$json.id = $instanceName
$json | ConvertTo-Json -Depth 100 | Set-Content ".\$instanceName.json" -Encoding UTF8
```

`CDPR.jar` 不需要存在。NeoForge `1.21.1` 使用 `inheritsFrom = "1.21.1"` 和 libraries 中的 patched client 启动，HMCL 自己安装出的 `neoforge-21.1.228` 版本也是这种布局。

## 配置 HMCL 版本隔离

启动前必须开启版本隔离。否则日志中会出现：

```text
--gameDir E:\minecraft\Client\HMCL\.minecraft
```

这会导致游戏读取全局 `.minecraft\mods` 和 `.minecraft\resourcepacks`，而不是 `versions\CDPR` 下的整合包文件。

在 HMCL 图形界面中设置：

- 选中版本 `CDPR`
- Java 选择 Java 21，例如 `C:\Program Files\Java\jdk-21\bin\javaw.exe`
- 开启版本隔离，使游戏目录为 `.minecraft\versions\CDPR`

也可以在关闭 HMCL 后检查 `E:\minecraft\Client\HMCL\hmcl.json`。当前配置组通常在 `configurations.Default` 下，对应配置应包含：

```json
{
  "configurations": {
    "Default": {
      "gameDir": ".minecraft",
      "useRelativePath": true,
      "selectedMinecraftVersion": "CDPR",
      "global": {
        "gameDirType": 1,
        "java": "Custom",
        "javaDir": "C:\\Program Files\\Java\\jdk-21\\bin\\javaw.exe",
        "defaultJavaPath": "C:\\Program Files\\Java\\jdk-21\\bin\\javaw.exe",
        "javaVersionType": "CUSTOM"
      }
    }
  }
}
```

其中 `configurations.Default.global.gameDirType = 1` 是版本隔离的关键。

## 验证

在 `CDPR` 目录执行：

```powershell
.\devtool.bat check
git status --short --untracked-files=all
```

检查关键文件：

```powershell
Test-Path .\CDPR.json
(Get-Content .\CDPR.json -Raw | ConvertFrom-Json) | Select-Object id,inheritsFrom,mainClass,jar
Test-Path "$MinecraftDir\versions\1.21.1\1.21.1.jar"
Test-Path "$MinecraftDir\libraries\net\neoforged\neoforge\21.1.228\neoforge-21.1.228-client.jar"
Get-ChildItem .\mods -Filter *.jar -File | Measure-Object
```

期望结果：

- `devtool.bat check` 全部通过
- `CDPR.json` 存在，`id` 为 `CDPR`
- `inheritsFrom` 为 `1.21.1`
- `mainClass` 为 `cpw.mods.bootstraplauncher.BootstrapLauncher`
- HMCL 全局 `1.21.1.jar` 存在
- HMCL 全局 NeoForge client jar 存在
- `mods/` 中有实际 `*.jar`

启动后确认版本隔离是否生效：

```powershell
Get-Content "E:\minecraft\Client\HMCL\.minecraft\versions\CDPR\logs\latest.log" -TotalCount 20
```

正确日志中应出现：

```text
--version, CDPR
--gameDir, E:\minecraft\Client\HMCL\.minecraft\versions\CDPR
```

如果日志仍写在 `E:\minecraft\Client\HMCL\.minecraft\logs\latest.log`，并且 `--gameDir` 是全局 `.minecraft`，说明版本隔离没有生效。

## 常见问题

### HMCL 看不到 CDPR

检查：

- `E:\minecraft\Client\HMCL\.minecraft\versions\CDPR\CDPR.json` 存在
- `CDPR.json` 中 `id` 等于 `CDPR`
- `E:\minecraft\Client\HMCL\.minecraft\versions\1.21.1\1.21.1.json` 存在
- `E:\minecraft\Client\HMCL\.minecraft\versions\1.21.1\1.21.1.jar` 存在

修复后重启 HMCL 或刷新版本列表。

### 启动后只加载 NeoForge，没有加载整合包 mod

看日志中的 `--gameDir`。如果是：

```text
E:\minecraft\Client\HMCL\.minecraft
```

说明未开启版本隔离。关闭 HMCL 后把 `hmcl.json` 中对应配置的 `global.gameDirType` 改为 `1`，或在 HMCL 图形界面开启版本隔离。

### 启动时扫描全局旧 Forge 1.20.1 mod

这也是版本隔离未生效。日志里通常会看到类似：

```text
Skipping jar. File mods\xxx-1.20.1-forge.jar is for Minecraft Forge or an older version of NeoForge
```

修复方式同上，确保 `--gameDir` 指向 `...\versions\CDPR`。

### 找不到 `bkmpw`

先确认 Node.js LTS / npm 已安装，然后安装全局工具：

```powershell
.\devtool.bat setup-tools
```

### NeoForge installer 提示没有 launcher profile

当前目录缺少 `launcher_profiles.json`。创建最小文件后重试：

```powershell
@'
{
  "profiles": {},
  "version": 3
}
'@ | Set-Content .\launcher_profiles.json -Encoding UTF8
```

### 下载太慢或连接重置

使用本地代理重跑 installer：

```powershell
java "-Dhttp.proxyHost=127.0.0.1" "-Dhttp.proxyPort=7890" `
     "-Dhttps.proxyHost=127.0.0.1" "-Dhttps.proxyPort=7890" `
     -jar .\neoforge.jar --install-client .
```

### 没有生成实例内 `logs/latest.log`

优先确认是否查错日志位置：

- 版本隔离生效：日志在 `E:\minecraft\Client\HMCL\.minecraft\versions\CDPR\logs\latest.log`
- 版本隔离未生效：日志在 `E:\minecraft\Client\HMCL\.minecraft\logs\latest.log`

如果实例目录只出现 `natives-windows-x86_64`、`log4j2.xml`，但没有日志，通常说明 HMCL 已经开始组装启动环境，但游戏进程还没进入 Minecraft 日志初始化阶段。继续检查 HMCL 自身日志：

```text
E:\minecraft\Client\HMCL\.hmcl\logs\
```
