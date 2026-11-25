# 2026 年 9—10 月玩法迁移与旧源清理

| 批次 | 当时完成和验证的内容 | 验收范围与证据 |
| --- | --- | --- |
| 09-17 至 09-19，TACZ、Ice and Fire | 活龙采血、补弹扣电与 TAB 图标分批转入 Core；维护者随后确认补弹与图标。配方隔离服通过 103/103 项检查（TACZ 60，冰火 43）。 | 补弹及图标对应的两份旧源已备份清理。清单在 `${CDPR_BACKUP_DIR}/tacz-verified-source-cleanup-20260918-234425/manifest.json`；配方证据在 `recipe-core-finish-20260919-161013` 备份目录。默认枪械获取另行验收。 |
| 09-19，基础机制与 Gateway | 集成难度、掉币、基础交互、工业配方、分液与永寒门。已验证的混合文件只清理对应分支。Dreadsteel 同 ID 占位用于保留已有引用。 | 备份目录包括 `basic-interactions-verified-cleanup-20260919-141315`、`drain-core-20260919-164446` 和 `dreadsteel-placeholder-20260919-172618`，均位于 `CDPR_BACKUP_DIR` 下。难度 HUD 后续又有配置变更。 |
| 09-19 至 09-20，配置、交易与品质 | 钱包、卷轴、炖菜组件和已有等效物完成适配。隔离服交易 164/164、品质生长 105/105；10 家商店 143 条普通交易和 1 条摇奖有效。 | `trade-components-20260919-234820` 保存清理与测试清单。旧批次 68、53、48、27 等缺项数字不能累加；退出 5 条造石机交易后的跟进范围见当前状态。客户端显示单独验收。 |
| 09-22 至 09-29，Bakeries、Tetra 与 Core | Bakeries 1.0.4 恢复纸杯、蛋糕糊、模具等注册项对应的生产线；Tetra 战斗和已有端侧表现分批确认，vvaddon 能量与图纸仍待设计。 | 9 月的配方结果只覆盖该批次。11 月新配方已在[当前状态](../migration/status.md)单独列出。 |
| 10-10 至 10-11，维度与饮食 | 明确 Enceladus 为旧包 Europa 相关生态的迁移目标。Lime Pie 3.1.0 接替旧 Sol Apple Pie，迁入可用食品覆盖；隔离服务端通过 36 项专项检查。 | 无实际调用的旧 `Sol Applepie/util.js` 获准清理；部分迁移的配置、语言及食物书纹理保留。饭盒、真实进食、旧存档与客户端界面未在该批验收。 |

Lime Pie 旧源备份为 `${CDPR_BACKUP_DIR}/limepie-source-cleanup-20261011-r49upj89/source-before-cleanup.tar.gz`，当时记录的 SHA-256 为 `d9348b653dc65685e7811616423a54373b2dcf407af42e07635d5ae985c80e5b`。同目录的 `SHA256SUMS` 和 `cleanup-manifest.json` 记录逐文件边界。备份目录是维护者本机证据，公共仓库保留标识和结论。
