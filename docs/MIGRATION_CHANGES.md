# 迁移改动记录

本文件记录从旧版整合包迁移到 Minecraft 1.21.1 NeoForge 过程中遇到的问题、当前临时处理方式和后续待办。这里记录的是实际迁移改动，不替代 `docs/modpack-analysis-report.md` 的模组可用性分析。

## Cosmopolitan

状态：暂缓迁移。

原因：`cosmopolitan-1.20.1-1.1.0.jar` 目前未找到可靠的 Minecraft 1.21.1 NeoForge 可用版本。现有迁移清单中已标记为确认无 1.21.1 版本。

影响范围：

- KubeJS 注册物品中引用了 `cosmopolitan:tracer` 和 `cosmopolitan:phototaxis` 效果。
- 部分物品还引用了 Cosmopolitan 的贴图资源，例如 `cosmopolitan:item/golden_arbutus_berries`。
- 如果在缺少 Cosmopolitan 的情况下继续注册这些物品，可能出现不存在的效果或资源引用，导致启动、数据生成或资源加载阶段报错。

当前临时处理：

- 在 `kubejs/startup_scripts/registry_item.js` 中注释掉依赖 Cosmopolitan 效果或资源的 KubeJS 物品注册。
- 当前已注释的物品包括：
  - `createdelight:lush_confiture_jello_item`
  - `createdelight:enchanted_golden_arbutus_berries`
- 暂不为这些物品补临时替代效果，避免迁移阶段出现语义不一致的平衡改动。

后续处理方案：

- 如果 Cosmopolitan 后续发布 1.21.1 NeoForge 版本，重新加入 packwiz 元数据后再恢复对应 KubeJS 注册。
- 如果确定长期不迁移 Cosmopolitan，需要决定替代方案：
  - 使用本包自定义效果替代 `cosmopolitan:tracer` / `cosmopolitan:phototaxis`。
  - 或改用原版 / Farmer's Delight 已存在效果。
  - 或彻底移除相关物品及配方、语言、贴图引用。
- 恢复或替换后，需要检查 `registry_item.js`、配方、语言文件和资源贴图是否仍有 `cosmopolitan:` 引用。

