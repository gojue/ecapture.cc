---
title: eCapture — 产品概览
description: 使用 eCapture 命令行工具捕获 TLS 明文，在终端实时查看、写入文件保存，或连接图形界面进一步分析。
lang: zh-CN
---

# eCapture

通过 **eBPF 驱动的命令行采集工具**，让 TLS 明文清晰可见。在受支持的 Linux 或 Android 采集端运行 eCapture，可直接在终端查看捕获结果与运行日志，也可将输出写入文件，供后续分析。

## 在通信发生处采集 {#capture}

eCapture 观察受支持的 TLS 库与 Go 应用，无需安装自定义 CA，也无需修改目标应用代码。可用于查看请求与响应、排查加密连接问题，以及开展经过授权的安全分析。

根据目标应用选择对应探针：

| 探针 | 采集对象 |
| --- | --- |
| **TLS**（`tls`） | OpenSSL、LibreSSL 与 BoringSSL |
| **GoTLS**（`gotls`） | 使用 Go TLS 实现的应用 |
| **GnuTLS**（`gnutls`） | 链接 GnuTLS 的应用 |

库路径与探针参数的选择见 [核心 TLS 模块](/zh/2-core-tls-modules/)。

## 实时查看、保存与分析 {#outputs}

使用 **文本模式** 在终端查看捕获的明文，并按需要将输出写入文件。运行日志描述采集器自身的工作情况，捕获消息则记录观察到的应用通信内容。

其他工作流程中，**Keylog** 用于保存 TLS 会话密钥，**PCAPNG** 用于保存数据包与 TLS 密钥，便于在 Wireshark 等工具中继续分析。选择输出格式时可参考 [捕获模式](/zh/3-capture-modes/)。

## 命令行工具还是图形界面？ {#relationship}

**eCapture 在采集端负责捕获与解密，eCaptureQ 提供图形化分析界面。** 你可以在终端中独立使用 eCapture，也可以让 eCaptureQ 连接兼容的采集器，对消息进行搜索与关联分析。

| | eCapture | eCaptureQ |
| --- | --- | --- |
| 操作方式 | 命令行 | 桌面应用或 Web 界面 |
| 主要用途 | 捕获 TLS 明文，查看或保存输出 | 筛选、关联与查看消息 |
| 运行位置 | 受支持的 Linux / Android 采集端 | Windows、macOS 或 Linux 工作站 / Web 服务主机 |
| 获取方式 | [下载 eCapture](/zh/download/) | [下载 eCaptureQ](/q/zh/download/) |

图形界面的工作流程可参阅已有的 [eCaptureQ 产品概览](/q/zh/)。

## 从受支持的采集环境开始 {#start}

Linux 支持 **amd64**、**arm64** 和 **loong64**，最低内核分别为 **4.18**、**5.5**、**6.6**；Android 支持 **amd64** 和 **arm64**。加载探针需要 root 权限或相应的 Linux capabilities。

下载匹配系统的构建产物后，按照 [快速入门](/zh/1-getting-started/) 完成第一次采集。对于使用 OpenSSL 的应用，基本命令为：

```sh
sudo ecapture tls
```

选择参数时请以已安装版本的文档与 `ecapture --help` 为准。更多部署与输出场景见 [进阶用法](/zh/4-advanced-usage/)，内部实现见 [架构与探针开发](/zh/5-architecture-and-probe-development/)。

[官方发布版本](https://github.com/gojue/ecapture/releases) · [源码与平台要求](https://github.com/gojue/ecapture) · [更新记录](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md)
