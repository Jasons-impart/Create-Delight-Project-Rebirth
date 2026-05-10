[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet(
    "help",
    "menu",
    "prepare-pack",
    "install-packwiz",
    "check",
    "refresh",
    "list",
    "update",
    "add-modrinth",
    "add-curseforge",
    "add-url",
    "add-github",
    "remove-mod",
    "install-files",
    "install-files-headless",
    "install-files-retry",
    "download-files",
    "detect-curseforge",
    "modlist",
    "serve",
    "export-modrinth",
    "export-curseforge"
  )]
  [string] $Command = "menu",

  [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
  [string[]] $Rest
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$BinDir = Join-Path $RepoRoot "scripts\bin"
$LocalPackwiz = Join-Path $BinDir "packwiz.exe"
$LocalPackwizInstallerBootstrap = Join-Path $BinDir "packwiz-installer-bootstrap.jar"
$DefaultPackwizRepo = "Jasons-impart/packwiz"
$PackTemplateDir = Join-Path $RepoRoot "pack"
$PackRootTemplateFiles = @(
  "pack.toml",
  "icon.png",
  "server-icon.png",
  "start.bat",
  "start.sh",
  "variables.txt"
)
$PackwizIgnoreSource = Join-Path $PackTemplateDir ".packwizignore.source"
$PackwizRootReleaseFiles = @(
  "icon.png",
  "server-icon.png",
  "start.bat",
  "start.sh",
  "variables.txt"
)
$PackwizPackPayloadFiles = @(
  "pack/icon.png",
  "pack/server-icon.png",
  "pack/start.bat",
  "pack/start.sh",
  "pack/variables.txt"
)
$PackwizTaczPayloadFiles = @(
  "tacz/Applied Armorer-v1.1.4+1.21.1.zip",
  "tacz/Create Armorer-v1.2.0+1.21.1.zip"
)
$PackwizPublishRoots = @(
  "PCL",
  "config",
  "defaultconfigs",
  "kubejs",
  "minemenu",
  "mods",
  "tacz",
  "pack"
)

function Write-Info {
  param([string] $Message)
  Write-Host "[信息] $Message" -ForegroundColor Cyan
}

function Write-Success {
  param([string] $Message)
  Write-Host "[完成] $Message" -ForegroundColor Green
}

function Write-Warn {
  param([string] $Message)
  Write-Host "[警告] $Message" -ForegroundColor Yellow
}

function Write-Fail {
  param([string] $Message)
  Write-Host "[错误] $Message" -ForegroundColor Red
}

function Show-Help {
  @"
Create Delight Project Rebirth 开发工具

用法：
  devtool.bat help
  devtool.bat menu
  devtool.bat prepare-pack
  devtool.bat install-packwiz [-Repo owner/name] [-Tag latest] [-Force]
  devtool.bat check
  devtool.bat refresh [packwiz args...]
  devtool.bat list [packwiz args...]
  devtool.bat update [mod-name | --all] [packwiz args...]
  devtool.bat add-modrinth <slug|url|project-id> [packwiz args...]
  devtool.bat add-curseforge <slug|url|project-id> [packwiz args...]
  devtool.bat add-url <url> [packwiz args...]
  devtool.bat add-github <owner/repo|url> [packwiz args...]
  devtool.bat remove-mod <name|metadata-file> [packwiz args...]
  devtool.bat install-files [attempts] [delay-seconds]           # 安装/同步 mod 文件到本地，GUI 模式，默认重试 5 次
  devtool.bat install-files-headless [attempts] [delay-seconds]  # 安装/同步 mod 文件到本地，无 GUI，默认重试 5 次
  devtool.bat install-files-retry [attempts] [delay-seconds]     # install-files-headless 的兼容别名
  devtool.bat download-files [-Force] [-CurseForgeApiKey <key>] [-CurseForgeApiBaseUrl <url>]
  devtool.bat detect-curseforge [-Yes]  # 迁移专用，非必要不使用
  devtool.bat modlist [-OutputDir docs/generated]
  devtool.bat serve [-p port] [packwiz args...]
  devtool.bat export-modrinth [packwiz args...]
  devtool.bat export-curseforge [packwiz args...]

说明：
  - 直接运行本脚本会进入交互式菜单。
  - packwiz 默认使用仓库内置的 scripts\bin\packwiz.exe。
  - 本地工具二进制、mod jar、服务端运行产物都会被 git 忽略。
  - pack.toml/index.toml/icon/start/variables 是由 pack/ 模板和 refresh 生成的本地发布根文件，默认不提交。
  - 首次拉取仓库后必须主动运行一次 prepare-pack，展开本地 packwiz 根目录文件。
  - 添加、删除或修改 packwiz 文件后，请运行 refresh，并提交 *.pw.toml、pack/ 模板和需要共享的资源/配置变更。
"@ | Write-Host
}

function Read-PackwizExtraArgs {
  param([string] $Prompt = "额外 packwiz 参数，留空表示无")

  $raw = Read-Host $Prompt
  if ([string]::IsNullOrWhiteSpace($raw)) {
    return @()
  }

  return $raw -split '\s+' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
}

function Pause-Menu {
  Write-Host ""
  Read-Host "按 Enter 继续" | Out-Null
}

function Show-MenuHeader {
  Clear-Host
  Write-Host "Create Delight Project Rebirth 开发工具" -ForegroundColor Cyan
  Write-Host "仓库路径：$RepoRoot" -ForegroundColor DarkGray

  $packwiz = Get-PackwizPath
  if ([string]::IsNullOrWhiteSpace($packwiz)) {
    Write-Host "packwiz：未安装" -ForegroundColor Yellow
  }
  else {
    Write-Host "packwiz：$packwiz" -ForegroundColor Green
  }

  Write-Host ""
}

function Start-DevMenu {
  while ($true) {
    Show-MenuHeader
    Write-Host "  P. 生成/刷新根目录发布文件（首次拉仓库必须先跑一次）"
    Write-Host "  1. 安装或更新内置 packwiz"
    Write-Host "  2. 检查仓库结构"
    Write-Host "  3. 刷新 packwiz 索引"
    Write-Host "  4. 查看 packwiz 文件列表"
    Write-Host "  5. 更新全部外部文件"
    Write-Host "  6. 更新单个外部文件"
    Write-Host "  7. 添加 Modrinth 项目"
    Write-Host "  8. 添加 CurseForge 项目"
    Write-Host "  9. 添加直链 URL"
    Write-Host " 10. 添加 GitHub Release 项目"
    Write-Host " 11. 移除 packwiz 管理文件" -ForegroundColor Yellow
    Write-Host " 12. 安装/同步 mod 文件到本地（GUI，自动重试）" -ForegroundColor Yellow
    Write-Host " 13. 安装/同步 mod 文件到本地（无 GUI，自动重试）" -ForegroundColor Yellow
    Write-Host " 14. 下载直链 packwiz 管理文件到本地（不清理无关文件）" -ForegroundColor Yellow
    Write-Host " 15. 扫描 mods 目录生成 CurseForge meta（迁移专用，非必要不使用）"
    Write-Host " 16. 生成 modlist 清单"
    Write-Host " 17. 启动 packwiz 本地服务器"
    Write-Host " 18. 导出 Modrinth .mrpack"
    Write-Host " 19. 导出 CurseForge .zip"
    Write-Host " 20. 执行自定义 packwiz 命令"
    Write-Host "  0. 退出"
    Write-Host ""

    $choice = Read-Host "请选择"

    try {
      switch ($choice) {
        "P" {
          Prepare-PackRoot
          Pause-Menu
        }
        "p" {
          Prepare-PackRoot
          Pause-Menu
        }
        "1" {
          $force = Read-Host "是否强制重装？y/N"
          $args = @()
          if ($force -match "^(y|yes)$") {
            $args += "-Force"
          }
          Install-Packwiz $args
          Pause-Menu
        }
        "2" {
          Test-Repository
          Pause-Menu
        }
        "3" {
          Invoke-Packwiz (@("refresh") + (Read-PackwizExtraArgs))
          Pause-Menu
        }
        "4" {
          Invoke-Packwiz (@("list") + (Read-PackwizExtraArgs))
          Pause-Menu
        }
        "5" {
          Invoke-PackwizAndRefresh @("update", "--all")
          Pause-Menu
        }
        "6" {
          $name = Read-Host "外部文件名称"
          if ([string]::IsNullOrWhiteSpace($name)) {
            Write-Warn "未输入名称。"
          }
          else {
            Invoke-PackwizAndRefresh (@("update", $name) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "7" {
          $project = Read-Host "Modrinth slug、URL 或项目 ID"
          if ([string]::IsNullOrWhiteSpace($project)) {
            Write-Warn "未输入项目。"
          }
          else {
            Invoke-PackwizAndRefresh (@("modrinth", "add", $project) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "8" {
          $project = Read-Host "CurseForge slug、URL 或项目 ID"
          if ([string]::IsNullOrWhiteSpace($project)) {
            Write-Warn "未输入项目。"
          }
          else {
            Invoke-PackwizAndRefresh (@("curseforge", "add", $project) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "9" {
          $url = Read-Host "直链下载 URL"
          if ([string]::IsNullOrWhiteSpace($url)) {
            Write-Warn "未输入 URL。"
          }
          else {
            Invoke-PackwizAndRefresh (@("url", "add", $url) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "10" {
          $project = Read-Host "GitHub 仓库 owner/repo 或 URL"
          if ([string]::IsNullOrWhiteSpace($project)) {
            Write-Warn "未输入项目。"
          }
          else {
            Invoke-PackwizAndRefresh (@("github", "add", $project) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "11" {
          $name = Read-Host "要移除的名称或 metadata 文件，例如 create 或 mods/create.pw.toml"
          if ([string]::IsNullOrWhiteSpace($name)) {
            Write-Warn "未输入名称。"
          }
          else {
            Invoke-PackwizAndRefresh (@("remove", $name) + (Read-PackwizExtraArgs))
            Write-Warn "已更新 packwiz 清单。请继续运行菜单 12 或 13，同步本地 mods 文件夹并清理旧 jar。"
          }
          Pause-Menu
        }
        "12" {
          $attempts = Read-Host "最大尝试次数，留空使用 5"
          $delay = Read-Host "失败后等待秒数，留空使用 10"
          $args = @()
          if (-not [string]::IsNullOrWhiteSpace($attempts)) {
            $args += $attempts
          }
          if (-not [string]::IsNullOrWhiteSpace($delay)) {
            $args += $delay
          }
          Invoke-PackwizInstallerWithRetry -InstallerArgs @() -RawRetryArgs $args
          Pause-Menu
        }
        "13" {
          $attempts = Read-Host "最大尝试次数，留空使用 5"
          $delay = Read-Host "失败后等待秒数，留空使用 10"
          $args = @()
          if (-not [string]::IsNullOrWhiteSpace($attempts)) {
            $args += $attempts
          }
          if (-not [string]::IsNullOrWhiteSpace($delay)) {
            $args += $delay
          }
          Invoke-PackwizInstallerWithRetry -InstallerArgs @("-g", "-s", "both") -RawRetryArgs $args
          Pause-Menu
        }
        "14" {
          $force = Read-Host "是否覆盖已存在文件？y/N"
          $args = @()
          if ($force -match "^(y|yes)$") {
            $args += "-Force"
          }
          Download-PackFiles $args
          Pause-Menu
        }
        "15" {
          Write-Warn "此操作会扫描 mods/*.jar 并尝试生成 CurseForge meta。"
          Write-Warn "这是迁移阶段兜底工具，非必要不使用；执行前请确认本地改动已提交或备份。"
          Write-Warn "执行后请检查生成的 *.pw.toml 和 index.toml，不要提交无关 jar。"
          $confirm = Read-Host "确认执行？输入 DETECT 继续"
          if ($confirm -eq "DETECT") {
            Invoke-Packwiz @("curseforge", "detect")
            Invoke-Packwiz @("refresh")
          }
          else {
            Write-Warn "已取消。"
          }
          Pause-Menu
        }
        "16" {
          $outputDir = Read-Host "输出目录，留空使用 docs/generated"
          if ([string]::IsNullOrWhiteSpace($outputDir)) {
            Write-ModList @()
          }
          else {
            Write-ModList @("-OutputDir", $outputDir)
          }
          Pause-Menu
        }
        "17" {
          $port = Read-Host "端口，留空使用 packwiz 默认值"
          Invoke-Packwiz @("refresh")
          if ([string]::IsNullOrWhiteSpace($port)) {
            Invoke-Packwiz @("serve")
          }
          else {
            Invoke-Packwiz @("serve", "-p", $port)
          }
          Pause-Menu
        }
        "18" {
          $output = Read-Host "输出文件，留空使用 packwiz 默认值"
          Invoke-Packwiz @("refresh")
          if ([string]::IsNullOrWhiteSpace($output)) {
            Invoke-Packwiz (@("modrinth", "export") + (Read-PackwizExtraArgs))
          }
          else {
            Invoke-Packwiz (@("modrinth", "export", "-o", $output) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "19" {
          $side = Read-Host "导出侧 client/server，留空使用 packwiz 默认值"
          $args = @("curseforge", "export")
          if (-not [string]::IsNullOrWhiteSpace($side)) {
            $args += @("-s", $side)
          }
          $args += Read-PackwizExtraArgs "额外 packwiz 参数，例如 -o output.zip；留空表示无"
          Invoke-Packwiz @("refresh")
          Invoke-Packwiz $args
          Pause-Menu
        }
        "20" {
          $custom = Read-PackwizExtraArgs "packwiz 命令参数"
          if ($custom.Count -eq 0) {
            Write-Warn "未输入命令。"
          }
          else {
            Invoke-Packwiz $custom
          }
          Pause-Menu
        }
        "0" {
          return
        }
        default {
          Write-Warn "未知选项：$choice"
          Pause-Menu
        }
      }
    }
    catch {
      Write-Fail $_.Exception.Message
      Pause-Menu
    }
  }
}

function ConvertTo-OptionMap {
  param([string[]] $RawArgs)

  $options = @{}
  $positionals = New-Object System.Collections.Generic.List[string]
  $i = 0

  while ($i -lt $RawArgs.Count) {
    $arg = $RawArgs[$i]

    switch ($arg) {
      "-Repo" {
        $i++
        $options.Repo = $RawArgs[$i]
      }
      "--repo" {
        $i++
        $options.Repo = $RawArgs[$i]
      }
      "-Tag" {
        $i++
        $options.Tag = $RawArgs[$i]
      }
      "--tag" {
        $i++
        $options.Tag = $RawArgs[$i]
      }
      "-Force" {
        $options.Force = $true
      }
      "--force" {
        $options.Force = $true
      }
      "-CurseForgeApiKey" {
        $i++
        $options.CurseForgeApiKey = $RawArgs[$i]
      }
      "--curseforge-api-key" {
        $i++
        $options.CurseForgeApiKey = $RawArgs[$i]
      }
      "-CurseForgeApiBaseUrl" {
        $i++
        $options.CurseForgeApiBaseUrl = $RawArgs[$i]
      }
      "--curseforge-api-base-url" {
        $i++
        $options.CurseForgeApiBaseUrl = $RawArgs[$i]
      }
      default {
        $positionals.Add($arg)
      }
    }

    $i++
  }

  $options.Positionals = $positionals.ToArray()
  return $options
}

function Get-PackwizPath {
  if (Test-Path $LocalPackwiz) {
    return $LocalPackwiz
  }

  $cmd = Get-Command "packwiz" -ErrorAction SilentlyContinue
  if ($null -ne $cmd) {
    return $cmd.Source
  }

  return $null
}

function Test-PackwizExecutable {
  param([string] $PackwizPath)

  & $PackwizPath help *> $null
  return ($LASTEXITCODE -eq 0)
}

function Sync-PackRootFiles {
  if (-not (Test-Path $PackTemplateDir)) {
    throw "缺少发布模板目录：$PackTemplateDir"
  }

  foreach ($relativePath in $PackRootTemplateFiles) {
    $source = Join-Path $PackTemplateDir $relativePath
    $destination = Join-Path $RepoRoot $relativePath

    if (-not (Test-Path $source)) {
      throw "缺少发布模板文件：pack\$relativePath"
    }

    $destinationDir = Split-Path -Parent $destination
    if (-not [string]::IsNullOrWhiteSpace($destinationDir)) {
      New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
    }

    $shouldCopy = -not (Test-Path $destination)
    if (-not $shouldCopy) {
      $sourceHash = (Get-FileHash -Path $source -Algorithm SHA256).Hash
      $destinationHash = (Get-FileHash -Path $destination -Algorithm SHA256).Hash
      $shouldCopy = $sourceHash -ne $destinationHash
    }

    if ($shouldCopy) {
      Copy-Item -Path $source -Destination $destination -Force
    }
  }

  Sync-PackwizIgnore
}

function Sync-PackwizIgnore {
  $gitIgnore = Join-Path $RepoRoot ".gitignore"
  $packwizIgnore = Join-Path $RepoRoot ".packwizignore"

  if (-not (Test-Path $gitIgnore)) {
    throw "缺少 .gitignore，无法生成 .packwizignore"
  }
  if (-not (Test-Path $PackwizIgnoreSource)) {
    throw "缺少发布忽略模板：pack\.packwizignore.source"
  }

  $lines = New-Object System.Collections.Generic.List[string]
  $seen = New-Object "System.Collections.Generic.HashSet[string]" ([System.StringComparer]::OrdinalIgnoreCase)

  $lines.Add("# Generated by devtool from Git source files and pack/.packwizignore.source.")
  $lines.Add("# Do not edit this file directly.")
  $lines.Add("")
  $lines.Add("# Start from an empty pack index, then re-allow publish files.")
  Add-PackwizIgnorePattern -Lines $lines -Seen $seen -Pattern "/*"

  $publishFiles = @(Get-PackwizPublishFilesFromGit)
  $allowedFiles = New-Object "System.Collections.Generic.HashSet[string]" ([System.StringComparer]::OrdinalIgnoreCase)
  foreach ($relativePath in ($PackwizRootReleaseFiles + $PackwizPackPayloadFiles + $PackwizTaczPayloadFiles + $publishFiles)) {
    [void] $allowedFiles.Add((Normalize-PackwizRelativePath $relativePath))
  }

  $lines.Add("")
  $lines.Add("# Generated release-root files copied from pack/.")
  foreach ($relativePath in $PackwizRootReleaseFiles) {
    Add-PackwizAllowFile -Lines $lines -Seen $seen -RelativePath $relativePath
  }

  $lines.Add("")
  $lines.Add("# Publish root traversal; generated local exclusions below keep this to the Git source set.")
  foreach ($root in $PackwizPublishRoots) {
    Add-PackwizAllowTree -Lines $lines -Seen $seen -RelativePath $root
  }

  $lines.Add("")
  $lines.Add("# Self-extract/release payload kept under pack/.")
  foreach ($relativePath in $PackwizPackPayloadFiles) {
    Add-PackwizAllowFile -Lines $lines -Seen $seen -RelativePath $relativePath
  }

  $lines.Add("")
  $lines.Add("# Git-visible pack source files selected for distribution.")
  foreach ($relativePath in $publishFiles) {
    Add-PackwizAllowFile -Lines $lines -Seen $seen -RelativePath $relativePath
  }

  $lines.Add("")
  $lines.Add("# Explicit TaCZ gun packs.")
  foreach ($relativePath in $PackwizTaczPayloadFiles) {
    Add-PackwizAllowFile -Lines $lines -Seen $seen -RelativePath $relativePath
  }

  $lines.Add("")
  $lines.Add("# Existing local files under publish roots that Git would not publish.")
  foreach ($relativePath in Get-PackwizExistingFilesInPublishRoots) {
    $normalized = Normalize-PackwizRelativePath $relativePath
    if (-not $allowedFiles.Contains($normalized)) {
      Add-PackwizIgnorePattern -Lines $lines -Seen $seen -Pattern "/$normalized"
    }
  }

  $lines.Add("")
  $lines.Add("# Extra distribution exclusions.")
  foreach ($line in Get-Content -Path $PackwizIgnoreSource) {
    $lines.Add($line)
  }

  $content = ($lines -join "`n") + "`n"
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($packwizIgnore, $content, $encoding)
}

function Add-PackwizAllowTree {
  param(
    [System.Collections.Generic.List[string]] $Lines,
    [System.Collections.Generic.HashSet[string]] $Seen,
    [string] $RelativePath
  )

  $normalized = Normalize-PackwizRelativePath $RelativePath
  if ([string]::IsNullOrWhiteSpace($normalized)) {
    return
  }

  Add-PackwizAllowDirectory -Lines $Lines -Seen $Seen -RelativePath $normalized
  Add-PackwizIgnorePattern -Lines $Lines -Seen $Seen -Pattern "!/$normalized/**"
}

function Add-PackwizIgnorePattern {
  param(
    [System.Collections.Generic.List[string]] $Lines,
    [System.Collections.Generic.HashSet[string]] $Seen,
    [string] $Pattern
  )

  if ($Seen.Add($Pattern)) {
    $Lines.Add($Pattern)
  }
}

function Add-PackwizAllowDirectory {
  param(
    [System.Collections.Generic.List[string]] $Lines,
    [System.Collections.Generic.HashSet[string]] $Seen,
    [string] $RelativePath
  )

  $normalized = Normalize-PackwizRelativePath $RelativePath
  if ([string]::IsNullOrWhiteSpace($normalized)) {
    return
  }

  $parts = $normalized -split "/"
  $current = ""
  foreach ($part in $parts) {
    if ([string]::IsNullOrWhiteSpace($part)) {
      continue
    }

    if ([string]::IsNullOrWhiteSpace($current)) {
      $current = $part
    }
    else {
      $current = "$current/$part"
    }

    Add-PackwizIgnorePattern -Lines $Lines -Seen $Seen -Pattern "!/$current/"
  }
}

function Add-PackwizAllowFile {
  param(
    [System.Collections.Generic.List[string]] $Lines,
    [System.Collections.Generic.HashSet[string]] $Seen,
    [string] $RelativePath
  )

  $normalized = Normalize-PackwizRelativePath $RelativePath
  if ([string]::IsNullOrWhiteSpace($normalized)) {
    return
  }

  $lastSlash = $normalized.LastIndexOf("/")
  if ($lastSlash -gt 0) {
    Add-PackwizAllowDirectory -Lines $Lines -Seen $Seen -RelativePath $normalized.Substring(0, $lastSlash)
  }

  Add-PackwizIgnorePattern -Lines $Lines -Seen $Seen -Pattern "!/$normalized"
}

function Normalize-PackwizRelativePath {
  param([string] $RelativePath)

  return ($RelativePath -replace "\\", "/").TrimStart("/")
}

function Get-PackwizPublishFilesFromGit {
  Push-Location $RepoRoot
  try {
    $paths = & git ls-files --cached --others --exclude-standard -- $PackwizPublishRoots
    if ($LASTEXITCODE -ne 0) {
      throw "git ls-files 退出码：$LASTEXITCODE"
    }
  }
  finally {
    Pop-Location
  }

  return $paths |
    ForEach-Object { Normalize-PackwizRelativePath $_ } |
    Where-Object { Test-PackwizPublishPath $_ } |
    Sort-Object -Unique
}

function Get-PackwizExistingFilesInPublishRoots {
  foreach ($root in $PackwizPublishRoots) {
    $rootPath = Join-Path $RepoRoot $root
    if (-not (Test-Path -LiteralPath $rootPath -PathType Container)) {
      continue
    }

    Get-ChildItem -LiteralPath $rootPath -Recurse -Force -File |
      ForEach-Object {
        Normalize-PackwizRelativePath ($_.FullName.Substring($RepoRoot.Length).TrimStart("\", "/"))
      }
  }
}

function Test-PackwizPublishPath {
  param([string] $RelativePath)

  $path = Normalize-PackwizRelativePath $RelativePath
  if ([string]::IsNullOrWhiteSpace($path)) {
    return $false
  }

  if ($path -match "(^|/)\.gitignore$") {
    return $false
  }

  $nativePath = Join-Path $RepoRoot ($path -replace "/", [System.IO.Path]::DirectorySeparatorChar)
  if (-not (Test-Path -LiteralPath $nativePath -PathType Leaf)) {
    return $false
  }

  if ($path -match "^(PCL|config|defaultconfigs|kubejs|minemenu)/") {
    return $true
  }

  if ($path -match "^mods/[^/]+\.pw\.toml$") {
    return $true
  }

  if ($PackwizPackPayloadFiles -contains $path) {
    return $true
  }

  if ($PackwizTaczPayloadFiles -contains $path) {
    return $true
  }

  return $false
}

function Prepare-PackRoot {
  Sync-PackRootFiles
  Invoke-Packwiz @("refresh") -SkipPrepare
}

function Invoke-Packwiz {
  param(
    [string[]] $PackwizArgs,
    [switch] $SkipPrepare
  )

  $packwiz = Get-PackwizPath
  if ([string]::IsNullOrWhiteSpace($packwiz)) {
    throw "未找到 packwiz。请运行：devtool.bat install-packwiz，或把 packwiz.exe 放到 scripts\bin\packwiz.exe"
  }

  if (-not $SkipPrepare) {
    Sync-PackRootFiles
  }

  Push-Location $RepoRoot
  try {
    Write-Info "执行：packwiz $($PackwizArgs -join ' ')"
    & $packwiz @PackwizArgs
    if ($LASTEXITCODE -ne 0) {
      throw "packwiz 退出码：$LASTEXITCODE"
    }
  }
  finally {
    Pop-Location
  }
}

function Invoke-PackwizAndRefresh {
  param([string[]] $PackwizArgs)

  Invoke-Packwiz $PackwizArgs
  Invoke-Packwiz @("refresh")
}

function Get-RelativePath {
  param(
    [string] $BasePath,
    [string] $TargetPath
  )

  $baseFullPath = [System.IO.Path]::GetFullPath($BasePath)
  $targetFullPath = [System.IO.Path]::GetFullPath($TargetPath)

  if (-not $baseFullPath.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
    $baseFullPath += [System.IO.Path]::DirectorySeparatorChar
  }

  $baseUri = New-Object System.Uri($baseFullPath)
  $targetUri = New-Object System.Uri($targetFullPath)
  $relativeUri = $baseUri.MakeRelativeUri($targetUri)
  $relativePath = [System.Uri]::UnescapeDataString($relativeUri.ToString())
  return ($relativePath -replace '/', [System.IO.Path]::DirectorySeparatorChar)
}

function Get-PackwizMetaFiles {
  Get-ChildItem -Path $RepoRoot -Recurse -File -Filter "*.pw.toml" |
  Where-Object {
    $relative = Get-RelativePath $RepoRoot $_.FullName
    $relative -notmatch '^(?i)\.git[\\/]' -and
    $relative -notmatch '^(?i)scripts[\\/]bin[\\/]'
  }
}

function Read-PackwizMeta {
  param([string] $Path)

  $meta = [ordered]@{
    Path     = $Path
    File     = $null
    Name     = $null
    Side     = $null
    Url      = $null
    Hash     = $null
    HashMode = $null
    Mode     = $null
    CurseForgeProjectId = $null
    CurseForgeFileId    = $null
  }

  foreach ($line in Get-Content -Path $Path) {
    if ($line -match '^\s*file\s*=\s*"([^"]+)"') {
      $meta.File = $matches[1]
    }
    elseif ($line -match '^\s*filename\s*=\s*"([^"]+)"') {
      $meta.File = $matches[1]
    }
    elseif ($line -match '^\s*name\s*=\s*"([^"]+)"') {
      $meta.Name = $matches[1]
    }
    elseif ($line -match '^\s*side\s*=\s*"([^"]+)"') {
      $meta.Side = $matches[1]
    }
    elseif ($line -match '^\s*url\s*=\s*"([^"]+)"') {
      $meta.Url = $matches[1]
    }
    elseif ($line -match '^\s*mode\s*=\s*"([^"]+)"') {
      $meta.Mode = $matches[1]
    }
    elseif ($line -match '^\s*hash\s*=\s*"([^"]+)"') {
      $meta.Hash = $matches[1]
    }
    elseif ($line -match '^\s*hash-format\s*=\s*"([^"]+)"') {
      $meta.HashMode = $matches[1]
    }
    elseif ($line -match '^\s*project-id\s*=\s*([0-9]+)') {
      $meta.CurseForgeProjectId = $matches[1]
    }
    elseif ($line -match '^\s*file-id\s*=\s*([0-9]+)') {
      $meta.CurseForgeFileId = $matches[1]
    }
  }

  return [pscustomobject]$meta
}

function ConvertTo-CsvCell {
  param([object] $Value)

  $text = [string] $Value
  if ($null -eq $Value) {
    $text = ""
  }

  '"' + ($text -replace '"', '""') + '"'
}

function Get-TomlStringValue {
  param(
    [string] $Text,
    [string] $Key
  )

  $pattern = '(?m)^\s*' + [regex]::Escape($Key) + '\s*=\s*"([^"]*)"'
  $match = [regex]::Match($Text, $pattern)
  if ($match.Success) {
    return $match.Groups[1].Value
  }

  return $null
}

function Read-ModInfoFromJar {
  param([string] $Path)

  $result = [ordered]@{
    Name    = [System.IO.Path]::GetFileNameWithoutExtension($Path)
    ModId   = $null
    Version = $null
  }

  try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction SilentlyContinue
    $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
    try {
      $entry = $zip.Entries | Where-Object {
        $_.FullName -in @("META-INF/neoforge.mods.toml", "META-INF/mods.toml")
      } | Select-Object -First 1

      if ($null -eq $entry) {
        return [pscustomobject]$result
      }

      $reader = New-Object System.IO.StreamReader($entry.Open())
      try {
        $text = $reader.ReadToEnd()
      }
      finally {
        $reader.Dispose()
      }

      $displayName = Get-TomlStringValue -Text $text -Key "displayName"
      $modId = Get-TomlStringValue -Text $text -Key "modId"
      $version = Get-TomlStringValue -Text $text -Key "version"

      if (-not [string]::IsNullOrWhiteSpace($displayName)) {
        $result.Name = $displayName
      }
      if (-not [string]::IsNullOrWhiteSpace($modId)) {
        $result.ModId = $modId
      }
      if (-not [string]::IsNullOrWhiteSpace($version)) {
        $result.Version = $version
      }
    }
    finally {
      $zip.Dispose()
    }
  }
  catch {
    Write-Warn "读取 jar 元数据失败：$([System.IO.Path]::GetFileName($Path))"
  }

  return [pscustomobject]$result
}

function ConvertTo-ModListOptions {
  param([string[]] $RawArgs)

  $options = @{
    OutputDir = "docs/generated"
  }

  $i = 0
  while ($i -lt $RawArgs.Count) {
    switch ($RawArgs[$i]) {
      "-OutputDir" {
        $i++
        $options.OutputDir = $RawArgs[$i]
      }
      "--output-dir" {
        $i++
        $options.OutputDir = $RawArgs[$i]
      }
      default {
        Write-Warn "忽略未知参数：$($RawArgs[$i])"
      }
    }
    $i++
  }

  return $options
}

function Write-ModList {
  param([string[]] $RawArgs)

  $options = ConvertTo-ModListOptions $RawArgs
  $outputDir = Join-Path $RepoRoot $options.OutputDir
  New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

  $items = New-Object System.Collections.Generic.List[object]

  foreach ($metaFile in @(Get-PackwizMetaFiles)) {
    $meta = Read-PackwizMeta $metaFile.FullName
    $relativeMeta = Get-RelativePath $RepoRoot $metaFile.FullName
    $file = $meta.File
    $name = $meta.Name

    if ([string]::IsNullOrWhiteSpace($file)) {
      $file = ""
    }
    if ([string]::IsNullOrWhiteSpace($name)) {
      if (-not [string]::IsNullOrWhiteSpace($file)) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($file)
      }
      else {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($metaFile.Name)
      }
    }

    $items.Add([pscustomobject]@{
      Name    = $name
      File    = $file
      Side    = $meta.Side
      Source  = "packwiz"
      Url     = $meta.Url
      Meta    = $relativeMeta
      Version = ""
      ModId   = ""
    })
  }

  $jarFiles = @(Get-ChildItem -Path (Join-Path $RepoRoot "mods") -File -Filter "*.jar" -ErrorAction SilentlyContinue)
  foreach ($jar in $jarFiles) {
    $relativeJar = Get-RelativePath $RepoRoot $jar.FullName
    $known = $items | Where-Object { $_.File -eq $relativeJar } | Select-Object -First 1
    if ($null -ne $known) {
      continue
    }

    $jarInfo = Read-ModInfoFromJar $jar.FullName
    $items.Add([pscustomobject]@{
      Name    = $jarInfo.Name
      File    = $relativeJar
      Side    = ""
      Source  = "local jar"
      Url     = ""
      Meta    = ""
      Version = $jarInfo.Version
      ModId   = $jarInfo.ModId
    })
  }

  $sorted = @($items | Sort-Object Name, File)
  $markdownPath = Join-Path $outputDir "modlist.md"
  $csvPath = Join-Path $outputDir "modlist.csv"

  $md = New-Object System.Collections.Generic.List[string]
  $md.Add("# Mod List")
  $md.Add("")
  $md.Add("> Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
  $md.Add("")
  $md.Add("Total: $($sorted.Count)")
  $md.Add("")
  $md.Add("| # | Name | File | Side | Source | Version | Mod ID |")
  $md.Add("|---:|---|---|---|---|---|---|")

  $index = 1
  foreach ($item in $sorted) {
    $name = [string]$item.Name
    if (-not [string]::IsNullOrWhiteSpace($item.Url)) {
      $name = "[$name]($($item.Url))"
    }

    $md.Add("| $index | $name | ``$($item.File)`` | $($item.Side) | $($item.Source) | $($item.Version) | $($item.ModId) |")
    $index++
  }

  Set-Content -Path $markdownPath -Value $md -Encoding UTF8

  $csv = New-Object System.Collections.Generic.List[string]
  $csv.Add("Name,File,Side,Source,Url,Meta,Version,ModId")
  foreach ($item in $sorted) {
    $csv.Add((@(
      ConvertTo-CsvCell $item.Name
      ConvertTo-CsvCell $item.File
      ConvertTo-CsvCell $item.Side
      ConvertTo-CsvCell $item.Source
      ConvertTo-CsvCell $item.Url
      ConvertTo-CsvCell $item.Meta
      ConvertTo-CsvCell $item.Version
      ConvertTo-CsvCell $item.ModId
    ) -join ","))
  }
  Set-Content -Path $csvPath -Value $csv -Encoding UTF8

  Write-Success "已生成 modlist：$(Get-RelativePath $RepoRoot $markdownPath)"
  Write-Success "已生成 CSV：$(Get-RelativePath $RepoRoot $csvPath)"
  Write-Info "记录数量：$($sorted.Count)"
}

function Get-HashAlgorithmName {
  param([string] $HashMode)

  switch -Regex ($HashMode) {
    '^sha1$' { return "SHA1" }
    '^sha256$' { return "SHA256" }
    '^sha512$' { return "SHA512" }
    default { return $null }
  }
}

function Test-DownloadedHash {
  param(
    [string] $Path,
    [string] $ExpectedHash,
    [string] $HashMode
  )

  if ([string]::IsNullOrWhiteSpace($ExpectedHash) -or [string]::IsNullOrWhiteSpace($HashMode)) {
    return
  }

  $algorithm = Get-HashAlgorithmName $HashMode
  if ([string]::IsNullOrWhiteSpace($algorithm)) {
    Write-Warn "暂不支持校验 hash-format=$HashMode：$Path"
    return
  }

  $actual = (Get-FileHash -Path $Path -Algorithm $algorithm).Hash.ToLowerInvariant()
  $expected = $ExpectedHash.ToLowerInvariant()

  if ($actual -ne $expected) {
    throw "文件校验失败：$Path，期望 $expected，实际 $actual"
  }
}

function Invoke-PackwizInstaller {
  param([string[]] $InstallerArgs)

  if (-not (Test-Path $LocalPackwizInstallerBootstrap)) {
    throw "未找到 packwiz-installer-bootstrap.jar：$LocalPackwizInstallerBootstrap"
  }

  $java = Get-Command "java" -ErrorAction SilentlyContinue
  if ($null -eq $java) {
    throw "未找到 java。请安装 Java 21，或把 Java 加入 PATH。"
  }

  Invoke-Packwiz @("refresh")

  Push-Location $RepoRoot
  try {
    $args = @("-jar", $LocalPackwizInstallerBootstrap) + $InstallerArgs + @(".\pack.toml")
    Write-Info "执行：java $($args -join ' ')"
    & $java.Source @args
    if ($LASTEXITCODE -ne 0) {
      throw "packwiz-installer 退出码：$LASTEXITCODE"
    }
  }
  finally {
    Pop-Location
  }

  Write-Success "packwiz-installer 已完成。本地 mods/*.jar 已按 packwiz 清单安装/同步，并会被 git 忽略。"
}

function Invoke-PackwizInstallerHeadless {
  param([string[]] $InstallerArgs)

  $effectiveInstallerArgs = @($InstallerArgs)
  if ($effectiveInstallerArgs.Count -eq 0) {
    $effectiveInstallerArgs = @("-g", "-s", "both")
  }

  Invoke-PackwizInstaller $effectiveInstallerArgs
}

function ConvertTo-InstallerRetryOptions {
  param([string[]] $RawArgs)

  $attempts = 5
  $delaySeconds = 10

  if ($RawArgs.Count -ge 1 -and -not [string]::IsNullOrWhiteSpace($RawArgs[0])) {
    if (-not [int]::TryParse($RawArgs[0], [ref] $attempts) -or $attempts -lt 1) {
      throw "最大尝试次数必须是大于 0 的整数。"
    }
  }

  if ($RawArgs.Count -ge 2 -and -not [string]::IsNullOrWhiteSpace($RawArgs[1])) {
    if (-not [int]::TryParse($RawArgs[1], [ref] $delaySeconds) -or $delaySeconds -lt 0) {
      throw "等待秒数必须是大于等于 0 的整数。"
    }
  }

  return [pscustomobject]@{
    Attempts = $attempts
    DelaySeconds = $delaySeconds
  }
}

function Invoke-PackwizInstallerWithRetry {
  param(
    [string[]] $InstallerArgs,
    [string[]] $RawRetryArgs
  )

  $options = ConvertTo-InstallerRetryOptions $RawRetryArgs
  $lastError = $null
  for ($i = 1; $i -le $options.Attempts; $i++) {
    Write-Info "安装/同步尝试 $i/$($options.Attempts)"
    try {
      Invoke-PackwizInstaller $InstallerArgs
      return
    }
    catch {
      $lastError = $_
      if ($i -ge $options.Attempts) {
        break
      }

      Write-Warn "安装/同步失败：$($_.Exception.Message)"
      if ($options.DelaySeconds -gt 0) {
        Write-Info "等待 $($options.DelaySeconds) 秒后重试。"
        Start-Sleep -Seconds $options.DelaySeconds
      }
    }
  }

  Write-Fail "安装/同步仍然失败。请检查上方 packwiz-installer 输出；若是 CurseForge 手动下载项，请按提示下载到 mods/ 后重试。"
  throw $lastError
}

function Invoke-PackwizInstallerRetry {
  param([string[]] $RawArgs)

  Invoke-PackwizInstallerWithRetry -InstallerArgs @("-g", "-s", "both") -RawRetryArgs $RawArgs
}

function Get-CurseForgeApiKey {
  param($Options)

  if ($Options.ContainsKey("CurseForgeApiKey") -and -not [string]::IsNullOrWhiteSpace($Options.CurseForgeApiKey)) {
    return $Options.CurseForgeApiKey
  }

  if (-not [string]::IsNullOrWhiteSpace($env:CURSEFORGE_API_KEY)) {
    return $env:CURSEFORGE_API_KEY
  }

  if (-not [string]::IsNullOrWhiteSpace($env:CF_API_KEY)) {
    return $env:CF_API_KEY
  }

  return $null
}

function Get-CurseForgeApiBaseUrl {
  param($Options)

  if ($Options.ContainsKey("CurseForgeApiBaseUrl") -and -not [string]::IsNullOrWhiteSpace($Options.CurseForgeApiBaseUrl)) {
    return $Options.CurseForgeApiBaseUrl.TrimEnd("/")
  }

  if (-not [string]::IsNullOrWhiteSpace($env:CURSEFORGE_API_BASE_URL)) {
    return $env:CURSEFORGE_API_BASE_URL.TrimEnd("/")
  }

  return "https://api.curseforge.com"
}

function Get-CurseForgeDownloadUrl {
  param(
    [string] $ApiBaseUrl,
    [string] $ApiKey,
    [string] $ProjectId,
    [string] $FileId
  )

  $requestUrl = "$ApiBaseUrl/v1/mods/$ProjectId/files/$FileId/download-url"
  $response = Invoke-RestMethod -Method Get -Uri $requestUrl -TimeoutSec 60 -Headers @{
    "Accept" = "application/json"
    "x-api-key" = $ApiKey
  }

  if ($null -eq $response -or [string]::IsNullOrWhiteSpace($response.data)) {
    return $null
  }

  return [string] $response.data
}

function Resolve-PackFileTarget {
  param(
    [string] $RepoRoot,
    [string] $MetaPath,
    [string] $PackFile
  )

  if ([System.IO.Path]::IsPathRooted($PackFile)) {
    return $PackFile
  }

  if ($PackFile -match '[\\/]') {
    return (Join-Path $RepoRoot $PackFile)
  }

  $metaDir = Split-Path -Parent $MetaPath
  return (Join-Path $metaDir $PackFile)
}

function Download-PackFiles {
  param([string[]] $RawArgs)

  $options = ConvertTo-OptionMap $RawArgs
  $force = [bool] $options.Force
  $curseForgeApiKey = Get-CurseForgeApiKey $options
  $curseForgeApiBaseUrl = Get-CurseForgeApiBaseUrl $options
  $missingCurseForgeApiKeyWarned = $false
  $metaFiles = @(Get-PackwizMetaFiles)

  if ($metaFiles.Count -eq 0) {
    Write-Warn "没有找到 *.pw.toml。"
    Write-Warn "请先用 add-modrinth/add-curseforge/add-url/add-github 添加项目，或用 detect-curseforge 扫描临时 mods/*.jar。"
    return
  }

  $downloaded = 0
  $skipped = 0

  foreach ($metaFile in $metaFiles) {
    $meta = Read-PackwizMeta $metaFile.FullName
    $relativeMeta = Get-RelativePath $RepoRoot $metaFile.FullName

    if ([string]::IsNullOrWhiteSpace($meta.File)) {
      Write-Warn "跳过缺少 file/filename 的 meta：$relativeMeta"
      $skipped++
      continue
    }

    $downloadUrl = $meta.Url
    if ([string]::IsNullOrWhiteSpace($downloadUrl) -and $meta.Mode -eq "metadata:curseforge") {
      if ([string]::IsNullOrWhiteSpace($meta.CurseForgeProjectId) -or [string]::IsNullOrWhiteSpace($meta.CurseForgeFileId)) {
        Write-Warn "跳过缺少 CurseForge project-id/file-id 的 meta：$relativeMeta"
        $skipped++
        continue
      }

      if ([string]::IsNullOrWhiteSpace($curseForgeApiKey)) {
        if (-not $missingCurseForgeApiKeyWarned) {
          Write-Warn "metadata:curseforge 下载需要 CurseForge API Key。"
          Write-Warn "可先在当前终端设置：`$env:CURSEFORGE_API_KEY='你的 key'，或运行 download-files -CurseForgeApiKey <key>。"
          $missingCurseForgeApiKeyWarned = $true
        }
        $skipped++
        continue
      }

      Write-Info "解析 CurseForge 下载地址：$relativeMeta"
      $downloadUrl = Get-CurseForgeDownloadUrl `
        -ApiBaseUrl $curseForgeApiBaseUrl `
        -ApiKey $curseForgeApiKey `
        -ProjectId $meta.CurseForgeProjectId `
        -FileId $meta.CurseForgeFileId
    }

    if ([string]::IsNullOrWhiteSpace($downloadUrl)) {
      Write-Warn "跳过缺少 download.url 的 meta：$relativeMeta"
      $skipped++
      continue
    }

    $target = Resolve-PackFileTarget -RepoRoot $RepoRoot -MetaPath $metaFile.FullName -PackFile $meta.File
    $targetDir = Split-Path -Parent $target

    if (-not (Test-Path $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir | Out-Null
    }

    if ((Test-Path $target) -and -not $force) {
      Write-Info "已存在，跳过：$($meta.File)"
      $skipped++
      continue
    }

    Write-Info "下载：$(Get-RelativePath $RepoRoot $target)"
    Invoke-WebRequest -Uri $downloadUrl -OutFile $target -TimeoutSec 300 -Headers @{
      "User-Agent" = "Create-Delight-Project-Rebirth-devtool"
    }

    Test-DownloadedHash -Path $target -ExpectedHash $meta.Hash -HashMode $meta.HashMode
    $downloaded++
  }

  Write-Success "下载完成：$downloaded 个，跳过：$skipped 个。"
  Write-Warn "本命令不会删除任何本地无关文件。"
}

function Invoke-CurseForgeDetect {
  param([string[]] $RawArgs)

  $options = ConvertTo-OptionMap $RawArgs
  $yes = $RawArgs -contains "-Yes" -or $RawArgs -contains "--yes"

  if (-not $yes) {
    Write-Warn "即将执行 packwiz curseforge detect。"
    Write-Warn "它会扫描 mods/*.jar 并尝试生成 CurseForge meta；执行后必须人工检查。"
    Write-Warn "这是迁移阶段兜底工具，非必要不使用；执行前请确认本地改动已提交或备份。"
    $confirm = Read-Host "输入 DETECT 继续"
    if ($confirm -ne "DETECT") {
      Write-Warn "已取消。"
      return
    }
  }

  Invoke-Packwiz @("curseforge", "detect")
  Invoke-Packwiz @("refresh")
}

function Select-PackwizAsset {
  param($Release)

  $assets = @($Release.assets)
  if ($assets.Count -eq 0) {
    throw "Release '$($Release.tag_name)' 没有资源文件。"
  }

  $preferred = $assets | Where-Object {
    $_.name -match "(?i)(windows|win)" -and
    $_.name -match "(?i)(amd64|x86_64|64)" -and
    $_.name -notmatch "(?i)(sha256|checksum|checksums|sig|asc)"
  } | Select-Object -First 1

  if ($null -ne $preferred) {
    return $preferred
  }

  $exe = $assets | Where-Object {
    $_.name -match "(?i)\.exe$" -and
    $_.name -notmatch "(?i)(sha256|checksum|checksums|sig|asc)"
  } | Select-Object -First 1

  if ($null -ne $exe) {
    return $exe
  }

  $zip = $assets | Where-Object {
    $_.name -match "(?i)\.zip$" -and
    $_.name -notmatch "(?i)(sha256|checksum|checksums|sig|asc)"
  } | Select-Object -First 1

  if ($null -ne $zip) {
    return $zip
  }

  $names = ($assets | ForEach-Object { $_.name }) -join ", "
  throw "Release '$($Release.tag_name)' 中没有找到 Windows packwiz 资源文件。现有资源：$names"
}

function Install-Packwiz {
  param([string[]] $RawArgs)

  $options = ConvertTo-OptionMap $RawArgs
  $repo = if ($options.Repo) { $options.Repo } else { $DefaultPackwizRepo }
  $tag = if ($options.Tag) { $options.Tag } else { "latest" }
  $force = [bool] $options.Force

  if ((Test-Path $LocalPackwiz) -and -not $force) {
    Write-Success "packwiz 已存在：$LocalPackwiz"
    if (Test-PackwizExecutable $LocalPackwiz) {
      Write-Success "packwiz 可正常执行"
    }
    return
  }

  if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Path $BinDir | Out-Null
  }

  $apiUrl = if ($tag -eq "latest") {
    "https://api.github.com/repos/$repo/releases/latest"
  }
  else {
    "https://api.github.com/repos/$repo/releases/tags/$tag"
  }

  Write-Info "获取 Release 元数据：$apiUrl"
  $release = Invoke-RestMethod -Uri $apiUrl -TimeoutSec 30 -Headers @{
    "User-Agent" = "Create-Delight-Project-Rebirth-devtool"
    "Accept"     = "application/vnd.github+json"
  }

  $asset = Select-PackwizAsset $release
  Write-Info "从 $repo 的 $($release.tag_name) 下载 $($asset.name)"

  $tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("cdpr-packwiz-" + [System.Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Path $tempDir | Out-Null

  try {
    $downloadPath = Join-Path $tempDir $asset.name
    Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $downloadPath -TimeoutSec 120 -Headers @{
      "User-Agent" = "Create-Delight-Project-Rebirth-devtool"
    }

    if ($downloadPath -match "(?i)\.zip$") {
      $extractDir = Join-Path $tempDir "extract"
      Expand-Archive -Path $downloadPath -DestinationPath $extractDir -Force
      $candidate = Get-ChildItem -Path $extractDir -Recurse -File |
      Where-Object { $_.Name -match "(?i)^packwiz(\.exe)?$" } |
      Select-Object -First 1

      if ($null -eq $candidate) {
        throw "下载的压缩包中没有 packwiz.exe。"
      }

      Copy-Item -Path $candidate.FullName -Destination $LocalPackwiz -Force
    }
    elseif ($downloadPath -match "(?i)\.exe$") {
      Copy-Item -Path $downloadPath -Destination $LocalPackwiz -Force
    }
    else {
      Copy-Item -Path $downloadPath -Destination $LocalPackwiz -Force
    }
  }
  finally {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
  }

  Write-Success "packwiz 已安装到 $LocalPackwiz"
  if (Test-PackwizExecutable $LocalPackwiz) {
    Write-Success "packwiz 可正常执行"
  }
}

function Test-Repository {
  $packwiz = Get-PackwizPath
  if ([string]::IsNullOrWhiteSpace($packwiz)) {
    Write-Fail "未找到 packwiz。请运行：devtool.bat install-packwiz，或把 packwiz.exe 放到 scripts\bin\packwiz.exe"
  }
  else {
    Write-Success "packwiz: $packwiz"
    if (Test-PackwizExecutable $packwiz) {
      Write-Success "packwiz 可正常执行"
    }
    else {
      Write-Fail "packwiz 无法正常执行"
    }
  }

  $required = @("pack\pack.toml", "pack\.packwizignore.source", "pack\icon.png", "pack\server-icon.png", "pack\start.bat", "pack\start.sh", "pack\variables.txt", "pack.toml", "index.toml", ".packwizignore", ".gitignore")
  foreach ($path in $required) {
    $fullPath = Join-Path $RepoRoot $path
    if (Test-Path $fullPath) {
      Write-Success "已找到 $path"
    }
    else {
      Write-Fail "缺少 $path"
    }
  }

  Push-Location $RepoRoot
  try {
    git check-ignore --quiet "mods/example.jar"
    if ($LASTEXITCODE -eq 0) {
      Write-Success "mods/*.jar 已被忽略"
    }
    else {
      Write-Fail "mods/*.jar 未被忽略"
    }

    git check-ignore --quiet "mods/example.pw.toml"
    if ($LASTEXITCODE -eq 1) {
      Write-Success "mods/*.pw.toml 可以被 git 跟踪"
    }
    else {
      Write-Fail "mods/*.pw.toml 看起来被忽略了"
    }
  }
  finally {
    Pop-Location
  }
}

switch ($Command) {
  "help" {
    Show-Help
  }
  "menu" {
    Start-DevMenu
  }
  "prepare-pack" {
    Prepare-PackRoot
  }
  "install-packwiz" {
    Install-Packwiz $Rest
  }
  "check" {
    Test-Repository
  }
  "refresh" {
    Invoke-Packwiz (@("refresh") + $Rest)
  }
  "list" {
    Invoke-Packwiz (@("list") + $Rest)
  }
  "update" {
    Invoke-PackwizAndRefresh (@("update") + $Rest)
  }
  "add-modrinth" {
    Invoke-PackwizAndRefresh (@("modrinth", "add") + $Rest)
  }
  "add-curseforge" {
    Invoke-PackwizAndRefresh (@("curseforge", "add") + $Rest)
  }
  "add-url" {
    Invoke-PackwizAndRefresh (@("url", "add") + $Rest)
  }
  "add-github" {
    Invoke-PackwizAndRefresh (@("github", "add") + $Rest)
  }
  "remove-mod" {
    Invoke-PackwizAndRefresh (@("remove") + $Rest)
    Write-Warn "已更新 packwiz 清单。请继续运行 devtool.bat install-files 或 install-files-headless，同步本地 mods 文件夹并清理旧 jar。"
  }
  "install-files" {
    Invoke-PackwizInstallerWithRetry -InstallerArgs @() -RawRetryArgs $Rest
  }
  "install-files-headless" {
    Invoke-PackwizInstallerWithRetry -InstallerArgs @("-g", "-s", "both") -RawRetryArgs $Rest
  }
  "install-files-retry" {
    Invoke-PackwizInstallerRetry $Rest
  }
  "download-files" {
    Download-PackFiles $Rest
  }
  "detect-curseforge" {
    Invoke-CurseForgeDetect $Rest
  }
  "modlist" {
    Write-ModList $Rest
  }
  "serve" {
    Invoke-Packwiz @("refresh")
    Invoke-Packwiz (@("serve") + $Rest)
  }
  "export-modrinth" {
    Invoke-Packwiz @("refresh")
    Invoke-Packwiz (@("modrinth", "export") + $Rest)
  }
  "export-curseforge" {
    Invoke-Packwiz @("refresh")
    Invoke-Packwiz (@("curseforge", "export") + $Rest)
  }
}
