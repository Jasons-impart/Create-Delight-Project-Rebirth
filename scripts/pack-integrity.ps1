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

function ConvertTo-IntegrityManifestComparableJson {
  param($Manifest)

  $comparable = [ordered]@{
    schemaVersion = $Manifest.schemaVersion
    generatedBy = $Manifest.generatedBy
    expectedModIds = $Manifest.expectedModIds
    sources = $Manifest.sources
  }

  return $comparable | ConvertTo-Json -Depth 8
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

  if (Test-Path -LiteralPath $IntegrityManifestPath -PathType Leaf) {
    try {
      $existingManifest = Get-Content -LiteralPath $IntegrityManifestPath -Raw | ConvertFrom-Json
      if ((ConvertTo-IntegrityManifestComparableJson $existingManifest) -eq (ConvertTo-IntegrityManifestComparableJson $manifest)) {
        Write-Success "完整性清单内容未变化，保留现有 kubejs\config\createdelight_pack_integrity_expected.json"
        Write-Info ("common={0}, client={1}, server={2}" -f $manifest.expectedModIds.common.Count, $manifest.expectedModIds.client.Count, $manifest.expectedModIds.server.Count)
        return
      }
    }
    catch {
      Write-Warn ("无法读取现有完整性清单，将重新生成：" + $_.Exception.Message)
    }
  }

  $manifestJson = ($manifest | ConvertTo-Json -Depth 8) + [Environment]::NewLine
  [System.IO.File]::WriteAllText($IntegrityManifestPath, $manifestJson, [System.Text.UTF8Encoding]::new($false))
  Write-Success "已生成 kubejs\config\createdelight_pack_integrity_expected.json"
  Write-Info ("common={0}, client={1}, server={2}" -f $manifest.expectedModIds.common.Count, $manifest.expectedModIds.client.Count, $manifest.expectedModIds.server.Count)
}
