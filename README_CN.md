# eCapture 官网

[English](README.md) · [简体中文](README_CN.md)

本仓库构建 [ecapture.cc](https://ecapture.cc)，即 [eCapture（旁观者）](https://github.com/gojue/ecapture) 的官网与用户文档。eCapture 的命令行程序、eBPF 探针、测试和发行产物位于**独立的** `gojue/ecapture` 仓库。本站使用 VitePress、Vue 3 和 TypeScript。

## 当前的 eCapture

官网重点介绍 OpenSSL 与 BoringSSL 应用使用的 `tls` 探针、Go `crypto/tls` 应用使用的 `gotls` 探针，以及 GnuTLS 应用使用的 `gnutls` 探针。三者都可结合数据包和 TLS 密钥重建消息，无需自定义 CA。

本 Wiki 对应 **eCapture v2.12.0**。文本模式默认使用 pcapng 数据源，可重复传入 `--output` 指定结构化记录的输出位置，使用 `--pcapfile` 和 `--keylogfile` 保存原生格式文件。**eCaptureQ v1.2.0** 通过 `ecapture.v2` WebSocket 子协议连接采集器的 `--stream-listen` 监听地址。[采集器迁移说明](https://github.com/gojue/ecapture/releases/tag/v2.12.0) · [eCaptureQ 发布说明](https://github.com/gojue/ecaptureQ/releases/tag/v1.2.0)

| 运行环境 | 架构 | 最低内核 |
| --- | --- | --- |
| Linux | x86_64 / amd64 | 4.18+ |
| Linux | AArch64 / arm64 | 5.5+ |
| Linux | LoongArch64 / loong64 | 6.6+ |
| Android | x86_64 / amd64 | 4.18+ |
| Android | AArch64 / arm64 | 5.5+ |

可使用 root 运行，或按采集模式授予所需的 Linux capabilities。默认文本模式和原生 pcapng 模式都会在网卡上挂载 TC 探针，因此都需要 `CAP_NET_ADMIN`。[各内核版本与采集模式的权限要求](src/zh/1-getting-started/1.1-requirements-and-installation.md#内核特性与权限)

Linux LoongArch64 提供压缩包与 Debian 软件包，并在原生硬件上运行 OpenSSL 和 GoTLS 端到端测试。[发行产物](https://github.com/gojue/ecapture/releases) · [LoongArch64 构建与测试范围](https://github.com/gojue/ecapture/blob/v2.12.0/docs/loong64-support.md)

## 本站内容在哪里

| 内容 | 路径 |
| --- | --- |
| 中英文首页 | `src/index.md`、`src/zh/index.md`、`.vitepress/theme/components/` |
| 导航、主题与 SEO | `.vitepress/config.mts`、`.vitepress/theme/`、`.vitepress/navigation.json` |
| 中英文用户指南 | `src/en/`、`src/zh/` |
| eCaptureQ 用户指南与 Decryptor SDK 开发者指南 | `src/q/{en,zh}/`、`src/decryptor/{en,zh}/` |
| Wiki 导入 | `scripts/wiki.json`、`scripts/generate_docs.js`、`scripts/migrate_docs.js` |
| 共用图片 | `src/public/assets/` |

六个双语 Wiki 章节由 `scripts/wiki.json` 生成。修订时同步更新快照与发布的 Markdown，以便下次导入时保留修改。迁移脚本会恢复采集器的中英文概览、下载页、中文首页和 `src/zh/usage/`。英文首页、eCaptureQ 用户指南和 Decryptor SDK 开发者指南均单独维护。

需要导入**已核实且最新**的 Wiki 快照时，运行 `bash scripts/update_docs.sh --no-dev`，审查正文与导航差异，再构建站点。仓库内现存快照可能落后于当前章节，运行会重建目录的迁移脚本前应先检查页面计划。

## 本地开发

使用 Node.js 22 或更新版本及 pnpm：

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run serve
```

`pnpm run build` 输出到 `dist/`，同时检查站内链接。`pnpm run check:mermaid` 检查图表语法，构建后的 `pnpm run check:q` 检查产品页面。Vercel 使用 `vercel.json` 指定的 `dist/` 输出，Netlify 的构建配置在 `netlify.toml` 中。

## 文档搜索

本站使用 VitePress 本地搜索，构建时自动生成中英文索引，不需要搜索服务、API Key 或 Vercel 环境变量。重新构建并部署后即可使用搜索；搜索会根据当前页面语言选择对应的索引。

`@vue/theme` 已固定版本，并在 `patches/` 中增加导航栏的本地搜索入口。

修改官网时，应检查中英文首页及相关屏幕宽度。描述 eCapture 的运行行为时，应核对[上游源码](https://github.com/gojue/ecapture)、[README](https://github.com/gojue/ecapture/blob/master/README-zh_Hans.md)、[CHANGELOG](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md) 和当前发行版；导入的 Wiki 可能滞后。

## 问题反馈与许可证

官网问题请提交到[本站仓库](https://github.com/gojue/ecapture.cc/issues)；命令行程序或探针问题请提交到 [gojue/ecapture](https://github.com/gojue/ecapture/issues)。

本站仓库采用 [MIT 许可证](LICENSE)。独立的 eCapture 主程序采用 [Apache-2.0](https://github.com/gojue/ecapture/blob/master/LICENSE)。
