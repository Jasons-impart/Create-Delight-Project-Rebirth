# 比较 0488 与旧包上游

开始前配置 [`CDPR_LEGACY_REPO`](../README.md#本机路径)，选一份包含比较两端提交的旧包 Git 仓库。记录完整的基线、目标 SHA 和核对日期；浅克隆缺少提交时，使用有完整历史的单独参考克隆。

以下 Bash 命令从 CDPR 源码根目录执行。目标使用本机已有的 `origin/main` 引用，执行时固定为完整 SHA。核对新版本前先确认这个引用对应所需的上游修订。

```bash
base=$(git -C "$CDPR_LEGACY_REPO" rev-parse --verify 'e75f52b133^{commit}') &&
tip=$(git -C "$CDPR_LEGACY_REPO" rev-parse --verify 'origin/main^{commit}') && (
  set -e
  mkdir -p docs/generated
  git -C "$CDPR_LEGACY_REPO" rev-list --count "$base..$tip"
  git -C "$CDPR_LEGACY_REPO" log --oneline "$base..$tip" > "docs/generated/commits-$base-$tip.txt"
  git -C "$CDPR_LEGACY_REPO" diff --name-status "$base" "$tip" > "docs/generated/files-$base-$tip.txt"
)
```

查单项变更可用 `git -C "$CDPR_LEGACY_REPO" log "$base..$tip" -- kubejs/`；用 `git show <SHA>:<相对路径>` 核对具体内容。提交数用 `rev-list` 统计，文件清单来自两棵树的差异，两者分别记录。

旧报告记载 2026-09-26 的端点为 `c5e673a0`，共 476 个提交；随附逐提交文本止于 09-24 的 `aae8dd00`，共有 469 行。逐文件文本有 5,078 行。两份旧文本及报告的端点未能统一核实，因此日常比较使用上面的命令按指定 SHA 重算。
