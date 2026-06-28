# 脚本

仓库辅助脚本放在这里。

- 根目录 `devtool.bat` 会打开交互式命令行菜单，并封装常用 bkmpw 命令。
- `scripts/devtool.ps1` 是实际实现，一般不需要直接运行。
- `devtool.bat check` 会检查 bkmpw、Node.js/npm、仓库模板文件和 git 忽略规则。首次拉取仓库后需要安装 Node.js LTS/npm，并在根目录运行 `npm install`。
- `devtool.bat modlist` 会从 `*.pw.toml` 和本地 `mods/*.jar` 生成 Markdown / CSV 模组清单。
- 跨平台入口脚本直接放在 `scripts/` 下。
- 开发组 Windows 环境固定使用 `scripts/bin/bkmpw.exe`；除此之外的本地二进制默认会被 git 忽略。
