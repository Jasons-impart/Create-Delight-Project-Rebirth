# 协作流程：fork → 分支 → 提交 → PR

本仓库是 [Jasons-impart/Create-Delight-Project-Rebirth](https://github.com/Jasons-impart/Create-Delight-Project-Rebirth) 的下游 fork，承载「齿轮盛宴」的**社区魔改移植**（非上游官方移植）。所有改动都按下面的流程走，**不直接向上游推分支**。

---

## 1. 建立 fork

```bash
# 在 GitHub 上 fork 上游仓库，然后：
git clone https://github.com/<your-name>/Create-Delight-Project-Rebirth.git
cd Create-Delight-Project-Rebirth
git remote add upstream https://github.com/Jasons-impart/Create-Delight-Project-Rebirth.git
git fetch upstream
```

约定：

- `origin` = 你的 fork；`upstream` = 上游 CDPR。
- 本仓库内容（`config/`、`kubejs/`、`docs/`、`mods.list`）放在 fork 的独立分支上，**不改上游目录结构**，避免与 packwiz 元数据冲突。

## 2. 建分支

| 前缀 | 用途 | 示例 |
| --- | --- | --- |
| `port/` | 版本移植、跨版本改造 | `port/1.21.1` |
| `feat/` | 新功能（任务章、机器配方、经济） | `feat/economy-persistent-traders` |
| `fix/` | 缺陷修复（崩溃、配方、任务依赖） | `fix/mbd2-null-recipe` |
| `perf/` | 性能相关 | `perf/entity-layer-limit` |
| `docs/` | 只改文档 | `docs/known-issues` |
| `chore/` | 配置、依赖、构建脚本 | `chore/bump-cdprfps` |

规则：

- 分支名全小写，用 `-` 分词，不含中文与空格。
- 一个分支只做一件事；性能与内容不要混在一个分支里。
- 长期分支 `port/1.21.1` 只接受已通过 PR 的改动，不直接提交。

```bash
git switch -c feat/economy-persistent-traders
```

## 3. 提交

提交信息格式（Conventional Commits）：

```
<type>(<scope>): <subject>

<body：为什么改，而不是改了什么>
```

- `type`：`feat` / `fix` / `perf` / `refactor` / `docs` / `chore` / `build`
- `scope`：`quests` / `kubejs` / `mbd2` / `economy` / `cdprfps` / `mods` / `docs`
- `subject`：祈使句、中文可、不超过 50 字，不以句号结尾
- `body` 写**动机与依据**（例如「1.21.1 的 loot_table 只认 value 字段」），不要只复述 diff

示例：

```
fix(quests): 修复章节 title/icon 被写回时清空

FTB Quests 2101.1.38 把文本存进 lang，snbt 内联文本会在保存时丢弃；
章节 icon 也必须写成对象 { id: "..." }。按章节 id 从参考包恢复并复核 40/40。
```

提交前自检：

- [ ] 没有提交任何 `.jar`（`.gitignore` 已忽略，仍建议 `git status` 复核）
- [ ] 没有提交日志、存档、缓存、`*.bak`
- [ ] 改动的 JSON / SNBT 能解析；KubeJS 脚本语法自检通过
- [ ] 文件为 UTF-8 无 BOM
- [ ] 改前有备份，且备份目录不在仓库内

## 4. 开 PR

```bash
git push -u origin feat/economy-persistent-traders
gh pr create --base port/1.21.1 --title "feat(economy): 迁移持久商店 schema" --body-file docs/PR-DESCRIPTION.md
```

PR 要求：

1. **标题**：与 commit 同格式，`<type>(<scope>): <subject>`。
2. **描述**：套用 `docs/PR-DESCRIPTION.md` 的七段式（Summary / Motivation / What changed / How tested / Risks / Checklist / Related issues）。
3. **How tested 必须区分「已验证」与「未验证」**。没进游戏验证的内容不能写成已验证；性能类改动必须附对照组数据（同机器、同分辨率、同视距）。
4. **风险项必须写**：与上游版本绑定、玩法副作用、未完成项。
5. **只合并到 `port/1.21.1`**，不直接合并到上游 `main`。

## 5. PR 检查项（Reviewer 用）

- [ ] 变更范围与标题一致，没有夹带无关改动
- [ ] 没有新增 jar / 二进制大文件
- [ ] 配方与物品 id 在本包存在（缺失的已替换或删除并记录）
- [ ] 任务书改动后：章节数、任务数、悬空依赖、BOM 四项都报告了
- [ ] 涉及 `cdprfps` 的改动说明了构建方式与是否进过世界
- [ ] 已知问题有更新（新增/关闭都要改 `docs/KNOWN-ISSUES.md`）
- [ ] `CHANGELOG.md` 已补条目

## 6. 同步上游

```bash
git fetch upstream
git switch port/1.21.1
git merge upstream/1.21.1   # 上游同名分支；无则用 upstream/main
```

冲突处理原则：**上游的结构与元数据优先照搬**，本包自有内容（任务书、MBD2、经济、cdprfps）在冲突后重新应用，不反向覆盖上游。
