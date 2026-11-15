# 移植日志：Create Delight Project Rebirth → 齿轮盛宴 1.21.1

本文件记录 1.20.1 → 1.21.1 移植中**做了什么、依据是什么、结果如何**。每条都按「现象/依据 → 动作 → 结果」组织，便于复核。

- 源：1.20.1 参考包（320 模组）+ 上游 CDPR 1.21.1 分支（packwiz，`v2.0.0.0-test4`）
- 目标：1.21.1 / NeoForge 21.1.266，406 个 jar
- 所有落盘改动均在实例目录内完成，改前备份，文件统一 UTF-8 无 BOM

---

## 1. 数据包目录与字段改名

| 项 | 1.20.1 | 1.21.1 |
| --- | --- | --- |
| 配方 | `data/<ns>/recipes/` | `data/<ns>/recipe/` |
| 战利品表 | `data/<ns>/loot_tables/` | `data/<ns>/loot_table/` |
| 物品标签 | `data/<ns>/tags/items/` | `data/<ns>/tags/item/` |

**依据**：1.21.1 的资源/数据加载器只认新目录名，旧目录下的文件不会报错但**静默不加载**——只看日志会误以为「没有配方」，实际是全被忽略。

**结果**：目录整体改名并逐文件复核，`kubejs/data` 下 384 个 JSON 全部可解析。

---

## 2. 配方转换：243 条 → 188 条

**依据**：1.20.1 参考包共 243 条需移植配方，其中一部分依赖本包未安装的模组（cavedelight、more_mod_tetra 等），另有一部分使用 1.20.1 的字段与标签写法。

**动作**：

1. 逐条转换到 1.21.1 JSON 结构（`result` / `ingredients` / `type` 命名空间）。
2. 剔除依赖缺失模组的配方。
3. 标签按本包已装模组重映射；物品 id 逐个核对存在性，不存在的用同模组等价物替换，无等价物则整条剔除并记录。
4. 自定义配方统一用 `event.custom` 直接写原版 Create 的 JSON 结构（本包没有 `kubejs-create` 插件，`event.recipes.create.*` 不可用）。

**结果**：188 条落地。特殊配方类型（MBD2、序列装配、灌注）单独列出人工判断，未强行机械转换。

---

## 3. 战利品表：`name` → `value`

**依据**：1.21.1 的战利品表引用写法从 `{"type":"minecraft:loot_table","name":…}` 改为 `{"type":"minecraft:loot_table","value":…}`。旧写法在 1.21.1 解析失败。

**现象**：日志中 35 条 `kubejs:chests/csa_structures/*` 战利品表解析失败，源头就是 `name` 字段。

**动作**：全量扫描并改写，共修改 49 个相关文件。

**结果**：战利品表加载错误清零；剩余的 `ServerRecipeBook` / `RecipeManager` 连锁错误随配方修复一并消失。

---

## 4. itemfilters → ftb-filter-system

**依据**：`itemfilters` 在 1.21.1 没有可用构建，任务书里 `itemfilters:tag` / `itemfilters:or` 两类任务全部失效（tag/候选内容在游戏改写时被抹掉）。

**动作**：

- 引入 `ftb-filter-system-neoforge-21.1.4.jar`。
- 任务书内过滤引用整体迁到 `ftbfiltersystem` 命名空间。
- 「玩转经济」章 9 个 tag/or 任务按 1.20.1 参考包恢复为具体物品或对应 tag。

**结果**：`config/ftbquests/quests/chapters/` 中 `itemfilters` 引用 **0** 处，`ftbfiltersystem` 引用 **43** 处。

---

## 5. Tetra 系无法移植 → 摘除 104 个任务

**依据**：

- `more_mod_tetra` 与 `tetrawear` 在 1.21.1 **无任何公开构建**（Modrinth 仅 1.20.1；上游 CDPR 的 `mods/common` 也未登记）。
- 评估过「安装移植版」与「改任务书」两条路，前者不可行，走后者。

**动作（方案 A：任务书侧收口）**：

1. 摘除 104 个饰品相关任务。
2. 23 处引用替换为本包存在的等价物（如 `iron_staff` → `tetra:modular_double`、`totem` → `minecraft:totem_of_undying`）。
3. 16 处残留的 MMT 图标改为 `geotetraarmor:feet` / `head`。
4. 三章残留文案清理。

**结果**：任务 2264 → **2160**；missing_item 202 → **59**；悬空依赖 **0**；BOM **0**；孤立节点未增加（273）。

---

## 6. 任务书文本迁移到 `lang/en_us.snbt`

**依据**：FTB Quests `2101.1.38` 起，任务/章节的标题、描述、副标题统一由 lang 文件提供；写进 `.snbt` 的内联文本会在游戏保存时被**自动丢弃**。

同时确认：章节图标必须写成对象 `icon: { id: "物品id" }`，字符串写法会被保存时删除。

**动作**：

- 把 40 章、2160 任务的标题与描述迁入 `config/ftbquests/quests/lang/en_us.snbt`。
- `.snbt` 中只保留 lang 键引用。
- 章节标题/图标按上游与 1.20.1 参考包逐章恢复，并复核 40/40。
- 处理过程中出现过一次回归（章节 `title`/`icon` 丢失、`withChapterTitle=0`），根因是全量重写章节时丢了头部行，已用按章节 id 取回参考值的脚本修复。

**结果**：`en_us.snbt` 615.7 KB；40 章标题与图标齐全；无跨行解析误判（批量处理 lang 时按方括号配平定位值边界，禁用跨行非贪婪正则）。

---

## 7. MBD2 37 台机器补配方

**依据**：

- Multiblocked2 `21.0.6` 会为 `MBDRegistries.RECIPE_TYPES` 中每个配方类型自动生成 KubeJS schema，无需自建注册。
- `createdelightcore 2.0.0.7` 未实现 KubeJS schema 注册，因此 MBD2 配方直接调用上游已存在的 `createdelightcore:` 命名空间配方类型。

**动作**：

- 移植上游 `kubejs/server_scripts/mods/mbd2/` 9 个脚本（`crafting`、`alloy_electric_furnace`、`assembly_line`、`big_centrifugation`、`butchery`、`fission_react`、`grinding_wheel`、`hydropower_station`、`single_machines`）与依赖标签补丁。
- 合计新增 **113 条**配方，覆盖 **28 台**机器的本体合成。
- `dragon_steel_fan` 因缺失熔融龙钢流体标签，当时整条剔除；后续改为「按标签灌注」方案（未实机验证，见 KNOWN-ISSUES T-2）。
- 序列装配流体成分统一改为 `neoforge:single` / `neoforge:tag`，不使用旧版 `fluid_stack`，否则会报「缺少 results 键」。

**结果**：**9 台**机器上游也没有本体合成定义，无法补齐，已记入 KNOWN-ISSUES E-4。

---

## 8. 交易终端数据结构问题

**现象**：

- `config/lightmanscurrency/PersistentTraders.json`（225 KB）仍是 1.20.1 schema：顶层 `{Traders: [...], Auctions: [...]}`。
- 其中 **10 家持久商店**，在 1.21.1 下**一家都没有加载成功**。
- 货币链 `MasterCoinList.json` 尚未迁移到 1.21.1 结构。

**影响**：交易终端与经济任务链在实际游戏里是空的。

**状态**：处理中，未解决。见 KNOWN-ISSUES E-2。

---

## 9. 世界生成配置

- 12 个 worldgen 配置文件完成引用有效性校验。
- 修复 1 处失效标签。
- **10 处** `Europa` / 远月面群系引用失效（相关模组未安装），保留未删，待决策。
- Alex 系群系没有总开关配置，无法整体关闭。

---

## 10. 永恒之门（Gateways）数据

- 13 个网关配置、58 波数据逐条校验。
- 剔除 Gateways `5.1` **不支持**的 `active_effects` 字段（写了会解析失败）。
- 另确认 `gateways` 5.1 只有 `gate_pearl`，没有 `gate_pearl_large`，相关物品 id 已修正。
- 3 个上游有入口价值的网关没有配置，未补。

---

## 11. 结构文件（.schematic）

- 14 个 `.schematic` 完成命名空间替换与 id 校验。
- 残留：缺失模组的方块实体数据键未处理（该模组不存在，结构里对应的方块实体会被跳过）。

---

## 12. 模组对齐与替换

| 项 | 数量 | 说明 |
| --- | --- | --- |
| 上游 packwiz 元数据 | 316 条 | 用于 sha1/文件名比对来源（见 `mods.list`） |
| 本包 jar | 406 | 160 CurseForge 命中 / 175 Modrinth 命中 / 67 未确认 / 4 自建 |
| 移出 | stellaris + potentials | `FuelRefineryRecipe#getResultItem()` 无条件返回 null，触发 createdelightcore 空指针 |
| 移出 | unusualend | 自定义 `RecipeType` 未注册进 `BuiltInRegistries`，同一处空指针 |
| 移出 | citadel、Dynamic Trees 全栈 | 分包冲突 / 注册期提前扫资源 |
| 补装 | ftb-filter-system、mbd2 + ldlib2、citadelup、alexscavesup 等 | 依赖对齐 |

依赖区间与替换明细见实例工作记录 `最终mods清单与替换表.md`（不在本仓库内）。

**结果**：无重复主 modid；NeoForge 21.1.266；创建端可进主菜单、可进世界。

---

## 13. 校验与回滚

- 所有改动前备份到 `2026-11-15/齿轮盛宴-移植备份/<批次>-<时间戳>/`。
- 写盘前确认 Minecraft 进程为 0（本次打包为**只读快照**，实例当时处于运行状态，未写实例）。
- 静态校验：KubeJS 脚本语法、SNBT 可解析、JSON 可解析、无 BOM。
- 本次打包不改动实例目录任何文件。

---

## 附：仍需在游戏内确认的项

见 [KNOWN-ISSUES.md](KNOWN-ISSUES.md) 的「未检查」与「未测试/未验证」两节。核心一条：**帧数问题仍未解决**，且方向已从「区块限流」修正为「实体层限制 + 按距离降频」。
