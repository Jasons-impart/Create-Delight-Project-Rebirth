# require_list_clean

> 来源：`docs/modpack-analysis-report.md`。  
> 这里只保留升级到 `1.21.1 NeoForge` 时需要继续关注的项目；已确认可直接升级的模组不列入。

## 状态

| 状态 | 含义 |
| --- | --- |
| ✅ 已完成 | 已有可用迁移/替代结果，可进入后续整合测试。 |
| 🟡 替代/非官方 | 有候选版本，但需要确认内容、ID 或稳定性。 |
| 🔴 缺失/需移植 | 未找到可靠 1.21.1 NeoForge 版本，或需要手动迁移。 |
| ⚠️ 可先排除 | 非核心内容、工具类或可用脚本/其他方式替代。 |

## ⭐ 两边共同未解决

| mod id | 1.20.1 jar | 状态 |
| --- | --- | --- |
| `endergetic` | `endergetic-1.20.1-5.0.1.jar` | 🔴 缺失/需移植 |
| `tetracelium` | `tetracelium-1.20.1-1.3.1.jar` | 🔴 缺失/需移植 |
| `tetracompat` | `tetracompat-1.0.0-all.jar` | 🔴 缺失/需移植 |
| `display` | `display-1.0.2-forge-1.20.1.jar` | 🔴 缺失/需移植 |
| `alex_cave_addon` | `alex_cave_addon-5.1.0-1.20.1.jar` | 🔴 缺失/需移植 |
| `moestweaks` | `moestweaks-forge-1.20.1-1.1.1.jar` | ⚠️ 可先排除 |

## ✅ 已完成

| mod id | 1.20.1 jar | 备注                                   |
| --- | --- |--------------------------------------|
| `casualness_delight` | `casualness_delight-1.20.1-0.4n.jar` | 已采用官方新版 `casualnessdelight-0.6.jar`；需执行 ID 前缀替换。  |
| `vintagedelight` | `vintagedelight-0.1.6.jar` | 已完成 1.21.1 NeoForge 迁移验证（PinkCats）。  |
| `mutil` | `mutil-1.20.1-6.2.0.jar` | 已有可用 1.21.1 NeoForge 社区版本（PinkCats）。   |
| `tetra` | `tetra-1.20.1-6.11.0.jar` | 已有可用 1.21.1 NeoForge 社区版本（PinkCats）。 |
| `collectorsreap` | `collectorsreap-1.20.1-1.5.5.jar` | 已完成 1.21.1 NeoForge 迁移验证（PinkCats）。 |
| `silentsdelight` | `silentsdelight-forge-1.0.1-1.20.1.jar` | 已完成 1.21.1 NeoForge 迁移验证（PinkCats）。 |
| `createfluidstuffs` | `createfluidstuffs-1.2.0-all.jar` | 已完成 1.21.1 NeoForge 迁移验证（KazeShukufuku）。 |

## 🔴 缺失/需移植

| mod id | 1.20.1 jar | 分组 |
| --- | --- | --- |
| `farmersrespite` | `farmersrespite-1.20.1-2.1.2.jar` | Farmer's Delight |
| `vintage_kubejs` | `vintage_kubejs-1.20.1-1.0.0rc-2.jar` | Vintage / KubeJS |
| `vvaddon` | `vvaddon-1.20.1-alpha3.0.1.jar` | Tetra |
| `taczaddon` | `taczaddon-1.20.1-1.1.4-for1.1.4.jar` | TaCZ |
| `create_utilities_j` | `Create-Utilities-J-1.20.1-0.3.3.jar` | Create |
| `cave_delight` | `Cave-Delight-1.20.1-2.0.1.jar` | Farmer's Delight |
| `cosmopolitan` | `cosmopolitan-1.20.1-1.1.0.jar` | Farmer's Delight |
| `festival_delicacies` | `festival_delicacies-2.0.0-beta+forge.1.20.1.jar` | Farmer's Delight |
| `frycooks_delight` | `frycooks_delight-1.20.1-1.0.1.jar` | Farmer's Delight |
| `oceanic_delight` | `oceanic_delight-1.0.3-forge-1.20.1.jar` | Farmer's Delight |
| `seasonals` | `seasonals-1.20.1-5.0.2.jar` | Farmer's Delight |
| `tetratic_combat_expanded` | `tetratic-combat-expanded-1.20-2.8.3.jar` | Tetra |
| `art_of_forging` | `art_of_forging-1.8.4-1.20.1.jar` | 装备 |
| `dreadsteel` | `dreadsteel-1.20.1-1.2.0.jar` | 装备 |
| `advancements_tracker` | 未列出明确 jar | UI |
| `kinetic_pixel` | `kinetic_pixel-1.0.3-forge-1.20.1.jar` | 杂项 |
| `questsadditions` | 未列出明确 jar | 任务 |
| `solapplepie` | 未列出明确 jar | 食物信息 |
| `solcarrot` | 未列出明确 jar | 食物玩法 |
| `sqlite_jdbc` | `sqlite-jdbc-3.36.0.3+20211227-all.jar` | 库 |
| `youkaishomecoming_curios` | `youkaishomecoming_curios-0.03.jar` | Youkai's Homecoming |
| `cobblefordays` | `CobbleForDays-1.8.0.jar` | 刷石机 |
| `nethervinery` | `letsdo-nethervinery-forge-1.2.19.jar` | 食物内容 |

## 🟡 替代/非官方

| mod id | 1.20.1 jar | 备注 |
| --- | --- | --- |
| `alexsdelight` | `alexsdelight-1.5.jar` | 依赖 Alex 系列候选。 |
| `alexsmobs` | `alexsmobs-1.20.1-*.jar` | 非官方移植，需稳定性测试。 |
| `alexscaves` | `alexscaves-1.20.1-*.jar` | 非官方移植，需稳定性测试。 |
| `iceandfire` | `iceandfire-2.1.13-1.20.1-beta-5.jar` | 可评估 Community Edition。 |
| `tacz` | `tacz-1.20.1-1.1.4-hotfix-all.jar` | 需确认枪械内容包和存档兼容。 |
| `createmetallurgy` | `createmetallurgy-1.0.1-1.20.1.jar` | 可评估替代项目。 |
| `create_better_storages` | `Create-Better-Storages-Forge-1.20.1-1.0b.Release.jar` | 可评估 Create: Bigger Storage [NeoFork]。 |
| `createbiggerstoragetocreate6` | `createbiggerstoragetocreate6-1.1.jar` | 与上项一起确认。 |
| `dumplings_delight` | `Dumplings Delight-1.20.1-Forge-1.3.1.jar` | 可评估 Rewrapped。 |
| `radiantgear` | `radiantgear-forge-2.2.0+1.20.1.jar` | 动态光源替代需谨慎。 |
| `customportalapi` | `customportalapi-0.0.1-forge-1.20.jar` | 可评估 Reforged。 |
| `always_eat` / `salwayseat` | `AlwaysEat-5.2.jar` | 可评估替代。 |
| `lucent` | `lucent-1.20.1-1.5.5.jar` | 动态光源替代需谨慎。 |
| `world_preview` | `world_preview-forge-1.20.1-1.3.1.jar` | 可评估 NeoForged。 |
| `0world2create` | `0World2Create-Universal-1.19-1.20.X-1.0.0.jar` | 有 refoxed 版。 |
| `icterine` | `Icterine-forge-1.20.0-1-1.3.0.jar` | 可评估Cerulean。 |
| `youkaishomecoming` | `youkaishomecoming-2.4.16.jar` | 1.21版本有战斗内容等缺失。 |

## ⚠️ 可先排除

| mod id | 1.20.1 jar | 备注 |
| --- | --- | --- |
| `create_oppenheimered` | `create_oppenheimered-1.0.5.jar` | 仅配方，可脚本实现。 |
| `botarium` | `botarium-forge-1.20.1-2.3.4.jar` | 疑似库/无用项，先查依赖。 |
