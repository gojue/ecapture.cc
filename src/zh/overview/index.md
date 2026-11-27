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
| **TLS**（`tls`） | 使用受支持版本 OpenSSL 或 BoringSSL 的应用 |
| **GoTLS**（`gotls`） | 使用 Go TLS 实现的应用 |
| **GnuTLS**（`gnutls`） | Linux 上链接 GnuTLS 的应用 |

库路径与探针参数的选择见 [核心 TLS 模块](/zh/2-core-tls-modules/)。

## 实时查看、保存与分析 {#outputs}

**eCapture v2.12.0** 的三个核心探针默认使用文本模式和 `pcapng` 数据源。采集器结合单个网卡上的数据包与 TLS 密钥，重建 HTTP/1.x 和 HTTP/2 消息。消息与运行日志默认显示在标准输出。测试本机回环流量时指定 `-i lo`。如需边看终端边保存结构化记录，可加上 `--output stdout --output capture.jsonl`。

离线分析时，`-m pcapng --pcapfile capture.pcapng` 将数据包与 TLS 密钥一并保存，可直接在 Wireshark 中打开。如果已经单独抓包，使用 `-m keylog --keylogfile capture.keys` 保存配套的密钥即可。要在自己的 Go 程序中读取抓包，请参阅 [Decryptor SDK 快速开始](/decryptor/zh/quick-start/)。[比较三种捕获模式](/zh/3-capture-modes/)。

## 命令行工具还是图形界面？ {#relationship}

**eCapture 在采集端负责捕获与解密，eCaptureQ 提供图形化分析界面。** 两者在同一台机器时，启动 eCapture v2.12.0 时加上 `--stream-listen ws://127.0.0.1:28256/`，并在 eCaptureQ v1.2.0 中将该地址添加为数据源。使用 Web 版时，由 Q 服务连接采集器；浏览器默认通过 `http://127.0.0.1:28257/` 打开 Q 界面。[连接设置](/q/zh/data-sources/)

要搜索已解码的消息，使用文本模式。使用 `-m keylog` 或 `-m pcapng` 时，Q 可将订阅后收到的原生数据保存成文件。若要记录完整测试会话，请在握手前连接 Q。[原生文件导出](/q/zh/interface/#native)

| | eCapture | eCaptureQ |
| --- | --- | --- |
| 操作方式 | 命令行 | 桌面应用或 Web 界面 |
| 主要用途 | 捕获 TLS 明文，查看或保存输出 | 筛选、关联与查看消息 |
| 运行位置 | 受支持的 Linux / Android 采集端 | Windows、macOS 或 Linux 工作站 / Web 服务主机 |
| 获取方式 | [下载 eCapture](/zh/download/) | [下载 eCaptureQ](/q/zh/download/) |

监听命令和连接配置见 [eCaptureQ 快速开始](/q/zh/quick-start/)。

## 从受支持的采集环境开始 {#start}

Linux 支持 **amd64**、**arm64** 和 **loong64**，最低内核分别为 **4.18**、**5.5**、**6.6**；Android 支持 **amd64** 和 **arm64**。加载探针需要 root 权限或相应的 Linux capabilities。

下载匹配系统的构建产物后，按照 [快速入门](/zh/1-getting-started/) 完成第一次采集。对于使用 OpenSSL 的应用，基本命令为：

```sh
sudo ecapture tls
```

选择参数时请以已安装版本的文档与 `ecapture --help` 为准。更多部署与输出场景见 [进阶用法](/zh/4-advanced-usage/)，内部实现见 [架构与探针开发](/zh/5-architecture-and-probe-development/)。

[官方发布版本](https://github.com/gojue/ecapture/releases) · [源码与平台要求](https://github.com/gojue/ecapture) · [更新记录](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md)
