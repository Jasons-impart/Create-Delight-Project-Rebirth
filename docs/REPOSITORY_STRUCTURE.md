# 仓库结构

本仓库存放整合包源码和元数据，不是完整 Minecraft 实例。

## 应提交

- `pack/`: 发布根目录模板。`pack/pack.toml`、`pack/.packwizignore.source`、`pack/icon.png`、`pack/server-icon.png`、`pack/start.bat`、`pack/start.sh`、`pack/variables.txt`、`pack/PCL/` 会由 `devtool.bat prepare-pack` / packwiz 操作同步或生成到根目录。
- `mods/*.pw.toml`: packwiz mod 描述文件。
- `resourcepacks/*.pw.toml`、`shaderpacks/*.pw.toml`: packwiz 管理的资源包/光影包描述文件。
- `config/`、`defaultconfigs/`: 确认需要团队共享的配置。
- `kubejs/`: 已确认适配目标版本的脚本、数据、资源和自定义注册。
- `ldlib/`、`tacz/`、`schematics/`、`minemenu/`: 目标整合包仍使用对应 mod 时维护的数据。
- `devtool.bat`: 根目录开发工具入口。
- `scripts/devtool.ps1`: 开发工具实际实现。
- `LICENSE`、`scripts/bin/packwiz.VERSION.txt`、`scripts/bin/packwiz-installer-bootstrap.VERSION.txt`: 项目主协议、自有视觉资产权利声明、第三方协议和内置 packwiz 工具来源记录。
- `.agents/skills/`: 面向 AI agent 的共享工作流。
- `docs/DevGuide.md`: 团队开发指南。
- `docs/modpack-analysis-report.md`: 旧包迁移分析参考。
- `docs/MIGRATION_CHANGES.md`: 迁移过程中的实际改动、临时处理和后续待办。
- `docs/`: 团队文档和迁移记录。

## 不应提交

- `mods/*.jar`
- 下载得到的资源包/光影包 zip
- NeoForge installer 和生成的 `run.bat` / `run.sh`
- `libraries/`, `versions/`, `logs/`, `crash-reports/`, `saves/`, `world*`
- 本地服务端状态，如 `server.properties`、`eula.txt`、`user_jvm_args.txt`
- `scripts/bin/` 下下载的其它工具二进制，已允许的 `scripts/bin/packwiz.exe` 和 `scripts/bin/packwiz-installer-bootstrap.jar` 除外
- 根目录 `pack.toml`、`index.toml`、`.packwizignore`、`icon.png`、`server-icon.png`、`start.bat`、`start.sh`、`variables.txt`、`PCL/`。这些由 `devtool.bat prepare-pack` / `refresh` 从 `pack/` 模板生成。

## 原则

安装或运行服务端生成的文件不进 git。手动维护的整合包源码需要明确加入，并确认 `.gitignore` 允许跟踪。
