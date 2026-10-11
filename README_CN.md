# eCapture 官网

[English](README.md) · [简体中文](README_CN.md)

本仓库构建 [ecapture.cc](https://ecapture.cc)，即 [eCapture（旁观者）](https://github.com/gojue/ecapture) 的官网与用户文档。eCapture 的命令行程序、eBPF 探针、测试和发行产物位于**独立的** `gojue/ecapture` 仓库。本站使用 VitePress、Vue 3 和 TypeScript。

## 当前的 eCapture

eCapture 在 TLS 库函数边界观察明文，无需中间人代理或自定义 CA 证书。官网重点介绍面向 OpenSSL、LibreSSL、BoringSSL 的 `tls` 探针、面向 Go 程序的 `gotls` 探针，以及面向 GnuTLS 库的 `gnutls` 探针。

上游 v2.8 代码新增 Linux LoongArch64 构建能力、GnuTLS 的 text/keylog/pcapng 捕获模式，并通过统一的 `--eventaddr` 指定 TLS、GoTLS 与 GnuTLS 捕获事件的目的端。`--logaddr` 单独承载程序运行日志；[eCaptureQ](https://github.com/gojue/ecaptureq) 另行接收结构化事件。具体约定请参阅[上游更新记录](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md)和[输出流水线说明](https://github.com/gojue/ecapture/blob/master/docs/agent/output-pipeline.md)。

| 运行环境 | 架构 | 最低内核 |
| --- | --- | --- |
| Linux | x86_64 / amd64 | 4.18+ |
| Linux | AArch64 / arm64 | 5.5+ |
| Linux | LoongArch64 / loong64 | 6.6+ |
| Android | x86_64 / amd64 | 4.18+ |
| Android | AArch64 / arm64 | 5.5+ |

暂不支持 Android/loong64、Windows 和 macOS。加载探针需要 root 或[指定的 Linux capabilities](https://github.com/gojue/ecapture/blob/master/docs/minimum-privileges.md)。请先核对[已发布的发行产物](https://github.com/gojue/ecapture/releases)中是否有 LoongArch64 包；也可参考 [LoongArch64 构建指南](https://github.com/gojue/ecapture/blob/master/docs/loong64-support.md)。构建流程包含交叉编译和用户态冒烟检查；用于生产环境前，应在目标硬件上验证 eBPF 捕获。

## 本站内容在哪里

| 内容 | 路径 |
| --- | --- |
| 中英文首页 | `src/index.md`、`src/zh/index.md`、`.vitepress/theme/components/` |
| 导航、主题与 SEO | `.vitepress/config.mts`、`.vitepress/theme/`、`.vitepress/navigation.json` |
| 中英文用户指南 | `src/en/`、`src/zh/` |
| Wiki 导入 | `scripts/wiki.json`、`scripts/generate_docs.js`、`scripts/migrate_docs.js` |
| 共用图片 | `src/public/assets/` |

大部分指南章节来自定期更新的 `scripts/wiki.json`。导入流程会替换 `src/en/` 与 `src/zh/`，然后恢复手工维护的中文首页、下载页及 `src/zh/usage/`。仅修改官网时，不要直接维护自动生成的章节；下次导入会覆盖它们。`src/index.md` 和 `src/zh/index.md` 由本站直接维护。

需要导入**已核实且最新**的 Wiki 快照时，运行 `bash scripts/update_docs.sh --no-dev`，审查正文与导航差异，再构建站点。仓库内现存快照可能落后于当前章节，运行会重建目录的迁移脚本前应先检查页面计划。

## 本地开发

使用 Node.js 22 或更新版本及 pnpm：

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run serve
```

`pnpm run build` 输出到 `dist/`，并检查站内链接。本仓库没有 `docs:dev`、`docs:build` 或自动测试脚本。Vercel 使用 `vercel.json` 指定的 `dist/` 输出；`netlify.toml` 提供另一套构建配置。自动部署触发条件由托管服务配置，不在本仓库声明。

修改官网时，应检查中英文首页及相关屏幕宽度。描述 eCapture 的运行行为时，应核对[上游源码](https://github.com/gojue/ecapture)、[README](https://github.com/gojue/ecapture/blob/master/README-zh_Hans.md)、[CHANGELOG](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md) 和当前发行版；导入的 Wiki 可能滞后。

## 问题反馈与许可证

官网问题请提交到[本站仓库](https://github.com/gojue/ecapture.cc/issues)；命令行程序或探针问题请提交到 [gojue/ecapture](https://github.com/gojue/ecapture/issues)。

本站仓库采用 [MIT 许可证](LICENSE)。独立的 eCapture 主程序采用 [Apache-2.0](https://github.com/gojue/ecapture/blob/master/LICENSE)。
