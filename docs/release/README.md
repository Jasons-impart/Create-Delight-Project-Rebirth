# 打包与发布

版本以 [pack/pack.toml](../../pack/pack.toml) 为准。稳定版格式是 `vA.B.C.D`，测试版追加 `-testN`，例如 `v2.0.0.0-test4`。

## 准备版本

1. 在目标分支运行 `./devtool.sh set-version <版本>`，同时更新发布模板、BCC 的 `modpackVersion` 和 FancyMenu 窗口标题末尾的版本段。PowerShell 使用 `.\devtool.bat`。
2. 更新工具并同步本次发布的运行文件。核对 Core 实际制品，运行 `generate-integrity-manifest`、`refresh`、`check`，检查版本字段和待提交文件。若需更新实例根目录的模板，先运行 `prepare-pack`。
3. 确认更新说明、目标版本和验证范围后，提交并推送对应分支。在发布提交上创建与模板完全一致的 tag，推送该 tag。例如在修复正式版时，从原 tag 创建 `release-vA.B.C.x` 维护分支，只取要发布的补丁，完成后将修复同步回主线。

## 本地导出

从源码根目录运行下列子命令。前三种导出在打包前读取本机受管 JAR 生成完整性清单；下载型服务端安装包使用已有清单。文件内容与分端规则见 [模组维护](../development/pack.md#发布模板和覆盖文件)。

| 目标 | 命令 | 使用方式 |
| --- | --- | --- |
| 客户端 CurseForge 安装包 | `./devtool.sh export-curseforge client-installer.zip client` | 导入支持 CurseForge 格式的启动器 |
| 客户端全量包 | `./devtool.sh export-client client-full.zip` | 获取带 common/client 运行文件的实例目录 |
| 服务端全量包 | `./devtool.sh export-server server-pack.zip` | 解压后以随包脚本启动 |
| 服务端安装包 | `./devtool.sh export-server-installer server-installer.zip` | 解压后运行安装脚本下载受管文件 |

本地 CurseForge 查询凭据放在 Git 忽略的 `.pw/config.local.toml` 下的 `[curseforge] api-key`，由 devtool 传给 bkmpw。CI 读取仓库 secret `STUDIO_CURSEFORGE_API_KEY`；产物发布到 GitHub Releases。

## CI 与验收

| 触发方式 | 结果 |
| --- | --- |
| 推送 `main` | 同步受管文件，给后续构建准备缓存 |
| 推送 `test-*` 或手动触发 | 构建 Actions artifacts，版本号带 `-test-build-<run_number>` |
| 推送匹配模板的版本 tag | 稳定版发布 Release；`-testN` 发布 prerelease |

构建会在 CI 工作区更新 Core、生成预期 mod ID 和 `release-info.json`，并把同一份版本信息写入包内 `config/createdelight_release_info.json`。四种 ZIP 均经过资产检查。tag 发布先准备草稿，上传四个 ZIP 和 `release-info.json` 后才公开。已有公开 Release 时流程报错；已有草稿可复用。核对公开资产与 tag、目标 commit 和渠道是否一致。[工作流](../../.github/workflows/release.yml) · [资产校验器](../../scripts/validate-release-artifacts.py)
