# Create Delight Project Rebirth 开发指南

本仓库是 1.21.1 NeoForge 版本的整合包源码仓库。仓库只维护可审查、可复现的源码和元数据；mod 本体通过 bkmpw 管理，不直接提交 jar。

## 项目基线

- Minecraft: `1.21.1`
- Loader: `NeoForge 21.1.228`
- Java: `21`
- Pack manager: `bkmpw`，用于管理仓库中的 mod 元数据、下载来源和文件索引。

## 基础环境

- Windows
- Java 21
- Git
- Node.js LTS / npm，用于 KubeJS 脚本格式化和 Git hook。安装 Node.js 时需包含 npm，并确认 `node`、`npm` 已加入 PATH。
- 推荐编辑器：VSCode / IntelliJ IDEA Community Edition / 其他支持 TOML、JSON、JavaScript 的编辑器

根目录内置开发工具：

```powershell
devtool.bat
```

双击使用：

```text
devtool.bat
```

开发工具只使用仓库内置的 `scripts/bin/bkmpw.exe`。旧 `packwiz.exe` 和 `packwiz-installer-bootstrap.jar` 不再内置，也不再兜底调用。

开发者日常操作优先使用交互式菜单，不需要记忆 bkmpw 参数命令。

可以用下面的命令快速检查本机基础工具：

```powershell
node -v
npm -v
devtool.bat check
```

## 仓库结构原则

- `mods/*.jar` 不提交。
- `mods/*.pw.toml`、`mods/common/*.pw.toml`、`mods/client/*.pw.toml`、`mods/server/*.pw.toml` 提交。
- `pack/` 中的发布模板提交；根目录 `pack.toml`、`index.toml`、`.packwizignore`、`icon.png`、`server-icon.png`、`start.bat`、`start.sh`、`variables.txt`、`PCL/` 由 `devtool.bat prepare-pack` 或 bkmpw 操作生成，不提交。
- `config/`、`defaultconfigs/` 只放确认要共享的配置。
- `kubejs/` 只放已确认适配 1.21.1 NeoForge 和目标模组集合的脚本、数据与资源。
- `scripts/bin/bkmpw.exe` 是唯一允许内置的 pack 管理二进制。不要重新加入 `packwiz.exe`、`packwiz-old.exe`、`packwiz-installer-bootstrap.jar` 或相关 VERSION 文件。
- 服务端运行产物不提交，包括 `libraries/`、`world*`、`logs/`、`run.bat`、`run.sh`、`server.properties`、`eula.txt`、`user_jvm_args.txt`。

AI 相关共享工作流放在：

```text
.agents/skills/packwiz-modpack/SKILL.md
```

处理 pack 元数据前应先阅读该文件。

完整结构说明见：

```text
docs/REPOSITORY_STRUCTURE.md
```

## mod 管理方式

mod 本体由 bkmpw 元数据管理，但开发者一般不直接手写命令。需要添加、更新、下载或生成 mod 清单时，运行：

```powershell
devtool.bat
```

菜单里已经封装了仓库检查、刷新索引、添加项目、更新项目、安装/同步本地 mod 文件、下载缺失文件和生成 mod 清单等操作。
参数式命令主要给 AI agent、自动化脚本或维护者排查问题使用，相关细节放在 `.agents/skills/packwiz-modpack/SKILL.md` 和 `docs/PACKWIZ_WORKFLOW.md`。

## 初始化 mod 下载

首次准备开发环境时：

1. 运行一次 `devtool.bat prepare-pack`，把 `pack/` 模板展开到根目录并生成 `pack.toml`、`index.toml`、`.packwizignore`、`PCL/` 等本地发布文件。
2. 从开发群文件下载需要手动补齐的 mod jar。
3. 把这些 jar 放进仓库根目录的 `mods/` 文件夹。
4. 双击根目录的 `devtool.bat`。
5. 在菜单里选择 `10` 安装/同步 bkmpw 管理的本地 mod 文件；或直接运行 `devtool.bat install-files`。

下载完成后，`mods/` 里会出现本地运行用的 `*.jar`。这些 jar 不提交，只保留在本机开发环境。以后如果误删某个受管 jar，再运行菜单 `10` 即可补回来。

增删 mod 的基本规则：

- 不要直接通过删除或复制 `mods/*.jar` 来调整整合包 mod 列表。jar 只是本地运行文件，真正的 mod 列表由 `*.pw.toml` 管理。
- 新增 CurseForge mod 使用菜单 `6. 添加 CurseForge 项目`，或命令 `devtool.bat add-curseforge <project>`。
- 新增直链或 GitHub Release 文件使用菜单 `7` 或 `8`。
- 删除 mod 使用菜单 `9. 移除管理文件`，或命令 `devtool.bat remove-mod <name-or-metadata-file>`。菜单 `9` 只会修改清单；删除后必须再运行菜单 `10` 或 `devtool.bat install-files` 同步本地文件夹，受管旧 jar 才会从本机 `mods/` 中清掉。
- Modrinth 添加、CurseForge detect、serve 和 Modrinth export 已移除。
- `add-*`、`update`、`remove-mod` 会自动生成/刷新根目录 `pack.toml` 和 `index.toml`；之后运行 `devtool.bat install-files`。无桌面环境使用 `devtool.bat install-files-headless`；网络不稳时使用 `devtool.bat install-files-retry`。
- 提交 `mods/*.pw.toml`、`mods/common/*.pw.toml`、`mods/client/*.pw.toml`、`mods/server/*.pw.toml`、`pack/` 模板和需要共享的配置变化，不提交根目录生成的 `pack.toml`、`index.toml`、`.packwizignore`、`PCL/` 或 `mods/*.jar`。

## 关于 modinstaller / 同步器

部分 mod 同步器会按照 manifest 清理目录，删除不在清单中的文件。开发仓库中优先使用开发工具菜单里的“安装/同步托管文件到本地”或“下载缺失文件到本地”。bkmpw 只清理上一次 `bkmpw:1` manifest 记录过的受管文件；手动塞入且未记录的 jar 不应被删除。

如果确实需要使用会清理文件的同步器，先确认：

- 当前目录不是唯一工作副本。
- 本地改动已经提交或备份。
- 清理范围只包含可再生成的运行文件。

## KubeJS 开发规范

当前阶段不要直接批量搬运旧仓库 KubeJS。旧仓库是 Forge 1.20.1，新仓库目标是 NeoForge 1.21.1，模组 ID、标签、配方类型、KubeJS API 和配置结构都可能变化。

### KubeJS JS 格式化

仓库根目录提供 `.prettierrc`，用于统一 KubeJS JavaScript 的基础格式。VSCode 用户建议安装工作区推荐插件里的 `Prettier - Code formatter`。

首次拉取仓库后运行：

```powershell
node -v
npm -v
npm install
```

如果 `node -v` 或 `npm -v` 找不到命令，请先安装 Node.js LTS，并确认 npm 一起安装且已加入 PATH。`npm install` 会安装格式化工具，并通过 Husky 安装 Git hook。之后提交时，`pre-commit` 会先对本次暂存的 `kubejs/**/*.js` 自动执行 Prettier 格式化，再运行 `devtool.bat refresh` 刷新 bkmpw 索引。根目录 `pack.toml`、`index.toml`、`.packwizignore` 是本地生成文件，不需要暂存或提交。

也可以手动运行：

```powershell
npm run format:js
npm run format:js:check
```

本仓库不提交 `.vscode/settings.json`，避免把个人编辑器设置、插件生成配置或本机偏好带给其他开发者。需要保存时自动格式化的开发者，可以在自己的 VSCode 用户设置或本地工作区设置中加入：

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

也可以在打开 `kubejs/**/*.js` 后手动执行 `Format Document`。Prettier 只负责格式化，不会把现代 JavaScript 语法转换成 KubeJS/Rhino 可用语法；脚本写法仍需按当前 KubeJS 运行环境保持兼容。

### KubeJS 配方 schema

当某个模组配方类型没有 KubeJS 内置支持时，可以给 KubeJS/ProbeJS 添加 JSON schema，用于生成 `event.recipes.<mod>.<recipe_type>(...)` 的类型补全。schema 只描述配方 JSON 的字段结构，不会把数组、字符串等自定义简写自动转换成目标 JSON；需要简写语法时，应在 server script 中单独写 helper 函数。

schema 文件放在 KubeJS datapack 目录：

```text
kubejs/data/<namespace>/kubejs/recipe_schema/<recipe_type>.json
```

例如 `ae2:inscriber` 对应：

```text
kubejs/data/ae2/kubejs/recipe_schema/inscriber.json
```

常用字段：

- `name`: 配方 JSON 中的字段名。
- `role`: 字段用途，常用 `input`、`output`、`other`。
- `type`: KubeJS recipe component 类型，例如 `item_stack`、`ingredient`、`fluid_stack`、`int`、`string`、`boolean`。
- `optional`: 可选字段的默认值；在 `custom_object` 子字段中也可用 `true` 表示该子字段可省略。
- `constructors`: 定义 helper 的参数顺序，例如 `event.recipes.ae2.inscriber(result, ingredients, mode)`。

`ae2:inscriber` 示例：

```json
{
  "keys": [
    {
      "name": "result",
      "role": "output",
      "type": "item_stack"
    },
    {
      "name": "ingredients",
      "role": "input",
      "type": {
        "type": "custom_object",
        "keys": [
          {
            "name": "top",
            "component": "ingredient",
            "optional": true
          },
          {
            "name": "middle",
            "component": "ingredient"
          },
          {
            "name": "bottom",
            "component": "ingredient",
            "optional": true
          }
        ]
      }
    },
    {
      "name": "mode",
      "role": "other",
      "type": "string"
    }
  ],
  "constructors": [
    {
      "keys": ["result", "ingredients", "mode"]
    }
  ]
}
```

对应脚本用法：

```js
ServerEvents.recipes((event) => {
  event.recipes.ae2
    .inscriber(
      'ae2:calculation_processor',
      {
        top: { item: 'ae2:printed_calculation_processor' },
        middle: { item: 'minecraft:redstone' },
        bottom: { item: 'ae2:printed_silicon' },
      },
      'press'
    )
    .id('kubejs:calculation_processor_test');
});
```

新增或修改 schema 后，进游戏执行：

```text
/reload
/probejs dump
```

等 `.probe/` 重新生成后，在 VSCode 中执行 `TypeScript: Restart TS Server` 或重载窗口，补全才会更新。

通用规范：

- 文件结尾保留空行。
- 缩进使用 2 或 4 个空格，但同一目录内保持一致。
- 使用 `let` / `const`，不要使用 `var`。
- KubeJS 迁移脚本中禁止使用 `var`；旧脚本里的 `var` 必须在迁移时改成 `const` 或 `let`。
- ResourceLocation 使用小写，避免空格和非法字符。
- 自定义配方必须有明确 id。
- 旧命名空间 `createdelight` 迁移到本仓库时改为 `createdelightcore`，除非目标对象明确属于其它 mod。
- `createdelightcore` 的物品、方块、流体注册和语言键由 core/对应注册层维护；迁移 server recipe 时不要为了让配方通过而临时补 startup 注册或 lang。
- 优先按层迁移：工具函数、注册、标签、配方、客户端脚本、可选联动。
- 每迁移一层都启动或 reload 验证，不要一次性塞入大量旧脚本。

### KubeJS 1.21 迁移注意事项

- `test_server/kubejs` 当前是测试服运行副本，不是仓库根目录 `kubejs/` 的符号链接。修改仓库脚本后，必须同步对应文件到 `test_server/kubejs` 再用 RCON `/reload` 验证，否则测到的是旧副本。
- 严格 remove 模式下，`event.remove({ id: ... })` 只能用于确认当前 recipe manager 中存在的配方 id。旧版 Forge 路径常发生变化，例如 `neapolitan:adzuki/adzuki_crate` 在新版变为 `neapolitan:adzuki_crate`。拿不准时先查 jar 和 reload 日志，或用 `event.findRecipeIds(id)` 做 guard。
- 旧脚本的 `#forge:*` 标签迁移到 `#c:*` 时必须确认新标签实际存在。不要只做字符串替换；部分旧标签语义在新版拆成了 `c:foods/*`、`c:tools/*`、`c:storage_blocks/*` 等不同路径。
- KubeJS Create processing recipe 中不要裸传 `'#tag'`。在 `create.deploying` 等配方里，裸 tag 可能被序列化成带 `amount: 1000` 的 `neoforge:tag`，随后被 Create 当作不支持的流体输入校验。物品 tag 优先写 `Ingredient.of('#c:...')`；如果该 recipe type 仍误判，改为具体物品或数据配方。
- `create.sequenced_assembly` 中嵌套 `create.filling` 是高风险路径。当前 KubeJS Create helper 会把流体 ingredient 写成 Create 1.21 在 sequence 校验中不接受的格式，可能报 `Recipe has more fluid inputs (1) than supported (0)`。已验证 datapack JSON 使用 `{ "type": "fluid_stack", "fluid": "...", "amount": ... }` 可通过；这类配方优先用数据 JSON 或后续 core 补丁/helper 接管。
- `fluid_tag_ingredient(...)` 这类手写流体 tag 对象不是 KubeJS Create helper 的稳定输入。流体 tag 需求需要专门 schema/helper 或 core 补丁处理，不要假定 `Ingredient.of()` 可以拿流体 tag。
- Minecraft 1.21 下 `Item.of(...).withChance(...)` 不再用于 Create 配方输出。Create 概率输出使用 `CreateItem.of(item, chance)`，已有脚本按这个写法迁移。
- Farmers Delight cooking 的输入不要写 `'2x item:id'`。该 helper 会按 ingredient 解析输入，`2x` 可能被当成命名空间。需要两个相同输入时写两次同一 item。
- Farmers Delight cutting 输出使用当前对象格式，例如 `{ id: 'item:id', count: 1, chance: 0.3 }`。不要把旧版 `Item.of(...).withChance(...)` 直接塞进新版 cutting。
- 旧脚本中的客户端网络包、声音播放、右键交互等非 recipe 逻辑要单独迁移。仅迁 server recipe 时，不要把依赖旧 client script 接收端的 `player.sendData(...)` 逻辑顺手搬入。

建议迁移顺序：

1. `kubejs/startup_scripts` 中的基础常量和注册。
2. `kubejs/server_scripts` 中的标签。
3. 已确认存在的模组配方。
4. 语言文件和资源。
5. 客户端 tooltip / render / keybind。
6. 任务和大型联动。

## 配置迁移规范

- 优先使用 1.21.1 NeoForge 实例生成的新配置。
- 不直接覆盖旧 Forge 配置。
- 只迁移同 mod id、同配置项语义明确的内容。
- 服务端默认配置放 `defaultconfigs/`。
- 客户端或通用配置放 `config/`，但要确认是否适合团队共享。
- FancyMenu 的窗口标题、窗口图标等全局显示项在 `config/fancymenu/options.txt` 中维护；主菜单布局和图片资源分别在 `config/fancymenu/customization/` 与 `config/fancymenu/assets/` 中维护。

## 启动脚本

服务端启动模板：

```powershell
.\start.bat
```

Linux/macOS：

```bash
./start.sh
```

默认 NeoForge installer 文件名：

```text
neoforge.jar
```

如果根目录没有 `neoforge.jar`，启动脚本会按 `variables.txt` 中的 `NEOFORGE_INSTALLER_URL` 自动下载。运行服务端需要 Java 21。`neoforge.jar`、生成的 `run.bat` / `run.sh` 和 `libraries/` 都不提交。

首次启动时，脚本会用变量文件里的 `JVM_ARGS` 创建 `user_jvm_args.txt`。之后不会覆盖这个文件，服主可以直接修改 `user_jvm_args.txt` 调整内存；如果要恢复仓库默认值，删除 `user_jvm_args.txt` 后重新启动即可。

`variables.txt` 中的服务端行为开关：

```text
ACCEPT_EULA=true
AUTO_RESTART=false
RESTART_DELAY_SECONDS=10
```

默认不自动重启。需要崩服后自动拉起时，服主可以把 `AUTO_RESTART` 改成 `true`。

## 版本与发布

正式发布前至少检查：

1. 修改 `pack/pack.toml` 版本号。
2. 执行 `devtool.bat prepare-pack` 或 `devtool.bat refresh`。
3. 执行 `devtool.bat check`。
4. 检查 `git status --short --untracked-files=all`。
5. 确认没有 `mods/*.jar`、导出 zip、`.mrpack`、服务端运行产物进入提交。
6. 更新发布说明。

导出命令：

```powershell
devtool.bat export-curseforge
```

当前只保留 CurseForge 导出；Modrinth export 已移除。导出产物默认不提交。

## 协议与第三方声明

除第三方声明另有规定外，本项目自有源码、KubeJS 脚本、bkmpw/packwiz-style 元数据、配置文件、数据文件、配方定义、构建脚本和其它文本实现文件允许公开查看、学习、修改和非商业再分发。

商业使用项目代码，包括销售、授权、付费分发、付费托管、商业整合包集成、商业衍生作品，或在任何盈利产品或服务中使用，必须先取得版权持有人书面授权。

本项目自有材质、模型和相关资产文件全部保留所有权利（All Rights Reserved），除非对应文件或第三方声明另有规定。

第三方 mod、资源包、光影包、工具、库，以及引用或派生内容，原样继承其上游协议；本仓库中的引用、描述、打包或修改行为不改变其原协议。

协议与第三方声明集中在：

```text
LICENSE
```

如果更新 `scripts/bin/bkmpw.exe`，确认它来自本仓库当前 release build，并在变更说明中记录来源。

SHA256 计算命令：

```powershell
Get-FileHash .\scripts\bin\bkmpw.exe -Algorithm SHA256
```

## 提交规范

建议参考 Conventional Commits：

```text
feat: 添加某功能
fix: 修复某问题
docs: 更新文档
chore: 调整构建或仓库维护文件
refactor: 重构但不改变行为
```

bkmpw 操作导致的提交应说明影响范围，例如：

```text
chore(bkmpw): add create mod metadata
chore(bkmpw): refresh index
```

## Issue 认领

仓库的 issue 采用“先认领，再处理”的轻量流程，目的是避免多人同时重复开工。

- 新 issue 默认应带 `needs-claim` 标签。
- 开发者在 issue 下评论 `/claim` 表示要认领该任务。
- 认领后由 GitHub Action 自动将 issue 分配给评论人，并把标签从 `needs-claim` 切换为 `claimed`。
- 如果 issue 已经被认领，后续开发请优先在已分配的 issue 上继续，不要重复抢占同一任务。

对应自动化定义在：

```text
.github/workflows/issue-claim.yml
```

## 常用检查

```powershell
devtool.bat check
devtool.bat refresh
git status --short --untracked-files=all
git check-ignore --quiet mods/example.jar
git check-ignore --quiet mods/example.pw.toml
```

期望结果：

- `mods/example.jar` 被忽略。
- `mods/example.pw.toml` 不被忽略。
