# 2026-09-20 模组更新兼容性记录

基线保持 Minecraft 1.21.1、NeoForge 21.1.242、Java 21。
本次更新 145 个现有模组，补充 Advanced Loot Info 所需的 Advanced Core Info，
将 Complementary Unbound 升至 r5.9.3；Waystones2Waypoints2 移至 common，以满足服务端握手。
Mechanical Spawner 配方同步使用新的 `spawn_fluid_piglin` 流体 ID。

## 暂缓更新

以下描述符设置 `pin = true`。解除锁定前，应先解决对应兼容性问题，并验证启动、脚本 reload 和客户端连接。

| 描述符 | 原因 |
| --- | --- |
| `mods/common/alexs-mobs-up.pw.toml` | 新版 mod ID 从 alexsmobsup 改为 alexsmobs，当前配方/数据未作命名空间迁移 |
| `mods/common/alexs-caves-up.pw.toml` | 与 Citadel Up 命名空间迁移绑定，当前 Core 强依赖 alexscavesup |
| `mods/common/citadel-up.pw.toml` | 新版 mod ID 从 citadelup 改为 citadel，当前 Core 强依赖 citadelup |
| `mods/common/create-delight-core.pw.toml` | 保留 2.0.0.5；Core 升级应与其脚本/API 迁移单独验证。 |
| `mods/common/createaddition.pw.toml` | 最新版要求 NeoForge 21.1.248，仓库基线固定 21.1.242；先保留已验证版 |
| `mods/common/cultural-delights.pw.toml` | 最新版要求 NeoForge 21.1.247，仓库基线固定 21.1.242；先保留已验证版 |
| `mods/common/uranus.pw.toml` | 最新版要求 NeoForge 21.1.248，仓库基线固定 21.1.242；先保留已验证版 |
| `mods/common/iceandfire-ce.pw.toml` | 最新版要求 NeoForge 21.1.248，仓库基线固定 21.1.242；先保留已验证版 |
| `mods/common/supplementaries.pw.toml` | 最新版要求 NeoForge 21.1.247，仓库基线固定 21.1.242；先保留已验证版 |
| `mods/common/multiblocked2.pw.toml` | 保留 21.0.x，避免跨越 Core 集成依赖的 21.1 API 边界。 |
| `mods/common/create-integrated-farming.pw.toml` | 实测无法启动：新版要求 Supplementaries 3.9.9，该版本又要求 NeoForge 21.1.247 |
| `mods/common/kubejs.pw.toml` | 升级后标签回调和混合物品/流体数组触发 Rhino 类型错误，保留已验证脚本引擎组合 |
| `mods/common/rhino.pw.toml` | 新版在现有数组解构回调及混合参数上出现回归，随 KubeJS 保留原验证版本 |
| `mods/common/northstar-redux.pw.toml` | 新版 TelescopeScreen 方法签名变化，与 Core 的客户端 mixin 不兼容。 |
| `mods/common/youkais-homecoming-unofficial-port.pw.toml` | 新版饮品配方 codec 要求 amount，现有 10 条茶饮输出为 count，实际 RecipeManager 解析失败 |
| `mods/common/probejs.pw.toml` | 新版 8.0.3 强依赖 KubeJS build.365 以上，随已验证脚本引擎组合保留旧版 |
| `resourcepacks/create-functional-storage.pw.toml` | 更新源 latest 指向 old_copper 补丁而非完整资源包，不能替换原主体资源包 |
| `mods/common/waystones.pw.toml` | 新版 restrictedWaystones 枚举集合与 Jupiter 配置桥接不兼容。 |
| `mods/common/improved-mobs.pw.toml` | 新版默认装备池引用当前不存在的 Ice and Fire / Dreadsteel 物品。 |
| `mods/common/create-connected.pw.toml` | 新版可选染色催化剂的战利品表引用未注册物品。 |
| `mods/common/create-diesel-generators.pw.toml` | 新版战利品表引用不存在的 andesite_girder_strut。 |
| `mods/common/create-fantasizing-again.pw.toml` | 新版 transporter 进度 JSON 无法解析。 |
| `mods/common/justenoughbreeding.pw.toml` | 新版三条兼容配方引用无效物品或不合法的 ingredient。 |
| `mods/common/tenshilib.pw.toml` | 随 Improved Mobs 保留原版；新版删除其使用的 transferHandler API。 |
| `mods/common/farmers-delight.pw.toml` | 新版战利品 codec 将 lootTable 改为 table，导致 Miners Delight / My Nethers Delight 三个战利品扩展失效。 |
| `mods/common/abnormals-delight.pw.toml` | 新版要求 Farmer’s Delight 1.3.4，随其兼容性锁定保留原版。 |
| `mods/common/dungeons-delight.pw.toml` | 新版两个战利品扩展使用新的 table 字段，随 Farmer’s Delight 保留原版。 |

Collectors Reap、Mutil、Silent’s Delight、Tetra、Vintage Delight 使用 URL 描述符，没有自动更新源，本次保留原版本。

`pin` 只约束版本更新，不会保护手动替换的 jar。`install-files` 会按描述符下载并校验文件；开发覆盖需要另行备份。

## 更新后检查

运行 `./devtool.sh generate-integrity-manifest`、`./devtool.sh refresh` 和 `./devtool.sh check`。
完整性清单生成器会区分启动服务、FML 库与实际模组，同时继续扫描嵌套 jar。
发布前还需验证公开 Core 构建与提交中的脚本，而不能用不同开发构建的运行结果代替。

本批提交使用描述符指定的公开 Core 2.0.0.5 完成独立服务端启动和 reload 验证：
4 个启动脚本、180 个服务端脚本无加载错误，KubeJS 配方生成无失败；
与更新前 main 对照，没有新增 ERROR 项或战利品修饰器解码失败。
已有上游日志问题仍存在；此检查不覆盖客户端完整游玩、旧存档迁移或启用光影后的画面。
