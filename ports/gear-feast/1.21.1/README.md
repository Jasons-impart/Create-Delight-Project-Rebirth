# 齿轮盛宴 · Minecraft 1.21.1 社区魔改移植（源码仓库）

本仓库是「齿轮盛宴」整合包的**社区魔改移植**版本：把 1.20.1 的整合包内容改造到 **1.21.1 / NeoForge** 的可审查快照，包含整合包自身维护的全部脚本、配置与任务书，以及社区魔改移植过程、自研补丁与已知问题的完整记录。

**这是社区魔改移植，不是上游 CDPR 官方移植。** 上游只维护自己的整合包内容，本包的中文任务书、经济链、MBD2 机器配方与自研补丁均来自社区侧改动。

**本仓库不包含任何 mod jar**，`mods.list` 只出清单（文件名 / modid / 版本 / 来源）。

---

## 一、这是什么

| 项 | 值 |
| --- | --- |
| 整合包 | 齿轮盛宴（中文社区整合包，Create 机械动力 + 料理 + 太空 + 任务书） |
| 上游 | [Jasons-impart/Create-Delight-Project-Rebirth](https://github.com/Jasons-impart/Create-Delight-Project-Rebirth)（下称 CDPR） |
| fork 关系 | 本仓库是 CDPR **1.21.1 线**的下游 fork，在其基础上做社区魔改移植；上游用 packwiz 维护（`pack/pack.toml` 版本 `v2.0.0.0-test4`） |
| 目标版本 | Minecraft 1.21.1 / NeoForge 21.1.266（上游 `pack.toml` 声明 21.1.251，本包实测 21.1.266 可用） |
| 当前 mod 数 | 406 个 jar（实测快照，见 `mods.list`） |
| 任务书 | 40 章 / 2160 任务，文本已迁移到 `config/ftbquests/quests/lang/en_us.snbt` |
| 当前状态 | **能启动、任务书 40 章 2160 任务完整可用、帧数未达标**（详见 [docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md)） |

上游与本仓库的关系、许可边界见 [LICENSE-NOTICE.md](LICENSE-NOTICE.md)。

---

## 二、目录说明

```
.
├── README.md                 本文件
├── CHANGELOG.md              按日期/版本的变更记录
├── LICENSE-NOTICE.md         上游许可与本仓库的关系
├── mods.list                 406 个 jar 的清单（不含 jar）
├── .gitignore                忽略 jar / 日志 / 存档 / 临时文件
├── config/                   实例 config 目录（原样复制，含下面的任务书）
│   └── ftbquests/quests/     任务书：40 章 snbt + data.snbt + chapter_groups.snbt + lang/
├── kubejs/                   KubeJS 脚本、数据包、资源
│   ├── startup_scripts/      一次性初始化（全局常量、注册、阶段）
│   ├── server_scripts/       配方、战利品、商店、MBD2 机器、事件
│   ├── client_scripts/       客户端脚本（Ponder、GUI 渲染等）
│   ├── data/                 数据包（384 个 JSON：配方、战利品表、标签、世界生成、网关）
│   ├── assets/               KubeJS 资源（createdelightcore / ae2 等自定义物品贴图与 lang）
│   └── config/               KubeJS 自身配置
├── docs/
│   ├── PORTING-LOG.md        1.20.1 → 1.21.1 移植日志（做了什么、依据、结果）
│   ├── DEV-LOG.md            自研 cdprfps 版本史、启动崩溃修复、KubeJS 报错根因
│   ├── KNOWN-ISSUES.md       已知问题（未检查 / 未验证 / 已确认存在）
│   ├── PR-DESCRIPTION.md     按 PR 模板撰写的整次社区魔改移植说明
│   └── WORKFLOW.md           fork → 分支 → 提交 → PR 的协作流程
└── patches/
    └── cdprfps/              自研帧数补丁的源码（JDK 21 + javac，无 Gradle；不含 jar）
```

任务书按用户要求放在 `config/ftbquests/quests/`，与 FTB Quests 运行时目录一致，还原时无需搬动。

---

## 三、如何用这份仓库还原一个可测实例

1. **准备启动器与版本**：新建 1.21.1 + NeoForge 21.1.266 实例（推荐 PCL / HMCL）。
2. **放 mods**：按 `mods.list` 的「文件名 + modid + 版本 + 来源」逐条取回 jar，放进 `mods/`。
   - `来源=自建` 的 4 个 jar 需要本地构建或从发行包获取，见下文「自建 jar」。
   - `来源=未确认` 的 67 个 jar 需要人工核对 CurseForge / GitHub（清单里保留了文件名与 sha1 判定结果）。
3. **覆盖仓库内容**：把本仓库的 `config/`、`kubejs/` 覆盖到实例同名目录。
4. **补齐运行时目录**（不属于源码，仓库不含）：`mods/`、`saves/`、`resourcepacks/`、`shaderpacks/`、`schematics/`、`local/`。
5. **首次启动**：先进主菜单确认无崩溃，再进世界；进世界后检查日志中 `[CDPRFPS]` 系列行是否打印。
6. **可选项**：`config/jei_biome/` 与 `config/fancymenu/slideshows/create_delight/images/` 未收录（见「四、排除项」），缺失只影响 JEI 生物群系展示与主菜单幻灯片，不影响启动与玩法。

### 自建 jar

| jar | 说明 | 源码/来源 |
| --- | --- | --- |
| `cdprfps-1.3.1.jar` | 帧数优化补丁（客户端剔除 + 服务端节流 + 维度闸门 + 票据诊断） | 本仓库 `patches/cdprfps/`，`build.ps1` 构建 |
| `cdc-mbd-guard-1.0.0.jar` | createdelightcore `MbdRecipeValues.rebuild` 空指针兜底 | 本地构建产物，源码未随包（接口与行为见 DEV-LOG） |
| `cdc-seq-guard-1.0.0.jar` | Create 序列装配配方空成分崩溃兜底 | 本地构建产物，源码未随包（同上） |
| `quality_food-1.21.1-2.3.6-cdpr.2.jar` | Quality Food 的 CDPR 定制构建（版本号含 `-cdpr`） | 上游 CDPR 发行物 |

> 只放清单、不放 jar 是硬性要求：所有 jar 的版权归各自作者，见 `LICENSE-NOTICE.md`。

---

## 四、排除项（体积与无关文件）

打包时从 `config/` 中剔除了以下内容，其余原样复制：

| 排除路径 | 体积 | 原因 | 影响 |
| --- | --- | --- | --- |
| `config/jei_biome/` | 15.7 MB | 单文件 `biome_blocks.json`，由模组扫描世界后生成，属缓存类数据 | JEI 生物群系来源展示缺失，可重新生成 |
| `config/fancymenu/slideshows/create_delight/images/` | 33.1 MB | 14 张主菜单幻灯片 PNG，纯二进制媒体，不属于需审查的源码 | 主菜单幻灯片无图，可再从实例复制 |
| `config/**/*.bak` | 约 60 KB | 配置修改留下的备份副本 | 无 |
| `config/bountiful/errors.log` | 1 KB | 运行期日志 | 无 |

`kubejs/assets/`（18.8 MB，主要是 createdelightcore 与 ae2 的自定义贴图）**保留**：它是 KubeJS 自定义物品的贴图来源，属于源码资产。

---

## 五、这份仓库里没有的东西

- 所有 mod jar、资源包 zip、光影包、存档、日志、崩溃报告。
- 运行时缓存与生成物（`.cache/`、`dynamic-data-pack-cache/`、`local/`、`logs/`、`crash-reports/`）。
- 1.20.1 参考包与上游 CDPR 源码树（按 fork 关系从上游获取即可）。

---

## 六、阅读顺序建议

1. 想快速判断「社区魔改移植到哪一步了」→ [docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md)
2. 想复核「改了什么、为什么」→ [docs/PORTING-LOG.md](docs/PORTING-LOG.md)
3. 想复核「自研补丁与崩溃修复」→ [docs/DEV-LOG.md](docs/DEV-LOG.md)
4. 想按 PR 流程接手 → [docs/PR-DESCRIPTION.md](docs/PR-DESCRIPTION.md)、[docs/WORKFLOW.md](docs/WORKFLOW.md)
