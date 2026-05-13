#!/usr/bin/env bash
# =============================================================================
# update_docs.sh
#
# 根据 scripts/wiki.json 重新生成并预览文档，对应 README 中的步骤 3-6：
#   Step 3 — 删除 docs/en 和 docs/zh 缓存目录
#   Step 4 — 执行 scripts/generate_docs.js
#   Step 5 — 执行 scripts/migrate_docs.js
#   Step 6 — 启动 pnpm run dev 预览（可通过 --no-dev 跳过）
#
# 用法：
#   bash scripts/update_docs.sh          # 生成文档并启动预览服务
#   bash scripts/update_docs.sh --no-dev # 生成文档但不启动预览服务
# =============================================================================

set -euo pipefail

# ── 颜色输出 ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; }
step()    { echo -e "\n${BOLD}${GREEN}▶ $*${RESET}"; }

# ── 参数解析 ──────────────────────────────────────────────────────────────────
START_DEV=true
for arg in "$@"; do
  case "$arg" in
    --no-dev) START_DEV=false ;;
    -h|--help)
      echo "用法: bash scripts/update_docs.sh [--no-dev]"
      echo "  --no-dev  跳过 pnpm run dev 预览步骤"
      exit 0
      ;;
    *)
      warn "未知参数: $arg（已忽略）"
      ;;
  esac
done

# ── 定位项目根目录 ────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"
info "项目根目录：${ROOT_DIR}"

# ── 前置检查 ──────────────────────────────────────────────────────────────────
if [[ ! -f "scripts/wiki.json" ]]; then
  error "scripts/wiki.json 不存在，请先完成步骤 1-2（刷新并下载 wiki.json）。"
  exit 1
fi

if ! command -v node &>/dev/null; then
  error "未找到 node，请先安装 Node.js >= 22。"
  exit 1
fi

if ! command -v pnpm &>/dev/null; then
  error "未找到 pnpm，请先执行：npm install -g pnpm"
  exit 1
fi

# ── Step 3：清除文档缓存 ──────────────────────────────────────────────────────
step "Step 3 — 清除文档缓存目录（docs/en、docs/zh）"
for dir in docs/en docs/zh; do
  if [[ -d "$dir" ]]; then
    rm -rf "$dir"
    success "已删除 $dir"
  else
    info "$dir 不存在，跳过"
  fi
done

# ── Step 4：生成文档 ──────────────────────────────────────────────────────────
step "Step 4 — 从 wiki.json 生成文档（generate_docs.js）"
node scripts/generate_docs.js
success "generate_docs.js 执行完毕"

# ── Step 5：迁移文档 ──────────────────────────────────────────────────────────
step "Step 5 — 将文档迁移到 src/（migrate_docs.js）"
node scripts/migrate_docs.js
success "migrate_docs.js 执行完毕"

# ── Step 6：本地预览 ──────────────────────────────────────────────────────────
if [[ "$START_DEV" == "true" ]]; then
  step "Step 6 — 启动本地预览（pnpm run dev）"
  info "按 Ctrl+C 退出预览服务器"
  pnpm run dev
else
  info "已跳过 pnpm run dev（--no-dev 模式）"
  echo -e "\n${BOLD}文档已生成完毕。如需预览，请手动执行：${RESET}"
  echo "  pnpm run dev"
fi

