# 用 PCL 部署源码实例

要导入发布版，请看[发布包选择说明](install/README.md#从-releases-下载)。以下步骤用于 Windows 上新建的源码开发实例。

1. 在 PCL 安装 Minecraft 1.21.1 和 NeoForge 21.1.251，版本名填 `Create-Delight-Project-Rebirth`。选择 Java 21，开启此版本的游戏目录隔离。
2. 在 PCL 打开该版本的文件夹，从这个文件夹打开 PowerShell。保留 PCL 生成的版本 JSON 和 JAR，把仓库内容（含隐藏的 `.git`）复制到同一目录：

```powershell
$instance = (Get-Location).Path
if (!(Test-Path '.\Create-Delight-Project-Rebirth.json')) { throw '请先进入 PCL 创建的版本目录' }
$source = Join-Path ([IO.Path]::GetTempPath()) ([guid]::NewGuid().ToString())
git clone https://github.com/Jasons-impart/Create-Delight-Project-Rebirth.git "$source"
if ($LASTEXITCODE -ne 0) { throw '克隆失败' }
robocopy "$source" "$instance" /E
if ($LASTEXITCODE -ge 8) { throw '源码复制失败' }
```

3. 继续执行[工作区初始化](DevGuide.md#初始化工作区)，再从 PCL 启动。核对实例的 `logs/latest.log` 有本次启动记录、正确的 NeoForge 版本和已加载的模组。已有源码实例可在原目录同步更新。

现有[部署脚本](../scripts/Install-PCL.ps1)会检查克隆副本是否自带版本 JSON，而该文件由 PCL 在实例目录生成。因此当前源码部署使用上面的手动步骤。
