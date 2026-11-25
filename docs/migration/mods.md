# 逐模组迁移与缺失清单

核对日期 **2026-11-25**，目标 Minecraft **1.21.1 / NeoForge**，包源码 `05e5d52`。本页合并旧《未安装 mod 清单》和《模组迁移与替代方案跟进》的全部独立条目，并补入已决定移除的 Ad Astra。

包内状态按描述符及[预期 mod ID 清单](../../kubejs/config/createdelight_pack_integrity_expected.json)核对。候选链接指向具体发布文件；“CF 原项目”表示本次在该项目按游戏版本和加载器过滤未查到匹配文件。未确认来源的条目保留待核。采用、挂起和放弃按项目已有记录填写；候选仍需在隔离实例验证。

## 未接入，已有目标版本或替代候选（15 项）

| 旧模组或 ID | 包内状态 | 解决办法与剩余事项 | 核对依据 |
| --- | --- | --- | --- |
| `acceleratedrendering` | 未接入，有候选 | 有目标版本；采用前测试本包客户端渲染与光影组合。 | [acceleratedrendering-1.0.16-1.21.1-alpha.jar](https://www.curseforge.com/minecraft/mc-mods/accelerated-rendering/files/9654337) |
| `cosmopolitan` | 未接入，有候选 | 有 Neo Cosmopolitan 移植；确认 cream 物品、流体、交易和 Bakeries 用法后决定是否采用。 | [Neo Cosmopolitan](https://www.curseforge.com/minecraft/mc-mods/neo-cosmopolitan-modern-port/files/9273287) |
| `createrailwaysnavigator` | 未接入，有候选 | 有 NeoForge 构建；原调查提示列车导航可能影响性能，采用前测实际线路。 | [createrailwaysnavigator-neoforge-1.21.1-beta-0.10.0-C6.jar](https://www.curseforge.com/minecraft/mc-mods/create-railways-navigator/files/8974254) |
| `curiouslanterns` | 未接入，有候选 | Radiant Gear NeoForged 的项目说明包含 Curious Lanterns 功能，饰品槽与动态光源仍待验收。 | [合并移植](https://www.curseforge.com/minecraft/mc-mods/radiant-gear-neoforged/files/8242427) |
| `endertrigon` | 未接入，有候选 | 已有非官方移植；末影龙战斗行为与整包兼容性待测。 | [Ender Trigon Unofficial](https://www.curseforge.com/minecraft/mc-mods/ender-trigon-unofficial/files/9753341) |
| `euphoriapatcher` | 未接入，有候选 | 有目标版本；按实际光影版本核对补丁需求。 | [EuphoriaPatcher-1.11.2-r5.10-neoforge.jar](https://www.curseforge.com/minecraft/mc-mods/euphoria-patches/files/9708040) |
| `extendedae_plus` | 未接入，有候选 | 包内有 ExtendedAE 本体，Plus 是另一项目；已有目标构建，附属功能待评估。 | [extendedae_plus-1.6.4.2.jar](https://www.curseforge.com/minecraft/mc-mods/extendedae-plus/files/9677920) |
| `farmersrespite` | 未接入，有候选 | 有非官方移植。茶种子已由妖怪归宅承接；茶饮流体、煮茶配方、交易及 Lime Pie 食物覆盖需核对实际 ID 后再决定接入。 | [非官方移植](https://www.curseforge.com/minecraft/mc-mods/farmers-respite-unofficial-port/files/8711341) |
| `harium` | 未接入，有候选 | 旧清单建议改用 Lithium，后者有目标版本；当前预期模组中两者均未列入。 | [Lithium](https://www.curseforge.com/minecraft/mc-mods/lithium/files/8330365) |
| `neruina` | 未接入，有候选 | 有目标版本；需先决定是否采用其 ticking 异常处理行为。 | [neruina-3.3.5+1.21.1-neoforge.jar](https://www.curseforge.com/minecraft/mc-mods/neruina/files/9220575) |
| `oneenoughvalue` | 未接入，有候选 | 旧清单写无目标版本，现已有可下载的 NeoForge 构建；待决定是否采用。 | [OneEnoughValue-1.21.1-neoforge-1.1.1.jar](https://www.curseforge.com/minecraft/mc-mods/one-enough-value/files/9609589) |
| `radiantgear` | 未接入，有候选 | 已有 NeoForged 和 Reforged 两条候选；按 Curios 与动态光源后端验证，再决定采用哪一个。 | [NeoForged](https://www.curseforge.com/minecraft/mc-mods/radiant-gear-neoforged/files/8242427) · [Reforged](https://www.curseforge.com/minecraft/mc-mods/radiant-gear-reforged/files/9703392) |
| `trueuuid` | 未接入，有候选 | 有目标版本；是否有 UUID 修复需求仍待评估。 | [trueuuid-1.3.0-neoforge-1.21.1.jar](https://www.curseforge.com/minecraft/mc-mods/project-1539688/files/8875983) |
| `world_preview` | 未接入，有候选 | 有 World Preview NeoForged 移植；世界预览功能待决定是否引入。 | [World Preview NeoForged](https://modrinth.com/mod/world-preview-neoforged-unofficial/version/AQCgiv4K) |
| `zstdnet` | 未接入，有候选 | 有目标版本；如需接入，先测试客户端与服务端网络握手。 | [zstdnet-1.21.1-neoforge-1.5.0.jar](https://www.curseforge.com/minecraft/mc-mods/zstdnet/files/9044611) |

## 未接入或只完成部分替代（20 项）

| 旧模组或 ID | 包内状态 | 解决办法与剩余事项 | 核对依据 |
| --- | --- | --- | --- |
| `advancements_tracker` | 未接入 | 旧成就追踪 UI 暂无已定替代；是否保留该需求待定。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/advancements-tracker) |
| `alex_cave_addon` | 未接入 | 本包已用 Alex’s Caves Up；旧附属须验证新命名空间与 API。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/alex-cave-addon) |
| `botarium` | 未接入 | 当前完整性清单未列入。作为库按实际调用方决定是否需要。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/botarium) |
| `cave_delight` | 未接入 | 洞穴料理暂无已定替代；同类料理项目需逐项比较食材及配方。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/cave-delight) |
| `create_oppenheimered` | 未接入 | 当前脚本只在检测到旧模组时修改其配方。旧记录建议用 KubeJS 自行实现所需部分，具体保留哪些配方待定。 | [可选配方分支](../../kubejs/server_scripts/mods/alexscavesup/recipes.js) · [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/create-oppenheimered) |
| `display` | 身份待核 | 旧清单指向 `display-1.0.2-forge-1.20.1.jar`；当前有 Display Delight（`displaydelight`），两者身份或功能等效性待核。 | 旧清单；未确认匹配发布文件 |
| `endergetic` | 未接入 | 末地生态仍缺原依赖；相关旧内容挂起，待定移植或替代。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/endergetic) |
| `festival_delicacies` | 部分已替代 | 白菜、茄子、茴香、韭菜种子交易已改用 Dumplings Delight；其余节日料理暂无整体替代决定。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/festival-delicacies) |
| `frycooks_delight` | 未接入 | canola 种子和农产品回收交易按缺项跳过。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/frycooks-delight) |
| `just_enough_couriers` | 未接入 | 快递包裹的 JEI 联动暂缺，旧清单仅提出后续升级。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/just-enough-couriers) |
| `lucent` | 未接入 | 动态光源后端仍待选型；需与饰品及渲染组合验证。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/lucent) |
| `moestweaks` | 未接入 | 原调查列为可先排除；有具体微调需求时再评估。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/moestweaks) |
| `nethervinery` | 未接入 | Vinery 本体已在包内；下界两种葡萄种子交易仍挂起。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/lets-do-nethervinery) |
| `oceanic_delight` | 未接入 | sea_grape 的种子交易挂起。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/oceanic-delight) |
| `seasonals` | 未接入 | 季节性食物及依赖它们的联动待定。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/seasonals) |
| `taczaddon` | 未接入 | TACZ 本体已接入；旧附属独立缺失，核对背包与枪包联动后决定处理方式。 | 旧清单；未确认匹配发布文件 |
| `tetracelium` | 未接入 | Tetra 本体已接入；材料联动按缺前置挂起。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/tetracelium) |
| `tetracompat` | 未接入 | 单独跟进此兼容附属，恢复前逐项核对旧词条和材料。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/tetra-compat) |
| `tetratic_combat_expanded` | 未接入 | 缺依赖的战斗联动分支挂起。 | [CF 原项目](https://www.curseforge.com/minecraft/mc-mods/tetratic-combat-expanded) |
| `vvaddon` | 拟由 Core 复刻 | 拟由 Core 等效复刻；五种物品、词条、FE 能量条、材料获取和刀树解锁尚待实现或定案。 | 旧清单；未确认匹配发布文件 |

## 已决定不加入、退出、重写或仅保留占位（9 项）

| 旧模组或 ID | 包内状态 | 解决办法与剩余事项 | 核对依据 |
| --- | --- | --- | --- |
| `ad_astra` | 退出范围 | 已决定移除，依赖旧材料的失效交易退出迁移队列。 | [范围决定](status.md) |
| `art_of_forging` | 退出范围 | 原联动、卷轴和对应枪械配方已决定退出范围。 | [范围决定](status.md) |
| `dreadsteel` | 同 ID 占位 | Core 提供同 ID 占位；维护者已决定占位即最终形态，完整装备属性、技能和染色退出范围。 | [范围决定](status.md) |
| `ftbquestlocalizer` | 旧任务重写 | 旧任务体系重写；新版任务依设计选择本地化工具。 | [范围决定](status.md) |
| `kinetic_pixel` | 退出范围 | 整体丢弃，graycottonseed 种子单独自实现，仍挂起。 | [范围决定](status.md) |
| `oneenoughitem` | 已决定不加入 | 保留手动操作。 | 2026-11-25 维护者决定；[上游目标版本](https://www.curseforge.com/minecraft/mc-mods/one-enough-item/files/9405255) |
| `questsadditions` | 旧任务重写 | 旧任务体系重写；任务扩展由新设计选择。 | [范围决定](status.md) |
| `sqlite_jdbc` | 退出范围 | 已决定移除旧 JDBC 依赖。 | [范围决定](status.md) |
| `vintage_kubejs` | 退出范围 | 已决定丢弃旧集成。 | [范围决定](status.md) |

## 已纳入本体、移植版或替代模组（28 项）

| 旧模组或 ID | 包内状态 | 解决办法与剩余事项 | 核对依据 |
| --- | --- | --- | --- |
| `0world2create` | 已纳入 | 已采用 Refoxed。 | [0world2create-neoforge-1.21.1-1.0.0.jar](../../mods/common/oworld2create-refoxed.pw.toml) |
| `alexscaves` | 已纳入 | 使用 Alex’s Caves Up，保留 alexscavesup 命名空间。 | [alexscavesup-0.1.1.jar](../../mods/common/alexs-caves-up.pw.toml) |
| `alexsdelight` | 已纳入 | 已加入 Alex’s Delight；联动以包内 Alex’s Mobs Up 的实际 ID 验证。 | [alexsdelight-1.6.jar](../../mods/common/alexs-delight.pw.toml) |
| `alexsmobs` | 已纳入 | 使用 Alex’s Mobs Up，保留 alexsmobsup 命名空间。 | [alexsmobsup-0.2.8.jar](../../mods/common/alexs-mobs-up.pw.toml) |
| `always_eat / salwayseat` | 已纳入 | 本包已接入 Always Eat；罐头进食与放置冲突单独处理。 | [AlwaysEat-neoforge-1.0.0.jar](../../mods/common/always-eat.pw.toml) |
| `casualness_delight` | 已纳入 | 已纳入新版本；旧配方引用仍按新版命名空间逐项核对。 | [casualnessdelight-0.6.jar](../../mods/common/casualness-delight.pw.toml) |
| `cobblefordays` | 已纳入 | 采用 Create Cobblestone；原五级造石机出售交易已决定删除。 | [createcobblestone-1.5.0+neoforge-1.21.1-153.jar](../../mods/common/create-cobblestone.pw.toml) |
| `collectorsreap` | 已纳入 | 使用社区移植，直链制品随包维护。 | [collectorsreap-1.21.1-1.5.5.jar](../../mods/common/collectors-reap.pw.toml) |
| `create_better_storages` | 已纳入 | 包内采用 Create: Bigger Storage NeoFork。已有存档、库存和旧方块 ID 需单独核对。 | [biggerstorage1.21.1-neoforge-1.0.0.jar](../../mods/common/create-bigger-storage-neofork.pw.toml) |
| `create_utilities_j` | 已纳入 | 已接入，移出缺失队列。 | [Create-Utilities-J-1.21.1-0.3.4+1.21.1.jar](../../mods/common/create-utilities-j.pw.toml) |
| `createbiggerstoragetocreate6` | 旧补丁待核 | 已有 NeoFork 存储本体；旧 Create 6 适配补丁是否仍有独立功能待核。 | [biggerstorage1.21.1-neoforge-1.0.0.jar](../../mods/common/create-bigger-storage-neofork.pw.toml) |
| `createdelightcore` | 已纳入 | 已纳入公开 Core；跨仓库联动按实际发布制品验收。 | [createdelightcore-2.0.0.7+1.21.1.jar](../../mods/common/create-delight-core.pw.toml) |
| `createfluidstuffs` | 已纳入 | 采用 NeoForge 移植版。 | [createfluidstuffs-neoforge-1.2.1.jar](../../mods/common/create-fluid-stuffs-neoforge.pw.toml) |
| `createmetallurgy` | 已纳入 | 已接入。当前配方使用 raw_tungsten、crushed_raw_tungsten、dirty_tungsten_dust、tungsten_dust；旧交易的四个 wolframite 系列 ID 需核对映射。 | [createmetallurgy-1.0.3-1.21.1.jar](../../mods/common/create-metallurgy.pw.toml) |
| `customportalapi` | 已纳入 | 已采用 Custom Portal API Reforged。 | [cpapireforged-neo-1.21.1-1.2.2.jar](../../mods/common/custom-portal-api-reforged.pw.toml) |
| `dumplings_delight` | 已纳入 | 已采用 Rewrapped，多项旧种子与回收交易已迁到对应食材。 | [DumplingsDelightRewrapped-1.21.1-1.4.1.jar](../../mods/common/dumplings-delight-rewrapped.pw.toml) |
| `iceandfire` | 已纳入 | 已选 Community Edition；配方、采血已有专项验证，土卫二生态限制另行跟进。 | [IceAndFireCE-2.0-beta.16-1.21.1-neoforge.jar](../../mods/common/iceandfire-ce.pw.toml) |
| `icterine` | 已纳入 | 旧方案指向 Cerulean，目标包已纳入 Cerulean。 | [cerulean-neoforge-1.0.0-1.21.1.jar](../../mods/common/cerulean.pw.toml) |
| `mutil` | 已纳入 | 使用社区版本，作为 Tetra 的配套依赖维护。 | [mutil-1.21.1-6.3.1.jar](../../mods/common/mutil.pw.toml) |
| `polyeng` | 已纳入 | 已随 Polymorphic Energistics 引入，实际 mod ID 为 polyeng。 | [polyeng-0.4.1.jar](../../mods/common/polymorphic-energistics.pw.toml) |
| `silentsdelight` | 已纳入 | 使用社区移植，直链制品随包维护。 | [silentsdelight-1.21.1-1.0.1.jar](../../mods/common/silents-delight.pw.toml) |
| `solapplepie` | 已纳入 | 由 Lime Pie 承接，服务端专项已验；GUI、饭盒、真实进食与旧存档待验。 | [sollimepie-neoforge-1.21.1-3.1.0.jar](../../mods/common/spice-of-life-lime-pie-edition.pw.toml) |
| `solcarrot` | 已纳入 | 已采用官方 NeoForge 版并迁移配置；客户端饮食体验另行验收。 | [solcarrot-1.21.1-1.16.6.jar](../../mods/common/solcarrot.pw.toml) |
| `tacz` | 已纳入 | 使用 1.21.1 移植；补弹与图标已有验收，默认枪械获取和旧存档仍需验证。 | [tacz-neoforge-1.21.1-1.1.8-hotfix-r6.jar](../../mods/common/tacz-1-21-1.pw.toml) |
| `tetra` | 已纳入 | 采用社区移植本体；附属与能量系统分别跟进。 | [tetra-1.21.1-6.13.0.jar](../../mods/common/tetra.pw.toml) |
| `vintagedelight` | 已纳入 | 采用社区移植；沿用包内描述符的来源。 | [vintagedelight-1.21.1-0.1.6.jar](../../mods/common/vintage-delight.pw.toml) |
| `youkaishomecoming` | 已纳入 | 采用非官方移植；主线已补餐台寿司与茶咖配方。 | [youkaishomecoming-4.2.1.jar](../../mods/common/youkais-homecoming-unofficial-port.pw.toml) |
| `youkaishomecoming_curios` | 本体功能随移植版提供（待验） | 旧记录称 Curios 功能由妖怪归宅移植版承接；不单装旧附属，饰品行为待客户端验收。 | [youkaishomecoming-4.2.1.jar](../../mods/common/youkais-homecoming-unofficial-port.pw.toml) |

玩法验收与跨模组事项见[当前迁移状态](status.md)。更新本表时同时核对项目身份、目标文件的加载器及游戏版本、包内描述符和已作出的取舍。
