# Create-Delight-Remake 整合包模组分析报告（功能说明是AI自己找的 有错很正常 其他已人工复查）

> **生成日期**: 2026-05-04
> **当前MC版本**: 1.20.1 (Forge)
> **模组总数**: 355 个
> **模组加载器**: Forge

---

## 1.21.1 升级总览

在 Minecraft 1.21.1 版本中，模组生态发生了重大变化：**Forge 已基本被 NeoForge 取代**。绝大多数主流模组在 1.21.1 上都已迁移至 NeoForge，仅有少数仍保留 Forge 版本。

### 升级可行性评估

| 状态 | 数量 | 说明 |
|------|------|------|
| ✅ 已有1.21.1版本 | ~294 (83%) | 两个txt之外的模组全部有1.21.1 |
| 🟡 有替代方案 / 非官方移植 | ~20 (6%) | Alex's Mobs/Caves(非官方)、Ice&Fire(CE)、Steam'n'Rails(官方移植)等 |
| 🔴 确认无1.21.1版本 | 41 (12%) | Tetra生态、Farmer's Respite(闭源)等（详见第二十/二十一章） |
| ⚠️ 需切换至 NeoForge | 几乎所有 | 1.21.1 的模组生态几乎完全在 NeoForge 上 |

> 修正依据：除 `ls/` 目录下两个txt列出的模组外，其余均有1.21.1版本。86处已批量修正。

---

## 一、核心/API/库依赖 (Core Libraries)

这些模组是其他模组的运行基础，不直接提供游戏内容。

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 1 | **Architectury** | architectury-9.2.14-forge.jar | 9.2.14 | 多加载器兼容API，FTB/KubeJS等模组的核心依赖 | ✅ 有NeoForge版 |
| 2 | **Balm** | balm-forge-1.20.1-7.3.38-all.jar | 7.3.38 | 通用模组开发库，提供网络/配置等抽象层 | ✅ 有NeoForge版 |
| 3 | **Bookshelf** | Bookshelf-Forge-1.20.1-20.2.15.jar | 20.2.15 | Darkhax的通用库，EnchantmentDescriptions等依赖 | ✅ 有NeoForge版 |
| 4 | **Blueprint** | blueprint-1.20.1-7.1.3.jar | 7.1.3 | TeamAbnormals团队模组的通用库 | ✅ 有NeoForge版 |
| 5 | **Citadel** | citadel-2.6.3-1.20.1.jar | 2.6.3 | Alex's Mobs/Caves的核心依赖库，提供动画/实体框架 | 🟡 非官方移植 |
| 6 | **Cloth Config** | cloth-config-11.1.136-forge.jar | 11.1.136 | 现代化配置界面API，几乎被所有模组依赖 | ✅ 有NeoForge版 |
| 7 | **Cobweb** | cobweb-forge-1.20.1-1.0.1.jar | 1.0.1 | 通用库 | ✅ 有1.21.1 |
| 8 | **Coroutil** | coroutil-forge-1.20.1-1.3.7.jar | 1.3.7 | Coro的实用库，用于Improved Mobs等 | ✅ 有1.21.1 |
| 9 | **CreativeCore** | CreativeCore_FORGE_v2.12.35_mc1.20.1.jar | 2.12.35 | ItemPhysic等模组的核心库 | ✅ 有NeoForge版 |
| 10 | **CristelLib** | cristellib-1.1.6-forge.jar | 1.1.6 | 配置/数据结构库 | ✅ 有NeoForge版 |
| 11 | **Curios** | curios-forge-5.14.1+1.20.1.jar | 5.14.1 | 饰品/装备槽位API，被广泛使用 | ✅ 有NeoForge版 |
| 12 | **DragonLib** | dragonlib-forge-1.20.1-beta-3.0.24.jar | 3.0.24 | Dragon的通用库 | ✅ 有1.21.1 |
| 13 | **ElysiumAPI** | ElysiumAPI-1.20.1-1.1.3.jar | 1.1.3 | 北欧主题模组API | ✅ 有1.21.1 |
| 14 | **FerriteCore** | ferritecore-6.0.1-forge.jar | 6.0.1 | 内存优化库，大幅减少RAM占用 | ✅ 有NeoForge版 |
| 15 | **Framework** | framework-forge-1.20.1-0.8.0.jar | 0.8.0 | MrCrayfish的通用框架 | ✅ 有NeoForge版 |
| 16 | **GeckoLib** | geckolib-forge-1.20.1-4.8.3.jar | 4.8.3 | 3D动画库，大量生物模组的依赖 | ✅ 有NeoForge版 |
| 17 | **Glodium** | Glodium-1.20-1.5-forge.jar | 1.5 | AE2附属模组开发库 | ✅ 有NeoForge版 |
| 18 | **Iceberg** | Iceberg-1.20.1-forge-1.1.25.jar | 1.1.25 | Grend的通用库，Tips/AdvancementPlaques依赖 | ✅ 有NeoForge版 |
| 19 | **Kambrik** | Kambrik-6.1.1+1.20.1-forge.jar | 6.1.1 | 通用工具库 | ✅ 有1.21.1 |
| 20 | **Kiwi** | Kiwi-1.20.1-Forge-11.10.1.jar | 11.10.1 | Snownee的通用库，贡献者模组的核心依赖 | ✅ 有NeoForge版 |
| 21 | **Konkrete** | konkrete_forge_1.8.0_MC_1.20-1.20.1.jar | 1.8.0 | FancyMenu/DrippyLoadingScreen的依赖库 | ✅ 有NeoForge版 |
| 22 | **KotlinForForge** | kotlinforforge-4.12.0-all.jar | 4.12.0 | 让Forge模组可以使用Kotlin编写 | ✅ 有NeoForge版 |
| 23 | **LDLib** | ldlib-forge-1.20.1-1.0.50.jar | 1.0.50 | LowDrag的通用库，Create addon依赖 | ✅ 有NeoForge版 |
| 24 | **Melody** | melody_forge_1.0.3_MC_1.20.1-1.20.4.jar | 1.0.3 | 音频/音乐系统库 | ✅ 有NeoForge版 |
| 25 | **MidnightLib** | midnightlib-forge-1.9.2+1.20.1.jar | 1.9.2 | 配置库，BetterNether等模组的依赖 | ✅ 有NeoForge版 |
| 26 | **Moonlight** | moonlight-1.20-2.16.27-forge.jar | 2.16.27 | MehVahdJukaar的通用库，Supplementaries/Amendments依赖 | ✅ 有NeoForge版 |
| 27 | **mutil** | mutil-1.20.1-6.2.0.jar | 6.2.0 | mickelus的通用库，Tetra的依赖 | 🔴 Tetra前置，无1.21 |
| 28 | **Mysterious Mountain Lib** | mysterious_mountain_lib-1.6.30-1.20.1.jar | 1.6.30 | 神秘山脉模组库 | ✅ 有1.21.1 |
| 29 | **OELib** | OELib-forge-1.20.1-0.2.3.jar | 0.2.3 | OpenEye通用库 | ✅ 有1.21.1 |
| 30 | **Placebo** | Placebo-1.20.1-8.6.3.jar | 8.6.3 | Shadows_of_Fire的通用库，Apothic Attributes等依赖 | ✅ 有NeoForge版 |
| 31 | **Prism** | Prism-1.20.1-forge-1.0.5.jar | 1.0.5 | 通用库 | ✅ 有1.21.1 |
| 32 | **PuzzlesLib** | PuzzlesLib-v8.1.33-1.20.1-Forge.jar | 8.1.33 | Fuzs的通用库，BetterAdvancements等依赖 | ✅ 有NeoForge版 |
| 33 | **Resourceful Config** | resourcefulconfig-forge-1.20.1-2.1.3.jar | 2.1.3 | 配置管理库 | ✅ 有NeoForge版 |
| 34 | **Resourceful Lib** | resourcefullib-forge-1.20.1-2.1.29.jar | 2.1.29 | 通用工具库 | ✅ 有NeoForge版 |
| 35 | **Rhino** | rhino-forge-2001.2.3-build.10.jar | 2001.2.3 | JavaScript引擎，KubeJS核心依赖 | ✅ 有NeoForge版 |
| 36 | **ServerCore** | servercore-forge-1.5.2+1.20.1.jar | 1.5.2 | 服务器性能优化库 | ✅ 有NeoForge版 |
| 37 | **ShadowizardLib** | shadowizardlib-1.20.1-1.3.1.jar | 1.3.1 | 通用库 | ✅ 有1.21.1 |
| 38 | **SuperMartijn642 Config Lib** | supermartijn642configlib-1.1.8-forge-mc1.20.jar | 1.1.8 | 配置库 | ✅ 有NeoForge版 |
| 39 | **SuperMartijn642 Core Lib** | supermartijn642corelib-1.1.18-forge-mc1.20.1.jar | 1.1.18 | 通用核心库 | ✅ 有NeoForge版 |
| 40 | **TenshiLib** | tenshilib-1.20.1-1.7.6-forge.jar | 1.7.6 | 通用库 | ✅ 有1.21.1 |
| 41 | **Titanium** | titanium-1.20.1-3.8.32.jar | 3.8.32 | Buuz135的通用库，Industrial Foregoing等依赖 | ✅ 有NeoForge版 |
| 42 | **YUNG's API** | YungsApi-1.20-Forge-4.0.6.jar | 4.0.6 | YUNG系列结构模组的API | ✅ → YUNG's API (NeoForge) 官方版 |
| 43 | **Zeta** | Zeta-1.0-31.jar | 1.0-31 | Vazkii的通用库，Quark的核心依赖 | ✅ 有NeoForge版 (alpha) |
| 44 | **Better Compatibility Checker** | BetterCompatibilityChecker-3.0.1-build.58+mc1.20.jar | 3.0.1 | 模组兼容性检查工具 | ✅ 有NeoForge版 |

---

## 二、Create 机械动力 及附属 (核心模组 + 46个Addon)

这是本整合包的核心模组系列。Create 是一个以机械动力为主题的自定义科技模组。

### 2.1 Create 核心

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 45 | **Create** | create-1.20.1-6.0.8.jar | 6.0.8 | 机械动力核心模组，提供齿轮/传送带/动力系统 | ✅ 官方6.1.x (NeoForge) |

### 2.2 Create 官方/主要附属

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 46 | **Create: Steam 'n' Rails** | Steam_Rails-1.7.2+forge-mc1.20.1.jar | 1.7.2 | 火车/铁路扩展，添加各种铁轨、信号灯、单轨等 | 🟡 → Steam 'n' Rails NeoForge 社区移植版 |
| 47 | **Create: Crafts & Additions** | createaddition-1.20.1-1.3.3.jar | 1.3.3 | 电力系统(FE)，电动机/发电机/线缆/储能 | ✅ 官方NeoForge版 |
| 48 | **Create: New Age** | create-new-age-1.1.7f+forge-mc1.20.1.jar | 1.1.7f | 核能/清洁能源扩展 | ✅ 有NeoForge版 |
| 49 | **Create: Connected** | create_connected-1.1.13-mc1.20.1-all.jar | 1.1.13 | 增加各种连接器、传动轴、离心机等机械组件 | ✅ 有NeoForge版 |
| 50 | **Create: Copycats+** | copycats-3.0.7+mc.1.20.1-forge.jar | 3.0.7 | 装饰性复制方块，用于建筑细节 | ✅ 有NeoForge版 |
| 51 | **Create: Enchantment Industry** | create_enchantment_industry-1.3.3-for-create-6.0.6.jar | 1.3.3 | 机械自动化附魔/拆解/经验处理 | ✅ 有NeoForge版 |
| 52 | **Create: Diesel Generators** | createdieselgenerators-1.20.1-1.3.12.jar | 1.3.12 | 柴油/汽油/生物柴油动力生成 | ✅ 有NeoForge版 |
| 53 | **Create: Jetpack** | create_jetpack-forge-4.4.6.jar | 4.4.6 | 机械动力风格喷气背包 | ✅ 有NeoForge版 |
| 54 | **Create: Ore Excavation** | createoreexcavation-1.20-1.6.5.jar | 1.6.5 | 矿脉探测与自动化采矿 | ✅ 有NeoForge版 |
| 55 | **Create: Ultimate Mine** | createultimine-1.20.1-forge-1.3.0.jar | 1.3.0 | 矿石连挖功能，与Create节奏匹配 | ✅ 有1.21.1 |
| 56 | **Create: Liquid Fuel** | createliquidfuel-2.1.1-1.20.1.jar | 2.1.1 | 液体燃料燃烧器 | ✅ 有1.21.1 |
| 57 | **Create: Pattern Schematics** | create_pattern_schematics-1.3.3.jar | 1.3.3 | 蓝图/模板系统增强 | ✅ 有1.21.1 |
| 58 | **Create: Metallurgy** | createmetallurgy-1.0.1-1.20.1.jar | 1.0.1 | 冶金/金属冶炼扩展 | 🔴 等作者更新 |

### 2.3 Create 食物/厨房附属

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 59 | **Create-Delight-Core** | Create-Delight-Core-1.20.1-2.2.14.jar | 2.2.14 | 本整合包核心！Create与Farmer's Delight的桥接模组 | ✅ 官方持续更新 |
| 60 | **Create: Central Kitchen** | create_central_kitchen-1.20.1-for-create-6.0.6-1.4.3b.jar | 1.4.3b | 集中厨房/自动化烹饪系统 | ✅ 有NeoForge版 |
| 61 | **Create Cafe** | createcafe-1.3-1.20.1.jar | 1.3 | 咖啡/茶饮制作，咖啡豆种植 | ✅ 有1.21.1 |
| 62 | **Create: Confectionery** | create-confectionery1.20.1_v1.1.0.jar | 1.1.0 | 甜点/巧克力自动化生产 | ✅ 有1.21.1 |
| 63 | **Create: Deepfried** | create_deepfried-forge-1.20.1-0.1.3C.jar | 0.1.3C | 油炸食品自动化 | ✅ 有1.21.1 |
| 64 | **Create: Ratatouille** | create_ratatouille-1.20.1-1.3.8.jar | 1.3.8 | 法式料理自动化 | ✅ 有1.21.1 |
| 65 | **Create: Fantasizing** | create_fantasizing-1.20.1-1.1.1.jar | 1.1.1 | 幻想风格食物 | ✅ 有1.21.1 |
| 66 | **Create: Fishery Industry** | createfisheryindustry-1.20-5.0.2.jar | 5.0.2 | 渔业工业化/自动化 | ✅ 有1.21.1 |
| 67 | **Create: BicBit** | createbicbit-forge-1.20.1-1.0.2B.jar | 1.0.2B | 小吃/零食制作 | ✅ 有1.21.1 |

### 2.4 Create 存储/物流附属

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 68 | **Create: Compatible Storage** | create_compatible_storage-2.11.0-all.jar | 2.11.0 | 兼容存储系统 | ✅ 有1.21.1 |
| 69 | **Create: Better Storages** | Create-Better-Storages-Forge-1.20.1-1.0b.Release.jar | 1.0b | 更好的存储方案 | 🔴 → 用 Create: Bigger Storage [NeoFork] 替代 |
| 70 | **Create: Bigger Storage** | createbiggerstoragetocreate6-1.1.jar | 1.1 | 更大容量的存储容器 | 🔴 → 用 Create: Bigger Storage [NeoFork] 替代 |
| 71 | **Create: Transmission** | createtransmission-1.1.0+forge-create6-1.20.1.jar | 1.1.0 | 物品/流体远程传输 | ✅ 有1.21.1 |
| 72 | **Create: Fluid Stuffs** | createfluidstuffs-1.2.0-all.jar | 1.2.0 | 流体处理增强 | ✅ 已完成1.21.1迁移 |
| 73 | **Create: Additional Logistics** | createadditionallogistics-1.20.1-1.4.5.jar | 1.4.5 | 额外的物流组件 | ✅ 有1.21.1 |
| 74 | **Create: Stock Bridge** | createstockbridge-1.20-0.1.5.jar | 0.1.5 | 仓储桥接 | ✅ 有1.21.1 |

### 2.5 Create 装饰/建筑附属

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 75 | **Create: Deco** | createdeco-2.0.3-1.20.1-forge.jar | 2.0.3 | 机械动力风格装饰方块 | ✅ 有NeoForge版 |
| 76 | **Create: Structures Arise** | create_structures_arise-174.47.46 Release-forge-1.20.1.jar | 174.47.46 | Create主题世界结构 | ✅ 有1.21.1 |
| 77 | **Create: Rustic Structures** | create_rustic_structures-1.0.0-forge-1.20.1.jar | 1.0.0 | 乡村风格建筑结构 | ✅ 有1.21.1 |
| 78 | **Create: Prism** | createprism-1.20-1.0.2.jar | 1.0.2 | 棱镜/光学相关 | ✅ 有1.21.1 |

### 2.6 Create 功能增强附属

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 79 | **Create: Stuff Additions** | create-stuff-additions1.20.1_v2.1.1.jar | 2.1.1 | 各种实用物品/工具添加 | ✅ 有1.21.1 |
| 80 | **Create: Utilities-J** | Create-Utilities-J-1.20.1-0.3.3.jar | 0.3.3 | 实用工具合集 | ✅ 作者是开发组成员，可向上移植 |
| 81 | **Create: Fast Schematic Cannon** | CreateFastSchematicCannon-1.4.1-6.0.x-forge-1.20.1.jar | 1.4.1 | 加速蓝图炮搭建速度 | ✅ 有1.21.1 |
| 82 | **Create: Enhanced Schematicannon** | create_enhanced_schematicannon-1.0.3-6.0+.jar | 1.0.3 | 蓝图炮功能增强 | ✅ 有1.21.1 |
| 83 | **Create: Lazy Tick** | CreateLazyTick-2.4.9-6.0.x-forge-1.20.1.jar | 2.4.9 | 优化Create机械的tick性能 | ✅ 有1.21.1 |
| 84 | **Create: Better FPS** | createbetterfps-1.20.1-1.1.1.jar | 1.1.1 | Create机械FPS优化 | ✅ 有1.21.1 |
| 85 | **Create: Cyber Goggles** | CreateCyberGoggles-1.20.1-7.2.2-Forge.jar | 7.2.2 | 赛博风格护目镜/信息显示 | ✅ 有1.21.1 |
| 86 | **Create: Mechanical Spawner** | create_mechanical_spawner-1.20.1-0.1.7-6.0.6.jar | 0.1.7 | 机械动力刷怪笼 | ✅ 有1.21.1 |
| 87 | **Create: More Recipes** | Create More Recipes-1.20.1-1.2.1-fix1.jar | 1.2.1 | 为Create物品添加更多合成配方 | ✅ 有1.21.1 |
| 88 | **Create: Oppenheimered** | create_oppenheimered-1.0.5.jar | 1.0.5 | 核弹/爆炸物，致敬奥本海默 | 🔴 仅提供配方，可KubeJS实现 |
| 89 | **Create: IDLX** | createidlx-1.20.1-1.3.jar | 1.3 | Create功能扩展 | ✅ 有1.21.1 |
| 90 | **Create: Railways Navigator** | createrailwaysnavigator-forge-1.20.1-alpha-0.9.0-C6+2.jar | 0.9.0 | 铁路导航系统 | ✅ 有1.21.1 ⚠️可能有性能问题 |
| 91 | **Create: Jetpack Curios** | create_jetpack_curios-1.2.0-forge-1.20.1.jar | 1.2.0 | 让喷气背包兼容Curios槽位 | ✅ 有1.21.1 |

### 2.7 Create x AE2 交叉附属

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 92 | **Applied Create** | appliedcreate-1.20.1-1.1.4.jar | 1.1.4 | Create机械处理AE2赛特斯石英等 | ✅ 有1.21.1 |

---

## 三、农夫乐事 & 食物/烹饪模组 (Farmer's Delight Ecosystem)

这是本整合包的另一大核心系列。Farmer's Delight 是一个农耕/烹饪模组，有大量的附属扩展。

### 3.1 Farmer's Delight 核心

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 93 | **Farmer's Delight** | FarmersDelight-1.20.1-1.2.11.jar | 1.2.11 | 农耕乐事核心，烹饪锅/砧板/炉灶/肥沃土壤 | ✅ 1.2.9 (NeoForge) |

### 3.2 Farmer's Delight 附属扩展

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 94 | **Abnormals Delight** | abnormals_delight-1.20.1-5.0.1.jar | 5.0.1 | TeamAbnormals模组的FD联动（Neapolitan等） | ✅ 有NeoForge版 |
| 95 | **Alex's Delight** | alexsdelight-1.5.jar | 1.5 | Alex's Mobs生物的肉类/食材联动 | 🟡 等待非官方移植 |
| 96 | **Bakeries** | bakeries-1.20.1-forge-1.2.0.jar | 1.2.0 | 烘焙/面包店主题食物 | ✅ 有1.21.1 |
| 97 | **Brewin' And Chewin'** | BrewinAndChewin-1.20.1-3.2.1.jar | 3.2.1 | 酿酒和发酵食品 | ✅ 有NeoForge版 |
| 98 | **Butchercraft** | butchercraft-2.4.1.jar | 2.4.1 | 屠宰/肉类加工（完整的畜牧屠宰链） | ✅ 有1.21.1 |
| 99 | **Casualness Delight** | casualness_delight-1.20.1-0.4n.jar | 0.4n | 休闲风格的额外食物 | ✅ 有1.21.1 |
| 100 | **Cave Delight** | Cave-Delight-1.20.1-2.0.1.jar | 2.0.1 | 洞穴/地下主题食材与食物 | 🔴 确认无1.21.1 |
| 101 | **Chef's Delight** | chefsdelight-1.0.4-forge-1.20.1.jar | 1.0.4 | 厨师主题扩展，村庄厨师村民 | ✅ 有1.21.1 |
| 102 | **Collector's Reap** | collectorsreap-1.20.1-1.5.5.jar | 1.5.5 | 收集/收获主题食物 | 🔴 未找到任何1.21分支 |
| 103 | **Corn Delight** | corn_delight-1.1.9-1.20.1.jar | 1.1.9 | 玉米及相关食物扩展 | ✅ 有NeoForge版 |
| 104 | **Cosmopolitan** | cosmopolitan-1.20.1-1.1.0.jar | 1.1.0 | 国际化美食 | 🔴 确认无1.21.1 |
| 105 | **Crabber's Delight** | crabbersdelight-1.20.1-1.2.3.jar | 1.2.3 | 螃蟹/海鲜主题食物 | ✅ 有1.21.1 |
| 106 | **Crate Delight** | cratedelight-25.09.22-1.20-forge.jar | 25.09.22 | 板条箱包装食物 | ✅ 有1.21.1 |
| 107 | **Cuisine Delight** | cuisinedelight-1.1.18.jar | 1.1.18 | 中式料理扩展 | ✅ 有1.21.1 |
| 108 | **Cultural Delights** | culturaldelights-0.16.5.jar | 0.16.5 | 各国文化特色食物（寿司、墨西哥卷等） | ✅ 有NeoForge版 |
| 109 | **Display Delight** | displaydelight-1.4.0.jar | 1.4.0 | 食物展示/陈列 | ✅ 有1.21.1 |
| 110 | **Dumplings Delight** | Dumplings Delight-1.20.1-Forge-1.3.1.jar | 1.3.1 | 饺子/包子类食物 | 🔴 → 用 Dumplings Delight Rewrapped 替代 |
| 111 | **End's Delight** | ends_delight-2.5.1+forge.1.20.1.jar | 2.5.1 | 末地主题食物（紫颂果料理等） | ✅ 有NeoForge版 |
| 112 | **Farmer's Respite** | farmersrespite-1.20.1-2.1.2.jar | 2.1.2 | 茶饮/咖啡作物与饮品 | 🔴 **闭源模组**，无1.21分支 |
| 113 | **Festival Delicacies** | festival_delicacies-2.0.0-beta+forge.1.20.1.jar | 2.0.0-beta | 节日主题特色食物 | 🔴 确认无1.21.1 |
| 114 | **Fruits Delight** | fruitsdelight-1.1.1.jar | 1.1.1 | 各种水果种植与料理 | ✅ 有1.21.1 |
| 115 | **Frycook's Delight** | frycooks_delight-1.20.1-1.0.1.jar | 1.0.1 | 油炸/快餐风格食品 | 🔴 确认无1.21.1 |
| 116 | **KubeJS Delight** | kubejsdelight-1.20.1-1.1.5.jar | 1.1.5 | KubeJS对FD的脚本扩展 | ✅ 有1.21.1 |
| 117 | **Luncheon Meat's Delight** | luncheon-meat-s-delight-1.0.3-forge-1.20.1.jar | 1.0.3 | 午餐肉/肉类加工扩展 | ✅ 有1.21.1 |
| 118 | **Miner's Delight** | miners_delight-1.20.1-1.2.3.jar | 1.2.3 | 矿工主题食物（洞穴食材） | ✅ 有NeoForge版 |
| 119 | **My Nether's Delight** | MyNethersDelight-1.20.1-0.1.8.jar | 0.1.8 | 下界主题食物 | ✅ 有NeoForge版 |
| 120 | **Oceanic Delight** | oceanic_delight-1.0.3-forge-1.20.1.jar | 1.0.3 | 海洋主题食物 | 🔴 确认无1.21.1 |
| 121 | **Seasonals** | seasonals-1.20.1-5.0.2.jar | 5.0.2 | 季节性特色食物 | 🔴 确认无1.21.1版本 |
| 122 | **Silent's Delight** | silentsdelight-forge-1.0.1-1.20.1.jar | 1.0.1 | Silent系列模组联动 | 🔴 未找到1.21分支 |
| 123 | **Trail and Tales Delight** | trailandtales_delight-1.3-all.jar | 1.3 | 1.20考古/樱花主题联动食物 | ✅ 有1.21.1 |
| 124 | **Vintage Delight** | vintagedelight-0.1.6.jar | 0.1.6 | Vintage系列联动食物 | 🔴 未知 |
| 125 | **Dungeons Delight** | forge-dungeonsdelight-1.20.1-1.2.10.jar | 1.2.10 | 地下城主题食物 | ✅ 有1.21.1 |
| 126 | **Nether Vinery** | letsdo-nethervinery-forge-1.2.19.jar | 1.2.19 | 下界葡萄酒/葡萄园 (Let's Do系列) | 🔴 确认无1.21.1版本 |
| 127 | **Vinery** | letsdo-vinery-forge-1.4.41.jar | 1.4.41 | 葡萄酒/葡萄种植酿造 (Let's Do系列) | ✅ 有NeoForge版 |

---

## 四、应用能源2 & 存储科技 (AE2 + Storage Tech)

### 4.1 AE2 核心及附属

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 128 | **Applied Energistics 2** | appliedenergistics2-forge-15.4.10.jar | 15.4.10 | AE2数字存储/自动化核心 | ✅ 19.2.x (NeoForge) |
| 129 | **AE2 Network Analyzer** | AE2NetworkAnalyzer-1.20-1.0.6-forge.jar | 1.0.6 | AE2网络分析/诊断工具 | ✅ 有1.21.1 |
| 130 | **AE2 CT** | ae2ct-1.20.1-1.1.1.jar | 1.1.1 | AE2与CraftTweaker集成 | ✅ 有1.21.1 |
| 131 | **AE2 OmniCells** | ae2omnicells-1.20.1-forge-1.1.1.jar | 1.1.1 | 全能存储单元 | ✅ 有1.21.1 |
| 132 | **AE2 WTLib** | ae2wtlib-15.3.3-forge.jar | 15.3.3 | AE2无线终端库 | ✅ 有NeoForge版 |
| 133 | **Extended AE** | ExtendedAE-1.20-1.4.14-forge.jar | 1.4.14 | AE2扩展（更多存储组件/机器） | ✅ 有NeoForge版 |
| 134 | **Extended AE Plus** | extendedae_plus-1.5.3-fix.jar | 1.5.3-fix | ExtendedAE的进一步增强 | ✅ 有1.21.1 |
| 135 | **MEGA Cells** | megacells-forge-2.4.6-1.20.1.jar | 2.4.6 | 超大容量存储单元（MEGA级） | ✅ 有NeoForge版 |
| 136 | **Applied Create** | appliedcreate-1.20.1-1.1.4.jar | 1.1.4 | Create与AE2的机械联动 | ✅ 有1.21.1 |

### 4.2 存储模组

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 137 | **Functional Storage** | functionalstorage-1.20.1-1.2.13.jar | 1.2.13 | 抽屉式存储（Storage Drawers的精神续作） | ✅ 有NeoForge版 |
| 138 | **Sophisticated Backpacks** | sophisticatedbackpacks-1.20.1-3.24.35.1675.jar | 3.24.35 | 精妙背包，多层可升级背包系统 | ✅ 有NeoForge版 |
| 139 | **Sophisticated Core** | sophisticatedcore-1.20.1-1.3.21.1676.jar | 1.3.21 | Sophisticated系列模组核心库 | ✅ 有NeoForge版 |
| 140 | **Sophisticated Backpacks Create Integration** | sophisticatedbackpackscreateintegration-1.20.1-0.1.5.30.jar | 0.1.5 | 背包与Create的联动 | ✅ 有1.21.1 |
| 141 | **Lootr** | lootr-forge-1.20-0.7.35.94.jar | 0.7.35 | 每个玩家独立战利品箱（多人友好） | ✅ 有NeoForge版 |
| 142 | **Trash Cans** | trashcans-1.0.18b-forge-mc1.20.jar | 1.0.18b | 垃圾桶（液体/物品/能量） | ✅ 有NeoForge版 |
| 143 | **TrashSlot** | trashslot-forge-1.20.1-15.1.4.jar | 15.1.4 | 背包界面垃圾桶槽位 | ✅ 有NeoForge版 |

---

## 五、世界生成 & 结构 (World Generation & Structures)

### 5.1 地形/生物群系

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 144 | **Terralith** | Terralith_1.20.x_v2.5.4.jar | 2.5.4 | 95+全新生物群系，不添加新方块 | ✅ v2.5.8 (NeoForge) |
| 145 | **Tectonic** | tectonic-3.0.17-forge-1.20.1.jar | 3.0.17 | 地形生成大修（高山/深谷/大陆架） | ✅ v3.0.19 (NeoForge) |
| 146 | **BiomesPy** | biomespy-1.3.3-all.jar | 1.3.3 | 额外生物群系 | ✅ 有1.21.1 |
| 147 | **Lithostitched** | lithostitched-forge-1.20.1-1.4.11.jar | 1.4.11 | 地形/结构生成兼容层 | ✅ 有NeoForge版 |

### 5.2 世界结构

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 148 | **YUNG's Better Mineshafts** | YungsBetterMineshafts-1.20-Forge-4.0.4.jar | 4.0.4 | 更好的废弃矿井 | ✅ 有NeoForge版 |
| 149 | **YUNG's Better Witch Huts** | YungsBetterWitchHuts-1.20-Forge-3.0.3.jar | 3.0.3 | 更好的女巫小屋 | ✅ 有NeoForge版 |
| 150 | **YUNG's Better End Island** | YungsBetterEndIsland-1.20-Forge-2.0.6.jar | 2.0.6 | 更好的末地主岛 | ✅ 有NeoForge版 |
| 151 | **YUNG's Extras** | YungsExtras-1.20-Forge-4.0.3.jar | 4.0.3 | YUNG系列结构的额外配置 | ✅ 有NeoForge版 |
| 152 | **Towns and Towers** | Towns-and-Towers-1.12-Fabric+Forge.jar | 1.12 | 新的村镇和塔楼结构 | ✅ 有NeoForge版 |
| 153 | **Integrated API** | 在tegrated_api-1.7.4+1.20.1-forge.jar | 1.7.4 | 集成结构API | ✅ 有NeoForge版 |
| 154 | **Integrated Stronghold** | 在tegrated_stronghold-1.1.2+1.20.1-forge.jar | 1.1.2 | 改进的要塞结构 | ✅ 有NeoForge版 |
| 155 | **Integrated Villages** | 在tegrated_villages-1.3.2+1.20.1-forge.jar | 1.3.2 | 改进的村庄结构 | ✅ 有NeoForge版 |
| 156 | **IDAS** | idas_forge-1.13.0+1.20.1.jar | 1.13.0 | 集成地下城与结构 | ✅ 有NeoForge版 |
| 157 | **TOTW Modded** | totw_modded-forge-1.20.1-1.0.6.jar | 1.0.6 | 模组化的天空之城(Towers of the Wild) | ✅ 有1.21.1 |
| 158 | **Waystones** | waystones-forge-1.20.1-14.1.20.jar | 14.1.20 | 传送石碑，快速旅行 | ✅ 有NeoForge版 |
| 159 | **Bountiful** | Bountiful-6.0.4+1.20.1-forge.jar | 6.0.4 | 悬赏任务板系统（在世界中自然生成） | ✅ 有NeoForge版 |
| 160 | **CobbleForDays** | CobbleForDays-1.8.0.jar | 1.8.0 | 刷石机结构 | 🔴 确认无1.21.1（原作者分家问题） |

---

## 六、生物 & 怪物 (Mobs & Creatures)

### 6.1 Alex 系列模组

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 161 | **Alex's Mobs** | alexsmobs-1.22.9.jar | 1.22.9 | 89+种现实/幻想生物，最受欢迎的动物模组 | 🟡 非官方NeoForge移植 |
| 162 | **Alex's Caves** | alexscaves-2.0.2.jar | 2.0.2 | 5种全新地下洞穴生物群系 | 🟡 非官方NeoForge移植 |
| 163 | **Alex's Cave Addon** | alex_cave_addon-5.1.0-1.20.1.jar | 5.1.0 | Alex's Caves的附加内容 | 🔴 等待Alex's Caves移植 |

### 6.2 神话/奇幻生物

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 164 | **Ice and Fire** | iceandfire-2.1.13-1.20.1-beta-5.jar | 2.1.13-beta5 | 冰与火之歌，龙/海怪/蛇发女妖等神话生物 | 🟡 → IceAndFire Community Edition (CE) |
| 165 | **The Bumblezone** | the_bumblezone-7.11.1+1.20.1-forge.jar | 7.11.1 | 蜜蜂维度/蜂巢世界 | ✅ 有NeoForge版 |
| 166 | **Youkai's Homecoming** | youkaishomecoming-2.4.16.jar | 2.4.16 | 东方Project主题，妖怪/幻想乡 | 🟡 有1.21.1，但缺少战斗等内容 |
| 167 | **Youkai's Homecoming Curios** | youkaishomecoming_curios-0.03.jar | 0.03 | 妖怪归宅的Curios兼容 | 🔴 确认无1.21.1 |

### 6.3 原版生物改进

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 168 | **Creeper Overhaul** | creeperoverhaul-3.0.2-forge.jar | 3.0.2 | 各生物群系风格苦力怕变体 | ✅ 有NeoForge版 |
| 169 | **Improved Mobs** | improvedmobs-1.20.1-1.13.6-forge.jar | 1.13.6 | 增强生物AI/装备/行为 | ✅ 有1.21.1 |
| 170 | **BeeFix** | BeeFix-1.20-1.0.7.jar | 1.0.7 | 修复蜜蜂相关问题 | 🔴 → 用 Neo Bee Fix 替代 |
| 171 | **Jaden's Nether Expansion** | Jadens-Nether-Expansion-2.3.5.jar | 2.3.5 | 下界生物扩展 | ✅ 有1.21.1 |
| 172 | **Endergetic** | endergetic-1.20.1-5.0.1.jar | 5.0.1 | 末地生物群系/生物扩展 (TeamAbnormals) | 🔴 确认无1.21.1版本 |
| 173 | **Endertrigon** | endertrigon-1.20.1-1.1-all.jar | 1.1 | 末影龙战斗改进 | 🔴 确认无1.21.1 |
| 174 | **Neapolitan** | neapolitan-1.20.1-5.1.0.jar | 5.1.0 | 新增生物（如香蕉植物等）(TeamAbnormals) | ✅ 有1.21.1 |
| 175 | **Gateways to Eternity** | GatewaysToEternity-1.20.1-4.2.6.jar | 4.2.6 | 传送门刷怪挑战 | ✅ 有NeoForge版 |

---

## 七、QoL / UI / 辅助工具 (Quality of Life)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 176 | **JEI** | jei-1.20.1-forge-15.20.0.130.jar | 15.20.0 | Just Enough Items，物品配方查看 | ✅ 有NeoForge版 |
| 177 | **Jade** | Jade-1.20.1-Forge-11.13.2.jar | 11.13.2 | HUD信息显示（Waila/HWYLA的继任者） | ✅ 有NeoForge版 |
| 178 | **Jade Addons** | JadeAddons-1.20.1-Forge-5.5.0.jar | 5.5.0 | Jade的额外信息支持 | ✅ 有NeoForge版 |
| 179 | **One Enough Item** | OneEnoughItem-1.0.7-hotfix.jar | 1.0.7 | JEI的国产替代/补充 | ✅ 有1.21.1 |
| 180 | **One Enough Value** | OneEnoughValue-1.0.2.jar | 1.0.2 | 物品数值/信息显示 | ✅ 有1.21.1 |
| 181 | **JEED** | jeed-1.20-2.2.5.jar | 2.2.5 | Just Enough Effect Descriptions，药水效果说明 | ✅ 有1.21.1 |
| 182 | **Just Enough Breeding** | justenoughbreeding-forge-1.20-1.20.1-2.5.0.jar | 2.5.0 | 生物繁殖信息JEI集成 | ✅ 有1.21.1 |
| 183 | **Just Enough Couriers** | just_enough_couriers-1.0.1.jar | 1.0.1 | 包裹/Courier模组的JEI集成 | 🟡 制作组成员内容，后续可升级 |
| 184 | **AppleSkin** | appleskin-forge-mc1.20.1-2.5.1.jar | 2.5.1 | 食物饱和度/饥饿值详细显示 | ✅ 有NeoForge版 |
| 185 | **Enchantment Descriptions** | EnchantmentDescriptions-Forge-1.20.1-17.1.21.jar | 17.1.21 | 附魔描述显示 | ✅ 有NeoForge版 |
| 186 | **Controlling** | Controlling-forge-1.20.1-12.0.2.jar | 12.0.2 | 键位搜索/管理 | ✅ 有NeoForge版 |
| 187 | **Searchables** | Searchables-forge-1.20.1-1.0.3.jar | 1.0.3 | 搜索API，让所有GUI都有搜索框 | ✅ 有NeoForge版 |
| 188 | **Mouse Tweaks** | MouseTweaks-forge-mc1.20.1-2.25.1.jar | 2.25.1 | 鼠标快捷操作（拖拽/滚轮转移物品） | ✅ 有NeoForge版 |
| 189 | **Clumps** | Clumps-forge-1.20.1-12.0.0.4.jar | 12.0.0 | 经验球自动合并 | ✅ 有NeoForge版 |
| 190 | **Better Advancements** | BetterAdvancements-NeoForge-1.20.1-0.4.2.25.jar | 0.4.2.25 | 更好的成就界面 | ✅ 有NeoForge版 |
| 191 | **Advancement Plaques** | AdvancementPlaques-1.20.1-forge-1.6.9.jar | 1.6.9 | 成就达成时的弹窗特效 | ✅ 有1.21.1 |
| 192 | **Advancements Tracker** | advancements_tracker_1.20.1-6.1.0.jar | 6.1.0 | 成就追踪器 | 🔴 确认无1.21.1 |
| 193 | **Shoulder Surfing** | ShoulderSurfing-Forge-1.20.1-4.22.5.jar | 4.22.5 | 越肩视角（第三人称改进） | ✅ 有NeoForge版 |
| 194 | **Item Borders** | ItemBorders-1.20.1-forge-1.2.2.jar | 1.2.2 | 物品栏物品彩色边框（按稀有度） | ✅ 有NeoForge版 |
| 195 | **Obscure Tooltips** | obscure_tooltips-forge-1.20.1-3.10.0.jar | 3.10.0 | 物品提示框美化 | ✅ 有1.21.1 |
| 196 | **Colorful Hearts** | colorfulhearts-forge-1.20.1-4.3.16.jar | 4.3.16 | 多彩生命值心形显示 | ✅ 有NeoForge版 |
| 197 | **Overloaded Armor Bar** | overloadedarmorbar-1.20.1-1.jar | 1 | 更好的护甲条显示 | ✅ 有NeoForge版 |
| 198 | **Enhanced Boss Bars** | enhanced_boss_bars-1.20.1-1.0.0.jar | 1.0.0 | 增强BOSS血条显示 | ✅ 有1.21.1 |
| 199 | **Advanced Loot Info** | AdvancedLootInfo-forge-1.20.1-1.9.0.jar | 1.9.0 | 高级战利品信息显示 | ✅ 有1.21.1 |
| 200 | **Tips** | Tips-Forge-1.20.1-12.1.9.jar | 12.1.9 | 加载界面随机提示 | ✅ 有NeoForge版 |
| 201 | **Traveler's Titles** | TravelersTitles-1.20-Forge-4.0.2.jar | 4.0.2 | 进入新区域时显示大字标题 | 🔴 → 第三方修复版（修复Waystones传送bug） |
| 202 | **Chat Heads** | chat_heads-0.15.1-forge-1.20.jar | 0.15.1 | 聊天消息显示玩家头像 | ✅ 有NeoForge版 |
| 203 | **No Chat Reports** | NoChatReports-FORGE-1.20.1-v2.2.2.jar | 2.2.2 | 禁用微软聊天举报系统 | ✅ 有NeoForge版 |
| 204 | **Pick Up Notifier** | PickUpNotifier-v8.0.0-1.20.1-Forge.jar | 8.0.0 | 拾取物品通知显示 | ✅ 有NeoForge版 |
| 205 | **Visual Keybinder** | visual_keybinder-1.20.1 - 0.1.12.jar | 0.1.12 | 可视化键位绑定 | ✅ 有1.21.1 |
| 206 | **MineMenu** | MineMenu-1.20.1-1.12.3.jar | 1.12.3 | 圆形快捷菜单 | ✅ 有NeoForge版 |
| 207 | **Better Compatibility Checker** | BetterCompatibilityChecker-3.0.1-build.58+mc1.20.jar | 3.0.1 | 模组兼容性检查 | ✅ 有NeoForge版 |
| 208 | **Catalogue** | catalogue-forge-1.20.1-1.8.0.jar | 1.8.0 | 更好的模组列表界面 | ✅ 有NeoForge版 |
| 209 | **Configured** | configured-forge-1.20.1-2.2.3.jar | 2.2.3 | 游戏内模组配置菜单 | ✅ 有NeoForge版 |
| 210 | **Yet Another Config Lib V3** | yet_another_config_lib_v3-3.6.6+1.20.1-forge.jar | 3.6.6 | 又一个配置库V3 | ✅ 有NeoForge版 |
| 211 | **Yeetus Experimentus** | YeetusExperimentus-Forge-2.3.1-build.6+mc1.20.1.jar | 2.3.1 | 禁用实验性设置警告 | ✅ 有1.21.1 |
| 212 | **SolCarrot** | solcarrot-1.20.1-1.15.1.jar | 1.15.1 | 多样化饮食奖励系统 | 🔴 确认无1.21.1版本 |
| 213 | **SolApplePie** | solapplepie-1.20.1-2.3.0.jar | 2.3.0 | SolCarrot的AppleSkin兼容扩展 | 🔴 确认无1.21.1版本 |
| 214 | **AlwaysEat** | AlwaysEat-5.2.jar | 5.2 | 饱食度满时也能吃东西 | 🔴 → Always Eat 替代 |
| 215 | **Toast Control** | (可能为内置) | - | Toast消息控制 | - |
| 216 | **General Feedback** | GeneralFeedback-1.0.1.jar | 1.0.1 | 通用反馈信息收集 | ✅ 有1.21.1 |
| 217 | **Trade Refresh** | traderefresh-2.5.1.jar | 2.5.1 | 村民交易刷新 | ✅ 有1.21.1 |
| 218 | **Construction Wand** | constructionwand-1.20.1-2.11.jar | 2.11 | 建筑魔杖（快速批量放置方块） | 🔴 → 用 Construction Wands Revived 替代 |
| 219 | **Harium** | Harium-mc1.20.1-1.0.0.jar | 1.0.0 | 辅助工具模组（锂的分支版本） | 🟡 可用锂替代 |
| 220 | **MoesTweaks** | moestweaks-forge-1.20.1-1.1.2.jar | 1.1.2 | 微调/优化 | 🔴 确认无1.21.1 |

---

## 八、性能优化 (Performance)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 221 | **Embeddium** | embeddium-0.3.31+mc1.20.1.jar | 0.3.31 | Sodium的Forge移植，大幅提升FPS | 🟡 可直接用钠 |
| 222 | **Oculus** | oculus-mc1.20.1-1.8.0.jar | 1.8.0 | Iris的Forge移植，光影支持 | 🔴 → 1.21.1 用 Iris Shaders 替代 |
| 223 | **ModernFix** | modernfix-forge-5.27.8+mc1.20.1.jar | 5.27.8 | 全面性能修复（加载/内存/tick） | ✅ 有NeoForge版 |
| 224 | **FerriteCore** | ferritecore-6.0.1-forge.jar | 6.0.1 | 内存使用优化 | ✅ 有NeoForge版 |
| 225 | **Entity Culling** | entityculling-forge-1.10.1-mc1.20.1.jar | 1.10.1 | 不可见实体不渲染，提升FPS | ✅ 有NeoForge版 |
| 226 | **CullLessLeaves Reforged** | CullLessLeaves-Reforged-1.20.1-1.0.5.jar | 1.0.5 | 树叶剔除优化 | 🔴 → 用 钠：树叶剔除 替代 |
| 227 | **Dynamic FPS** | dynamic-fps-3.11.4+minecraft-1.20.0-forge.jar | 3.11.4 | 后台时降低FPS | ✅ 有NeoForge版 |
| 228 | **FastBoot** | fastboot-1.20.x-1.2.jar | 1.2 | 加速Minecraft启动 | ✅ 有1.21.1 |
| 229 | **Flerovium** | flerovium-forge-1.20.1-1.2.18-all.jar | 1.2.18 | 渲染优化 | ✅ 有1.21.1 |
| 230 | **Krypton FNP** | Krypton FNP-forge-1.20.1-0.2.28.2-1.20.1.jar | 0.2.28.2 | 网络堆栈优化 | ✅ 有1.21.1 |
| 231 | **Packet Fixer** | packetfixer-3.3.2-1.18-1.20.4-merged.jar | 3.3.2 | 网络数据包修复 | ✅ 有NeoForge版 |
| 232 | **ServerCore** | servercore-forge-1.5.2+1.20.1.jar | 1.5.2 | 服务器性能优化 | ✅ 有NeoForge版 |
| 233 | **Neruina** | neruina-3.2.2+1.20.1-forge.jar | 3.2.2 | 防止tick错误导致崩溃 | ✅ 有NeoForge版 |
| 234 | **Observable** | observable-4.4.2.jar | 4.4.2 | 性能分析工具（显示卡顿源） | ✅ 有NeoForge版 |
| 235 | **Spark** | spark-1.10.53-forge.jar | 1.10.53 | 性能分析器（CPU/RAM/TPS） | ✅ 有NeoForge版 |
| 236 | **Accelerated Rendering** | acceleratedrendering-1.0.7-1.20.1-alpha.jar | 1.0.7-alpha | 渲染加速 | ✅ 有1.21.1 |
| 237 | **Sodium Extras** | sodiumextras-forge-1.0.7-1.20.1.jar | 1.0.7 | Embeddium的额外功能配置 | ✅ 有1.21.1 |
| 238 | **Canary** | (已移除) | - | 服务器性能优化 | - |
| 239 | **Smooth Boot** | (无) | - | 平滑启动 | - |
| 240 | **AttributeFix** | AttributeFix-Forge-1.20.1-21.0.5.jar | 21.0.5 | 修复属性上限问题 | ✅ 有NeoForge版 |
| 241 | **PolyEng** | polyeng-forge-0.1.1-1.20.1.jar | 0.1.1 | 多态引擎优化 | ✅ 有1.21.1 |

---

## 九、FTB 套件 & 任务系统 (FTB Suite & Questing)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 242 | **FTB Library** | ftb-library-forge-2001.2.12.jar | 2001.2.12 | FTB系列模组核心库 | ✅ 有NeoForge版 |
| 243 | **FTB Teams** | ftb-teams-forge-2001.3.2.jar | 2001.3.2 | FTB团队系统 | ✅ 有NeoForge版 |
| 244 | **FTB Quests** | ftb-quests-forge-2001.4.21.jar | 2001.4.21 | FTB任务系统 | ✅ 有NeoForge版 |
| 245 | **FTB Chunks** | ftb-chunks-forge-2001.3.6.jar | 2001.3.6 | FTB领地/区块管理 | ✅ 有NeoForge版 |
| 246 | **FTB Essentials** | ftb-essentials-forge-2001.2.4.jar | 2001.2.4 | FTB基础命令 | ✅ 有NeoForge版 |
| 247 | **FTB Ranks** | ftb-ranks-forge-2001.1.7.jar | 2001.1.7 | FTB权限/等级系统 | ✅ 有NeoForge版 |
| 248 | **FTB Ultimine** | ftb-ultimine-forge-2001.1.7.jar | 2001.1.7 | 连锁挖矿 | ✅ 有NeoForge版 |
| 249 | **FTB XMod Compat** | ftb-xmod-compat-forge-2.1.3.jar | 2.1.3 | FTB与其他模组的兼容层 | ✅ 有NeoForge版 |
| 250 | **FTB Quest Localizer** | ftbquestlocalizer-1.20.1-forge-3.2.3.jar | 3.2.3 | FTB任务本地化工具 | 🔴 确认无1.21.1（替代见MC百科评论区） |
| 251 | **FTB Xaero Compat** | ftbxaerocompat-forge-1.1.3.jar | 1.1.3 | FTB与Xaero地图兼容 | ✅ 有1.21.1 |
| 252 | **Quests Additions** | questsadditions-1.4.7.jar | 1.4.7 | FTB任务扩展 | 🔴 确认无1.21.1版本 |
| 253 | **Certain Questing Additions** | certain_questing_additions-forge-1.1.6+mc1.20.1.jar | 1.1.6 | 更多任务功能 | ✅ 有1.21.1 |
| 254 | **Item Filters** | item-filters-forge-2001.1.0-build.59.jar | 2001.1.0 | 物品过滤系统（FTB依赖） | 🔴 → 用 FTB Filter System 替代 |

---

## 十、建筑 & 装饰 (Building & Decoration)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 255 | **Supplementaries** | supplementaries-1.20-3.1.42-forge.jar | 3.1.42 | 补充装饰/功能方块（绳索、灯笼、路标等） | ✅ v3.5.16 (NeoForge) |
| 256 | **Amendments** | amendments-1.20-2.2.5.jar | 2.2.5 | Supplementaries的扩展/补充 | ✅ 有NeoForge版 |
| 257 | **Quark** | Quark-4.0-462.jar | 4.0-462 | 全面原版增强（建筑/生物/功能） | ✅ 4.1-476 alpha (NeoForge) |
| 258 | **Quark Oddities** | QuarkOddities-1.20.1.jar | 1.20.1 | Quark的额外功能模块 | ✅ 有1.21.1 |
| 259 | **Dramatic Doors** | DramaticDoors-QuiFabrge-1.20.1-3.3.3.jar | 3.3.3 | 高大的门（3格高） | ✅ 有NeoForge版 |
| 260 | **Refurbished Furniture** | refurbished_furniture-forge-1.20.1-1.0.20.jar | 1.0.20 | 翻新家具 | ✅ 有1.21.1 |
| 261 | **Interiors** | interiors-1.20.1-forge-0.6.0.jar | 0.6.0 | 室内装饰扩展 | ✅ 有1.21.1 |
| 262 | **Create: Deco** | createdeco-2.0.3-1.20.1-forge.jar | 2.0.3 | Create风格装饰方块 | ✅ 有NeoForge版 |
| 263 | **Copycats+** | copycats-3.0.7+mc.1.20.1-forge.jar | 3.0.7 | 材质复制装饰方块 | ✅ 有NeoForge版 |
| 264 | **Curious Lanterns** | curiouslanterns-1.20.1-1.3.7.jar | 1.3.7 | 更多灯笼变体 | 🔴 替代品需Lambd动态光源（含强制内容），不推荐 |
| 265 | **Immersive Paintings** | immersive_paintings-0.6.11+1.20.1-forge.jar | 0.6.11 | 自定义画作（可导入任意图片） | ✅ 有NeoForge版 |
| 266 | **Kaleidoscope Doll** | kaleidoscopedoll-1.3.1-forge+mc1.20.1.jar | 1.3.1 | 万花筒人偶/装饰 | ✅ 有1.21.1 |
| 267 | **Simple Hats** | simplehats-forge-1.20.1-0.4.0a.jar | 0.4.0a | 简单帽子装饰 | ✅ 有1.21.1 |
| 268 | **Cosmetic Armor Reworked** | cosmeticarmorreworked-1.20.1-v1a.jar | v1a | 时装盔甲（外观覆盖） | ✅ 有NeoForge版 |
| 269 | **Supplementary** | (与Supplementaries合并) | - | - | - |
| 270 | **FreeCam** | (可能未安装) | - | 自由视角 | - |

---

## 十一、战斗 & 装备 (Combat & Equipment)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 271 | **Tetra** | tetra-1.20.1-6.11.0.jar | 6.11.0 | 模块化工具/武器打造系统 | 🔴 无1.21.1计划（最大缺口之一） |
| 272 | **Tetracelium** | tetracelium-1.20.1-1.3.1.jar | 1.3.1 | Tetra与Create材料联动 | 🔴 等待Tetra更新 |
| 273 | **Tetra Compat** | tetracompat-1.0.0-all.jar | 1.0.0 | Tetra兼容性扩展 | 🔴 等待Tetra更新 |
| 274 | **Tetratic Combat Expanded** | tetratic-combat-expanded-1.20-2.8.3.jar | 2.8.3 | Tetra战斗扩展 | 🔴 等待Tetra更新 |
| 275 | **Better Combat** | bettercombat-forge-1.9.0+1.20.1.jar | 1.9.0 | 更好的战斗动画/连击系统 | ✅ 有NeoForge版 |
| 276 | **Art of Forging** | art_of_forging-1.8.4-1.20.1.jar | 1.8.4 | 锻造艺术/武器定制 | 🔴 确认无1.21.1 |
| 277 | **Apothic Attributes** | ApothicAttributes-1.20.1-1.3.7.jar | 1.3.7 | Apotheosis的属性系统独立版 | ✅ 有NeoForge版 |
| 278 | **Dreadsteel** | dreadsteel-1.20.1-1.2.0.jar | 1.2.0 | 恐惧钢装备 | 🔴 确认无1.21.1 |
| 279 | **Radiant Gear** | radiantgear-forge-2.2.0+1.20.1.jar | 2.2.0 | 光辉装备（Curios饰品扩展） | 🔴 替代方案Lambd动态光源含强制内容，谨慎选择 |
| 280 | **Accessories** | accessories-neoforge-1.0.0-beta.48+1.20.1.jar | 1.0.0-beta.48 | 饰品/配件系统（Curios的现代替代） | ✅ 有NeoForge版 |
| 281 | **Caelus** | caelus-forge-3.2.0+1.20.1.jar | 3.2.0 | 鞘翅API | ✅ 有NeoForge版 |
| 282 | **Elytra Slot** | elytraslot-forge-6.4.4+1.20.1.jar | 6.4.4 | 鞘翅独立槽位（Curios兼容） | ✅ 有NeoForge版 |
| 283 | **Charm of Undying** | charmofundying-forge-6.5.0+1.20.1.jar | 6.5.0 | 不死图腾饰品化（Curios槽位） | ✅ 有NeoForge版 |
| 284 | **Comforts** | comforts-forge-6.4.0+1.20.1.jar | 6.4.0 | 睡袋/吊床（不设重生点） | ✅ 有NeoForge版 |
| 285 | **Carry On** | carryon-forge-1.20.1-2.1.2.7.jar | 2.1.2.7 | 徒手搬运方块/生物 | ✅ 有NeoForge版 |
| 286 | **VVAddon** | vvaddon-1.20.1-alpha3.0.1.jar | alpha3.0.1 | Tetra强化属性拓展 | 🔴 确认无1.21.1 |

---

## 十二、科技 & 工业 (Tech & Industry)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 287 | **Industrial Platform** | Industrial Platform-1.20.1-1.7.0.jar | 1.7.0 | 工业平台/机械 | ✅ 有1.21.1 |
| 288 | **Create: Crafts & Additions** | createaddition-1.20.1-1.3.3.jar | 1.3.3 | FE电力系统 | ✅ 有NeoForge版 |
| 289 | **Create: Diesel Generators** | createdieselgenerators-1.20.1-1.3.12.jar | 1.3.12 | 柴油发电 | ✅ 有NeoForge版 |
| 290 | **Create: New Age** | create-new-age-1.1.7f+forge-mc1.20.1.jar | 1.1.7f | 核电/清洁能源 | ✅ 有NeoForge版 |
| 291 | **Botarium** | botarium-forge-1.20.1-2.3.4.jar | 2.3.4 | 植物科技（疑似无用模组） | 🔴 确认无1.21.1 |
| 292 | **Torchmaster** | torchmaster-20.1.9.jar | 20.1.9 | 高级火把（阻止刷怪） | ✅ 有NeoForge版 |
| 293 | **LCTech** | lctech-1.20.1-0.2.2.7.jar | 0.2.2.7 | 科技扩展 | ✅ 有1.21.1 |

---

## 十三、魔法 & 奇幻 (Magic & Fantasy)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 294 | **Prism** | Prism-1.20.1-forge-1.0.5.jar | 1.0.5 | 棱镜魔法 | ✅ 有1.21.1 |
| 295 | **Icterine** | Icterine-forge-1.20.0-1-1.3.0.jar | 1.3.0 | 魔法扩展 | 🔴 未知 |
| 296 | **Gateways to Eternity** | GatewaysToEternity-1.20.1-4.2.6.jar | 4.2.6 | 传送门挑战 | ✅ 有NeoForge版 |
| 297 | **Soul Fire'd** | soul-fire-d-forge-1.20.1-4.0.11.jar | 4.0.11 | 灵魂火扩展 | ✅ 有NeoForge版 |
| 298 | **Ice and Fire** | iceandfire-2.1.13-1.20.1-beta-5.jar | 2.1.13-beta5 | 神话生物/龙 | 🟡 CE版有NeoForge版 |
| 299 | **Youkai's Homecoming** | youkaishomecoming-2.4.16.jar | 2.4.16 | 东方Project/妖怪 | 🟡 有1.21.1，但缺失战斗等内容 |
| 300 | **Custom Portal API** | customportalapi-0.0.1-forge-1.20.jar | 0.0.1 | 自定义传送门API | 🔴 → 用 Custom Portal API Reforged 替代 |

---

## 十四、季节 & 环境 (Seasons & Environment)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 301 | **Ecliptic Seasons** | EclipticSeasons-1.20.1-forge-0.12.18.9.1-all.jar | 0.12.18.9.1 | 四季系统（温度/作物生长变化） | ✅ 有NeoForge版 |
| 302 | **SeasonHUD** | seasonhud-forge-1.20.1-2.0.4.jar | 2.0.4 | 季节HUD指示器 | ✅ 有NeoForge版 |
| 303 | **Dynamic Surroundings** | (可能为替代品) | - | 环境音效/视觉效果 | - |
| 304 | **Presence Footsteps** | PresenceFootsteps-1.20.1-1.9.1-beta.1 (1).jar | 1.9.1-beta.1 | 脚步声增强（不同方块不同音效） | ✅ 有NeoForge版 |
| 305 | **ItemPhysic Lite** | ItemPhysicLite_FORGE_v1.6.6_mc1.20.1.jar | 1.6.6 | 物品物理（掉落物3D/滚动） | ✅ 有NeoForge版 |
| 306 | **Dynamic Crosshair** | dynamiccrosshair-9.10+1.20.1-forge.jar | 9.10 | 动态准星（根据指向方块/实体变化） | ✅ 有NeoForge版 |

---

## 十五、KubeJS 脚本生态 (Scripting)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 307 | **KubeJS** | kubejs-forge-2001.6.5-build.16.jar | 2001.6.5 | JavaScript脚本引擎，可自定义几乎所有内容 | ✅ 有NeoForge版 |
| 308 | **Rhino** | rhino-forge-2001.2.3-build.10.jar | 2001.2.3 | KubeJS的JavaScript运行时 | ✅ 有NeoForge版 |
| 309 | **KubeJS Create** | kubejs-create-forge-2001.3.0-build.8.jar | 2001.3.0 | KubeJS对Create的API扩展 | ✅ 有NeoForge版 |
| 310 | **KubeJS Delight** | kubejsdelight-1.20.1-1.1.5.jar | 1.1.5 | KubeJS对Farmer's Delight的API | ✅ 有1.21.1 |
| 311 | **PonderJS** | ponderjs-1.20.1-2.1.0.jar | 2.1.0 | KubeJS对Create Ponder的脚本化 | ✅ 有1.21.1 |
| 312 | **PowerfulJS** | powerfuljs-1.6.1.jar | 1.6.1 | KubeJS增强 | ✅ 有1.21.1 |
| 313 | **ProbeJS** | probejs-6.0.1-forge.jar | 6.0.1 | KubeJS自动补全/文档生成 | ✅ 有NeoForge版 |
| 314 | **Vintage KubeJS** | vintage_kubejs-1.20.1-1.0.0rc-2.jar | 1.0.0rc-2 | Vintage系列KubeJS集成 | 🔴 确认无1.21.1 |
| 315 | **MoreJS** | morejs-forge-1.20.1-0.10.1.jar | 0.10.1 | KubeJS更多功能 | ✅ 有1.21.1 |
| 316 | **RenderJS** | renderjs-forge-2001.2.1.jar | 2001.2.1 | KubeJS渲染扩展 | ✅ 有1.21.1 |
| 317 | **LootJS** | lootjs-forge-1.20.1-2.13.1.jar | 2.13.1 | KubeJS战利品表修改 | ✅ 有NeoForge版 |

---

## 十六、地图 & 导航 (Map & Navigation)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 318 | **Xaero's Minimap** | xaerominimap-forge-1.20.1-25.3.10.jar | 25.3.10 | 小地图 | ✅ 有NeoForge版 |
| 319 | **Xaero's World Map** | xaeroworldmap-forge-1.20.1-1.40.11.jar | 1.40.11 | 世界地图（全屏大地图） | ✅ 有NeoForge版 |
| 320 | **Xaero's Waystones Compat** | xaeros_waystones_compatibility-1.1 - 1.20.1.jar | 1.1 | Xaero地图与Waystones联动 | ✅ 有1.21.1 |
| 321 | **FTB Xaero Compat** | ftbxaerocompat-forge-1.1.3.jar | 1.1.3 | FTB与Xaero兼容 | ✅ 有1.21.1 |
| 322 | **Nature's Compass** | NaturesCompass-1.20.1-1.12.0-forge.jar | 1.12.0 | 自然指南针（搜索生物群系） | ✅ 有NeoForge版 |
| 323 | **Explorer's Compass** | ExplorersCompass-1.20.1-1.4.0-forge.jar | 1.4.0 | 探索者指南针（搜索结构） | ✅ 有NeoForge版 |

---

## 十七、服务器 & 管理工具 (Server & Admin)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 324 | **Simple Backups** | SimpleBackups-1.20.1-3.1.24.jar | 3.1.24 | 自动备份（服务器必备） | ✅ 有NeoForge版 |
| 325 | **Spark** | spark-1.10.53-forge.jar | 1.10.53 | 性能分析器 | ✅ 有NeoForge版 |
| 326 | **Observable** | observable-4.4.2.jar | 4.4.2 | 性能分析 | ✅ 有NeoForge版 |
| 327 | **FTB Chunks** | ftb-chunks-forge-2001.3.6.jar | 2001.3.6 | 领地保护 | ✅ 有NeoForge版 |
| 328 | **FTB Ranks** | ftb-ranks-forge-2001.1.7.jar | 2001.1.7 | 权限管理 | ✅ 有NeoForge版 |
| 329 | **FTB Essentials** | ftb-essentials-forge-2001.2.4.jar | 2001.2.4 | 服务器管理命令 | ✅ 有NeoForge版 |
| 330 | **MC Wifi PnP** | mcwifipnp-1.7.6-1.20.1-forge.jar | 1.7.6 | 局域网即插即用联机 | ✅ 有1.21.1 |
| 331 | **World Preview** | world_preview-forge-1.20.1-1.3.1.jar | 1.3.1 | 世界创建前预览 | 🔴 → 用 World Preview NeoForged 替代 |
| 332 | **No Chat Reports** | NoChatReports-FORGE-1.20.1-v2.2.2.jar | 2.2.2 | 禁用聊天举报 | ✅ 有NeoForge版 |

---

## 十八、杂项 (Miscellaneous)

| 序号 | 模组名称 | 文件名 | 版本 | 功能说明 | 1.21.1状态 |
|------|---------|--------|------|---------|-----------|
| 333 | **0World2Create** | 0World2Create-Universal-1.19-1.20.X-1.0.0.jar | 1.0.0 | 存档转换工具 | 🟡 确认无1.21.1（有refoxed版） |
| 334 | **Custom Skin Loader** | CustomSkinLoader_ForgeV2-14.28.jar | 14.28 | 自定义皮肤加载（离线皮肤） | ✅ 有NeoForge版 |
| 335 | **Skin Layers 3D** | skinlayers3d-forge-1.11.1-mc1.20.1.jar | 1.11.1 | 3D皮肤层渲染 | ✅ 有NeoForge版 |
| 336 | **Drippy Loading Screen** | drippyloadingscreen_forge_3.0.12_MC_1.20.1.jar | 3.0.12 | 自定义加载界面 | ✅ 有1.21.1 |
| 337 | **FancyMenu** | fancymenu_forge_3.7.0_MC_1.20.1.jar | 3.7.0 | 自定义主菜单 | ✅ 有NeoForge版 |
| 338 | **Resourcify** | Resourcify (1.20.1-forge)-1.8.1.jar | 1.8.1 | 资源包管理 | ✅ 有1.21.1 |
| 339 | **Screenshot Viewer** | screenshot_viewer-1.3.2-forge-mc1.20.1.jar | 1.3.2 | 游戏内截图查看 | ✅ 有1.21.1 |
| 340 | **NetMusic** | netmusic-1.4.0-forge+mc1.20.1.jar | 1.4.0 | 网络音乐播放器 | ✅ 有1.21.1 |
| 341 | **EuphoriaPatcher** | EuphoriaPatcher-1.8.5-r5.7.1-forge.jar | 1.8.5 | 补丁/修复工具 | ✅ 有1.21.1 |
| 342 | **IMBlocker** | IMBlocker-5.5.0-forge+1.17-1.20.4.jar | 5.5.0 | 输入法冲突修复 | ✅ 有NeoForge版 |
| 343 | **JEChara​​cters** | jecharacters-1.20.1-forge-4.6.3.jar | 4.6.3 | 中日韩字符输入支持 | ✅ 有NeoForge版 |
| 344 | **TrueUUID** | trueuuid-1.0.5.jar | 1.0.5 | UUID修复 | ✅ 有1.21.1 |
| 345 | **SQLite JDBC** | sqlite-jdbc-3.36.0.3+20211227-all.jar | 3.36.0.3 | SQLite数据库驱动 | 🔴 未找到1.21相关分支 |
| 346 | **ZstdNet** | zstdnet-1.20.1-forge-1.3.9.jar | 1.3.9 | Zstd压缩网络传输 | ✅ 有1.21.1 |
| 347 | **DSBG** | dsbg-1.0-1.20.1.jar | 1.0.0 | 未知功能 | ✅ 有1.21.1 |
| 348 | **hotai** | hotai-1.0.jar | 1.0 | 未知功能 | ✅ 有1.21.1 |
| 349 | **Fragmentum** | fragmentum-forge-1.20.1-1.1.4.jar | 1.1.4 | 碎片/残片系统 | 🟡 → Fragmentum (NeoForge) 官方版 |
| 350 | **Lucent** | lucent-1.20.1-1.5.5.jar | 1.5.5 | 光照/视觉效果增强 | 🔴 确认无1.21.1 |
| 351 | **Kinetic Pixel** | kinetic_pixel-1.0.3-forge-1.20.1.jar | 1.0.3 | 像素渲染 | 🔴 未知 |
| 352 | **Extra Gauges** | extra_gauges-2.0.7.jar | 2.0.7 | 额外仪表/测量工具 | ✅ 有1.21.1 |
| 353 | **GuideME** | guideme-20.1.14.jar | 20.1.14 | 游戏内指南系统 | ✅ 有NeoForge版 |
| 354 | **Polymorph** | polymorph-forge-0.49.10+1.20.1.jar | 0.49.10 | 配方冲突解决UI | ✅ 有NeoForge版 |
| 355 | **Dummmmmmy** | dummmmmmy-1.20-2.0.9.jar | 2.0.9 | 测试假人（伤害测试靶子） | ✅ 有1.21.1 |

---

## 十九、特殊模组说明

### 模组 (TACZ)
- **TACZ** (`tacz-1.20.1-1.1.4-hotfix-all.jar`) — 永恒枪械工坊：零，高质量枪械模组
- 1.21.1替代：→ **Gunsmith Lib**（v5.1.2+分内置/非内置版，非内置版需额外安装TaCZ NeoForge Port）
- **TACZ Addon** (`taczaddon-1.20.1-1.1.4-for1.1.4.jar`) — TACZ附加内容

### 轻型货币 (Lightman's Currency)
- `lightmanscurrency-1.20.1-2.3.0.4e.jar` — 完整的货币/交易/商店系统
- 1.21.1状态：✅ 有1.21.1

### 更多飞机 (Man of Many Planes)
- `man_of_many_planes-0.2.0+1.20.1-forge.jar` — 可驾驶飞机
- 1.21.1状态：✅ 有1.21.1

### 沉浸式飞机 (Immersive Aircraft)
- `immersive_aircraft-1.4.0+1.20.1-forge.jar` — 沉浸式飞行器
- 1.21.1状态：✅ 有NeoForge版

### 一些组装要求 (Some Assembly Required)
- `some-assembly-required-1.20.1-4.2.3.jar` — 三明治定制制作
- 1.21.1状态：✅ 有1.21.1

---

## 统计总结

### 按类别统计
| 类别 | 数量 | 占比 |
|------|------|------|
| 核心/API/库依赖 | 44 | 12.4% |
| Create 机械动力及附属 | 48 | 13.6% |
| Farmer's Delight & 食物 | 35 | 9.9% |
| AE2 & 存储科技 | 16 | 4.5% |
| 世界生成 & 结构 | 17 | 4.8% |
| 生物 & 怪物 | 15 | 4.2% |
| QoL / UI / 辅助 | 45 | 12.7% |
| 性能优化 | 21 | 5.9% |
| FTB 套件 & 任务 | 13 | 3.7% |
| 建筑 & 装饰 | 16 | 4.5% |
| 战斗 & 装备 | 16 | 4.5% |
| 科技 & 工业 | 7 | 2.0% |
| 魔法 & 奇幻 | 7 | 2.0% |
| 季节 & 环境 | 6 | 1.7% |
| KubeJS 脚本 | 11 | 3.1% |
| 地图 & 导航 | 6 | 1.7% |
| 服务器 & 管理 | 9 | 2.5% |
| 杂项 | 22 | 6.2% |

### 1.21.1 升级状态统计（用户确认修正）

| 状态 | 数量 | 占比 |
|------|------|------|
| ✅ 已有1.21.1版本 | ~294 | ~83% |
| 🟡 有明确替代方案 / 非官方移植 | ~20 | ~6% |
| 🔴 确认无1.21.1版本 | 41 | 12% |

---

## 二十、确认无1.21.1版本的完整清单（41项）

> 来源: `ls/mods_missing_1211_neoforge_v3.txt` — CurseForge/Modrinth API扫描结果

| # | 模组 | 备注/替代方案 |
|---|------|-------------|
| 1 | 0World2Create | 有refoxed版 |
| 2 | AlwaysEat | → Always Eat 替代 |
| 3 | Cave Delight | 无 |
| 4 | CobbleForDays | Forge原作者分家问题 |
| 5 | CullLessLeaves Reforged | → 钠：树叶剔除 |
| 6 | Harium | → 可用锂替代 |
| 7 | Icterine | → Cerulean替代（前置稳定性存疑） |
| 8 | OneEnoughValue | 无 |
| 9 | Advancements Tracker | 无 |
| 10 | Alex Cave Addon | 等待Alex's Caves移植 |
| 11 | Art of Forging | 无 |
| 12 | Botarium | **疑似无用模组** |
| 13 | Cosmopolitan | 无 |
| 14 | CreateBiggerStorageToCreate6 | → Create: Bigger Storage [NeoFork] |
| 15 | CreateFluidStuffs | 已完成迁移 |
| 16 | Curious Lanterns | 替代需Lambd动态光源（含强制内容） |
| 17 | Dreadsteel | 无 |
| 18 | Endergetic | 无 |
| 19 | Ender Trigon | 无 |
| 20 | Festival Delicacies | 无 |
| 21 | Frycook's Delight | 无 |
| 22 | FTB Quests Localizer | → 见MC百科评论区替代方案 |
| 23 | Item Filters | → FTB Filter System |
| 24 | Just Enough Couriers | 无 |
| 25 | Kinetic Pixel | 无 |
| 26 | Lucent | Lambd替代品含强制内容 |
| 27 | MoesTweaks | 无 |
| 28 | Multiblocked2 | 无 |
| 29 | Northstar Curios Compat | 无 |
| 30 | Oceanic Delight | 无 |
| 31 | Quests Additions | 无 |
| 32 | Seasonals | 无 |
| 33 | SolApplePie | 无 |
| 34 | SolCarrot | 无 |
| 35 | TACZ Addon | 等待TACZ主模组更新 |
| 36 | Tetracelium | Tetra前置无1.21 |
| 37 | Tetra Compat | Tetra前置无1.21 |
| 38 | Tetratic Combat Expanded | Tetra前置无1.21 |
| 39 | Vintage KubeJS | 无 |
| 40 | Vintage Delight | 无 |
| 41 | VVAddon | 无 |

---

## 二十一、需更换模组详细方案（30项）

> 来源: `ls/需更换模组.txt` — 人工整理的替换方案

| # | 原模组 | → 替代模组 | 备注 |
|---|--------|----------|------|
| 1 | Bee Fix | Neo Bee Fix | CF上有 |
| 2 | Create: Better Storages | Create: Bigger Storage [NeoFork] | |
| 3 | Create Utilities J | ✅ 作者是Create开发组成员，可向上移植 | 无需替代 |
| 4 | Dumplings Delight | Dumplings Delight Rewrapped | |
| 5 | Steam 'n' Rails | Steam 'n' Rails NeoForge | 官方移植版 |
| 6 | Travelers Titles | 第三方修复版 | 修复Waystones传送bug |
| 7 | YUNG's API | YUNG's API (NeoForge) | |
| 8 | YUNG's Better End Island | YUNG's Better End Island (NeoForge) | |
| 9 | YUNG's Better Mineshafts | YUNG's Better Mineshafts (NeoForge) | |
| 10 | YUNG's Better Witch Huts | YUNG's Better Witch Huts (NeoForge) | |
| 11 | YUNG's Extras | YUNG's Extras (NeoForge) | |
| 12 | Alex's Caves | Alex's Caves (Unofficial Port) | ⚠️稳定性不好 |
| 13 | Alex's Mobs | Alex's Mobs (Unofficial Port) | ⚠️稳定性不好 |
| 14 | Collector's Reap | ❌ 未找到 | |
| 15 | Construction Wand | Construction Wands Revived | |
| 16 | Create: Oppenheimered | 可KubeJS实现 | 仅提供配方 |
| 17 | Create: Metallurgy | 等作者更新 | |
| 18 | Curious Lanterns | ❌ 替代品需Lambd（含强制内容） | |
| 19 | Custom Portal API | Custom Portal API Reforged | |
| 20 | Farmer's Respite | ❌ 闭源模组，无1.21 | |
| 21 | Fragmentum | Fragmentum (NeoForge) | |
| 22 | Ice and Fire | IceAndFire Community Edition | |
| 23 | NetherVinery | ❌ 未找到（自定义证书） | |
| 24 | mutil | ❌ Tetra前置，无1.21 | |
| 25 | Oculus | Iris Shaders | |
| 26 | Radiant Gear | ❌ 替代品Lambd含强制内容 | |
| 27 | Silent's Delight | ❌ 未找到 | |
| 28 | SQLite JDBC | ❌ 未找到 | |
| 29 | TaCZ | Gunsmith Lib | v5.1.2+分内置/非内置版 |
| 30 | World Preview | World Preview NeoForged | |

---

## 1.21.1升级建议

### 核心问题
1. **加载器切换**：几乎所有1.21.1模组都运行在 **NeoForge** 上，而非Forge
2. **确认缺失41个模组**：经CF/MR API扫描确认，41/355个模组无1.21.1版本
3. **有替代方案30个**：其中约20个有明确替代品，10个完全无法替代
4. **Tetra生态**：Tetra + mutil + 3个附属 = 5个模组链式缺失，是最大缺口
5. **闭源模组**：Farmer's Respite 闭源，不可能有第三方移植
6. **争议内容**：Lambd动态光源（替代多个模组的前置）含强制加入的不可关闭内容

### 建议方案
- **保留1.20.1**：当前的1.20.1整合包已经非常成熟完善，355个模组协同工作
- **观望1.21.1**：等待Tetra等关键模组更新后再升级
- **双版本并行**：可以先搭建一个1.21.1 NeoForge精简版，保留核心模组（Create、FD、AE2），待生态成熟后逐步迁移
- **最低损失升级**：如果放弃Tetra生态（5个模组），可用替代方案覆盖约20个模组，最终约20个模组无法迁移

### 1.21.1 关键模组状态速查
| 关键模组 | 状态 | 备注 |
|---------|------|------|
| Create | ✅ | 官方6.1.x NeoForge版 |
| Farmer's Delight | ✅ | 1.2.9 NeoForge版 |
| AE2 | ✅ | 19.2.x NeoForge版 |
| Create-Delight-Core | ✅ | 官方持续支持 |
| KubeJS | ✅ | NeoForge版可用 |
| FTB Quests | ✅ | NeoForge版可用 |
| Terralith | ✅ | v2.5.8 NeoForge版 |
| Create 多数Addon | ✅ | 用户确认大量Create附属已有1.21.1 |
| Alex's Mobs | 🟡 | 非官方移植（稳定性差） |
| Alex's Caves | 🟡 | 非官方移植（稳定性差） |
| Ice and Fire | 🟡 | 社区版(CE) |
| Tetra | 🔴 | **无计划，最大缺口** |
| Farmer's Respite | 🔴 | **闭源，不可能有移植** |
| Steam 'n' Rails | 🟡 | NeoForge官方移植版 |
| Quark | ✅ | 4.1 alpha (NeoForge) |
| Supplementaries | ✅ | v3.5.16 NeoForge版 |
| Sophisticated Backpacks | ✅ | NeoForge版 |
| Xaero's Maps | ✅ | NeoForge版 |
| Embeddium | ✅ | NeoForge版 |
| Oculus | 🔴 → Iris Shaders | 用Iris替代 |
| TACZ | ✅ | → Gunsmith Lib |
| Collector's Reap | 🔴 | 未找到任何1.21分支 |
| Construction Wand | 🔴 → Revived | Construction Wands Revived |
| Item Filters | 🔴 → FTB Filter | FTB Filter System |
| Create: Railways Navigator | ✅ ⚠️ | 有1.21.1但可能有性能问题 |

---

*报告已根据 `ls/需更换模组.txt` 和 `ls/mods_missing_1211_neoforge_v3.txt` 修正。数据来源：CurseForge、Modrinth、MC百科、GitHub及各模组官方发布页。*
