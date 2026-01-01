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

| 架构 | 最低内核版本 | 状态 |
|------|-------------|------|
| x86_64 (amd64) | Linux 4.18+ | ✅ 完全支持 |
| aarch64 (arm64) | Linux 5.5+ | ✅ 完全支持 |
| Android ARM64 | Android 12+ | ✅ 支持 (BoringSSL) |
| Windows / macOS | N/A | ❌ 不支持 |

---

## 📚 文档结构

文档分为以下几个部分：

### 1. 概述
- [简介](src/zh/1-overview/index.md) - 系统目的与功能
- [安装与快速入门](src/zh/1-overview/1.1-installation-and-quick-start.md) - 快速开始
- [命令行界面](src/zh/1-overview/1.2-command-line-interface.md) - CLI 参考
- [依赖与系统要求](src/zh/1-overview/1.3-dependencies-and-system-requirements.md) - 系统先决条件

### 2. 架构设计
- [架构概述](src/zh/2-architecture/index.md) - 五层系统设计
- [eBPF 引擎](src/zh/2-architecture/2.1-ebpf-engine.md) - eBPF 程序管理
- [事件处理管道](src/zh/2-architecture/2.2-event-processing-pipeline.md) - 数据流和处理
- [配置系统](src/zh/2-architecture/2.3-configuration-system.md) - 配置管理
- [模块系统与生命周期](src/zh/2-architecture/2.4-module-system-and-lifecycle.md) - 模块架构
- [版本检测](src/zh/2-architecture/2.5-version-detection-and-bytecode-selection.md) - 动态字节码选择
- [连接跟踪](src/zh/2-architecture/2.6-network-connection-tracking.md) - 网络流管理

### 3. 捕获模块
- [模块概述](src/zh/3-capture-modules/index.md) - 模块注册表
- **TLS/SSL 模块**
  - [OpenSSL 模块](src/zh/3-capture-modules/3.1.1-openssl-module.md) - OpenSSL/BoringSSL/LibreSSL
  - [Go TLS 模块](src/zh/3-capture-modules/3.1.2-go-tls-module.md) - Go crypto/tls
  - [GnuTLS 与 NSS 模块](src/zh/3-capture-modules/3.1.3-gnutls-and-nss-modules.md) - GnuTLS 和 Firefox/Chrome NSS
  - [Master Secret 提取](src/zh/3-capture-modules/3.1.4-master-secret-extraction.md) - 密钥提取机制
- **系统审计模块**
  - [Shell 命令审计](src/zh/3-capture-modules/3.2.1-shell-command-auditing.md) - Bash/Zsh 监控
  - [数据库查询审计](src/zh/3-capture-modules/3.2.2-database-query-auditing.md) - MySQL/PostgreSQL 查询
- [网络数据包捕获 (TC)](src/zh/3-capture-modules/3.3-network-packet-capture-with-tc.md) - TC eBPF 程序

### 4. 输出格式
- [文本输出模式](src/zh/4-output-formats/4.1-text-output-mode.md) - 控制台/文件输出
- [PCAP 集成](src/zh/4-output-formats/4.2-pcap-integration.md) - Wireshark 兼容格式
- [TLS 密钥日志](src/zh/4-output-formats/4.3-tls-key-logging.md) - SSLKEYLOGFILE 格式
- [Protobuf 与外部集成](src/zh/4-output-formats/4.4-protobuf-and-external-integration.md) - WebSocket/TCP 流

### 5. 开发指南
- [构建系统](src/zh/5-development-guide/5.1-build-system.md) - 编译和构建过程
- **eBPF 程序开发**
  - [程序结构](src/zh/5-development-guide/5.2.1-ebpf-program-structure.md) - eBPF 代码组织
  - [结构体偏移计算](src/zh/5-development-guide/5.2.2-structure-offset-calculation.md) - 内存布局处理
- [添加新模块](src/zh/5-development-guide/5.3-adding-new-modules.md) - 扩展 eCapture
- [事件处理与解析器](src/zh/5-development-guide/5.4-event-processing-and-parsers.md) - 自定义解析器

### 6. 故障排除与常见问题
- [常见问题](src/zh/6-troubleshooting-and-faq/index.md) - 常见问题的解决方案

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

