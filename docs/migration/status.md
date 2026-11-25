# 当前迁移状态

整合包源码核对至 2026-11-25 主线 `05e5d52`。查某个旧模组是否接入、缺什么或选了哪种替代，见[逐模组迁移与缺失清单](mods.md)。以下记录玩法的实现范围与验收进度。

## 本轮主线已接入

| 内容 | 已进入主线 | 后续边界 |
| --- | --- | --- |
| Bakeries | `0a7ec94` 补面胚台、酵母发酵、顺序组装、盐矿掉落和纸杯资源，目标包仍用 1.0.4。[配方](../../kubejs/server_scripts/mods/bakeries/recipes.js) | 曾因缺少注册项挂起的浆果面团、司康面团、南瓜派面团、云腿月饼和蛋糕卷分支，恢复前逐个核对对应物品。 |
| Youkai’s Homecoming | `05e5d52` 补餐台寿司、茶叶标签、红丝绒组装、醋发酵和茶咖灌装。[餐台](../../kubejs/server_scripts/mods/youkaishomecoming/sushi.js) · [茶咖配方](../../kubejs/server_scripts/mods/youkaishomecoming/recipes.js) | 餐台 Java 映射、Farmer’s Respite 煮茶及未注册的咖啡流体独立跟进。 |
| 客户端默认配置 | `6eee56f` 关闭 Terralith 开场提示和 Improved Mobs 难度显示。 | 查当前配置时以主线文件为准。 |

## 待实现、取舍和验收

| 事项 | 下一步 |
| --- | --- |
| Core 流体行为 | 9 月记录已有三种 slime 反弹、核废液辐射与腐蚀的六项隔离 GameTest。核对发布制品，验收真实实例和客户端。 |
| 生命质品质收割 | 控制器与注入器已有实现，继续核对 Quality Food 桥接版本、物品注册、校准器、物品标签和配方，再测试真实收割与注入。 |
| Vinery | 自有发酵桶仍需在 Core 实现方块、库存、配方处理和自动化。现有葡萄采收与装瓶配方是独立功能。 |
| Tetra、vvaddon | 拟在 Core 复刻行为。五个物品、词条、幻影箭、FE 与能量条、charge/forestall/life_drain 及刀树解锁仍需设计和实现。材料获取、命名空间、katana/murasama 图纸来源待定。火龙钢自动附魔另需自定义 crafting outcome。 |
| 土卫二生态 | 目标已定为 Enceladus。适配旧 dread 维度白名单和塞壬、海蛇限制后，在目标维度实际验收刷怪和地貌。 |
| 交易与材料 | 9 月核对尚缺 22 条 LC 交易（5 种子、13 流体、4 矿物），另有 2 条 Core 村民回收缺 canola 和 cream。已有等效物的茄子、葱、白菜、茶种子等已替换。继续跟进艾草、灰棉籽、CEI ink 和罐头满饱食时的放置冲突。 |
| 食物多样性 | Sol Carrot 用官方版；旧 Sol Apple Pie 由 Lime Pie 接替。13 项缺依赖食品覆盖仍挂起，需验收 GUI、真实进食、饭盒、联网和旧存档。 |
| 客户端与可选联动 | 跟进交易地图与提示、JEI、视觉渲染、缺加载器的 CIT 钱币、TACZ 默认枪械获取。Ponder、Tetracelium/Tetratic 缺依赖分支继续挂起。 |

## 模组替代与范围决定

- Farmer’s Respite、Cosmopolitan 已有 1.21.1 NeoForge 移植候选。仍需测试茶饮、奶油和旧交易的 ID。Create Metallurgy 已接入，新版[钨材料配方](../../kubejs/server_scripts/mods/createmetallurgy/recipes.js)使用 `tungsten` 系列 ID；9 月挂起的是四条旧 `wolframite` 商品交易。
- Alex 系列目前的 `alexsmobsup`、`alexscavesup`、`citadelup` 命名空间影响 Core 和配方。对候选新版要同时验证 ID、依赖和客户端表现。Youkai 非官方移植中的 Curios 功能需按实际交互确认。
- Dreadsteel 保留同 ID 占位；完整装备属性、技能和染色已退出范围。Ad Astra、Art of Forging 和旧 CobbleForDays 五条造石机交易已退出。kinetic_pixel 整体放弃，灰棉籽单独处理。vintage_kubejs、sqlite_jdbc 和旧任务专用依赖无需补齐。
- 核对 Core 的具体实现及构建记录时，查 `${CDPR_CORE_REPO}/docs/status.md`。已有旧源清理和批次验收见[迁移归档](../archive/migration-2026-09-to-10.md)。
