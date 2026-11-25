# 开发脚本

在仓库根目录使用 Windows 的 `.\devtool.bat` 或 Linux/macOS 的 `./devtool.sh`。无参数打开菜单，`help` 显示命令和参数。

| 要维护的功能 | 实现 | 操作指南 |
| --- | --- | --- |
| 本地开发工具 | [devtool.mjs](devtool.mjs)、[devtool.test.mjs](devtool.test.mjs) | [模组维护](../docs/development/pack.md) |
| 完整性清单 | [pack-integrity.mjs](pack-integrity.mjs)、[CI 校验](validate-integrity-manifest.py) | [清单生成与诊断](../docs/development/pack.md#完整性清单) |
| 安装源码实例 | [PCL](Install-PCL.ps1)、[Prism](install-prism.sh) | [安装指南](../docs/install/README.md) |
| 验证发布资产 | [validate-release-artifacts.py](validate-release-artifacts.py) | [发布指南](../docs/release/README.md) |
