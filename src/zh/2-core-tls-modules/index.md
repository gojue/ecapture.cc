# 核心 TLS 模块

模块决定 **eCapture 从哪里取得 TLS 密钥**，捕获模式决定**最终产出什么数据**。每个受支持的 TLS 实现都可使用文本、密钥日志和 pcapng 工作流。

| 模块 | 采集主机上的目标 | 网络包文本解密 | 显式 hook 文本模式 |
| --- | --- | --- | --- |
| [tls](2.1-tls-capture-openssl-and-boringssl.md) | Linux 或 Android 上的 OpenSSL/BoringSSL 共享库 | 库提供的密钥和网络包 | OpenSSL 接口的读写事件 |
| [gotls](2.2-gotls-capture.md) | `--elfpath` 指定的 Go `crypto/tls` 可执行文件 | Go TLS 密钥和网络包 | Go TLS 连接读写事件 |
| [gnutls](2.3-gnutls-capture.md) | Linux 上受支持的 GnuTLS 共享库 | GnuTLS 握手密钥和网络包 | GnuTLS 记录收发事件 |

## 从建立连接到解码事件

1. 确认工作负载实际使用的 ELF 文件或共享库。先启动 eCapture，再让测试应用建立连接。
2. 默认的 `--model text --text-source pcapng` 在一张网卡上采包，结合可用的密钥，将 pcapng 流送入实时解密 SDK。如果工作负载使用的网卡与启动日志显示的不一致，通过 `-i` 指定。
3. 终端显示解码消息和运行日志。要用 Wireshark 检查这批数据，可追加 `--pcapfile session.pcapng`，也可选用原生 `--model pcapng --pcapfile session.pcapng`。

各模式的本地文件、终端输出及网络接收方式见[捕获模式选择](../3-capture-modes/3.1-choosing-text-keylog-or-pcapng.md)和[输出目的地](../3-capture-modes/3.5-event-destinations-and-rotation.md)。[采集器使用说明](https://github.com/gojue/ecapture/blob/v2.12.0/README.md)
