# 捕获模式

对于 `tls`、`gotls` 和 `gnutls`，`--model`（`-m`）决定采集器产出什么数据。先确定抓包要回答的问题。同一次 HTTPS 请求，既可以实时查看，也可以仅记录 TLS 密钥，或为 Wireshark 保留网络包。

| 要回答的问题 | 模式 | 如何验证 |
| --- | --- | --- |
| 应用发出了什么请求？ | [文本](3.2-text-mode.md) | 在 `TEXT` 事件中找到解码后的路径、标头或正文。 |
| 已有的独立抓包能解密吗？ | [密钥日志](3.3-keylog-mode.md) | 将 NSS 密钥日志与对应的网络包一同加载到 Wireshark。 |
| 哪些数据包承载了请求？ | [pcapng](3.4-pcapng-mode.md) | 在同时包含数据包和密钥的文件中追踪解密后的会话。 |

## 保存和转发结果

`--output` 控制终端、文件及 TCP 目的地，负责传送运行日志与采集事件。原生 keylog 或 pcapng 模式必须通过 `--keylogfile` 或 `--pcapfile` 指定本地文件，此时本地 `--output` 文件仅含运行日志。使用网络包作为文本数据源时，也可以选配上述原生文件，同时继续接收解码后的 `TEXT` 事件。[输出规范](https://github.com/gojue/ecapture/blob/v2.12.0/docs/event-forward-api.md)

- [捕获模式选择](3.1-choosing-text-keylog-or-pcapng.md)对照各模式的先决条件和文件参数。
- [输出目的地与订阅](3.5-event-destinations-and-rotation.md)说明 Protobuf v2、远端接收端以及如何迁移 v2.8 的旧参数。
- [Wireshark 解密工作流](3.6-wireshark-decryption-workflows.md)说明如何检查数据包和密钥是否来自同一条测试连接。
