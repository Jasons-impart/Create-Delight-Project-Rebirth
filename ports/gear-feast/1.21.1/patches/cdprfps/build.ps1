# CDPRFPS 构建脚本（javac + jar，无需 Gradle / 联网）
# 用法： powershell -ExecutionPolicy Bypass -File .\build.ps1
#   -LibDir  启动器 libraries 目录（其下需有 net/neoforged 等仓库结构）
#   -McJar   官方映射的 Minecraft 客户端 jar
# 也可分别用环境变量 CDPRFPS_LIB / CDPRFPS_MC_JAR 指定；JDK 21 取 JAVA_HOME 或 PATH 上的 javac。
param(
    [string]$LibDir = $env:CDPRFPS_LIB,
    [string]$McJar  = $env:CDPRFPS_MC_JAR
)

$ErrorActionPreference = "Stop"

$root   = $PSScriptRoot
$lib    = $LibDir
if (-not $lib -or -not (Test-Path $lib)) {
    throw "找不到启动器 libraries 目录，请用 -LibDir 或环境变量 CDPRFPS_LIB 指定"
}

$jdkCandidates = @()
if ($env:JAVA_HOME) { $jdkCandidates += $env:JAVA_HOME }
$javacCmd = Get-Command javac -ErrorAction SilentlyContinue
if ($javacCmd) { $jdkCandidates += (Split-Path (Split-Path $javacCmd.Source -Parent) -Parent) }
$jdkCandidates += @(Get-ChildItem "C:\Program Files\Java" -Directory -ErrorAction SilentlyContinue | ForEach-Object FullName)
$jdkCandidates += @(Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue | ForEach-Object FullName)
$jdk    = $jdkCandidates | Where-Object { $_ -and (Test-Path (Join-Path $_ "bin\javac.exe")) } | Select-Object -First 1
if (-not $jdk) { throw "找不到 JDK 21，请设置 JAVA_HOME 或把 javac 加入 PATH" }
$javac  = Join-Path $jdk "bin\javac.exe"
$jarExe = Join-Path $jdk "bin\jar.exe"

# NeoForm 运行时缓存里的官方映射 Minecraft 客户端 jar
if (-not $McJar) {
    $neoFormDir = Join-Path $env:USERPROFILE ".gradle\caches\neoformruntime\intermediate_results"
    if (Test-Path $neoFormDir) {
        $McJar = Get-ChildItem $neoFormDir -Filter "rename_*_output.jar" |
                 Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName
    }
}
if (-not $McJar -or -not (Test-Path $McJar)) { throw "找不到官方映射的 Minecraft jar，请用 -McJar 或环境变量 CDPRFPS_MC_JAR 指定" }

$cp = @(
    $mcJar,
    (Join-Path $lib "net\neoforged\fancymodloader\loader\4.0.45\loader-4.0.45.jar"),
    (Join-Path $lib "net\neoforged\neoforge\21.1.266\neoforge-21.1.266-universal.jar"),
    (Join-Path $lib "net\neoforged\bus\8.0.5\bus-8.0.5.jar"),
    (Join-Path $lib "org\spongepowered\mixin\0.8.5\mixin-0.8.5.jar"),
    (Join-Path $lib "com\google\code\gson\gson\2.10.1\gson-2.10.1.jar"),
    (Join-Path $lib "com\google\guava\guava\32.1.2-jre\guava-32.1.2-jre.jar"),
    (Join-Path $lib "com\mojang\brigadier\1.3.10\brigadier-1.3.10.jar"),
    (Join-Path $lib "com\mojang\datafixerupper\8.0.16\datafixerupper-8.0.16.jar"),
    (Join-Path $lib "com\mojang\authlib\6.0.54\authlib-6.0.54.jar"),
    (Join-Path $lib "com\mojang\logging\1.2.7\logging-1.2.7.jar"),
    (Join-Path $lib "it\unimi\dsi\fastutil\8.5.12\fastutil-8.5.12.jar"),
    (Join-Path $lib "org\slf4j\slf4j-api\2.0.9\slf4j-api-2.0.9.jar"),
    (Join-Path $lib "org\lwjgl\lwjgl\3.3.3\lwjgl-3.3.3.jar"),
    (Join-Path $lib "org\lwjgl\lwjgl-glfw\3.3.3\lwjgl-glfw-3.3.3.jar")
) -join ";"

$classes = Join-Path $root "classes"
$stage   = Join-Path $root "stage"
Remove-Item $classes, $stage -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $classes, $stage -Force | Out-Null

$sources = @(Get-ChildItem (Join-Path $root "src") -Recurse -Filter "*.java" | ForEach-Object { $_.FullName })
Write-Host ("源文件: " + $sources.Count)

Write-Host "== 编译 =="
& $javac -encoding UTF-8 -nowarn -proc:none -cp $cp -d $classes $sources
if ($LASTEXITCODE -ne 0) { throw "javac 失败" }

Write-Host "== 组装 =="
Copy-Item (Join-Path $classes "*") $stage -Recurse -Force
Copy-Item (Join-Path $root "res\*") $stage -Recurse -Force
Remove-Item (Join-Path $stage "META-INF\MANIFEST.MF") -Force

$out = Join-Path $root "cdprfps-1.4.0.jar"
Remove-Item $out -Force -ErrorAction SilentlyContinue
& $jarExe --create --file $out --manifest (Join-Path $root "res\META-INF\MANIFEST.MF") -C $stage .
if ($LASTEXITCODE -ne 0) { throw "jar 打包失败" }

Write-Host "== 完成 =="
Write-Host $out
Get-Item $out | Select-Object Length, LastWriteTime


