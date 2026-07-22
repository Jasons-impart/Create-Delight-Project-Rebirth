#!/usr/bin/env bash
set -euo pipefail

repo_url="https://github.com/Jasons-impart/Create-Delight-Project-Rebirth.git"
skip_install_files=0
input_path=""

expected_mc=""
expected_neoforge=""

if [[ -t 1 ]]; then
  c_title=$'\033[35m'
  c_title_dim=$'\033[95m'
  c_info=$'\033[90m'
  c_step=$'\033[36m'
  c_ok=$'\033[32m'
  c_warn=$'\033[33m'
  c_err=$'\033[31m'
  c_reset=$'\033[0m'
else
  c_title=""
  c_title_dim=""
  c_info=""
  c_step=""
  c_ok=""
  c_warn=""
  c_err=""
  c_reset=""
fi

title() {
  local i
  printf '\n%s%s%s\n' "$c_title" "$1" "$c_reset"
  printf '%s' "$c_title_dim"
  for ((i = 0; i < ${#1}; i++)); do
    printf '='
  done
  printf '%s\n' "$c_reset"
}

info() {
  printf '%s[信息]%s %s\n' "$c_info" "$c_reset" "$1"
}

step() {
  printf '\n%s==>%s %s\n' "$c_step" "$c_reset" "$1"
}

ok() {
  printf '%s[完成]%s %s\n' "$c_ok" "$c_reset" "$1"
}

warn() {
  printf '%s[警告]%s %s\n' "$c_warn" "$c_reset" "$1"
}

fail() {
  printf '%s[错误]%s %s\n' "$c_err" "$c_reset" "$1" >&2
  exit 1
}

usage() {
  cat <<EOF
用法：
  bash install-prism.sh [Prism实例目录或minecraft目录]

选项：
  --skip-install-files    只部署仓库，不下载 mod 和资源文件
  --repo-url URL          使用指定 Git 仓库
  -h, --help              显示帮助
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-install-files)
      skip_install_files=1
      shift
      ;;
    --repo-url)
      repo_url="${2:-}"
      [[ -n "$repo_url" ]] || fail "--repo-url 需要 URL"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -z "$input_path" ]]; then
        input_path="$1"
        shift
      else
        fail "未知参数：$1"
      fi
      ;;
  esac
done

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "未找到命令：$1。请先安装并加入 PATH。"
}

resolve_existing_dir() {
  local path="$1"
  [[ -d "$path" ]] || fail "目录不存在：$path"
  (cd "$path" && pwd -P)
}

read_pack_version() {
  local pack_toml="$1"
  local key="$2"
  local value

  [[ -f "$pack_toml" ]] || fail "缺少整合包版本基线：$pack_toml"
  value="$(sed -n -E "s/^[[:space:]]*$key[[:space:]]*=[[:space:]]*\"([^\"]+)\"[[:space:]]*$/\1/p" "$pack_toml" | head -n 1)"
  [[ -n "$value" ]] || fail "pack/pack.toml 缺少 versions.$key"
  printf '%s' "$value"
}

detect_dirs() {
  local raw="$1"
  local resolved
  resolved="$(resolve_existing_dir "$raw")"

  if [[ -f "$resolved/mmc-pack.json" ]]; then
    instance_dir="$resolved"
    game_dir="$resolved/minecraft"
    return
  fi

  if [[ "$(basename "$resolved")" == "minecraft" && -f "$(dirname "$resolved")/mmc-pack.json" ]]; then
    game_dir="$resolved"
    instance_dir="$(dirname "$resolved")"
    return
  fi

  fail "未找到 Prism 实例标记 mmc-pack.json。请输入 Prism 实例目录，或实例内的 minecraft 目录。"
}

title "Create Delight Project Rebirth Prism 部署脚本"
info "目标 Minecraft 与 NeoForge 版本将在克隆后从 pack/pack.toml 读取。"
info "Prism 实例名可以自定义；仓库识别只依赖游戏目录中的 .git。"

require_command git
require_command node
require_command npm
require_command grep
require_command cp
require_command rm
require_command sed
require_command head

if [[ -z "$input_path" ]]; then
  printf '%s[输入]%s Prism 实例目录或 minecraft 目录 > ' "$c_warn" "$c_reset"
  read -r input_path
fi

input_path="${input_path/#\~/$HOME}"
detect_dirs "$input_path"

[[ -d "$game_dir" ]] || mkdir -p "$game_dir"

info "Prism 实例目录：$instance_dir"
info "游戏目录：$game_dir"

tmp_dir="$game_dir/tmp"
if [[ -e "$tmp_dir" ]]; then
  if [[ -n "$(find "$tmp_dir" -mindepth 1 -maxdepth 1 2>/dev/null)" ]]; then
    warn "tmp 目录已存在且非空：$tmp_dir"
    printf '%s[输入]%s 是否删除后重新克隆？输入 YES 继续 > ' "$c_warn" "$c_reset"
    read -r answer
    [[ "$answer" == "YES" ]] || fail "已取消。请清理 tmp 后重试。"
  fi
  rm -rf "$tmp_dir"
fi

step "克隆仓库到 tmp"
git clone --depth 1 "$repo_url" "$tmp_dir"
ok "仓库克隆完成"

[[ -d "$tmp_dir/.git" ]] || fail "克隆结果缺少 .git：$tmp_dir/.git"
[[ -f "$tmp_dir/devtool.sh" ]] || fail "克隆结果缺少 devtool.sh：$tmp_dir/devtool.sh"

expected_mc="$(read_pack_version "$tmp_dir/pack/pack.toml" minecraft)"
expected_neoforge="$(read_pack_version "$tmp_dir/pack/pack.toml" neoforge)"
info "pack/pack.toml 要求 Minecraft $expected_mc + NeoForge $expected_neoforge。"

mmc_pack="$instance_dir/mmc-pack.json"
grep -F "$expected_mc" "$mmc_pack" >/dev/null || fail "mmc-pack.json 中未找到 Minecraft $expected_mc。请检查 Prism 实例版本。"
grep -F "$expected_neoforge" "$mmc_pack" >/dev/null || fail "mmc-pack.json 中未找到 NeoForge $expected_neoforge。请检查 Prism 实例加载器版本。"

step "覆盖 Prism 游戏目录"
cp -a "$tmp_dir"/. "$game_dir"/
rm -rf "$tmp_dir"
ok "文件覆盖完成"

step "安装 npm 依赖"
(cd "$game_dir" && npm install)
ok "npm 依赖安装完成"

step "安装 bkmpw 工具"
(cd "$game_dir" && sh ./devtool.sh setup-tools)
ok "bkmpw 工具安装完成"

step "生成本地 pack 文件"
(cd "$game_dir" && sh ./devtool.sh prepare-pack)
ok "pack 文件生成完成"

step "检查仓库状态"
(cd "$game_dir" && sh ./devtool.sh check)
ok "检查完成"

if [[ "$skip_install_files" -eq 0 ]]; then
  step "同步 mod 和资源文件"
  (cd "$game_dir" && sh ./devtool.sh install-files-headless 5 5)
  ok "mod 和资源文件同步完成"
else
  warn "已跳过 install-files。稍后请在游戏目录运行：sh ./devtool.sh install-files-headless 5 5"
fi

step "完成"
ok "部署完成"
printf '%s请在 Prism Launcher 中启动实例：%s%s%s%s\n' "$c_info" "$c_reset" "$c_ok" "$(basename "$instance_dir")" "$c_reset"
