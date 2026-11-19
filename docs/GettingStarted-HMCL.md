# 开发环境快速开始（HMCL版）

本文用于从空目录配置 Create Delight Project Rebirth 本地开发实例。

## 基线和路径

- Minecraft: `1.21.1`
- Loader: `NeoForge 21.1.251`
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

如果网络访问 GitHub、Mojang、NeoForge Maven、CurseForge/ForgeCDN 较慢，可准备本地代理，例如 `127.0.0.1:7890`。代理能解决一部分超时和连接重置，但有些机器访问 `maven.neoforged.net` 时即使走代理也会 SSL 握手失败。后面安装 NeoForge 一节提供了镜像下载和哈希校验办法。

如果不想修改系统环境，也可以把便携版 Node.js 和 Java 21 解压到 HMCL 目录下，例如
`$HmclDir\.runtime\`。运行本文命令前，在当前 PowerShell 会话临时加入 PATH 即可：

```powershell
$RuntimeDir = Join-Path $HmclDir ".runtime"
$env:Path = (Join-Path $RuntimeDir "node-v24.18.0-win-x64") + ";$env:Path"
```

随后在 HMCL 的 Java 设置中选择便携 Java 21 的 `bin\javaw.exe`。这种方式不会修改系统级
PATH，但只对当前终端会话生效。

## 克隆仓库

推荐浅克隆到实例目录：

```powershell
cd "$MinecraftDir\versions"
mkdir $InstanceName
cd $InstanceName
git clone --depth 1 https://github.com/Jasons-impart/Create-Delight-Project-Rebirth.git .
```

如果已经普通克隆完成，不需要删除重来，继续后续步骤。就地更新已有实例时，先把仓库快进到目标分支，再跑后面的工具链和 NeoForge 安装，不要删掉实例目录。

## 初始化仓库

在 `CDPR` 目录执行：

```powershell
npm install
.\devtool.bat setup-tools
.\devtool.bat prepare-pack
.\devtool.bat refresh
.\devtool.bat check
```

Windows 下不要从 PowerShell 运行 `devtool.sh`；`.sh` 是 Linux/macOS 入口。

`prepare-pack` 会把 `pack/` 模板展开到根目录，并生成/刷新本地 `pack.toml` 等发布根目录文件。整合包版本和 Loader 版本以仓库里的 `pack/pack.toml` 为准；根目录 `pack.toml` 由 `prepare-pack` 生成，且已被 git 忽略。如果跳过 `prepare-pack`，目录里可能还留着旧的根目录 `pack.toml`（例如更早的 NeoForge 版本），不要按它去装 Loader。

`index.toml` 由 `refresh` 生成；如果跳过 `refresh`，`check` 会因为缺少 `index.toml` 失败。根目录 `.packwizignore` 是仓库跟踪的发布排除规则，不会由 `prepare-pack` 覆盖。

## 同步 mod 和资源文件

推荐通过 devtool 同步：

```powershell
.\devtool.bat install-files-headless 5 5
```

后面两个 `5` 是重试相关参数。个别文件可能在第一次尝试时超时，之后会自动重试；等到命令结束再看结果，不要在第一次超时后就中断。

成功后：

- `mods/` 中应出现实际 `*.jar`
- `resourcepacks/` 中应出现实际资源包文件
- 这些运行文件已被 `.gitignore` 忽略，不提交

不要用手工复制/删除 `mods/*.jar` 来管理整合包列表；mod 列表以 `mods/*.pw.toml` 为准。

如果是复用旧实例目录、切换分支，或之前手动放过 mod，`install-files-headless` 只会清理 bkmpw 上次记录过的受管文件；未记录的旧 `mods/*.jar` 可能继续残留并参与启动。同步后可以用下面的命令检查当前分支元数据和本地 jar 是否一致：

```powershell
$ExpectedModJars = Get-ChildItem .\mods -Recurse -File -Filter *.pw.toml |
  ForEach-Object {
    Select-String -LiteralPath $_.FullName -Pattern '^filename\s*=\s*"([^"]+)"' |
      ForEach-Object { $_.Matches[0].Groups[1].Value }
  }
$ActualModJars = Get-ChildItem .\mods -File -Filter *.jar | Select-Object -ExpandProperty Name
Compare-Object $ExpectedModJars $ActualModJars
```

没有输出表示文件名一致。`SideIndicator` 为 `=>` 的 jar 是当前分支没有声明的本地残留文件，确认不需要后删除对应 `mods/*.jar`；`<=` 表示当前分支需要但本地缺失，重新运行 `.\devtool.bat install-files-headless 5 5`。

## 安装 NeoForge 到当前实例目录

先把 installer 下到带版本号的文件名，不要直接覆盖已有的 `neoforge.jar`。就地升级时，目录里可能还留着旧版本的 `neoforge.jar`；如果下载失败，旧文件会原样留在那里，接着运行会把旧 Loader 重新装回去。

先尝试官方 Maven；失败后再走 BMCLAPI 镜像。下载完成后必须用官方 SHA-256 校验，通过后再复制为 `neoforge.jar`：

```powershell
$InstallerVersion = "21.1.251"
$ExpectedSha256 = "f63d9011b89aa5db0f5cbe437bb21b2f8c2182ff0c6ac329b7bbf6c9b19bc741"
$OfficialUrl = "https://maven.neoforged.net/releases/net/neoforged/neoforge/$InstallerVersion/neoforge-$InstallerVersion-installer.jar"
$MirrorUrl = "https://bmclapi2.bangbang93.com/maven/net/neoforged/neoforge/$InstallerVersion/neoforge-$InstallerVersion-installer.jar"
$OutFile = ".\neoforge-$InstallerVersion-installer.jar"
$Proxy = "http://127.0.0.1:7890"  # 没有本地代理就改成 $null

function Save-Installer([string]$Url) {
  $params = @{ Uri = $Url; OutFile = $OutFile; UseBasicParsing = $true }
  if ($Proxy) { $params.Proxy = $Proxy }
  Invoke-WebRequest @params
}

try {
  Save-Installer $OfficialUrl
} catch {
  Write-Warning "官方 Maven 下载失败，改用 BMCLAPI：$($_.Exception.Message)"
  Save-Installer $MirrorUrl
}

$actual = (Get-FileHash $OutFile -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $ExpectedSha256) {
  throw "SHA-256 不匹配: $actual，期望 $ExpectedSha256。不要继续安装。"
}
Copy-Item $OutFile ".\neoforge.jar" -Force
```

`21.1.251` 安装包的 SHA-256 是 `f63d9011b89aa5db0f5cbe437bb21b2f8c2182ff0c6ac329b7bbf6c9b19bc741`。官方校验文件在：

```text
https://maven.neoforged.net/releases/net/neoforged/neoforge/21.1.251/neoforge-21.1.251-installer.jar.sha256
```

如果官方站点本身也握手失败，就使用上面文档里写死的哈希。BMCLAPI 的路径没有官方地址中的 `/releases/` 这一段，不要把官方 URL 原样换主机名。

官方 Maven 失败时，常见报错包括 PowerShell 的“无法建立 SSL/TLS 安全通道”或 unexpected EOF、Windows/Git curl 的 exit 35，以及 Java 的 `SSLHandshakeException` / `Remote host terminated the handshake`。这些情况即使已经给 `Invoke-WebRequest` 或 Java 加了 `127.0.0.1:7890` 代理，仍可能出现。

NeoForge installer 要求目标目录存在 `launcher_profiles.json`。如果当前目录已经有这个文件，不要覆盖。没有时再创建一个最小文件：

```powershell
if (!(Test-Path .\launcher_profiles.json)) {
  @'
{
  "profiles": {},
  "version": 3
}
'@ | Set-Content .\launcher_profiles.json -Encoding UTF8
}
```

安装到当前目录。不要把目标设成 HMCL 全局 `.minecraft`：

```powershell
java -jar .\neoforge.jar --install-client .
```

如果官方 Maven 可以访问但比较慢，可给 installer 加上本地代理重跑。已下载且校验通过的文件会跳过：

```powershell
java "-Dhttp.proxyHost=127.0.0.1" "-Dhttp.proxyPort=7890" `
     "-Dhttps.proxyHost=127.0.0.1" "-Dhttps.proxyPort=7890" `
     -jar .\neoforge.jar --install-client .
```

如果 installer 在下载依赖库时再次对 `maven.neoforged.net` 报 SSL 失败，可能已经生成了 `versions\neoforge-21.1.251\neoforge-21.1.251.json`，但还没有 `libraries\net\neoforged\neoforge\21.1.251\neoforge-21.1.251-client.jar`。这时不要删掉半成品，先按下面的脚本从 BMCLAPI 预拉 installer 清单里的库（按 SHA-1 校验），再重跑 installer：

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$Jar = (Resolve-Path ".\neoforge-21.1.251-installer.jar")
$Zip = [System.IO.Compression.ZipFile]::OpenRead($Jar)
function Read-ZipJson([string]$Name) {
  $entry = $Zip.GetEntry($Name)
  $stream = $entry.Open()
  try {
    $reader = New-Object System.IO.StreamReader($stream)
    try { return $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Close() }
  } finally { $stream.Close() }
}
$profile = Read-ZipJson "install_profile.json"
$version = Read-ZipJson "version.json"
$Zip.Dispose()

$libs = @{}
foreach ($src in @($profile.libraries + $version.libraries)) {
  $art = $src.downloads.artifact
  if ($null -eq $art -or [string]::IsNullOrWhiteSpace($art.path)) { continue }
  $libs[$art.path] = $art
}

$Proxy = "http://127.0.0.1:7890"  # 没有本地代理就改成 $null
$OfficialPrefix = "https://maven.neoforged.net/releases/"
$MirrorRoot = "https://bmclapi2.bangbang93.com/maven/"

foreach ($art in $libs.Values) {
  $dest = Join-Path ".\libraries" $art.path
  if (Test-Path $dest) {
    $sha1 = (Get-FileHash $dest -Algorithm SHA1).Hash.ToLowerInvariant()
    if ($sha1 -eq $art.sha1.ToLowerInvariant()) { continue }
  }
  $url = [string]$art.url
  if ($url.StartsWith($OfficialPrefix)) {
    $url = $MirrorRoot + $url.Substring($OfficialPrefix.Length)
  }
  New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null
  $params = @{ Uri = $url; OutFile = $dest; UseBasicParsing = $true }
  if ($Proxy) { $params.Proxy = $Proxy }
  Invoke-WebRequest @params
  $sha1 = (Get-FileHash $dest -Algorithm SHA1).Hash.ToLowerInvariant()
  if ($sha1 -ne $art.sha1.ToLowerInvariant()) {
    throw "SHA-1 不匹配: $($art.path) 实际 $sha1，期望 $($art.sha1)"
  }
}

java -jar .\neoforge.jar --install-client .
```

成功时 installer 会输出：

```text
Successfully installed client into launcher.
```

此时当前实例目录内会生成：

```text
libraries/
versions/1.21.1/
versions/neoforge-21.1.251/
launcher_profiles.json
```

这些是 installer 生成的“独立 Minecraft 根目录”结构。为了让 HMCL 左侧把 `CDPR` 当普通版本识别，还需要执行下一节。就地升级后，实例里可能还留着旧的 `versions\neoforge-21.1.242` 之类目录，一般可以忽略；真正生效的是新生成的 `CDPR.json` 和全局库里的 `21.1.251` 文件。

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

`robocopy` 的退出码 `0` 到 `7` 都算成功。其中 `1` 表示有文件被复制，`3` 表示既复制了文件、目标目录里也已有多余文件，这两种都是正常结果。不要只看到非 0 就当成失败。

最后生成根目录版本 JSON：

```powershell
$instanceName = Split-Path -Leaf (Get-Location)
$json = Get-Content ".\versions\neoforge-21.1.251\neoforge-21.1.251.json" -Raw | ConvertFrom-Json
$json.id = $instanceName
$json | ConvertTo-Json -Depth 100 | Set-Content ".\$instanceName.json" -Encoding UTF8
```

`CDPR.jar` 不需要存在。NeoForge `1.21.1` 使用 `inheritsFrom = "1.21.1"` 和 libraries 中的 patched client 启动，HMCL 自己安装出的 `neoforge-21.1.251` 版本也是这种布局。升级 Loader 后必须按新的 `neoforge-21.1.251.json` 重新生成 `CDPR.json`，不要沿用旧版本的根 JSON。

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

如果本机 HMCL 里已经有其他实例，只改 `CDPR` 这一份实例的 Java 和隔离，不要改全局默认 Java，以免把其他实例的 Java 一并改掉。

改配置文件前必须先完全退出 HMCL。HMCL 退出时可能把内存里的设置写回文件，运行中编辑这些 JSON 会被覆盖。

### HMCL 3.16 及以后

从 HMCL 3.16 起，实例的 Java、隔离和游戏目录不再读取 `hmclversion.cfg`，也通常不再使用 HMCL 根目录的 `hmcl.json`。实际文件是：

- 实例设置：`E:\minecraft\Client\HMCL\.minecraft\versions\CDPR\.hmcl\config\instance-game-settings.json`
- 游戏设置预设：`E:\minecraft\Client\HMCL\.hmcl\config\game-settings.json`
- 启动器设置：`E:\minecraft\Client\HMCL\.hmcl\config\launcher-settings.json`

仓库里附带的 `hmclversion.cfg` 只会在第一次用 3.16 或更新版本启动该实例时迁移一次。已经迁移过的实例再改 `hmclversion.cfg` 不会生效。

在图形界面为 `CDPR` 开启版本隔离，或把当前游戏设置预设的默认隔离设为始终隔离（`defaultIsolationType` 为 `ALWAYS`），或至少对带加载器的版本隔离（`MODDED`）。最终是否生效以启动日志中的 `--gameDir` 为准，不要只看旧的 `hmclversion.cfg`。

### HMCL 3.15 及更早版本

HMCL 可能同时在全局配置和版本目录配置中保存游戏目录设置。版本目录下的
`E:\minecraft\Client\HMCL\.minecraft\versions\CDPR\hmclversion.cfg` 会覆盖全局配置；
如果这里的 `gameDirType` 是 `0`，即使 `hmcl.json` 中当前配置组已经是 `1`，启动时仍可能使用全局
`.minecraft` 作为 `--gameDir`。

关闭 HMCL 后，先检查版本级配置。如果文件不存在，先创建最小版本级配置：

```powershell
$VersionConfig = Join-Path $InstanceDir "hmclversion.cfg"
if (!(Test-Path $VersionConfig)) {
  @{
    usesGlobal = $false
    gameDirType = 1
    gameDir = ""
    java = "Custom"
    javaVersionType = "CUSTOM"
  } | ConvertTo-Json -Depth 20 | Set-Content $VersionConfig -Encoding UTF8
}
```

然后检查：

```powershell
$VersionConfig = Join-Path $InstanceDir "hmclversion.cfg"
Get-Content $VersionConfig -Raw |
  ConvertFrom-Json |
  Select-Object usesGlobal, gameDirType, gameDir, java, javaVersionType
```

期望 `gameDirType` 为 `1`。如果是 `0`，关闭 HMCL 后执行：

```powershell
$VersionConfig = Join-Path $InstanceDir "hmclversion.cfg"
$cfg = Get-Content $VersionConfig -Raw | ConvertFrom-Json
$cfg.gameDirType = 1
$cfg.gameDir = ""
$cfg | ConvertTo-Json -Depth 20 | Set-Content $VersionConfig -Encoding UTF8
```

然后再检查 `E:\minecraft\Client\HMCL\hmcl.json`。当前配置组通常在 `configurations.Default` 下，对应配置应包含：

改 `hmcl.json` 前建议先备份：

```powershell
Copy-Item "$HmclDir\hmcl.json" "$HmclDir\hmcl.json.bak-$(Get-Date -Format yyyyMMdd-HHmmss)"
```

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

其中 `configurations.Default.global.gameDirType = 1` 和
`versions\CDPR\hmclversion.cfg` 中的 `gameDirType = 1` 都要成立；实际是否生效以启动日志中的
`--gameDir` 为准。

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
Test-Path "$MinecraftDir\libraries\net\neoforged\neoforge\21.1.251\neoforge-21.1.251-client.jar"
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

说明未开启版本隔离。先在 HMCL 图形界面为 `CDPR` 开启版本隔离。

如果用的是 HMCL 3.16 或更新版本，关闭 HMCL 后检查
`E:\minecraft\Client\HMCL\.minecraft\versions\CDPR\.hmcl\config\instance-game-settings.json`
以及 `E:\minecraft\Client\HMCL\.hmcl\config\game-settings.json` 里当前预设的默认隔离。不要只改已经迁移过的 `hmclversion.cfg`，那个文件不会再生效。

如果用的是更早的 HMCL，关闭 HMCL 后把 `hmcl.json` 中对应配置的 `global.gameDirType` 改为 `1`。
如果 `hmcl.json` 已经是 `1` 但仍未生效，继续检查
`E:\minecraft\Client\HMCL\.minecraft\versions\CDPR\hmclversion.cfg`，把其中的 `gameDirType` 也改为 `1`。

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

当前目录缺少 `launcher_profiles.json`。创建最小文件后重试。如果这个文件已经存在，不要覆盖：

```powershell
if (!(Test-Path .\launcher_profiles.json)) {
  @'
{
  "profiles": {},
  "version": 3
}
'@ | Set-Content .\launcher_profiles.json -Encoding UTF8
}
```

### 官方 Maven 下载失败，或 SSL 握手失败

先确认本地代理可用，例如 `127.0.0.1:7890`，再按「安装 NeoForge 到当前实例目录」一节：先下到带版本号的文件名，失败后改用 BMCLAPI，并用官方 SHA-256 校验。不要在哈希校验失败时继续安装。

如果 `neoforge.jar` 已经能跑，但安装中途仍在下载 `fancymodloader`、`asm` 或 `neoforge-21.1.251-universal` 等库时失败，用同一节的预拉脚本从 BMCLAPI 补齐 `libraries\`，再重跑 installer。

### installer 跑完了，但没有 `neoforge-21.1.251-client.jar`

这通常是中途下载依赖库失败留下的半成品：`versions\neoforge-21.1.251\neoforge-21.1.251.json` 可能已经在，但 client jar 还没有。不要以为看到版本 JSON 就安装成功了。按上面的预拉脚本补库后重跑 installer，直到出现：

```text
Successfully installed client into launcher.
```

然后再检查：

```powershell
Test-Path ".\libraries\net\neoforged\neoforge\21.1.251\neoforge-21.1.251-client.jar"
Test-Path "$MinecraftDir\libraries\net\neoforged\neoforge\21.1.251\neoforge-21.1.251-client.jar"
```

如果实例里已经有 client jar，但还没同步到 HMCL 全局 `libraries`，HMCL 启动仍可能缺库。重新执行前面的 `robocopy`。

### 安装出来的仍是旧版 NeoForge

先检查刚下载的安装包 SHA-256 是不是 `f63d9011b89aa5db0f5cbe437bb21b2f8c2182ff0c6ac329b7bbf6c9b19bc741`。如果直接覆盖下载到已有的 `neoforge.jar` 且中途失败，这个文件可能仍是旧版本。确认哈希后再复制为 `neoforge.jar` 并重新安装，然后按新的 `neoforge-21.1.251.json` 重新生成 `CDPR.json`。

### `install-files-headless` 第一次超时

个别文件第一次尝试可能超时，后面的 `5 5` 会自动重试。等到命令退出码为 `0`，再用前面的 `Compare-Object` 核对 `mods/*.jar` 是否和 `*.pw.toml` 一致。

### 没有生成实例内 `logs/latest.log`

优先确认是否查错日志位置：

- 版本隔离生效：日志在 `E:\minecraft\Client\HMCL\.minecraft\versions\CDPR\logs\latest.log`
- 版本隔离未生效：日志在 `E:\minecraft\Client\HMCL\.minecraft\logs\latest.log`

如果实例目录只出现 `natives-windows-x86_64`、`log4j2.xml`，但没有日志，通常说明 HMCL 已经开始组装启动环境，但游戏进程还没进入 Minecraft 日志初始化阶段。继续检查 HMCL 自身日志：

```text
E:\minecraft\Client\HMCL\.hmcl\logs\
```
