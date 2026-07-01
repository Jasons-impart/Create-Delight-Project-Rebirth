param(
  [string]$InstanceDir = "",
  [string]$RepoUrl = "https://github.com/Jasons-impart/Create-Delight-Project-Rebirth.git",
  [switch]$SkipInstallFiles
)

$ErrorActionPreference = "Stop"

$ExpectedVersionName = "Create-Delight-Project-Rebirth"
$ExpectedMinecraftVersion = "1.21.1"
$ExpectedNeoForgeVersion = "21.1.228"

function Write-Title {
  param([string]$Message)
  Write-Host ""
  Write-Host $Message -ForegroundColor Magenta
  Write-Host ("=" * $Message.Length) -ForegroundColor DarkMagenta
}

function Write-Info {
  param([string]$Message)
  Write-Host "[信息] $Message" -ForegroundColor Gray
}

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Success {
  param([string]$Message)
  Write-Host "[完成] $Message" -ForegroundColor Green
}

function Write-Warn {
  param([string]$Message)
  Write-Host "[警告] $Message" -ForegroundColor Yellow
}

function Fail {
  param([string]$Message)
  Write-Host "[错误] $Message" -ForegroundColor Red
  throw $Message
}

function Require-Command {
  param([string]$Name)
  $command = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $command) {
    Fail "未找到命令：$Name。请先安装并加入 PATH。"
  }
}

function Read-RequiredPath {
  param([string]$Prompt)

  while ($true) {
    Write-Host "[输入] $Prompt" -ForegroundColor Yellow -NoNewline
    Write-Host " > " -ForegroundColor DarkYellow -NoNewline
    $value = Read-Host
    $value = $value.Trim().Trim('"')
    if ($value) {
      return $value
    }
  }
}

function Invoke-Checked {
  param(
    [string]$FilePath,
    [string[]]$ArgumentList,
    [string]$WorkingDirectory
  )

  $process = Start-Process `
    -FilePath $FilePath `
    -ArgumentList $ArgumentList `
    -WorkingDirectory $WorkingDirectory `
    -NoNewWindow `
    -Wait `
    -PassThru

  if ($process.ExitCode -ne 0) {
    Fail "命令失败：$FilePath $($ArgumentList -join ' ')"
  }

  Write-Success "命令完成"
}

Write-Title "Create Delight Project Rebirth PCL 部署脚本"
Write-Info "请先在 PCL 中手动安装 Minecraft $ExpectedMinecraftVersion + NeoForge $ExpectedNeoForgeVersion。"
Write-Info "PCL 版本名必须设置为：$ExpectedVersionName"

Require-Command "git"
Require-Command "node"
Require-Command "npm"

if (-not $InstanceDir) {
  $InstanceDir = Read-RequiredPath "请输入 PCL 版本目录路径"
}

$InstanceDir = $InstanceDir.Trim().Trim('"')
if (-not (Test-Path -LiteralPath $InstanceDir -PathType Container)) {
  Fail "版本目录不存在：$InstanceDir"
}

$InstanceDir = (Resolve-Path -LiteralPath $InstanceDir).Path
$actualVersionName = Split-Path -Leaf $InstanceDir
if ($actualVersionName -ne $ExpectedVersionName) {
  Fail "版本目录名必须是 $ExpectedVersionName，当前是 $actualVersionName。请先在 PCL 中用正确版本名安装。"
}

$versionJson = Join-Path $InstanceDir "$ExpectedVersionName.json"
$versionJar = Join-Path $InstanceDir "$ExpectedVersionName.jar"

if (-not (Test-Path -LiteralPath $versionJson -PathType Leaf)) {
  Fail "未找到版本 JSON：$versionJson。请先用 PCL 安装 NeoForge 版本。"
}

if (-not (Test-Path -LiteralPath $versionJar -PathType Leaf)) {
  Write-Warn "未找到版本 jar：$versionJar。NeoForge 有时不依赖同名 jar，但请确认 PCL 已完整安装该版本。"
}

$jsonText = Get-Content -Raw -LiteralPath $versionJson
if ($jsonText -notmatch [regex]::Escape($ExpectedMinecraftVersion)) {
  Fail "版本 JSON 中未找到 Minecraft $ExpectedMinecraftVersion。请检查 PCL 安装的 MC 版本。"
}

if ($jsonText -notmatch [regex]::Escape($ExpectedNeoForgeVersion)) {
  Fail "版本 JSON 中未找到 NeoForge $ExpectedNeoForgeVersion。请检查 PCL 安装的 NeoForge 版本。"
}

$tmpDir = Join-Path $InstanceDir "tmp"
if (Test-Path -LiteralPath $tmpDir) {
  $existing = Get-ChildItem -LiteralPath $tmpDir -Force -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Warn "tmp 目录已存在且非空。"
    Write-Host "[输入] 是否删除后重新克隆？输入 YES 继续" -ForegroundColor Yellow -NoNewline
    Write-Host " > " -ForegroundColor DarkYellow -NoNewline
    $answer = Read-Host
    if ($answer -ne "YES") {
      Fail "已取消。请清理 tmp 后重试。"
    }
    Remove-Item -LiteralPath $tmpDir -Recurse -Force
  } else {
    Remove-Item -LiteralPath $tmpDir -Force
  }
}

Write-Step "克隆仓库到 tmp"
Invoke-Checked -FilePath "git" -ArgumentList @("clone", "--depth", "1", $RepoUrl, $tmpDir) -WorkingDirectory $InstanceDir

$tmpGit = Join-Path $tmpDir ".git"
$tmpJson = Join-Path $tmpDir "$ExpectedVersionName.json"
if (-not (Test-Path -LiteralPath $tmpGit -PathType Container)) {
  Fail "克隆结果缺少 .git：$tmpGit"
}
if (-not (Test-Path -LiteralPath $tmpJson -PathType Leaf)) {
  Fail "克隆结果缺少版本 JSON：$tmpJson"
}

Write-Step "覆盖版本目录"
Get-ChildItem -LiteralPath $tmpDir -Force | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $InstanceDir -Recurse -Force
}
Remove-Item -LiteralPath $tmpDir -Recurse -Force

Write-Step "安装 npm 依赖"
Invoke-Checked -FilePath "npm" -ArgumentList @("install") -WorkingDirectory $InstanceDir

Write-Step "安装 bkmpw 工具"
Invoke-Checked -FilePath (Join-Path $InstanceDir "devtool.bat") -ArgumentList @("setup-tools") -WorkingDirectory $InstanceDir

Write-Step "生成本地 pack 文件"
Invoke-Checked -FilePath (Join-Path $InstanceDir "devtool.bat") -ArgumentList @("prepare-pack") -WorkingDirectory $InstanceDir

Write-Step "检查仓库状态"
Invoke-Checked -FilePath (Join-Path $InstanceDir "devtool.bat") -ArgumentList @("check") -WorkingDirectory $InstanceDir

if (-not $SkipInstallFiles) {
  Write-Step "同步 mod 和资源文件"
  Invoke-Checked -FilePath (Join-Path $InstanceDir "devtool.bat") -ArgumentList @("install-files-headless", "5", "5") -WorkingDirectory $InstanceDir
} else {
  Write-Warn "已跳过 install-files。稍后请在版本目录运行：.\devtool.bat install-files-headless 5 5"
}

Write-Step "完成"
Write-Success "部署完成"
Write-Host "请在 PCL 中启动版本：" -ForegroundColor Gray -NoNewline
Write-Host $ExpectedVersionName -ForegroundColor Green
