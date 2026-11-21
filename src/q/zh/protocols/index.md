---
title: 协议与消息详情
description: 对应采集模式与协议查看器，理解消息、进程和 TLS 信息的边界。
lang: zh-CN
---

# 协议与消息详情

eCapture 负责采集与解密；eCaptureQ 连接事件服务、关联应用消息并展示。有某个协议查看器，不代表任意使用某个动态库的程序都能提供全部应用协议。

## 采集条件与模块 {#capture}

eCapture v2.12.0 的 `tls`、`gotls` 和 `gnutls` 默认使用 **text 模式与 pcapng 数据源**。下面显式指定该组合，将已解密的消息发送给 Q。

```sh
sudo ./ecapture tls -m text --text-source pcapng -i eth0 \
  --stream-listen ws://127.0.0.1:28256/
```

选择测试流量经过的网卡和受支持的 TLS 库或程序。eCapture 在采集主机上解密、重组消息，再通过 TEXT 事件发送给 eCaptureQ。采集器使用 keylog 或 pcapng 模式时，发送的是原生文件字节。[保存原生文件](/q/zh/interface/#native)

| TLS 应用 | 模块与目标选择 |
| --- | --- |
| 受支持的 OpenSSL / BoringSSL 变体 | `tls`；仍需满足库版本与附加条件 |
| Go TLS 可执行文件 | `gotls --elfpath /path/to/go-app` |
| Linux 上的 GnuTLS 应用 | `gnutls --gnutls /path/to/libgnutls.so` |

将可执行文件/库路径、网卡替换为真实采集目标。例如：

```sh
sudo ./ecapture gotls --elfpath /path/to/go-app \
  -m text --text-source pcapng -i lo \
  --stream-listen ws://127.0.0.1:28256/
```

仅当流量经过 loopback 时使用 `lo`。Linux、Android 采集仍受 CPU、内核、权限、库版本和模块限制；具体发布版本条件见 [采集端官方 README](https://github.com/gojue/ecapture/blob/v2.12.0/README.md)。Hook 文本路径可能提供片段或原始记录，而非完整协议消息。

TLS 解密在上游恢复明文；应用协议解析解释这些应用字节；HTTP 正文解压处理选中消息的 gzip 等 `Content-Encoding`。这三项操作彼此不同。

## HTTP/1.x {#http1}

完整消息路径可以提供请求/响应 Headers 和正文。eCaptureQ 在同一 **来源、重连代次、连接标识** 内按 FIFO 顺序关联，单独的 PID 不能充当连接标识。

在请求/响应页检查方法、实际捕获的路径/Host、状态、Headers 与正文。未捕获请求的响应保留为独立响应记录。无法关联最终响应时保留未配对状态，不代表超时、失败或服务端仍在执行；迟到响应不能复活已淘汰的请求。

## HTTP/2 {#http2}

完整消息事件必须提供连接标识与 **Stream ID**，才能按流关联请求/响应。缺少流标识时保留独立记录，不猜测配对。界面展示消息 Headers 与正文，不是逐个网络包的 HTTP/2 帧跟踪。

HTTP/1.x、HTTP/2 共用 **HTTP/1 · 2** 筛选，具体协议以行内字段为准。缺失 authority 时不会重建一个虚构的请求 URL。

## HTTP/3 {#http3}

HTTP/3 使用上游 QUIC 解密与消息路径，文档中的采集验证样例使用 **GoTLS**。界面展示 HTTP 请求/响应，以及事件提供的 QUIC 版本、Stream ID、ALPN、QPACK 信息；关联同时需要连接标识和流标识。

支持 HTTP/3 不代表任意 QUIC 库或任意 UDP 流都能被采集。需要受支持的 Go 可执行文件与匹配网卡；原始 QUIC 事件应与已解析的 HTTP/3 消息区别对待。

## Redis {#redis}

受支持的上游 Redis 路径需要在适用 TLS 模块上，使用 `-m text --text-source pcapng` 并显式选择 `--text-protocol redis`。解析器支持固定长度 RESP2/RESP3 消息；有查看器不等于能自动采集任意明文 Redis 端口。

在 **命令、响应、原始 RESP** 页检查参数、请求编号和带类型的值，包括字符串、整数、数组、Map、错误和 Null。原始请求与响应字节分别保留，二进制值保留 Hex，避免文本转换破坏内容。

服务端 **Push** 与 **Attribute** 独立展示，不占用普通命令的响应位置。`invalidate` 推送包含失效键，不是 Pub/Sub Channel。协议 Null 是已捕获的空值，区别于未观察到响应。关联依赖事件提供的请求编号和连接范围，不依据列表中相邻顺序强配对。

## MySQL {#mysql}

`mysqld` 探针提供 **查询事件**。在 **SQL 查询** 看已捕获 SQL，**捕获信息** 看原始/捕获长度、截断和实际观察到的 `dispatch_command` 返回值，**原始** 页查看载荷。

这条路径不是完整 MySQL 查询与结果捕获。即使派发返回 `SUCCESS`，也不能证明 SQL 执行成功、事务已提交或获得完整结果集。SQL 截断时只展示查询片段。采集需要受支持的 mysqld 目标与探针配置，参见 [采集端模块文档](https://github.com/gojue/ecapture/blob/v2.12.0/README.md)。

## MQTT {#mqtt}

在受支持的 text/pcapng TLS 路径中选择 `--text-protocol mqtt`，提供 **MQTT 3.1.1** 事件；不承诺 MQTT 5 或任意 MQTT 端口的通用采集。

[![深色 eCaptureQ v1.0.0 Web 界面，展示合成 MQTT PUBLISH 消息、Topic、QoS 和 Packet ID](/assets/q/protocol-details.png)](/assets/q/protocol-details.png)

*点击放大。eCaptureQ v1.0.0 Web 界面、合成 MQTT 数据、深色主题。*

**报文** 页展示控制类型、Topic、Client ID、Packet ID、QoS、DUP、RETAIN 以及该报文适用的已观测字段；**载荷** 页展示捕获的业务字节。Packet ID 在 QoS 0 PUBLISH 等情况下不适用。DUP、QoS 和观测到的 ACK 不能证明最终投递成功或投递次数。

## QUIC 流与数据报事件 {#quic}

需要原始事件时，在受支持的上游 QUIC 路径使用 `--text-raw`。**流事件** 页展示 STREAM 数据、FIN/结束、RESET、方向、偏移、加密级别及可用的连接/流标识；**载荷** 页展示可用字节。

DATAGRAM 具有独立消息边界，长度可以合法地为零。Reset 不是 HTTP 状态。被拒绝的 0-RTT 字节仍是观察到的字节，不证明对端接受了数据。这些事件不会自动解释为 HTTP 请求。

## 原始或不完整事件 {#raw}

格式异常或未映射的 TEXT 事件会保留已有载荷与元数据。Q 无法解析 SDK 格式化首行时，可在 RAW 视图中检查原始字节与解析错误。在 v2 中，`length` 是格式化后载荷的字节数，`original_length` 描述 SDK 格式化前的长度，单凭二者的差值无法判断截断。[接收与保留限制](/q/zh/faq/#retention)

## 进程与 TLS 元数据兼容性 {#tls}

eCaptureQ v1.2.0 读取 eCapture v2.12.0 TEXT 事件中的 Protobuf v2 字段。`process_args` 与 `process_args_truncated` 描述当时捕获的进程命令，可选字段 `tls` 携带已观察到的握手信息。[v2 协议定义](https://github.com/gojue/ecapture/blob/v2.12.0/protobuf/proto/v2/ecaptureq.proto)

数据可用时，连接页展示捕获的进程/PID/argv，以及 TLS 版本、密码套件、SNI、ALPN、组、签名算法。**JA3**、**JA4** 来自首次线上 ClientHello；适用时标记 ECH Outer。协商参数是握手信息，不是实际会话密钥；SNI 不从 HTTP Host 推测，缺失字段不补造。

较旧路径可能给出 PID 0 或 `decryptor`，表示归属未知。eCaptureQ 不会读取 Web 服务主机的进程来猜测远端归属。按 [界面指南](/q/zh/interface/#connection) 查看可用字段与缺失提示。
