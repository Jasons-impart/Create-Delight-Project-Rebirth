[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet(
    "help",
    "menu",
    "prepare-pack",
    "check",
    "refresh",
    "list",
    "update",
    "add-curseforge",
    "add-url",
    "add-github",
    "remove-mod",
    "install-files",
    "install-files-headless",
    "install-files-retry",
    "download-files",
    "modlist",
    "generate-integrity-manifest",
    "export-curseforge"
  )]
  [string] $Command = "menu",

  [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
  [string[]] $Rest
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$BinDir = Join-Path $RepoRoot "scripts\bin"
$LocalBkmpw = Join-Path $BinDir "bkmpw.exe"
$PackTemplateDir = Join-Path $RepoRoot "pack"
$PackRootTemplateFiles = @(
  "pack.toml",
  "icon.png",
  "server-icon.png",
  "start.bat",
  "start.sh",
  "variables.txt",
  "PCL\Logo.png",
  "PCL\Setup.ini"
)
$IgnoreSource = Join-Path $PackTemplateDir ".packwizignore.source"
$IntegrityManifestPath = Join-Path $RepoRoot "kubejs\config\createdelight_pack_integrity_expected.json"

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
  devtool.bat check
  devtool.bat refresh
  devtool.bat list
  devtool.bat update [mod-name | --all]
  devtool.bat add-curseforge <project|url|project-id> [file-id] [bkmpw args...]
  devtool.bat add-url <side> <name> <filename> <url> <sha256>
  devtool.bat add-github <owner/repo|url> [bkmpw args...]
  devtool.bat remove-mod <name|metadata-file>
  devtool.bat install-files [attempts] [delay-seconds]
  devtool.bat install-files-headless [attempts] [delay-seconds]
  devtool.bat install-files-retry [attempts] [delay-seconds]
  devtool.bat download-files [jobs] [--force]
  devtool.bat modlist [output-dir]
  devtool.bat generate-integrity-manifest
  devtool.bat export-curseforge [output.zip] [client|server|both]

说明：
  - 直接运行本脚本会进入交互式菜单。
  - 本工具只使用 scripts\bin\bkmpw.exe，不再调用旧 packwiz 或 installer jar。
  - 所有新增 mod 元数据默认写入 mods/*.pw.toml；可手动移动到 mods/common、mods/client、mods/server。
  - 当前实例已把现有 mod 元数据放在 mods/common，jar 仍保留在 mods 根目录。
  - install-files/download-files 由 bkmpw 执行，只处理清单记录的托管文件，不清理手动塞入且未入清单的 jar。
  - 首次拉取仓库后运行 prepare-pack，展开本地发布根目录文件。
"@ | Write-Host
}

function Get-BkmpwPath {
  if (Test-Path $LocalBkmpw) {
    return $LocalBkmpw
  }

  $cmd = Get-Command "bkmpw.exe" -ErrorAction SilentlyContinue
  if ($null -eq $cmd) {
    $cmd = Get-Command "bkmpw" -ErrorAction SilentlyContinue
  }
  if ($null -ne $cmd) {
    return $cmd.Source
  }

  return $null
}

function Test-BkmpwExecutable {
  param([string] $Path)

  try {
    & $Path --version | Out-Null
    return $LASTEXITCODE -eq 0
  }
  catch {
    return $false
  }
}

function Invoke-BkmpwRaw {
  param([string[]] $CommandArgs)

  $bkmpw = Get-BkmpwPath
  if ([string]::IsNullOrWhiteSpace($bkmpw)) {
    throw "未找到 bkmpw.exe，请确认 scripts\bin\bkmpw.exe 存在。"
  }

  Write-Info ("bkmpw " + ($CommandArgs -join " "))
  & $bkmpw @CommandArgs
  if ($LASTEXITCODE -ne 0) {
    throw "bkmpw 执行失败，退出码 $LASTEXITCODE。"
  }
}

function Invoke-BkmpwPackCommand {
  param(
    [string] $SubCommand,
    [string[]] $CommandArgs = @()
  )

  Invoke-BkmpwRaw (@($SubCommand, $RepoRoot) + $CommandArgs)
}

function Get-TomlValue {
  param(
    [string[]] $Lines,
    [string] $Key
  )

  $match = $Lines | Select-String -Pattern ("^\s*" + [regex]::Escape($Key) + "\s*=\s*(.+?)\s*$") | Select-Object -First 1
  if ($match) {
    $value = $match.Matches[0].Groups[1].Value.Trim()
    if ($value.StartsWith('"') -and $value.EndsWith('"')) {
      return $value.Substring(1, $value.Length - 2)
    }
    return $value
  }
  return $null
}

function Get-RepoRelativePath {
  param([string] $Path)

  $fullPath = (Resolve-Path -LiteralPath $Path).Path
  $root = $RepoRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
  $prefix = $root + [System.IO.Path]::DirectorySeparatorChar
  if ($fullPath.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $fullPath.Substring($prefix.Length) -replace "\\", "/"
  }

  return $fullPath -replace "\\", "/"
}

function Get-ModSideFromMetadataPath {
  param([string] $Path)

  $relative = Get-RepoRelativePath $Path
  if ($relative.StartsWith("mods/client/", [System.StringComparison]::OrdinalIgnoreCase)) {
    return "client"
  }
  if ($relative.StartsWith("mods/server/", [System.StringComparison]::OrdinalIgnoreCase)) {
    return "server"
  }
  return "common"
}

function Get-PackModMetadata {
  $paths = @()
  foreach ($sub in @("mods", "mods/common", "mods/client", "mods/server")) {
    $dir = Join-Path $RepoRoot $sub
    if (Test-Path -LiteralPath $dir -PathType Container) {
      $paths += Get-ChildItem -LiteralPath $dir -Filter "*.pw.toml" -File
    }
  }

  foreach ($path in $paths | Sort-Object FullName) {
    $lines = Get-Content -LiteralPath $path.FullName
    $filename = Get-TomlValue $lines "filename"
    if ([string]::IsNullOrWhiteSpace($filename)) {
      continue
    }

    [pscustomobject]@{
      Side = Get-ModSideFromMetadataPath $path.FullName
      MetadataPath = $path.FullName
      RelativeMetadataPath = Get-RepoRelativePath $path.FullName
      Filename = $filename
      JarPath = Join-Path (Join-Path $RepoRoot "mods") $filename
    }
  }
}

function Get-ZipEntryText {
  param(
    [System.IO.Compression.ZipArchive] $Zip,
    [string] $EntryName
  )

  $entry = $Zip.GetEntry($EntryName)
  if ($null -eq $entry) {
    return $null
  }

  $stream = $entry.Open()
  try {
    $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
    try {
      return $reader.ReadToEnd()
    }
    finally {
      $reader.Dispose()
    }
  }
  finally {
    $stream.Dispose()
  }
}

function Get-ModIdsFromTomlText {
  param([string] $Text)

  $ids = New-Object System.Collections.Generic.List[string]
  $blocks = [regex]::Matches($Text, '(?ms)^\s*\[\[mods\]\]\s*(.*?)(?=^\s*\[\[|\z)')
  foreach ($block in $blocks) {
    $match = [regex]::Match($block.Groups[1].Value, '(?m)^\s*modId\s*=\s*"([^"]+)"')
    if ($match.Success) {
      $id = $match.Groups[1].Value.Trim().ToLowerInvariant()
      if (-not [string]::IsNullOrWhiteSpace($id) -and -not $ids.Contains($id)) {
        $ids.Add($id)
      }
    }
  }

  return @($ids)
}

function Normalize-FabricModId {
  param([string] $ModId)

  return $ModId.Trim().ToLowerInvariant() -replace "-", "_"
}

function Get-ModIdsFromJar {
  param([string] $JarPath)

  Add-Type -AssemblyName System.IO.Compression.FileSystem

  $zip = [System.IO.Compression.ZipFile]::OpenRead($JarPath)
  try {
    foreach ($entryName in @("META-INF/neoforge.mods.toml", "META-INF/mods.toml")) {
      $toml = Get-ZipEntryText $zip $entryName
      if (-not [string]::IsNullOrWhiteSpace($toml)) {
        return @(Get-ModIdsFromTomlText $toml)
      }
    }

    $fabricJson = Get-ZipEntryText $zip "fabric.mod.json"
    if (-not [string]::IsNullOrWhiteSpace($fabricJson)) {
      $metadata = $fabricJson | ConvertFrom-Json
      $ids = New-Object System.Collections.Generic.List[string]
      if (-not [string]::IsNullOrWhiteSpace($metadata.id)) {
        $ids.Add((Normalize-FabricModId ([string]$metadata.id)))
      }
      if ($null -ne $metadata.provides) {
        foreach ($provided in $metadata.provides) {
          $id = Normalize-FabricModId ([string]$provided)
          if (-not [string]::IsNullOrWhiteSpace($id) -and -not $ids.Contains($id)) {
            $ids.Add($id)
          }
        }
      }
      if ($ids.Count -gt 0) {
        return @($ids)
      }
    }
  }
  finally {
    $zip.Dispose()
  }

  return @()
}

function Get-ModIdsFromNestedJarEntry {
  param(
    [System.IO.Compression.ZipArchiveEntry] $Entry,
    [int] $Depth = 0
  )

  $sourceStream = $Entry.Open()
  try {
    $memory = [System.IO.MemoryStream]::new()
    try {
      $sourceStream.CopyTo($memory)
      $memory.Position = 0
      $nestedZip = [System.IO.Compression.ZipArchive]::new($memory, [System.IO.Compression.ZipArchiveMode]::Read, $true)
      try {
        $ids = New-Object System.Collections.Generic.List[string]

        foreach ($entryName in @("META-INF/neoforge.mods.toml", "META-INF/mods.toml")) {
          $toml = Get-ZipEntryText $nestedZip $entryName
          if (-not [string]::IsNullOrWhiteSpace($toml)) {
            foreach ($modId in Get-ModIdsFromTomlText $toml) {
              if (-not $ids.Contains($modId)) {
                $ids.Add($modId)
              }
            }
          }
        }

        $fabricJson = Get-ZipEntryText $nestedZip "fabric.mod.json"
        if (-not [string]::IsNullOrWhiteSpace($fabricJson)) {
          $metadata = $fabricJson | ConvertFrom-Json
          if (-not [string]::IsNullOrWhiteSpace($metadata.id)) {
            $id = Normalize-FabricModId ([string]$metadata.id)
            if (-not $ids.Contains($id)) {
              $ids.Add($id)
            }
          }
          if ($null -ne $metadata.provides) {
            foreach ($provided in $metadata.provides) {
              $id = Normalize-FabricModId ([string]$provided)
              if (-not [string]::IsNullOrWhiteSpace($id) -and -not $ids.Contains($id)) {
                $ids.Add($id)
              }
            }
          }
        }

        if ($Depth -lt 4) {
          foreach ($innerEntry in $nestedZip.Entries) {
            if (-not $innerEntry.FullName.EndsWith(".jar", [System.StringComparison]::OrdinalIgnoreCase)) {
              continue
            }

            foreach ($modId in Get-ModIdsFromNestedJarEntry $innerEntry ($Depth + 1)) {
              if (-not $ids.Contains($modId)) {
                $ids.Add($modId)
              }
            }
          }
        }

        return @($ids)
      }
      finally {
        $nestedZip.Dispose()
      }
    }
    finally {
      $memory.Dispose()
    }
  }
  finally {
    $sourceStream.Dispose()
  }

  return @()
}

function Get-NestedModIdsFromJar {
  param([string] $JarPath)

  Add-Type -AssemblyName System.IO.Compression.FileSystem

  $ids = New-Object System.Collections.Generic.List[string]
  $nonRuntimeEmbeddedModIds = @("mixinsquared")
  $zip = [System.IO.Compression.ZipFile]::OpenRead($JarPath)
  try {
    foreach ($entry in $zip.Entries) {
      if (-not $entry.FullName.EndsWith(".jar", [System.StringComparison]::OrdinalIgnoreCase)) {
        continue
      }

      foreach ($modId in Get-ModIdsFromNestedJarEntry $entry) {
        if ($nonRuntimeEmbeddedModIds -contains $modId) {
          continue
        }
        if (-not $ids.Contains($modId)) {
          $ids.Add($modId)
        }
      }
    }
  }
  finally {
    $zip.Dispose()
  }

  return @($ids)
}

function Test-KnownNonRuntimeJar {
  param([string] $JarPath)

  Add-Type -AssemblyName System.IO.Compression.FileSystem

  $zip = [System.IO.Compression.ZipFile]::OpenRead($JarPath)
  try {
    return $null -ne $zip.GetEntry("META-INF/services/cpw.mods.modlauncher.api.ITransformationService")
  }
  finally {
    $zip.Dispose()
  }
}

function Test-KnownNonModJar {
  param([string] $JarPath)

  Add-Type -AssemblyName System.IO.Compression.FileSystem

  $zip = [System.IO.Compression.ZipFile]::OpenRead($JarPath)
  try {
    foreach ($entryName in @(
      "META-INF/services/net.neoforged.neoforgespi.earlywindow.GraphicsBootstrapper",
      "META-INF/services/net.neoforged.neoforgespi.earlywindow.ImmediateWindowProvider"
    )) {
      if ($null -ne $zip.GetEntry($entryName)) {
        return $true
      }
    }
  }
  finally {
    $zip.Dispose()
  }

  return $false
}

function New-SortedUniqueArray {
  param([string[]] $Values)

  return @(
    $Values |
      Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
      ForEach-Object { $_.Trim().ToLowerInvariant() } |
      Sort-Object -Unique
  )
}

function New-IntegrityManifest {
  $metadata = @(Get-PackModMetadata)
  if ($metadata.Count -eq 0) {
    throw "未找到 mods/**/*.pw.toml，无法生成完整性清单。"
  }

  $missing = @($metadata | Where-Object { -not (Test-Path -LiteralPath $_.JarPath -PathType Leaf) })
  if ($missing.Count -gt 0) {
    Write-Fail "以下受管理 mod jar 缺失，请先运行 devtool.bat install-files："
    $missing | ForEach-Object { Write-Fail ("  mods\" + $_.Filename) }
    throw "完整性清单生成失败：缺少受管理 mod jar。"
  }

  $expected = @{
    common = New-Object System.Collections.Generic.List[string]
    client = New-Object System.Collections.Generic.List[string]
    server = New-Object System.Collections.Generic.List[string]
  }
  $sources = New-Object System.Collections.Generic.List[object]
  $unresolved = New-Object System.Collections.Generic.List[object]

  foreach ($mod in $metadata) {
    $modIds = @(Get-ModIdsFromJar $mod.JarPath)
    foreach ($nestedModId in Get-NestedModIdsFromJar $mod.JarPath) {
      if (-not ($modIds -contains $nestedModId)) {
        $modIds += $nestedModId
      }
    }

    if ($modIds.Count -eq 0) {
      if (-not (Test-KnownNonModJar $mod.JarPath)) {
        $unresolved.Add($mod)
        continue
      }

      $sources.Add([pscustomobject]@{
        side = $mod.Side
        metadata = $mod.RelativeMetadataPath
        filename = $mod.Filename
        modIds = @()
        nonModFile = $true
      })
      continue
    }

    if (Test-KnownNonRuntimeJar $mod.JarPath) {
      $sources.Add([pscustomobject]@{
        side = $mod.Side
        metadata = $mod.RelativeMetadataPath
        filename = $mod.Filename
        modIds = @(New-SortedUniqueArray $modIds)
        nonRuntimeMod = $true
      })
      continue
    }

    foreach ($modId in $modIds) {
      $expected[$mod.Side].Add($modId)
    }

    $sources.Add([pscustomobject]@{
      side = $mod.Side
      metadata = $mod.RelativeMetadataPath
      filename = $mod.Filename
      modIds = @(New-SortedUniqueArray $modIds)
    })
  }

  if ($unresolved.Count -gt 0) {
    Write-Fail "以下受管理 jar 无法解析出 mod id，请先确认文件是否已同步，必要时运行 devtool.bat install-files："
    $unresolved | ForEach-Object { Write-Fail ("  mods\" + $_.Filename + " (" + $_.RelativeMetadataPath + ")") }
    throw "完整性清单生成失败：无法解析受管理 jar。"
  }

  $manifest = [ordered]@{
    schemaVersion = 1
    generatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    generatedBy = "devtool.bat generate-integrity-manifest"
    expectedModIds = [ordered]@{
      common = @(New-SortedUniqueArray $expected.common)
      client = @(New-SortedUniqueArray $expected.client)
      server = @(New-SortedUniqueArray $expected.server)
    }
    sources = @($sources | Sort-Object side, filename)
  }

  $targetDir = Split-Path -Parent $IntegrityManifestPath
  if (-not (Test-Path -LiteralPath $targetDir -PathType Container)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
  }

  $manifestJson = ($manifest | ConvertTo-Json -Depth 8) + [Environment]::NewLine
  [System.IO.File]::WriteAllText($IntegrityManifestPath, $manifestJson, [System.Text.UTF8Encoding]::new($false))
  Write-Success "已生成 kubejs\config\createdelight_pack_integrity_expected.json"
  Write-Info ("common={0}, client={1}, server={2}" -f $manifest.expectedModIds.common.Count, $manifest.expectedModIds.client.Count, $manifest.expectedModIds.server.Count)
}

function Read-BkmpwExtraArgs {
  param([string] $Prompt = "额外 bkmpw 参数，留空表示无")

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

function Prepare-PackRoot {
  if (-not (Test-Path $PackTemplateDir)) {
    throw "缺少 pack 模板目录：$PackTemplateDir"
  }

  foreach ($relative in $PackRootTemplateFiles) {
    $source = Join-Path $PackTemplateDir $relative
    $target = Join-Path $RepoRoot $relative
    if (-not (Test-Path $source)) {
      Write-Warn "模板缺失，跳过：pack\$relative"
      continue
    }

    $targetDir = Split-Path -Parent $target
    if (-not (Test-Path $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    Copy-Item -LiteralPath $source -Destination $target -Force
    Write-Success "已生成 $relative"
  }

  if (Test-Path $IgnoreSource) {
    Copy-Item -LiteralPath $IgnoreSource -Destination (Join-Path $RepoRoot ".packwizignore") -Force
    Write-Success "已生成 .packwizignore"
  }
  else {
    Write-Warn "未找到 pack\.packwizignore.source"
  }
}

function Test-Repository {
  $bkmpw = Get-BkmpwPath
  if ([string]::IsNullOrWhiteSpace($bkmpw)) {
    Write-Fail "未找到 bkmpw.exe：scripts\bin\bkmpw.exe"
  }
  else {
    Write-Success "bkmpw: $bkmpw"
    if (Test-BkmpwExecutable $bkmpw) {
      Write-Success "bkmpw 可正常执行"
    }
    else {
      Write-Fail "bkmpw 无法正常执行"
    }
  }

  $required = @(
    "pack\pack.toml",
    "pack\.packwizignore.source",
    "pack\icon.png",
    "pack\server-icon.png",
    "pack\start.bat",
    "pack\start.sh",
    "pack\variables.txt",
    "pack.toml",
    "index.toml",
    ".packwizignore",
    ".gitignore"
  )
  foreach ($relative in $required) {
    $fullPath = Join-Path $RepoRoot $relative
    if (Test-Path $fullPath) {
      Write-Success "已找到 $relative"
    }
    else {
      Write-Fail "缺少 $relative"
    }
  }

  Invoke-BkmpwPackCommand "check"
}

function Show-MenuHeader {
  Clear-Host
  Write-Host "Create Delight Project Rebirth 开发工具" -ForegroundColor Cyan
  Write-Host "仓库路径：$RepoRoot" -ForegroundColor DarkGray

  $bkmpw = Get-BkmpwPath
  if ([string]::IsNullOrWhiteSpace($bkmpw)) {
    Write-Host "bkmpw：未安装" -ForegroundColor Yellow
  }
  else {
    Write-Host "bkmpw：$bkmpw" -ForegroundColor Green
  }

  Write-Host ""
}

function Start-DevMenu {
  while ($true) {
    Show-MenuHeader
    Write-Host "  P. 生成/刷新根目录发布文件"
    Write-Host "  1. 检查仓库结构"
    Write-Host "  2. 刷新索引"
    Write-Host "  3. 查看文件列表"
    Write-Host "  4. 更新全部外部文件"
    Write-Host "  5. 更新单个外部文件"
    Write-Host "  6. 添加 CurseForge 项目"
    Write-Host "  7. 添加直链 URL"
    Write-Host "  8. 添加 GitHub Release 项目"
    Write-Host "  9. 移除管理文件" -ForegroundColor Yellow
    Write-Host " 10. 安装/同步托管文件到本地" -ForegroundColor Yellow
    Write-Host " 11. 下载缺失文件到本地（不清理无关文件）" -ForegroundColor Yellow
    Write-Host " 12. 生成 modlist 清单"
    Write-Host " 13. 导出 CurseForge .zip"
    Write-Host " 14. 生成完整性校验清单"
    Write-Host " 15. 执行自定义 bkmpw 命令"
    Write-Host "  0. 退出"
    Write-Host ""

    $choice = Read-Host "请选择"

    try {
      switch ($choice) {
        "P" { Prepare-PackRoot; Pause-Menu }
        "p" { Prepare-PackRoot; Pause-Menu }
        "1" { Test-Repository; Pause-Menu }
        "2" { Invoke-BkmpwPackCommand "refresh"; Pause-Menu }
        "3" { Invoke-BkmpwPackCommand "list"; Pause-Menu }
        "4" { Invoke-BkmpwPackCommand "update" @("--all"); Pause-Menu }
        "5" {
          $name = Read-Host "外部文件名称"
          if ([string]::IsNullOrWhiteSpace($name)) { Write-Warn "未输入名称。" } else { Invoke-BkmpwPackCommand "update" @($name) }
          Pause-Menu
        }
        "6" {
          $project = Read-Host "CurseForge slug、URL 或项目 ID"
          if ([string]::IsNullOrWhiteSpace($project)) { Write-Warn "未输入项目。" } else { Invoke-BkmpwPackCommand "add-curseforge" (@("both", $project) + (Read-BkmpwExtraArgs)) }
          Pause-Menu
        }
        "7" {
          $side = Read-Host "side：client/server/both，留空使用 both"
          if ([string]::IsNullOrWhiteSpace($side)) { $side = "both" }
          $name = Read-Host "名称"
          $filename = Read-Host "文件名"
          $url = Read-Host "直链下载 URL"
          $hash = Read-Host "sha256"
          if ([string]::IsNullOrWhiteSpace($name) -or [string]::IsNullOrWhiteSpace($filename) -or [string]::IsNullOrWhiteSpace($url) -or [string]::IsNullOrWhiteSpace($hash)) {
            Write-Warn "名称、文件名、URL、sha256 都不能为空。"
          }
          else {
            Invoke-BkmpwPackCommand "add-url" @($side, $name, $filename, $url, $hash)
          }
          Pause-Menu
        }
        "8" {
          $project = Read-Host "GitHub 仓库 owner/repo 或 URL"
          if ([string]::IsNullOrWhiteSpace($project)) { Write-Warn "未输入项目。" } else { Invoke-BkmpwPackCommand "add-github" (@("both", $project) + (Read-BkmpwExtraArgs)) }
          Pause-Menu
        }
        "9" {
          $name = Read-Host "要移除的名称或 metadata 文件，例如 create 或 mods/common/create.pw.toml"
          if ([string]::IsNullOrWhiteSpace($name)) { Write-Warn "未输入名称。" } else { Invoke-BkmpwPackCommand "remove" @($name); Write-Warn "已更新清单。请继续运行菜单 10，同步本地托管文件。" }
          Pause-Menu
        }
        "10" {
          $attempts = Read-Host "最大尝试次数，留空使用默认值"
          $delay = Read-Host "失败后等待秒数，留空使用默认值"
          $args = @()
          if (-not [string]::IsNullOrWhiteSpace($attempts)) { $args += $attempts }
          if (-not [string]::IsNullOrWhiteSpace($delay)) { $args += $delay }
          Invoke-BkmpwPackCommand "install-files-headless" $args
          Pause-Menu
        }
        "11" {
          $jobs = Read-Host "下载线程数，留空使用默认值"
          $force = Read-Host "是否覆盖已存在文件？y/N"
          $args = @()
          if (-not [string]::IsNullOrWhiteSpace($jobs)) { $args += $jobs }
          if ($force -match "^(y|yes)$") { $args += "--force" }
          Invoke-BkmpwPackCommand "download-files" $args
          Pause-Menu
        }
        "12" {
          $outputDir = Read-Host "输出目录，留空使用 docs/generated"
          if ([string]::IsNullOrWhiteSpace($outputDir)) { Invoke-BkmpwPackCommand "modlist" } else { Invoke-BkmpwPackCommand "modlist" @($outputDir) }
          Pause-Menu
        }
        "13" {
          $output = Read-Host "输出文件，留空使用默认值"
          $side = Read-Host "导出侧 client/server/both，留空使用 both"
          $args = @()
          if (-not [string]::IsNullOrWhiteSpace($output)) { $args += $output }
          if (-not [string]::IsNullOrWhiteSpace($side)) { $args += $side }
          New-IntegrityManifest
          Invoke-BkmpwPackCommand "refresh"
          Invoke-BkmpwPackCommand "export-curseforge" $args
          Pause-Menu
        }
        "14" { New-IntegrityManifest; Pause-Menu }
        "15" {
          $custom = Read-BkmpwExtraArgs "bkmpw 原生命令参数"
          if ($custom.Count -eq 0) { Write-Warn "未输入命令。" } else { Invoke-BkmpwRaw $custom }
          Pause-Menu
        }
        "0" { return }
        default { Write-Warn "未知选项：$choice"; Pause-Menu }
      }
    }
    catch {
      Write-Fail $_.Exception.Message
      Pause-Menu
    }
  }
}

switch ($Command) {
  "help" { Show-Help }
  "menu" { Start-DevMenu }
  "prepare-pack" { Prepare-PackRoot }
  "check" { Test-Repository }
  "refresh" { Invoke-BkmpwPackCommand "refresh" $Rest }
  "list" { Invoke-BkmpwPackCommand "list" $Rest }
  "update" { Invoke-BkmpwPackCommand "update" $Rest }
  "add-curseforge" { Invoke-BkmpwPackCommand "add-curseforge" (@("both") + $Rest); Invoke-BkmpwPackCommand "refresh" }
  "add-url" { Invoke-BkmpwPackCommand "add-url" $Rest; Invoke-BkmpwPackCommand "refresh" }
  "add-github" { Invoke-BkmpwPackCommand "add-github" (@("both") + $Rest); Invoke-BkmpwPackCommand "refresh" }
  "remove-mod" { Invoke-BkmpwPackCommand "remove" $Rest; Invoke-BkmpwPackCommand "refresh"; Write-Warn "已更新清单。请继续运行 devtool.bat install-files，同步本地托管文件。" }
  "install-files" { Invoke-BkmpwPackCommand "install-files-headless" $Rest }
  "install-files-headless" { Invoke-BkmpwPackCommand "install-files-headless" $Rest }
  "install-files-retry" { Invoke-BkmpwPackCommand "install-files-retry" $Rest }
  "download-files" { Invoke-BkmpwPackCommand "download-files" $Rest }
  "modlist" { Invoke-BkmpwPackCommand "modlist" $Rest }
  "generate-integrity-manifest" { New-IntegrityManifest }
  "export-curseforge" { New-IntegrityManifest; Invoke-BkmpwPackCommand "refresh"; Invoke-BkmpwPackCommand "export-curseforge" $Rest }
}
