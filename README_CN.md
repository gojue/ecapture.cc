# eCapture 文档

<div align="center">

[English](README.md) | [简体中文](README_CN.md)

[![Website](https://img.shields.io/badge/website-ecapture.cc-blue)](https://ecapture.cc)
[![GitHub](https://img.shields.io/badge/GitHub-gojue/ecapture-black)](https://github.com/gojue/ecapture)
[![License](https://img.shields.io/badge/license-Apache%202.0-green)](LICENSE)

**eCapture 的完整文档 - 基于 eBPF 的 SSL/TLS 捕获和系统审计工具**

[查看文档](https://ecapture.cc) | [报告问题](https://github.com/gojue/ecapture/issues)

</div>

---

## 📖 关于本项目

本仓库托管 [eCapture（旁观者）](https://github.com/gojue/ecapture) 的**官方文档网站**。eCapture 是一个强大的基于 eBPF 的网络流量捕获和系统审计工具。文档提供了关于安装、架构、模块开发和使用模式的全面指南。

**eCapture** 能够以明文形式捕获 SSL/TLS 加密通信，**无需 CA 证书**或修改应用程序。它还提供了用于 Shell 命令、数据库查询和网络数据包的系统审计功能。

### eCapture 的核心特性

- ✨ **SSL/TLS 明文捕获** - 拦截来自 OpenSSL、BoringSSL、GnuTLS、NSS/NSPR 和 Go crypto/tls 的加密数据
- 🔒 **无需 CA 证书** - 透明捕获，无需安装证书
- 🐚 **系统审计** - 监控 Bash/Zsh 命令和 MySQL/PostgreSQL SQL 查询
- 📦 **多种输出格式** - 文本、PCAP-NG、密钥日志（SSLKEYLOGFILE）和 Protobuf 流
- 🚀 **eBPF 技术** - 内核级别 Hook，性能开销极小
- 🔧 **CO-RE 支持** - 一次编译，在兼容内核上到处运行

### 平台支持

| 架构                    | 最低内核版本 | 状态 |
|-----------------------|-------------|------|
| x86_64 (amd64)        | Linux 4.18+ | ✅ 完全支持 |
| aarch64 (arm64)       | Linux 5.5+ | ✅ 完全支持 |
| Android (amd64/arm64) | Android 12+ | ✅ 支持 (BoringSSL) |
| Windows / macOS       | N/A | ❌ 不支持 |

---

## 📚 文档结构

文档分为以下几个部分：

### 1. eCapture 简介
- [简介](src/zh/1-introducing-ecapture/index.md) - 系统目的与功能
- [核心功能与特性](src/zh/1-introducing-ecapture/1.1-introduction-and-core-capabilities.md) - 核心能力
- [支持的平台与版本](src/zh/1-introducing-ecapture/1.2-supported-platforms-and-versions.md) - 平台支持

### 2. 快速上手
- [安装指南与先决条件](src/zh/2-getting-started/2.1-installation-and-prerequisites.md) - 安装指南
- [最小权限配置](src/zh/2-getting-started/2.2-minimum-privileges.md) - 权限配置
- [快速开始](src/zh/2-getting-started/2.3-quick-start-run-the-first-example-in-5-minutes.md) - 5分钟运行首个示例
- [输出格式说明](src/zh/2-getting-started/2.4-output-formats-text--pcap--keylog.md) - 文本、PCAP 和 KeyLog 输出

### 3. 探针参考手册
- [探针参考手册](src/zh/3-probe-reference/index.md) - 模块注册表
- **TLS/SSL 探针**
  - [TLS/SSL 明文捕获](src/zh/3-probe-reference/3.1-tlsssl-plaintext-capture-openssl--boringssl.md) - OpenSSL/BoringSSL
  - [GoTLS 捕获](src/zh/3-probe-reference/3.2-gotls-capture.md) - Go crypto/tls
  - [GnuTLS 捕获](src/zh/3-probe-reference/3.3-gnutls-capture.md) - GnuTLS 支持
  - [NSS/NSPR 捕获](src/zh/3-probe-reference/3.4-nss--nspr-capture.md) - Firefox/Chrome NSS
- **系统审计探针**
  - [Shell 命令审计](src/zh/3-probe-reference/3.6-shell-auditing-bash--zsh.md) - Bash/Zsh 监控
  - [数据库流量捕获](src/zh/3-probe-reference/3.5-database-traffic-capture-mysql--postgresql.md) - MySQL/PostgreSQL 查询

### 4. 集成与部署
- [集成与部署概览](src/zh/4-integration-and-deployment/index.md) - 部署与集成指南
- [远程事件流](src/zh/4-integration-and-deployment/4.1-remote-event-streaming-ecaptureq-websocket.md) - WebSocket/TCP 流
- [远程动态配置 API](src/zh/4-integration-and-deployment/4.2-remote-dynamic-configuration-api.md) - 远程配置
- [日志与输出配置](src/zh/4-integration-and-deployment/4.3-logging-and-output-configuration.md) - 日志配置
- [性能开销与基准测试](src/zh/4-integration-and-deployment/4.4-performance-overhead-and-benchmarks.md) - 性能数据

### 5. 系统架构
- [架构概览](src/zh/7-architecture/index.md) - 系统架构设计
- [三层架构设计](src/zh/7-architecture/7.1-three-layer-architecture.md) - 三层系统设计
- [探针框架与扩展机制](src/zh/7-architecture/7.2-probe-framework-and-extension-mechanism.md) - 探针框架
- [事件处理流水线](src/zh/7-architecture/7.3-event-processing-pipeline.md) - 事件数据流

### 6. 开发者指南
- [开发者指南概览](src/zh/8-developer-guide/index.md) - 开发者文档
- [源码编译指南](src/zh/8-developer-guide/8.1-compilation-and-build.md) - 编译和构建过程
- [如何添加新探针](src/zh/8-developer-guide/8.2-how-to-add-a-new-probe.md) - 扩展 eCapture 新探针
- [测试策略与 CI/CD](src/zh/8-developer-guide/8.3-testing-strategy-and-cicd.md) - 测试和 CI/CD 流水线

### 7. 故障排查与常见问题
- [故障排查概览](src/zh/9-faq-and-troubleshooting/index.md) - 常见问题的解决方案
- [检测与防御](src/zh/9-faq-and-troubleshooting/9.1-detection-and-defense.md) - 检测与防御策略
- [术语表](src/zh/9-faq-and-troubleshooting/9.2-glossary.md) - 关键术语和概念

---

## 🚀 快速开始

### 本地查看文档

```bash
# 克隆仓库
git clone https://github.com/gojue/ecapture.cc.git
cd ecapture.cc

# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# 构建静态站点
pnpm docs:build
```

### 部署到生产环境

当更改推送到主分支时，文档会通过 [Vercel](https://vercel.com/) 自动部署到 [https://ecapture.cc](https://ecapture.cc)。

---

## 🔄 从 Wiki 生成最新文档

文档内容由 [Devin AI Wiki](https://app.devin.ai/org/gojue/wiki/gojue/ecapture?branch=master) 生成。按照以下步骤将文档更新为最新 Wiki 内容：

### 第 1 步 — 刷新 Wiki

打开 Devin AI Wiki 页面并触发刷新，确保 Wiki 反映最新源代码：

👉 [https://app.devin.ai/org/gojue/wiki/gojue/ecapture?branch=master](https://app.devin.ai/org/gojue/wiki/gojue/ecapture?branch=master)

### 第 2 步 — 下载最新 `wiki.json`

下载完整的多语言 Wiki 并覆盖 `scripts/wiki.json`：

```bash
curl -o scripts/wiki.json \
  "https://app.devin.ai/api/wiki/get_full_multi_language_wiki?repo_name=gojue%2Fecapture&branch_name=master"
```

### 第 3–6 步 — 一键更新与预览

脚本 `scripts/update_docs.sh` 将第 3–6 步合并为一条命令：

```bash
# 生成文档并启动预览服务
bash scripts/update_docs.sh

# 仅生成文档，不启动预览服务
bash scripts/update_docs.sh --no-dev
```

也可以逐步手动执行：

**第 3 步** — 清除文档缓存：
```bash
rm -rf docs/en docs/zh
```

**第 4 步** — 从 Wiki 生成文档：
```bash
node scripts/generate_docs.js
```

**第 5 步** — 将文档迁移到 `src/`：
```bash
node scripts/migrate_docs.js
```

**第 6 步** — 本地预览：
```bash
pnpm run dev
```

打开浏览器，确认渲染后的文档显示正确。

### 第 7 步 — 提交并推送

确认无误后，提交更改：

```bash
git add .
git commit -m "docs: update from latest wiki"
git push
```

---

## 🤝 贡献指南

我们欢迎对文档的改进贡献！您可以通过以下方式帮助：

1. **报告问题** - 发现拼写错误或不正确的信息？[提交 Issue](https://github.com/gojue/ecapture/issues)
2. **提交 Pull Request** - 改进现有文档或添加新内容
3. **翻译** - 帮助将文档翻译成其他语言
4. **分享反馈** - 建议结构和内容的改进

### 文档编写指南

- 编写清晰、简洁的内容，并提供实用示例
- 在适当的地方包含图表和代码示例
- 遵循现有的结构和格式
- 提交前测试所有代码示例
- 添加来自[主仓库](https://github.com/gojue/ecapture)的源代码引用

---

## 🔗 相关链接

- **主项目**: [github.com/gojue/ecapture](https://github.com/gojue/ecapture)
- **文档站点**: [ecapture.cc](https://ecapture.cc)
- **Issue 跟踪**: [GitHub Issues](https://github.com/gojue/ecapture/issues)
- **讨论区**: [GitHub Discussions](https://github.com/gojue/ecapture/discussions)

---

## 📝 许可证

Apache License 2.0

Copyright (c) 2022-present, CFC4N (https://www.cnxct.com)

根据 Apache 许可证 2.0 版（"许可证"）授权；除非遵守许可证，否则您不得使用此文件。您可以在以下位置获取许可证副本：

http://www.apache.org/licenses/LICENSE-2.0

除非适用法律要求或书面同意，否则根据许可证分发的软件是基于"按原样"分发的，不附带任何明示或暗示的保证或条件。有关许可证下权限和限制的具体信息，请参阅许可证。

---

## 👥 贡献者

特别感谢所有文档贡献者：

- [@CFC4N](https://github.com/CFC4N) - 项目负责人及核心开发者
- [@Marandi269](https://github.com/Marandi269) - 文档贡献者
- [@liushengxue](https://github.com/liushengxue) - 文档贡献者

---

<div align="center">

**[⬆ 返回顶部](#ecapture-文档)**

由 eCapture 团队用 ❤️ 制作

</div>

