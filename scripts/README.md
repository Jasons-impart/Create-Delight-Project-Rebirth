# 脚本

仓库辅助脚本放在这里。

- 根目录 `devtool.bat` 会在 Windows 打开交互式命令行菜单，并封装常用 bkmpw 命令。
- 根目录 `devtool.sh` 是 Linux/macOS 入口。
- `scripts/devtool.mjs` 是实际实现，一般不需要直接运行。
- `devtool.bat check` 会检查 bkmpw、Node.js/npm、仓库模板文件和 git 忽略规则。首次拉取仓库后需要安装 Node.js LTS/npm，在根目录运行 `npm install`，并运行 `devtool.bat setup-tools` 安装全局 `bkmpw`。
- `devtool.bat modlist` 会从 `*.pw.toml` 和本地 `mods/*.jar` 生成 Markdown / CSV 模组清单。
- `devtool.bat export-curseforge`、`export-client`、`export-server` 和 `export-server-installer` 封装客户端 CurseForge 安装包、客户端全量包、开箱即用服务端包和 bkmpw 下载型服务端安装包导出。
- 开发工具使用全局 npm 包 `@bro-know-my/packwiz` 提供的 `bkmpw` 命令；本地二进制默认会被 git 忽略。
