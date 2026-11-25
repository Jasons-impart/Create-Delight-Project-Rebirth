# KubeJS 开发与验证

配方和标签通常在 `kubejs/server_scripts/`，客户端交互和显示在 `client_scripts/`，注册及启动期行为在 `startup_scripts/`。定位模组脚本后，先看同目录现有写法。模组注册、语言键和兼容逻辑涉及 Core 时，同时核对 `CDPR_CORE_REPO` 对应版本。

## 配方 ID 和旧版迁移

- 自定义配方显式指定 `createdelightcore:<模组id>/<path>`，沿用所在脚本的 `id()` 助手。新增配方的 `path` 按类型分段，工作台及无形状配方通常为 `crafting/<物品id的路径>`，搅拌为 `mixing/...`，序列组装为 `sequenced_assembly/...`。新迁入的工作台配方省去旧后缀 `_manual_only`，保留已投入使用的配方 ID。
- 迁移旧 `createdelight` 命名空间时，核实目标对象归属。对旧 Forge 标签逐个确认 NeoForge 的 `c:` 标签是否存在、语义是否一致。严格移除配方时，先核对当前加载的 ID；可选联动按目标模组和资源是否存在处理。
- Create 的物品标签可显式写 `Ingredient.of('#c:...')`。输出概率使用 `CreateItem.of(item, chance)`。涉及序列组装内灌注、混合流体或自定义类型时，核对序列化后的 JSON 和目标 recipe codec。茶饮里物品和流体可能同名，灌装输出应明确为物品。
- Farmer’s Delight 烹饪需要两份相同输入时，重复列出 ingredient。切割产物使用带 `id`、`count` 和可选 `chance` 的对象。迁移旧交互时一并核对接收端脚本和触发条件。

上游近期实例见 [Bakeries 配方](../../kubejs/server_scripts/mods/bakeries/recipes.js) 和 [Youkai 餐台](../../kubejs/server_scripts/mods/youkaishomecoming/sushi.js)。

## Recipe schema 和补全

schema 位于 `kubejs/data/<namespace>/kubejs/recipe_schema/<类型>.json`。`keys` 描述输入、输出和字段类型，`constructors` 决定调用参数顺序；嵌套对象用 `custom_object`。以 [AE2 压印器](../../kubejs/data/ae2/kubejs/recipe_schema/inscriber.json) 为例，构造参数是 `result, ingredients, mode`，中间槽必填，上下槽可选。自定义参数简写需要在脚本里显式转换。

改 schema 后，先 `/reload`，再执行 `/probejs dump`。等待 `.probe/` 生成后，在编辑器里重启 TypeScript 服务以更新补全。

## 格式化和验收

1. 从根目录执行 `npm run format:js:check` 检查格式。提交钩子只格式化已暂存的 KubeJS JavaScript，再刷新包索引。Prettier 处理格式，Rhino 的语言兼容性仍需实际加载确认。
2. 在当前测试实例验证。若隔离服有独立的 `kubejs/` 副本，先将本次改动同步到 `CDPR_TEST_SERVER_DIR` 下实际加载的位置。server script 和数据包通常用 `/reload`；启动脚本、模组 JAR 或注册变化需要完整重启。
3. 查看该实例的 KubeJS 日志及 `logs/latest.log`，核对脚本错误、序列化和缺失 ID。在游戏内验证配方是否能显示并完成制作，客户端交互、旧存档和服务端逻辑分别记下验收结果。
