# 开发日志

记录两件事：自研补丁 `cdprfps` 的版本演进，以及社区魔改移植期所有启动/运行崩溃与 KubeJS 报错的根因与修法。

---

## 一、cdprfps：自研帧数补丁

定位：**定点剔除 + 定点节流**，不改写任何通用渲染管线（不碰 Sodium / Flywheel / Iris），只注入原版类。构建方式为 JDK 21 + `javac`，无 Gradle、无联网依赖。源码见 `patches/cdprfps/`，配置见 `config/cdprfps.json`。

| 版本 | 新增 | 为什么 | 类数 |
| --- | --- | --- | --- |
| 1.0.0 | 客户端：方块实体距离剔除（默认 32 格）、掉落物实体距离剔除（40 格）、粒子总量封顶（默认关）；`F6` 一键开关 | 先解决最直接的客户端渲染开销：远处机器/箱子/告示牌的方块实体与掉落物仍在逐帧渲染 | 5 |
| 1.1.0 | 服务端：远处生物 tick 节流（>64 格每 2 tick 一次）、掉落物合并（半径 2 格/40 tick）、单区块生物上限（默认关） | 单人内置服务器是主要瓶颈之一；只做客户端剔除对服务端每刻耗时无效 | 8 |
| 1.2.0 | 维度闸门：`always` / `throttle` / `freeze` 三档，默认 `freeze`；单维度区块上限（默认 600）；`/cdprfps list\|status\|set` 指令（权限 2）；配置即时写回 | 无人维度仍在整段 tick，是最大的「白烧」开销；同时防止某个维度无限加载区块 | 14 |
| 1.3.0 | 按玩家限距：视距上限 8、模拟距离上限 5、每玩家票据上限 300、每玩家 tick 半径 5 区块 | 1.21.1 没有原生按玩家模拟距离，只能服务端统一钳制；目标是压缩「玩家身边被加载/被 tick」这一层 | 18 |
| 1.3.1 | 票据诊断与回收：`/cdprfps tickets`、`chunkEvictionEnabled`、`evictForcedChunks`、`ticketEvictionKeepRadiusChunks` | 1.3.0 部署后需要看清「谁在占票据」，否则区块上限只能拒绝新票据、不能回收已有票据 | 21 |

**当前状态（重要）**：1.3.0 与 1.3.1 **都已编译并放入 `mods/`，但都还没进过世界**；`/cdprfps tickets` 一次都没有成功输出过。因此 1.3.x 的全部效果都属于**未验证**，见 `KNOWN-ISSUES.md` T-1。

**效果口径**：帧数问题的对照数据表明瓶颈在实体数与每刻耗时（见 `KNOWN-ISSUES.md` E-1）。cdprfps 目前的方向（区块上限、票据回收）针对的是区块层，**不是当前的主要矛盾**。

---

## 二、六个启动崩溃的修复

时间线：2026-11-14 23:18 → 2026-11-15 01:28，共六个不同错误，前四个挡住启动，后两个挡住进世界。

### C-1 23:18 Create 重复注册客户端扩展

- **现象**：`Initializing game` 崩溃，`Duplicate client extensions registration for create:cardboard_helmet`。
- **根因**：Create 自己的 `RegisterClientExtensionsEvent` 处理器被分发了两次。排查排除：没装两份 Create、jar 的 sha1 与可用实例一致、没有其它 jar 内嵌 Create 类、赛博护目镜不是直接原因。结合时间点，23:04–23:15 正在向 `mods/` 批量复制 jar，**启动瞬间目录处于变动中**是最合理解释。
- **修复**：把赛博护目镜换回上游 pin 的 `8.6.3`（唯一引用该 Overlay 类的第三方 jar），并等目录稳定后再启动。
- **结果**：后续两轮未复现。

### C-2 23:27 citadel / citadelup 分包冲突（JPMS）

- **现象**：启动止于模块解析，`ResolutionException: Modules citadelup and citadel export package net.sourceforge.jaad`。
- **根因**：两个 jar 都把 JAAD（AAC 解码库）打进自己包里，FML 当模块解析时同包被两个模块导出，JVM 直接拒绝。该冲突早于 mixin 与 KubeJS。
- **修复**：`citadel-1.21.1-2.7.6.jar` 移入 `mods-replaced`。复核：`iceandfire` 不依赖 citadel，`alexscavesup` / `alexsmobsup` 只依赖 `citadelup`，无其它硬依赖。

### C-3 23:40 improvedmobs 与 tenshilib 二进制不兼容

- **现象**：`Failed to create mod instance. ModID: improvedmobs` → `NoSuchMethodError: AttachmentType$Builder.transferHandler(...)`，随后 FML 进入 broken mod state，崩溃报告最终落在 `Cannot get config value before config is loaded`（**二次症状**）。
- **根因**：`improvedmobs 1.15.2` 编译期调用的 tenshilib API 在实例的 `tenshilib 2.3.1` 中已删除。这类二进制不兼容不会被依赖区间检查拦住（两版都声明满足区间）。
- **修复**：移出 1.15.2，恢复 `improvedmobs 1.21.1-1.16.0.b`（与 tenshilib 2.3.1 配对）。
- **教训**：只看崩溃报告最后一行会误判成 createdelightcore 的 bug，必须按时间顺序看第一条 ERROR。

### C-4 23:49 Dynamic Trees 注册期扫资源，撞上 createdelightcore 配置未加载

- **现象**：`RegisterEvent` 阶段 `IllegalStateException: Cannot get config value before config is loaded`，栈在 `PathPackResources → createdelightcore$filterKnownInvalidPaths`；随后一串 `unbound value` 与 `Rolling back to VANILLA state`。
- **根因**：Dynamic Trees 在注册阶段就把自带 tree pack 当资源包 `listPath`，而 `PathPackResources` 被 createdelightcore 的 mixin 改写，入口先读 `Config.ENABLE_INVALID_RESOURCE_PATH_FILTERS`；NeoForge 21.1 的配置加载**晚于**注册事件。
- **修复**：Dynamic Trees 全栈（`dynamictrees` / `DynamicTreesPlus` / `dtquark` / `dtbop`）移入 `mods-replaced`。DT 是自家独有、上游没有，移出代价最小。
- **结果**：23:58 启动进入主菜单（`Sound engine started`）。

### C-5 00:03 进世界崩溃：stellaris 配方返回 null

- **现象**：`Exception in server tick loop`，`MbdRecipeValues.rebuild:39` → `ItemStack.isEmpty()` NPE。
- **根因**：`MbdRecipeValues.rebuild` 在 `ServerStartedEvent` 遍历全部配方并对结果直接 `isEmpty()`，不判空；`stellaris` 的 `FuelRefineryRecipe#getResultItem()` 字节码就是 `aconst_null; areturn`，全库仅 1 条 `stellaris:fuel_refining` 触发。
- **修复**：移出 stellaris 与其独占前置 `potentials`（`architectury` 被 12 个模组依赖，保留）。`createpropulsion` 里两条带 `required_mod` 的引用会自动跳过。
- **兜底**：保留 `cdc-mbd-guard`（独立 Mixin 补丁 jar），给同一处空指针兜底，避免未来其它模组触发同样问题。

### C-6 01:12 / 01:28 进世界崩溃：unusualend 的 RecipeType 未注册

- **现象**：同一条 `rebuild:62`，`Cannot invoke ResourceLocation.toString() because "type" is null`。
- **根因**：`unusualend` 的 `InfuserRecipe$Type` 与 `BolokTradingRecipe$Type` 在静态初始化里直接 `new`，从未注册进 `BuiltInRegistries.RECIPE_TYPE`；序列化器正常注册，所以配方能加载但 `getKey()` 返回 null。
- **修复**：先把 jar 移入 `mods-replaced`（连同 `unusualend_type_guard.js` 一起移除）。复核：无其它模组硬依赖 unusualend，任务书无 unusualend 物品引用。
- **兜底**：保留 `cdc-mbd-guard`。

### 后续崩溃（启动后阶段）

| 时间 | 现象 | 根因 | 修复 |
| --- | --- | --- | --- |
| 11:00 | FML `Mod loading failures` | `immersive_paintings` 缺 `fzzy_config`、`corn_delight` 缺 `mysterious_mountain_lib` | 补装前置 |
| 12:54 | FML `Mod loading failures` | `feywild` 缺 `quest_giver` | 补装前置 |
| 11:27 | 数据包加载失败（序列装配配方） | Create 序列装配配方成分为空时 `SequencedRecipe#initFromSequencedAssembly` 抛错，整轮数据包加载失败 | 自研 `cdc-seq-guard`：空成分时取消原方法，把「整包失败」降级为「单条配方跳过」 |
| 16:47 | `Rendering screen` 时 `StackOverflowError`，栈在 `Quest.isVisible` | 任务依赖成环，`isVisible` 无限递归 | 清理依赖环、修复悬空依赖 |

> 两个自研兜底补丁都遵循同一原则：**不改 Create / createdelightcore 原 jar**，以独立 Mixin jar 放入 `mods/`。代价是与上游版本绑定——上游方法签名一变，补丁会在启动阶段明确抛 `InvalidInjectionException` 中止，而不是静默失效。

---

## 三、KubeJS 脚本报错

| 报错 | 根因 | 修法 |
| --- | --- | --- |
| `redeclaration of var` | KubeJS 2101 使用的 Rhino 在同一作用域内不允许重复声明同名 `var`；脚本被合并/重载时，同名变量会撞车 | 变量改名；把临时变量收进函数作用域，避免顶层重复声明 |
| `getOrCreateTeamData` 调用歧义 | FTB Teams 提供多个重载（`UUID` / `String` / `Team` 等），Rhino 无法在弱类型下选定，抛「ambiguous method」 | 显式传入确定类型的参数（转成 `UUID` 或先取 `Team`），避免依赖隐式转换 |
| 给 `global` 赋值报错 | KubeJS 2101 禁止在 `server_scripts` 中给 `global` 赋值：服务端脚本会随 `/reload` 重载，写入不持久且直接报错 | 全局常量统一放到 `startup_scripts`（本仓库为 `kubejs/startup_scripts/04_global_data.js`），只在启动时写一次 |

补充约定（已落在脚本里）：

- 配方里裸写 `'#tag'` 会被识别成**流体**标签，导致「配方流体输入数量不匹配」；统一用 `Ingredient.of('#tag')` 显式声明物品标签。
- KubeJS 没有 `ServerEvents.lootTables`，战利品表修改改用 `EntityEvents.drops`。
- KubeJS 没有 FTB Quests 事件集成，阶段解锁走「锻造台提交 + stages + 指令商店」，不依赖任务完成事件。
