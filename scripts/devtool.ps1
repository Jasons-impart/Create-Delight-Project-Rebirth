[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet(
    "help",
    "menu",
    "install-packwiz",
    "check",
    "refresh",
    "list",
    "update",
    "add-modrinth",
    "add-curseforge",
    "add-url",
    "add-github",
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
$DefaultPackwizRepo = "Jasons-impart/packwiz"

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
  devtool.bat install-packwiz [-Repo owner/name] [-Tag latest] [-Force]
  devtool.bat check
  devtool.bat refresh [packwiz args...]
  devtool.bat list [packwiz args...]
  devtool.bat update [mod-name | --all] [packwiz args...]
  devtool.bat add-modrinth <slug|url|project-id> [packwiz args...]
  devtool.bat add-curseforge <slug|url|project-id> [packwiz args...]
  devtool.bat add-url <url> [packwiz args...]
  devtool.bat add-github <owner/repo|url> [packwiz args...]
  devtool.bat download-files [-Force]
  devtool.bat detect-curseforge [-Yes]
  devtool.bat modlist [-OutputDir docs/generated]
  devtool.bat serve [-p port] [packwiz args...]
  devtool.bat export-modrinth [packwiz args...]
  devtool.bat export-curseforge [packwiz args...]

说明：
  - 直接运行本脚本会进入交互式菜单。
  - packwiz 默认使用仓库内置的 scripts\bin\packwiz.exe。
  - 本地工具二进制、mod jar、服务端运行产物都会被 git 忽略。
  - 添加、删除或修改 packwiz 文件后，请运行 refresh，并提交 pack.toml/index.toml/*.pw.toml 的变更。
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
    Write-Host " 11. 下载 packwiz 管理文件到本地（不清理无关文件）"
    Write-Host " 12. 扫描 mods 目录生成 CurseForge meta"
    Write-Host " 13. 生成 modlist 清单"
    Write-Host " 14. 启动 packwiz 本地服务器"
    Write-Host " 15. 导出 Modrinth .mrpack"
    Write-Host " 16. 导出 CurseForge .zip"
    Write-Host " 17. 执行自定义 packwiz 命令"
    Write-Host "  0. 退出"
    Write-Host ""

    $choice = Read-Host "请选择"

    try {
      switch ($choice) {
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
          Invoke-Packwiz @("update", "--all")
          Pause-Menu
        }
        "6" {
          $name = Read-Host "外部文件名称"
          if ([string]::IsNullOrWhiteSpace($name)) {
            Write-Warn "未输入名称。"
          }
          else {
            Invoke-Packwiz (@("update", $name) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "7" {
          $project = Read-Host "Modrinth slug、URL 或项目 ID"
          if ([string]::IsNullOrWhiteSpace($project)) {
            Write-Warn "未输入项目。"
          }
          else {
            Invoke-Packwiz (@("modrinth", "add", $project) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "8" {
          $project = Read-Host "CurseForge slug、URL 或项目 ID"
          if ([string]::IsNullOrWhiteSpace($project)) {
            Write-Warn "未输入项目。"
          }
          else {
            Invoke-Packwiz (@("curseforge", "add", $project) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "9" {
          $url = Read-Host "直链下载 URL"
          if ([string]::IsNullOrWhiteSpace($url)) {
            Write-Warn "未输入 URL。"
          }
          else {
            Invoke-Packwiz (@("url", "add", $url) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "10" {
          $project = Read-Host "GitHub 仓库 owner/repo 或 URL"
          if ([string]::IsNullOrWhiteSpace($project)) {
            Write-Warn "未输入项目。"
          }
          else {
            Invoke-Packwiz (@("github", "add", $project) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "11" {
          $force = Read-Host "是否覆盖已存在文件？y/N"
          $args = @()
          if ($force -match "^(y|yes)$") {
            $args += "-Force"
          }
          Download-PackFiles $args
          Pause-Menu
        }
        "12" {
          Write-Warn "此操作会扫描 mods/*.jar 并尝试生成 CurseForge meta。"
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
        "13" {
          $outputDir = Read-Host "输出目录，留空使用 docs/generated"
          if ([string]::IsNullOrWhiteSpace($outputDir)) {
            Write-ModList @()
          }
          else {
            Write-ModList @("-OutputDir", $outputDir)
          }
          Pause-Menu
        }
        "14" {
          $port = Read-Host "端口，留空使用 packwiz 默认值"
          if ([string]::IsNullOrWhiteSpace($port)) {
            Invoke-Packwiz @("serve")
          }
          else {
            Invoke-Packwiz @("serve", "-p", $port)
          }
          Pause-Menu
        }
        "15" {
          $output = Read-Host "输出文件，留空使用 packwiz 默认值"
          if ([string]::IsNullOrWhiteSpace($output)) {
            Invoke-Packwiz (@("modrinth", "export") + (Read-PackwizExtraArgs))
          }
          else {
            Invoke-Packwiz (@("modrinth", "export", "-o", $output) + (Read-PackwizExtraArgs))
          }
          Pause-Menu
        }
        "16" {
          $side = Read-Host "导出侧 client/server，留空使用 packwiz 默认值"
          $args = @("curseforge", "export")
          if (-not [string]::IsNullOrWhiteSpace($side)) {
            $args += @("-s", $side)
          }
          $args += Read-PackwizExtraArgs "额外 packwiz 参数，例如 -o output.zip；留空表示无"
          Invoke-Packwiz $args
          Pause-Menu
        }
        "17" {
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

function Invoke-Packwiz {
  param([string[]] $PackwizArgs)

  $packwiz = Get-PackwizPath
  if ([string]::IsNullOrWhiteSpace($packwiz)) {
    throw "未找到 packwiz。请运行：devtool.bat install-packwiz，或把 packwiz.exe 放到 scripts\bin\packwiz.exe"
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
  }

  foreach ($line in Get-Content -Path $Path) {
    if ($line -match '^\s*file\s*=\s*"([^"]+)"') {
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
    elseif ($line -match '^\s*hash\s*=\s*"([^"]+)"') {
      $meta.Hash = $matches[1]
    }
    elseif ($line -match '^\s*hash-format\s*=\s*"([^"]+)"') {
      $meta.HashMode = $matches[1]
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

    $md.Add("| $index | $name | `$($item.File)` | $($item.Side) | $($item.Source) | $($item.Version) | $($item.ModId) |")
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

function Download-PackFiles {
  param([string[]] $RawArgs)

  $options = ConvertTo-OptionMap $RawArgs
  $force = [bool] $options.Force
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

    if ([string]::IsNullOrWhiteSpace($meta.File) -or [string]::IsNullOrWhiteSpace($meta.Url)) {
      Write-Warn "跳过缺少 file/url 的 meta：$(Get-RelativePath $RepoRoot $metaFile.FullName)"
      $skipped++
      continue
    }

    $target = Join-Path $RepoRoot $meta.File
    $targetDir = Split-Path -Parent $target

    if (-not (Test-Path $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir | Out-Null
    }

    if ((Test-Path $target) -and -not $force) {
      Write-Info "已存在，跳过：$($meta.File)"
      $skipped++
      continue
    }

    Write-Info "下载：$($meta.File)"
    Invoke-WebRequest -Uri $meta.Url -OutFile $target -TimeoutSec 300 -Headers @{
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

  $required = @("pack.toml", "index.toml", ".packwizignore", ".gitignore")
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
    Invoke-Packwiz (@("update") + $Rest)
  }
  "add-modrinth" {
    Invoke-Packwiz (@("modrinth", "add") + $Rest)
  }
  "add-curseforge" {
    Invoke-Packwiz (@("curseforge", "add") + $Rest)
  }
  "add-url" {
    Invoke-Packwiz (@("url", "add") + $Rest)
  }
  "add-github" {
    Invoke-Packwiz (@("github", "add") + $Rest)
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
    Invoke-Packwiz (@("serve") + $Rest)
  }
  "export-modrinth" {
    Invoke-Packwiz (@("modrinth", "export") + $Rest)
  }
  "export-curseforge" {
    Invoke-Packwiz (@("curseforge", "export") + $Rest)
  }
}
