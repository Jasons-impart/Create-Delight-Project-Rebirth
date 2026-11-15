# CHANGELOG

按日期记录本仓库（移植版源码）的变更。版本号沿用上游 CDPR 的 packwiz 版本，`port.N` 表示本包第 N 次移植快照。

## 2026-11-15 · port.1（首次源码仓库快照）

### 新增

- 建立按 GitHub fork + PR 流程组织的源码仓库：`config/`、`kubejs/`、`docs/`、`mods.list`、`patches/cdprfps/`。
- `mods.list`：406 个 jar 的文件名 / modid / 版本 / 来源（160 CurseForge、175 Modrinth、67 未确认、4 自建）。
- `docs/`：移植日志、开发日志、已知问题、PR 说明、协作流程。
- `patches/cdprfps/`：帧数补丁 1.0.0–1.3.1 的源码快照（不含 jar）。

### 任务书

- 40 章 / 2160 任务完整落地；文本统一由 `config/ftbquests/quests/lang/en_us.snbt` 提供。
- `itemfilters` 引用清零，改为 `ftbfiltersystem`（43 处）。
- Tetra 系 104 个任务按方案 A 摘除（2264 → 2160），无悬空依赖。

### 数据包

- 目录改名：`recipes/`→`recipe/`、`loot_tables/`→`loot_table/`、`tags/items/`→`tags/item/`。
- 配方 243 条转换为 188 条；战利品表 `name`→`value`（49 个文件）。
- MBD2：9 个脚本、113 条配方，覆盖 28 台机器；9 台上游无本体合成。

### 性能

- `cdprfps` 1.3.1 部署（客户端剔除 + 服务端节流 + 维度闸门 + 按玩家限距 + 票据诊断）。
- 帧数未达标：46 fps（目标 200）。对照参考包确认瓶颈在实体数（399 vs 93）与每刻耗时（14–36 ms vs 7 ms），不在区块量（2209 vs 2025）。

### 修复

- 六个启动/进世界崩溃全部修复（Create 重复注册、citadel 分包冲突、improvedmobs 二进制不兼容、Dynamic Trees 注册期扫资源、stellaris 空配方、unusualend 未注册 RecipeType）。
- 后续：补装缺失前置（`fzzy_config` / `mysterious_mountain_lib` / `quest_giver`）、`cdc-seq-guard` 兜底序列装配崩溃、清理任务依赖环。

### 已知未完成

- LightmanCurrency 10 家持久商店（1.20.1 schema）0 加载；`MasterCoinList.json` 未移植。
- 17 条空任务描述 + 2 条单字标题无来源可补。
- `cdprfps` 1.3.0 / 1.3.1 从未进世界验证。
- 10 处失效群系引用待决策；3 个网关未补。

## 2026-11-14

- 模组对齐与替换：按 createdelightcore 依赖表逐项核对，替换 / 降级 / 补装；移出 stellaris、potentials、citadel、Dynamic Trees 栈。
- 首次启动成功进入主菜单（23:58）。

## 2026-11-13

- 移植前期：数据包结构转换、配方与战利品表改写、任务书基线与章节骨架搭建。
