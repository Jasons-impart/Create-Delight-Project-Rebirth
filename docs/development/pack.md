# 模组维护与打包工具

完成 [工作区初始化](../DevGuide.md#初始化工作区) 后，在仓库根目录运行 `./devtool.sh help` 查询参数。PowerShell 使用 `.\devtool.bat`。维护前先运行 `check`，记下工具版本和已有的检查结果。

## 增删和更新

1. 用 `list` 查现有条目；按来源用 `add-curseforge <项目>`、`add-github <owner/repo>` 或 `add-url <side> <名称> <文件名> <URL> <SHA-256>` 新增。更新用 `update <名称>` 或 `update --all`，删除用 `remove-mod <名称或描述符路径>`。
2. 检查描述符的下载来源、文件名、哈希和适用端。新增模组的描述符可能位于 `mods/`，归入 `mods/common/`、`mods/client/` 或 `mods/server/` 后再刷新索引。资源包、光影包分别放在 `resourcepacks/` 和 `shaderpacks/`。运行 JAR 统一放在 `mods/` 根目录。
3. 查看变更涉及的 `pin` 和依赖。`pin = true` 会限制自动更新；复测时逐组确认加载器门槛、Core 接口、模组 ID、配方解析和客户端握手。历史故障按日期查 [更新记录](../archive/mod-updates-2026-09-to-10.md)，实际选择查对应的 `.pw.toml`。
4. 同步运行文件，重新生成完整性清单，再刷新并检查。提交描述符和发生变化的预期清单。

```sh
./devtool.sh install-files
./devtool.sh generate-integrity-manifest
./devtool.sh refresh
./devtool.sh check
git status --short --untracked-files=all
```

`install-files` 同步并清理上次 `bkmpw:1` 清单记录的受管文件，`download-files` 默认只补缺失项。两种入口都会先尝试更新 Create Delight Core，需复核它的描述符。若使用本机开发版 Core，先保留该构建及校验值，发布验证使用描述符指定的制品。要查看便于阅读的列表，可运行 `modlist` 输出到忽略的 `docs/generated/`。

## 完整性清单

`generate-integrity-manifest` 根据描述符逐个读取本地 JAR 和嵌套 JAR 的实际 mod ID，并按 common、client、server 写入 [预期清单](../../kubejs/config/createdelight_pack_integrity_expected.json)。缺包或解析失败时先检查下载和元数据，再重新生成。

客户端将 common 和 client 集合与实际加载列表比较，差异写入 `logs/createdelight_pack_integrity.json`。出现缺包提示时，从报告中的 ID 追到描述符和实例中的 JAR；对 CurseForge 安装包还需检查直链来源是否随 overrides 分发。只有明确允许的额外模组才配置到 [运行设置](../../kubejs/config/createdelight_pack_integrity.json)。

## 升级 NeoForge

1. 从 [发布模板](../../pack/pack.toml) 读原版本，检查目标 installer、模组依赖和 Core 构建兼容性。模板改 `versions.neoforge`，同时更新 [服务端变量](../../pack/variables.txt) 中的版本及完整 installer URL、[PCL 模板](../../pack/PCL/Setup.ini) 的 `VersionNeoForge`。
2. 同步 Prism 与 PCL 部署脚本的版本检查和各启动器示例，区分历史版本记录与当前要求。运行 `prepare-pack`、`check` 和 `npm run test:devtool`。模板只控制发布文件，实际运行实例还需安装对应的 NeoForge 组件。
3. 先在隔离服务端启动、执行 `/reload` 并核查配方与日志，再验证客户端进服、握手和相关功能。提高最低加载器版本后，逐项复测原先固定的模组，记录仍需保留锁定的原因。

使用 bkmpw 检查 Prism 组件时，实例变量应指向含 `mmc-pack.json` 的目录。在 Bash 中可运行 `bkmpw neoforge inspect "${CDPR_INSTANCE_DIR}" --json`，再用 `bkmpw neoforge plan "${CDPR_INSTANCE_DIR}" --target <版本> --json` 查看兼容性和阻塞项。计划通过后再选择升级方式；Prism 下载客户端库与服务端运行 installer 是两个独立步骤。

## 发布模板和覆盖文件

[发布配置](../../.pw/config.toml) 指定要从 `pack/` 展开到根目录的文件。修改模板后使用 `prepare-pack` 重新展开并生成索引；手动调整其它包内容后用 `refresh` 刷新索引。编辑分发排除规则用受跟踪的根 `.packwizignore`。

`roots/common/` 适用于全量客户端和服务端覆盖，`roots/client/` 适用于全量客户端，`roots/server/` 适用于服务端全量包和安装包。导出时将覆盖内容铺到目标根目录，分端文件优先。四种导出命令、CI 资产和版本规则见 [发布指南](../release/README.md)。
