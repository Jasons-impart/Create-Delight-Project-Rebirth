# 2026 年 9—10 月模组、脚本引擎和加载器升级

## 09-20 批量更新

按已提交的 `f377eec` 与其父提交逐个比较 `mods/` 下同名描述符的 `filename`，**145 个已有模组更换了 JAR 文件名，另新增 Advanced Core Info**。旧草稿记为 155，归档统计以实际提交为准。同期更新 Complementary Unbound，调整 Waystones2Waypoints2 分端，并修正 Mechanical Spawner 刷怪液 ID。

当时在 NeoForge 21.1.242 上记录的锁定理由包括：

- Alex / Citadel 移植版的命名空间与 Core 强依赖；Northstar 望远镜的客户端 mixin；Multiblocked2 跨版本 API。
- CreateAddition、Cultural Delights、Uranus、Ice and Fire CE、Supplementaries 的最低加载器版本；Create Integrated Farming 还依赖新版 Supplementaries。
- Youkai 茶饮的输出 codec，Waystones 配置桥接，Improved Mobs 与 TenshiLib 配套变更，以及 Farmer’s Delight 和附属模组的战利品解码。
- KubeJS、Rhino、ProbeJS 的脚本回归；资源包更新源将独立 old_copper 补丁识别为主体更新。直链模组需要单独核对发布来源。

上述项目的现行版本和锁定状态直接查描述符。旧记录中的本机 Core 覆盖与公开构建有过差异，复测注明实际运行的制品。[模组维护](../development/pack.md)

## 09-30 脚本引擎

KubeJS 升至 build.377、Rhino 升至 build.91、ProbeJS 升至 8.0.3，并解除三者锁定。修正数组空位解构和稀疏数组 `fill` 引发的回归，复核含流体或物品的混合输入、配方末项和 ProbeJS 输出。仅凭 09-20 的快照恢复旧版本会丢掉这批适配。

## 10-11 NeoForge 与 Lime Pie

为满足 Lime Pie 的加载器要求，NeoForge 从 21.1.242 升至 21.1.251，Minecraft 维持 1.21.1，Java 维持 21。当时 bkmpw 预检遇到 Minecraft 兼容别名和 SPI 识别问题；维护者备份 Prism 组件配置后完成调整。独立服务端安装、启动、reload 和 Lime Pie 专项通过；客户端连接及旧存档另行验收。当前升级步骤见[加载器维护](../development/pack.md#升级-neoforge)。
