# 文档目录

从你要完成的任务进入。各指南中的仓库相对路径均以含 `devtool.sh` 的源码根目录为起点。

| 任务 | 入口 |
| --- | --- |
| 游玩、开服或从源码部署实例 | [安装指南](install/README.md) |
| 参与开发、提交配置或排查文件归属 | [开发指南](DevGuide.md) |
| 增删模组、处理完整性提示或升级 NeoForge | [模组与打包工具](development/pack.md) |
| 编写配方、配置 schema、验证脚本 | [KubeJS 指南](development/kubejs.md) |
| 从旧版移植、查询剩余事项 | [迁移流程](migration/README.md) · [当前状态](migration/status.md) |
| 查一个旧模组是否缺失、有哪些候选、项目决定怎么处理 | [逐模组迁移与缺失清单](migration/mods.md) |
| 比较 0488 和旧包上游 | [上游对照](migration/upstream.md) |
| 打包、打 tag、发布补丁 | [发布指南](release/README.md) |
| 追溯某次验证、版本锁定或旧源清理 | [历史记录](archive/README.md) |

早期 issue 中的 `PACKWIZ_WORKFLOW.md` 已并入[模组维护](development/pack.md)，目录职责和 Hotai 补丁约定已并入[开发指南](DevGuide.md)。旧“未安装 mod 清单”和 `require_list_clean.md` 统一查[逐模组清单](migration/mods.md)，玩法与验收查[当前状态](migration/status.md)。

## 维护规范

- **操作指南**按读者和任务归档。安装写在 `install/`，三个启动器保留原入口；开发写在 `development/`，发布写在 `release/`。写明起点、实际命令和判断成功的方法。共用步骤只写一处。
- **当前状态**按问题维护：模组缺失、候选与取舍写在[逐模组清单](migration/mods.md)，跨模组玩法和验收写在[迁移状态](migration/status.md)。注明核对日期或提交、剩余动作和验收范围。组件版本以描述符和模板为准，命令以工具实现为准。
- **历史记录**放在 `archive/`，写明日期、当时的版本、已验证范围和证据。新的验证结果可链接旧记录；进入当前流程的结论同步到对应指南。
- **附件和个人信息**分开存放。可重算的清单输出到 `docs/generated/`；本机绝对路径写进 `docs/local/paths.md`。这两个目录由 Git 忽略，整包导出排除 `docs/`。
- 新页面按任务命名，使用小写英文和连字符；分组首页使用 `README.md`。标题写清读者要完成的任务，正文先给步骤和成功条件，再列需要时才查的故障处理或证据。
- 新增或移动页面后，更新上表和引用它的页面。链接使用相对路径。改工具、版本、配方规范或发布流程时，同一变更更新对应指南。

## 本机路径

在每份克隆中自行创建 `docs/local/paths.md`，按下表填写用到的目录。源码根目录可用 `git rev-parse --show-toplevel` 查询。

| 变量 | 指向的位置 |
| --- | --- |
| `CDPR_INSTANCE_DIR` | Prism 实例根目录，内有 `mmc-pack.json` |
| `CDPR_LEGACY_REPO` | Forge 1.20.1 的 Create-Delight-Remake 参考仓库 |
| `CDPR_0488_SOURCE` | 可在验收并备份后清理的 0488 迁移副本 |
| `CDPR_CORE_REPO` | Create-Delight-Core 源码仓库 |
| `CDPR_BACKUP_DIR` | 本机迁移备份与校验清单所在目录 |
| `CDPR_TEST_SERVER_DIR` | 本次实际使用的隔离服务端根目录 |

**Bash** 下可把本地文档写成下面的格式，说明行以 `#` 开头，赋值行缩进四个空格。填写自己的路径后，在源码根目录运行 `source docs/local/paths.md` 即可载入。以后使用 `"${CDPR_LEGACY_REPO}"` 等变量。

```sh
# 本机路径
    export CDPR_LEGACY_REPO='/你的路径/Create-Delight-Remake'
    export CDPR_CORE_REPO='/你的路径/Create-Delight-Core'
```

**PowerShell** 用户可在本地文档里保存 `$env:CDPR_LEGACY_REPO = '你的路径\Create-Delight-Remake'` 等赋值，需要时粘贴到会话中。使用 `git -C "$env:CDPR_LEGACY_REPO" status` 检查取值。实例、备份和参考仓库可以位于不同的磁盘。
