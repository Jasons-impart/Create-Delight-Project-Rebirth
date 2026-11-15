# 社区魔改移植：齿轮盛宴 → Minecraft 1.21.1 (NeoForge)

> 本项目按「一个待合并的上游 PR」来叙述：把整次社区魔改移植作为一次变更集，便于按 PR 流程审查与合并。这是社区魔改版本，不是上游官方移植。

## Summary

把「齿轮盛宴」以社区魔改移植的方式从 1.20.1 改造到 Minecraft 1.21.1 / NeoForge 21.1.266，保持上游 CDPR（Create Delight Project Rebirth）的内容骨架不变，落地本包自有的任务书、KubeJS 脚本、数据包、世界生成与配置，并新增自研帧数补丁 `cdprfps`。

- 40 章 / 2160 任务可加载可完成，任务文本已迁移到 `lang/en_us.snbt`
- 188 条移植配方、49 个战利品表、384 个数据包 JSON 全部可解析
- 406 个 mod（依赖对齐完成，无重复主 modid）
- 能启动、能进世界；**帧数未达标**（46 fps vs 目标 200）

## Motivation

上游 CDPR 的 1.21.1 分支只提供公共骨架与本家内容，不含本包的中文任务书、经济链、MBD2 机器配方、东方/料理/太空等自有整合内容。1.20.1 的参考包在 1.21.1 下不能直接运行：

1. 数据包目录与字段改名（`recipes/`→`recipe/` 等），旧文件静默不加载；
2. FTB Quests 2101 起把文本搬进 lang，`.snbt` 内联文本会在保存时丢失；
3. `itemfilters`、`more_mod_tetra`、`cavedelight` 等模组在 1.21.1 无可用构建；
4. 多个上游模组在 1.21.1 有二进制不兼容与注册期缺陷（详见 DEV-LOG）；
5. 1.21.1 的区块/实体开销模型与 1.20.1 不同，需要独立的性能补丁。

因此需要一次成体系的社区魔改移植，并把「哪些已验证、哪些没验证」写清楚，避免下游误用。

## What changed

| 范围 | 变更 |
| --- | --- |
| `config/ftbquests/quests/` | 40 章任务书移植；文本迁入 `lang/en_us.snbt`；章节图标改对象写法；`itemfilters` → `ftbfiltersystem`；摘除 104 个 Tetra 饰品任务（2264 → 2160） |
| `kubejs/startup_scripts/` | 全局常量、注册、阶段初始化（含 `04_global_data.js`，承接原 `global` 赋值） |
| `kubejs/server_scripts/` | 配方删改与新增、MBD2 9 个脚本 113 条配方、战利品、商店分档、阶段属性缩放、火炮路线软约束 |
| `kubejs/client_scripts/` | Ponder、GUI 渲染、物品能量条等客户端脚本 |
| `kubejs/data/` | 384 个 JSON：配方（188）、战利品表（含 `name`→`value`）、标签、worldgen（12）、gateways（13）、结构 |
| `kubejs/assets/` | 自定义物品贴图与 lang（createdelightcore / ae2 等） |
| `config/` | 实例配置快照（剔除缓存与幻灯片图片，见 README 排除项） |
| `patches/cdprfps/` | 自研帧数补丁源码，1.0.0 → 1.3.1 |
| `mods.list` | 406 个 jar 的清单与来源判定（不含 jar） |
| `docs/` | 移植日志、开发日志、已知问题、本 PR 说明、协作流程 |

## How tested

**已验证**：

- 客户端可启动到主菜单；可进入世界（无崩溃）。
- 静态校验：KubeJS 脚本语法、SNBT 可解析、384 个 JSON 可解析、UTF-8 无 BOM、无重复主 modid。
- 任务书：40 章、2160 任务、悬空依赖 0、章节标题/图标 40/40。
- 崩溃回归：六个启动/进世界崩溃均不再复现（DEV-LOG 第二节）。

**未验证**：

- 帧数目标未达成：同一台机器、2560×1440、无光影、渲染距离 8 / 模拟距离 5 下，本包 46 fps，参考包 1.20.1 为 135 fps。
- `cdprfps` 1.3.0 / 1.3.1 从未进过世界，`/cdprfps tickets` 从未成功输出。
- LightmanCurrency 10 家持久商店 0 加载（schema 未迁移）。
- `dragon_steel_fan` 按标签灌注方案未实机验证。
- 188 条配方未逐条在 JEI/工作台点开验证。

完整清单见 [KNOWN-ISSUES.md](KNOWN-ISSUES.md)。

## Risks

1. **性能不达标是阻塞项。** 对照数据显示区块量与参考包同量级（2025 vs 2209），瓶颈在实体数（93 vs 399）与每刻耗时（7 ms vs 14–36 ms）。当前补丁方向（区块限流）解决不了它，需要改为实体层限制 + 按距离降频。
2. **经济链不可用。** 10 家持久商店与货币链未迁移，交易终端为空。
3. **两个兜底补丁与上游版本强绑定。** `cdc-mbd-guard` / `cdc-seq-guard` 依赖 createdelightcore 与 Create 的具体方法签名；上游改动会在启动阶段抛 `InvalidInjectionException`（明确失败，不会静默）。
4. **维度默认冻结有玩法副作用。** `defaultDimensionMode: freeze` 会冻结农场、Create 列车、AE2 跨维度系统；需要常驻的维度必须显式设为 `always`/`throttle`。
5. **1.21.1 没有原生按玩家模拟距离**，按玩家限距只能是服务端统一钳制。
6. **67 个 jar 来源未确认**（Modrinth sha1 未命中、上游无条目），复现时需要人工核对。

## Checklist

- [x] 数据包目录/字段已按 1.21.1 改名
- [x] 配方、战利品表、标签全部可解析
- [x] 任务书文本已迁入 lang，章节标题/图标完整
- [x] `itemfilters` 引用清零，改由 `ftb-filter-system` 承担
- [x] Tetra 系任务按方案 A 收口，无悬空依赖
- [x] 启动与进世界崩溃已修复（六项）
- [x] 自研补丁源码随仓库，jar 不入库
- [x] `mods.list` 覆盖全部 406 个 jar
- [ ] 帧数达标（未完成）
- [ ] 经济链（持久商店 + 货币链）迁移（未完成）
- [ ] `cdprfps` 1.3.x 进世界验证（未完成）
- [ ] 17 条空描述 + 2 条单字标题补齐（无来源，待人工撰写）

## Related issues

- #perf：帧数未达标（实体数与每刻耗时，非区块量）
- #economy：LightmanCurrency 1.20.1 schema 未迁移
- #quests-text：任务描述缺口无来源可补
- #mbd2：9 台机器上游无本体合成
- #worldgen：10 处失效群系引用待决策
