# 用 HMCL 部署源码实例

游玩发布包见[发布包选择说明](install/README.md#从-releases-下载)。下面在 Windows 上建立独立的 CDPR 源码实例。准备好 Java 21、Git、Node.js 和 npm，将 PowerShell 的工作目录切到 **HMCL 正在使用的 Minecraft 根目录**。

## 创建源码实例

```powershell
$MinecraftDir = (Get-Location).Path
$InstanceDir = Join-Path $MinecraftDir 'versions/CDPR'
git clone https://github.com/Jasons-impart/Create-Delight-Project-Rebirth.git "$InstanceDir"
Set-Location "$InstanceDir"
```

已有源码实例可直接进入其实例目录。从这里执行[工作区初始化](DevGuide.md#初始化工作区)。如果游戏目录中已有手动添加的 JAR，核对它们的版本与来源；受管文件同步只清理清单记录过的文件。

## 安装加载器

当前目标为 NeoForge 21.1.251。从官方 Maven 下载带版本号的 installer，连接失败时可用 BMCLAPI 镜像。下面的命令先验证官方 SHA-256，再运行 installer；换加载器版本时同时更新官方校验值。

```powershell
$InstallerVersion = "21.1.251"
$ExpectedSha256 = "f63d9011b89aa5db0f5cbe437bb21b2f8c2182ff0c6ac329b7bbf6c9b19bc741"
$OfficialUrl = "https://maven.neoforged.net/releases/net/neoforged/neoforge/$InstallerVersion/neoforge-$InstallerVersion-installer.jar"
$MirrorUrl = "https://bmclapi2.bangbang93.com/maven/net/neoforged/neoforge/$InstallerVersion/neoforge-$InstallerVersion-installer.jar"
$OutFile = ".\neoforge-$InstallerVersion-installer.jar"
$Proxy = $null  # 需要代理时填写本机代理 URL

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

$Proxy = $null  # 需要代理时填写本机代理 URL
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


## 让 HMCL 识别版本

在同一 PowerShell 会话、同一实例目录中执行。基础游戏放入 HMCL 全局版本目录，运行库同步到全局 libraries，实例 JSON 则位于自己的版本目录中。

```powershell
$base = Join-Path $MinecraftDir 'versions/1.21.1'
New-Item -ItemType Directory -Force $base | Out-Null
Copy-Item .\versions\1.21.1\1.21.1.json, .\versions\1.21.1\1.21.1.jar -Destination $base -Force
robocopy .\libraries (Join-Path $MinecraftDir 'libraries') /E /NFL /NDL /NJH /NJS /NP
if ($LASTEXITCODE -ge 8) { throw '运行库复制失败' }
$profile = Get-Content .\versions\neoforge-21.1.251\neoforge-21.1.251.json -Raw | ConvertFrom-Json
$profile.id = 'CDPR'
$profile | ConvertTo-Json -Depth 100 | Set-Content .\CDPR.json -Encoding UTF8
```

## 版本隔离和验收

在 HMCL 为 CDPR 选择 Java 21 并启用版本隔离。启动后在实例 `logs/latest.log` 核对 `--gameDir` 指向 `$InstanceDir`，以及 NeoForge 版本、实际模组和 KubeJS 均已加载。

- **HMCL 3.16 及以后**使用实例下的 `.hmcl/config/instance-game-settings.json`。启动器的游戏设置预设和启动器设置在 HMCL 根目录的 `.hmcl/config/`。旧 `hmclversion.cfg` 只在首次迁移时读取。
- **HMCL 3.15 及以前**检查实例下的 `hmclversion.cfg`。实例设置优先，独立游戏目录通常使用 `usesGlobal = false`、`gameDirType = 1`。手动改配置前先退出 HMCL。
- **找不到版本或缺少 client.jar**时，先检查全局基础游戏 JAR、目标 NeoForge client JAR 和实例根 `CDPR.json`。它应继承 `1.21.1`，主类为 `cpw.mods.bootstraplauncher.BootstrapLauncher`。installer 中途失败时，仅看到版本 JSON 还不能证明安装成功；按上节校验依赖后重跑，再同步全局库。
