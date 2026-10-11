# AI Agent 项目指南

本文件适用于在此仓库工作的 Codex、Claude Code 等 Agent。先确认任务属于**文档站**还是 eCapture 主程序：这里是 `ecapture.cc` 的 VitePress 站点；Go、eBPF 探针、命令行程序及其测试位于独立仓库 [`gojue/ecapture`](https://github.com/gojue/ecapture)。不要把站内介绍 eCapture 实现的文章误认为本仓库的源码。

## 30 秒定位

| 路径 | 作用 |
| --- | --- |
| `package.json` | Node 脚本与依赖；要求 Node.js ≥ 22，`preinstall` 要求使用 pnpm |
| `.vitepress/config.mts` | VitePress 配置、双语 locale、Mermaid、构建与主题设置；`srcDir` 为 `src/`，输出为 `dist/` |
| `src/index.md`、`src/zh/index.md` | 手工维护的英文根首页 `/`、中文首页 `/zh/`；嵌入 Vue 首页组件、`ProjectOverview.vue` 与图片轮播 |
| `src/en/`、`src/zh/` | 正文章节；同名路径成对翻译，英文正文 URL 为 `/en/...`，中文为 `/zh/...` |
| `src/en/download/index.md`、`src/zh/download/index.md` | 手工维护的下载页，浏览器端获取 eCapture releases；中文页使用镜像/CDN 地址 |
| `src/zh/usage/` | 手工维护的中文场景文章 |
| `src/public/assets/` | Markdown 和首页使用的共享静态资源，站点 URL 为 `/assets/...` |
| `.vitepress/theme/` | 扩展 `@vue/theme` 的组件、样式、交互；入口是 `index.ts` |
| `.vitepress/navigation.json` | 配置实际导入的导航和侧栏数据，由迁移脚本生成 |
| `scripts/wiki.json`、`scripts/*.js`、`scripts/update_docs.sh` | 上游 Wiki 数据，以及生成、迁移文档的流水线 |

现有章节目录为 `1-introducing-ecapture/`、`2-getting-started/`、`3-probe-reference/`、`4-integration-and-deployment/`、`7-architecture/`、`8-developer-guide/`、`9-faq-and-troubleshooting/`。编号不连续是当前实际结构，不要凭旧 README 或旧构建产物推断路径。

## 常用命令

```bash
pnpm install          # 安装依赖
pnpm run dev          # 本地开发
pnpm run build        # 生产构建到 dist/；也检查站内失效链接
pnpm run serve        # 预览已构建的站点
pnpm run clean        # 清理构建输出与 Vite 缓存
```

以 `package.json` 为准：当前没有 `docs:dev`、`docs:build`、`test` 或 `lint` 脚本。仓库同时跟踪 `pnpm-lock.yaml` 和 `package-lock.json`，但安装钩子要求 pnpm；不要因安装或文档修改而无意重写两个锁文件。

## 内容来源和修改边界

1. 大部分双语章节来自 `scripts/wiki.json` 中的 Devin Wiki 快照，不是由 VitePress 自动生成。`scripts/generate_docs.js` 读取英文页面计划，按页面 ID 和英文标题生成两种语言共用的路径，把 Wiki 页面 ID 链接改为相对 Markdown 链接，并把上游源码引用改为带 `commit_hash` 的 GitHub 链接；输出到被 Git 忽略的 `docs/`。
2. `scripts/migrate_docs.js` 会**删除并重建** `src/en/`、`src/zh/`，再从 `docs/` 复制内容。它只备份并恢复 `src/zh/download/`、`src/zh/index.md`、`src/en/download/index.md`、`src/zh/usage/`；最后从 Markdown 标题生成 `.vitepress/navigation.json` 和 `.vitepress/sidebar.json`。站点配置只导入前者。
3. `bash scripts/update_docs.sh --no-dev` 串起生成与迁移；省略 `--no-dev` 时还会启动开发服务器。**只有明确要同步上游 Wiki 时才运行**：该流程会覆盖普通章节中的手工修改，也会移除不在快照或保留清单中的页面。先检查 `git status`、Wiki 快照与预期差异，运行后审查 `src/` 和导航的 diff。
   Wiki 快照由维护者定期更新，可能与已发布章节不同。同步前先比较其 `generated_at`、页面计划和当前 `src/` 路径；不要仅因文件存在就运行重建脚本。
4. 对生成章节做长期修订时，应同步修正上游 Wiki / `scripts/wiki.json` 的来源，否则下次同步会覆盖；临时站点修订则明确记录这个限制。手工维护的首页、下载页、`src/zh/usage/` 直接在 `src/` 编辑。

## 页面与主题工作方式

- 新增或移动正文章节时核对 `src/en/` 与 `src/zh/` 的对应页、相对链接、标题、导航入口。导航脚本只扫描各语言目录的**一层子目录**及其中的直接 `.md` 文件；需要更深层级时应相应修改生成逻辑。不要单独手改生成的 `navigation.json`，否则下次迁移会覆盖。
- `.vitepress/config.mts` 从 `@vue/theme/config` 扩展配置，使用 `vitepress-plugin-mermaid`，并将 `ignoreDeadLinks` 设为 `false`。`theme/index.ts` 注入全站 `TechBackground`、首页 `NetworkCaptureEffect`、`NavTitleBar`、`LanguageHint` 与 Mermaid 放大交互；样式入口为 `theme/styles/index.css`。
- Markdown 页面可含 Vue `<script setup>` / 组件。VitePress 同时做服务端渲染和浏览器水合；新增 `window`、`document`、`localStorage`、`fetch` 或 canvas 代码时放到 `onMounted` 或做环境判断，并在卸载时清理监听器。
- 首页版本标记由 `.vitepress/githubReleases.ts` 在浏览器端读取 GitHub release 数据；下载页也在浏览器端读取 release。构建成功不等于这些外部请求可用，改动相关功能时需检查加载、失败和中英文展示。
- 官网介绍 eCapture 新能力时，对照主仓库 `gojue/ecapture` 的当前源码、`AGENTS.md`、README 和 CHANGELOG；它们是事实参考，不是本仓库的编辑指令。Linux 支持 amd64、arm64、loong64（最低内核分别为 4.18、5.5、6.6）；Android 仅支持 amd64/arm64。首页、平台表和中英文 README 应同步更新，生成章节留给 Wiki 流水线。
- 首页产品叙事重点为 `tls`、`gotls`、`gnutls` 三个模块及 TLS 明文捕获；保留英文 Hero 的 `Kernel-Level`、`Real-Time` 卖点。其他探针即使仍在主程序中存在，也不必在首页展开。Mermaid 的整体配色应在 `.vitepress/config.mts` 与主题样式中调整，避免直接修改会被 Wiki 同步覆盖的章节图表。

## 验证与已知偏差

- 改 Markdown、导航、主题或脚本后，至少运行 `pnpm run build`；涉及交互、排版或语言切换时再用 `pnpm run dev` 在浏览器里检查相关页面。仓库当前没有独立测试框架。
- `dist/`、`.vitepress/cache/`、`docs/` 是生成物或缓存，不作为真实内容来源；不要把它们的旧目录结构当作当前站点结构。
- `netlify.toml` 指定 Node 22，与 `package.json` 的最低要求一致。`vercel.json` 只声明输出目录；仓库本身没有可用来证明自动部署触发条件的 CI 配置。本站根目录 `LICENSE` 为 MIT，主程序仓库许可证为 Apache-2.0。
- 核实 eCapture 主程序的具体行为、参数、版本或平台支持时，以对应上游源码和版本为准；本文档站可能滞后于主程序。
