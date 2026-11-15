# 许可与归属说明（LICENSE-NOTICE）

本文件说明本仓库与上游、与第三方模组之间的权利关系。**本仓库不授予任何超出上游的授权。**

---

## 一、上游项目

| 项 | 内容 |
| --- | --- |
| 上游 | Create Delight Project Rebirth（CDPR） |
| 地址 | https://github.com/Jasons-impart/Create-Delight-Project-Rebirth |
| 维护者 | JSI（Jasons-impart） |
| 上游版本 | `v2.0.0.0-test4`（packwiz `pack/pack.toml`） |
| 本仓库关系 | 下游 fork：在 CDPR 的 1.21.1 移植线基础上，叠加本包自有任务书、脚本、数据与配置 |

上游在 `README.md` 与 `LICENSE` 中声明（原文摘要）：

- 除第三方声明另有规定外，**项目自有源码、KubeJS 脚本、packwiz 元数据、配置文件、数据文件、配方定义、构建脚本和其它文本实现文件**，允许公开查看、学习、修改和**非商业**再分发。
- **商业使用项目代码需要版权持有人事先书面授权。**
- **项目自有材质、模型和相关资产文件全部保留所有权利（All Rights Reserved）。**
- **第三方内容原样继承其上游协议**；`LICENSE` 中另有 Third-party Notices 段落，说明引用的第三方模组、资源包、光影、工具与库保留各自上游许可。

## 二、本仓库包含什么、不包含什么

**包含**（均属上游许可中「可查看/修改/非商业再分发」的文本类实现文件）：

- `config/`：FTB Quests 任务书、模组配置
- `kubejs/`：startup / server / client 脚本，`data/` 数据包，`assets/` 中的自定义贴图与 lang
- `docs/`、`mods.list`、`CHANGELOG.md` 等文档
- `patches/cdprfps/`：自研补丁源码（MIT）

**不包含**：

- 任何 mod jar、资源包 zip、光影包、存档、日志。
- 上游或第三方的材质/模型/音效原始资产（`kubejs/assets/` 中若含第三方素材，其权利仍归原作者）。

## 三、第三方模组

`mods.list` 只列文件名、modid、版本与来源判定，**不包含 jar 本体**。清单中的每一个模组仍受其各自许可约束（CurseForge / Modrinth / GitHub 上的原始协议）。复现实例时请按各模组页面声明的条款自行获取，不要从本仓库再分发 jar。

## 四、自研补丁

| 组件 | 许可 | 说明 |
| --- | --- | --- |
| `cdprfps` | MIT | 源码在 `patches/cdprfps/`，jar 不入库 |
| `cdc-mbd-guard` | 随本包 | 独立 Mixin 兜底补丁，源码未随包；行为见 `docs/DEV-LOG.md` |
| `cdc-seq-guard` | 随本包 | 同上 |

两个 `cdc-*-guard` 都是**独立 jar**，不修改 Create / createdelightcore 原 jar，因此不构成对上游模组的再分发。

## 五、免责声明

- 本仓库按「现状」提供，不附带任何担保。
- 任务书文本、配置与脚本可能包含来自 1.20.1 参考包与上游的内容，若权利人认为存在越权使用，请联系仓库维护者删除，本仓库不主张对其拥有额外权利。
- 本说明不构成法律意见；正式分发前请与上游维护者确认商业使用与非商业再分发的边界。
