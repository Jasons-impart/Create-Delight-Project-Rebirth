# 用 Prism Launcher 部署源码实例

要直接游玩发布版，请看[发布包选择说明](install/README.md#从-releases-下载)。以下步骤适用于装有 Bash、curl、Git 和 npm 的开发环境。

1. 在 Prism 新建 Minecraft 1.21.1 实例，安装 NeoForge 21.1.251，选择 Java 21。通过实例菜单打开文件夹，确认实例根目录有 `mmc-pack.json`；游戏文件在它下面的 `minecraft/` 中。
2. 在 Bash 中运行以下命令。脚本会询问实例位置；也可在脚本名后传入实例目录。若已按[本机路径约定](README.md#本机路径)配置，可以使用 `"$CDPR_INSTANCE_DIR"`。

```bash
curl -fL https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Project-Rebirth/main/scripts/install-prism.sh -o install-prism.sh
bash install-prism.sh
```

3. 脚本核对实例组件，克隆仓库，安装 npm 依赖，再依次执行 `setup-tools`、`prepare-pack`、`refresh`、`check` 和 `install-files-headless 5 5`。如使用 `--skip-install-files`，首次启动前到游戏目录执行 `sh ./devtool.sh install-files`。
4. 在 Prism 启动实例。若脚本提示找不到组件，重新选择含 `mmc-pack.json` 的实例目录；若游戏只加载 NeoForge，检查当前实例游戏目录的 `mods/` 是否有实际 JAR，以及该目录中的 `logs/latest.log` 是否刚更新。

[部署脚本](../scripts/install-prism.sh)
