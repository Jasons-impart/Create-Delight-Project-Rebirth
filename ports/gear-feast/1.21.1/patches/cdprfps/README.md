> **仓库内说明**：本目录是 `cdprfps` 的源码快照，**不含 jar**。
> - 已部署到实例的版本是 `1.3.1`；`build.ps1` 的输出名当前写的是 `cdprfps-1.4.0.jar`（下一个开发版本），构建前请按需修改。
> - `build.ps1` 用 `-LibDir` / `-McJar` 参数（或同名环境变量 `CDPRFPS_LIB` / `CDPRFPS_MC_JAR`）定位启动器 `libraries` 目录与 NeoForm 运行时缓存里的官方映射客户端 jar，JDK 21 取 `JAVA_HOME` 或 PATH 上的 javac。
> - `build.ps1` 必须保持 **UTF-8 带 BOM**，否则 PowerShell 5.1 会按 ANSI 读取导致中文路径乱码。
> - 1.3.0 / 1.3.1 的效果**从未进世界验证**，见 `../../docs/KNOWN-ISSUES.md` T-1。

# CDPRFPS —— 齿轮盛宴帧数优化补丁

自建 Mixin 补丁：客户端做定点剔除，服务端做定点节流，外加一层维度闸门。
不改写任何通用渲染管线（Sodium / Flywheel / Iris 都不碰），不依赖 Create、Sodium，只注入原版类。

- 产物：`cdprfps-1.2.0.jar`
- 安装：复制到实例的 `mods/`
- 配置：实例的 `config/cdprfps.json`
- 构建：JDK 21 + javac，无需 Gradle、无需联网；源码与 `build.ps1` 在本目录

## 一、优化项与默认值

### 客户端（`client` 列表）

| 开关 | 默认 | 作用 | 代价 |
|---|---|---|---|
| `blockEntityCulling` / `blockEntityDistance` | `true` / `32.0` | 超过距离的方块实体不渲染（机器、箱子、告示牌、Create 装置方块实体部分） | 远处机器内部不可见，逻辑不受影响 |
| `itemEntityCulling` / `itemEntityDistance` | `true` / `40.0` | 远处掉落物不渲染 | 看不见但仍可拾取 |
| `particleLimit` / `maxParticles` | `false` / `1200` | 粒子总量封顶 | 实测只有百余个粒子，默认关闭 |
| `blockEntitySkipList` | beacon / end_gateway / conduit / bell | 永不剔除的方块实体 | — |

### 服务端（`mixins` 公共列表，专用服务端与单人世界都会加载）

| 开关 | 默认 | 作用 | 玩法差异 |
|---|---|---|---|
| `farEntityTickThrottle` | `true` | 64 格外的普通生物每 2 tick tick 一次 | 远处怪物动作变慢；命名怪/Boss/载具不节流 |
| `farEntityTickDistance` / `farEntityTickDivisor` | `64.0` / `2` | 触发距离与倍率 | 调小更省、更明显 |
| `farTickBlacklist` | create / simulated / sable / aerowarptics / valkyrienskies / touhou_little_maid / carryon / cataclysm / alexscaves | 不参与节流的命名空间 | 新装机械/载具模组时把命名空间加进来 |
| `itemEntityMerge` / `itemMergeIntervalTicks` / `itemMergeRadius` | `true` / `40` / `2.0` | 合并半径内完全相同的掉落物（只合并、不删除） | 依赖多个独立掉落物实体做计数的装置需关掉 |
| `entityChunkCap` | `false` | 单区块普通生物超限时按比例抽稀 tick | 默认关闭，防误伤 |
| `entityChunkCapLimit` / `entityChunkCapInterval` | `64` / `60` | 阈值与计数刷新 | — |

## 二、维度闸门（1.2.0 核心）

### 三档模式

| 模式 | 区块加载 | tick | 用途 |
|---|---|---|---|
| `always` | 照常 | 照常 | 确实有农场/列车在跑的维度 |
| `throttle` | 照常 | 每 `dimensionThrottleDivisor` tick 跑一次（默认 1/4） | 不想让农场停摆，但可以变慢 |
| `freeze` | 保持已加载 | 完全不 tick | 最省，默认档位 |

- **主世界固定 `always`，不接受修改。**
- 维度内有玩家时按 `always` 处理；玩家离开后恢复配置档位。
- 未在 `dimensionModes` 里命中的维度使用 `defaultDimensionMode`（默认 `freeze`）。

### 配置写法

```json
"dimensionModes": {
  "minecraft:the_nether": "always",
  "northstar:": "throttle",
  "the_bumblezone:the_bumblezone": "freeze"
},
"defaultDimensionMode": "freeze",
"dimensionThrottleDivisor": 4,
"dimensionWhitelist": ["minecraft:overworld"],
"unfreezeOnTicket": true,
"dimensionUnfreezeGraceTicks": 200
```

优先级：`dimensionModes` 精确匹配 > `dimensionModes` 最长前缀 > `dimensionWhitelist`（等价于 `always`）> `defaultDimensionMode`。
`dimensionWhitelist` 只是 `always` 的简写，两者不冲突。

### 游戏内指令（权限等级 2）

```
/cdprfps list
/cdprfps status
/cdprfps set <维度id> always|throttle|freeze
```

- `set` 立即生效，并只把 `dimensionModes` 一段写回 `config/cdprfps.json`，其余键不动。
- 拒绝把**玩家当前所在维度**设为 `freeze`（防止当场卡死）。
- 拒绝修改主世界。
- 维度参数补全当前已知的全部维度 id。

输出示例：

```
> /cdprfps list
[CDPRFPS] 维度模式：
 - minecraft:overworld = always
 - minecraft:the_nether = always
 - northstar:mars = throttle
 - the_bumblezone:the_bumblezone = 默认(freeze)

> /cdprfps status
[CDPRFPS] enabled=true, 当前维度=minecraft:overworld(always), 冻结维度数=3, throttle=1/4, 区块上限=600

> /cdprfps set northstar:mars always
[CDPRFPS] 维度 northstar:mars -> always（已写回 config/cdprfps.json）
```

### 单维度区块上限

- `chunkLimitEnabled`（默认 `true`）、`chunkLimitPerDimension`（默认 `600`）。
- 达到上限后拒绝新增 chunk ticket，并按维度累计被拒次数，由主世界每 100 tick 打印一次：
  `[CDPRFPS] 区块上限拒绝汇总（近100tick）: northstar:mars=12`
- 主世界上限会自动按「视距² + 模拟距离² + 128」抬高，当前 8/5 配置下不低于 538，不会自锁。

## 二·五、按玩家限距（1.3.0）

解决的是「玩家身边被加载/被 tick 的区块里机器与实体」这一层开销，与维度闸门互相独立、叠加生效（更严格者为准）。

| 配置项 | 默认 | 作用 | 代价 |
|---|---|---|---|
| `perPlayerLimitsEnabled` | `true` | 总开关 | 关掉即完全恢复原版视距/模拟距离 |
| `playerViewDistanceCap` | `8` | 服务端下发并用于票据半径的视距上限 | 客户端把视距拉到 16 也只会按 8 加载/发送 |
| `playerSimulationDistanceCap` | `5` | 模拟距离上限 | 超出半径的机器方块实体、生物 AI 不再逐刻运算；**远处农场会停摆** |
| `playerTicketLimit` | `300` | 每玩家区块票据硬上限，换算成半径（√300≈17 → 半径 8）后与视距上限取更小者 | 不会掉玩家脚下区块：半径收缩而不是删票据 |
| `playerTickRadiusChunks` | `5` | 每玩家区块级 tick 半径 | 超出半径不再做随机刻/积雪/雷击，作物与树木生长变慢 |

生效方式：
- `PlayerViewDistanceMixin` 截断 `ServerPlayer.requestedViewDistance()`；
- `ChunkMapPlayerViewDistanceMixin` 对 `ChunkMap.getPlayerViewDistance` 再兜一层；
- `PlayerListDistanceMixin` 钳制 `PlayerList.getViewDistance/getSimulationDistance`（1.21.1 的模拟距离是全局值，没有原生按玩家版本，因此这里是服务端级别的等效实现）；
- `PlayerTickRadiusMixin` 跳过超半径区块的 `ServerLevel.tickChunk`。

一键恢复原版：`perPlayerLimitsEnabled:false`。列车、机械臂、农场在模拟距离之外会停摆；需要在某处继续运行时，把 `playerSimulationDistanceCap` 调回 8~10。

## 三、明确避开的坑与副作用

- **Create 列车 / 传动件**：传动件走 Flywheel，不做剔除；`create` / `simulated` / `sable` 在节流黑名单。
  但被设为 `freeze` 的维度里，列车与装置**会停摆**（区块仍加载，tick 不跑）。
- **AE2 空间存储 / 空间锚点**：`ae2/spatial_storage` 维度若被冻结，锚点的随机刻与刷怪会停止。
  需要时 `/cdprfps set ae2:spatial_storage always`。
- **航空学载具**：载具所在维度若被冻结会静止；载具跨维度时请把目标维度设为 `always` 或依赖临时解冻。
- **传送 / 进入冻结维度**：`unfreezeOnTicket=true` 时，冻结维度一旦收到新的 chunk ticket 会临时解冻
  `dimensionUnfreezeGraceTicks`（默认 200 tick），保证传送和装置加载不被卡住；之后自动恢复冻结。
- **时间与天气**：`freeze` / `throttle` 跳过的是整段 `ServerLevel.tick`，因此被冻结维度的
  时间推进、天气、随机刻、方块实体、实体 AI 全部暂停。这是「省 tick」的代价，不是 bug。
- **Boss / 命名怪 / 玩家的维度**：有玩家的维度永远按 `always` 跑；`isPersistenceRequired()` 的实体不节流。
  已在 alexscavesup（ItemEntityMixin/MobMixin）、improvedmobs、Cataclysm、alexsmobsup 上核对过注入点，不冲突。

## 四、注入点一览（避免重复注入）

| Mixin | 目标方法 | 做什么 |
|---|---|---|
| `BlockEntityDistanceCullingMixin` | `BlockEntityRenderDispatcher.render` | 客户端方块实体距离剔除 |
| `ItemEntityDistanceCullingMixin` | `EntityRenderDispatcher.render` | 客户端掉落物距离剔除 |
| `ParticleLimitMixin` | `ParticleEngine.add` | 客户端粒子上限 |
| `FarEntityTickThrottleMixin` | `ServerLevel.tickNonPassenger` | 远处生物 tick 节流 |
| `ItemEntityMergeMixin` | `ItemEntity.tick` | 掉落物合并 |
| `EntityChunkCapMixin` | `ServerLevel.tickNonPassenger` | 单区块生物抽稀 |
| `DimensionModeMixin` | `ServerLevel.tick` | 维度三档闸门 + 每 100 tick 拒绝汇总 |
| `ChunkTicketLimitMixin` | `ServerChunkCache.addRegionTicket` | 区块上限 + 冻结维度收到 ticket 时临时解冻 |

`ServerLevel.tick` 与 `ServerLevel.tickNonPassenger` 是两个不同方法，不存在同一方法重复注入。

## 五、验证与回滚

启动后日志应出现：

```
[CDPRFPS] 补丁已加载（按 F6 可一键开关全部优化项）
[CDPRFPS] 配置已加载：enabled=true, 方块实体剔除=true(32.0格), ...
[CDPRFPS] 服务端配置：远距离tick节流=true(>64.0格, 1/2), ...
[CDPRFPS] 维度闸门：区块上限=true(600/维度), throttle 分母=4, 默认档位=freeze, 覆盖规则=0 条
[CDPRFPS] 按玩家限距：总开关=true, 视距上限=8 区块(票据上限300), 模拟距离上限=5 区块, tick 半径=5 区块
```

进世界后还会看到（每个维度只打一次）：

```
[CDPRFPS] 维度 northstar:mars -> freeze
[CDPRFPS] 维度 the_bumblezone:the_bumblezone -> throttle(1/4)
```

回滚：
- 关全部优化：`enabled:false` 或游戏内 F6。
- 只关闸门：所有维度改 `always`（`/cdprfps set <维度> always`），或 `defaultDimensionMode` 改 `always`。
- 彻底移除：删除 `mods\cdprfps-1.2.0.jar` 与 `config\cdprfps.json`。

## 六、重新构建

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1 -LibDir "<启动器 libraries 目录>"
```

`build.ps1` 必须保持 UTF-8 **带 BOM**，否则 PowerShell 5.1 会按 ANSI 读取导致中文路径乱码。
