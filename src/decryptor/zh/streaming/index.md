---
title: 流式集成
description: 向 eCapture Decryptor v1.4.4 提供 pcapng 字节流，处理迟到密钥、背压、取消与结束状态。
lang: zh-CN
---

# 流式集成

应用持续提供 pcapng 字节、希望在生产端结束之前收到解码消息时，可使用 `DecryptPcapngStream`。也可以用同一个入口回放 [Go 快速开始](/decryptor/zh/quick-start/)中的回环测试抓包。[流式入口实现](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/pcapng_stream.go)

## 选择输入与密钥来源 {#input}

| 应用提供的输入 | 入口 | SDK 如何读取密钥 |
| --- | --- | --- |
| 持续写入管道或连接的 pcapng 流 | `DecryptPcapngStream(ctx, input, emit)` 或 `DecryptPcapngStreamWithOptions(ctx, input, emit, options)` | 在读取各块时从 DSB 导入 TLS 密钥。回调入口没有独立的密钥日志参数。 |
| pcap 或 pcapng reader，以及一份有限的 NSS 密钥日志 | `DecryptLiveTraffic(keylog, input, packets)` | 先将外部密钥日志读到 EOF，再处理抓包字节。如果输入为 pcapng，还会读取其中的 DSB。调用方提供输入，同时消费输出通道。 |
| 已完成的抓包 | `DecryptPcapFile(keylog, input, packets)` | 可传入独立密钥日志。对于可回绕的 pcapng 文件，先扫描 DSB，再返回文件起点读取数据包。 |

回调入口接收以节头块（Section Header Block）起始的 pcapng 字节流。生产端可以分多次写入一个块。如果上游传输 eCapture Protobuf v2 消息，应解开原生 `PCAPNG` 事件，按同一连接的到达顺序拼接其 `pcapng.data` 字节。`TEXT` 事件中已经是采集器的输出。[Go 入口实现](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/api.go) · [采集器线协议](https://github.com/gojue/ecapture/blob/v2.12.0/protobuf/PROTOCOLS.md)

## 接入消费者 {#consumer}

`Forward` 将每条完整的应用消息发往调用方的输出通道。传入的 `io.ReadCloser` 需支持用 `Close` 中断阻塞的 `Read`，例如 `io.PipeReader` 或网络连接。普通文件读到当前末尾就会返回 EOF。如果后续还要写入抓包块，可通过管道或连接输入。

```go
package replay

import (
	"context"
	"io"

	sdk "github.com/gojue/ecapture_decryptor"
	"github.com/gojue/ecapture_decryptor/types"
)

func Forward(ctx context.Context, input io.ReadCloser, out chan<- *types.DecryptedPacket) error {
	return sdk.DecryptPcapngStreamWithOptions(ctx, input, func(p *types.DecryptedPacket) error {
		select {
		case out <- p:
			return nil
		case <-ctx.Done():
			return ctx.Err()
		}
	}, types.DecryptOptions{})
}
```

下游消费者应与 `Forward` 并发运行。SDK 串行调用 `emit`，等回调执行完才返回。下游通道写满时会产生背压，示例中的 `select` 让取消信号能够中断阻塞的发送。如果下游提前结束，应取消 `ctx`。`out` 由调用方管理，可在 `Forward` 返回且所有发送者结束后关闭。

正常结束时，由生产端关闭管道写端或结束网络字节流，向 SDK 发送 EOF。调用返回后，调用方释放输入资源。取消上下文或回调返回错误时，SDK 会主动关闭 `input` 以解除阻塞的读取。若 `emit` 内部还有阻塞操作，也需要使其能响应取消。`OnDiagnostic` 回调可能并发执行，应及时返回。[回调与取消约定](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/docs/API.md)

## 迟到密钥与资源限制 {#lifecycle}

DSB 可以晚于它能解密的包到达，甚至出现在最后一个网络包之后。需要保持输入开启，直到这个密钥块写完。在流仍开启时，匹配密钥的到达即可触发缓冲的 QUIC 包重新解密。正常 EOF 会排空可处理的数据包和工作协程的输出。

v1.4.4 的流式入口会保留工作协程仍在引用的密钥。最后一个引用释放后，先前已接入、尚在识别连接身份的工作协程仍可能暂时保护这份密钥。后来的新连接若复用已回收的身份，需要再次提供密钥。尚未与连接关联的密钥从首次导入开始计算保留时间，窗口长度取 `IdleTimeout`。文件入口则在整次调用期间保留已加载密钥。

| Go 选项 | 默认值 | 对集成的影响 |
| --- | --- | --- |
| `KeyWaitTimeout` | 30 秒 | 限制等待所需密钥的时间。QUIC 识别连接身份的期限从创建工作协程时起算，后续来包、Retry 或重复 DSB 均不会延长。 |
| `IdleTimeout` | 5 分钟 | 按实际经过时间回收空闲连接，同时界定流中未关联密钥的保留窗口。 |
| `MaxConnections` | 1,024 | 计入活跃及仍在排空的工作协程，完成清理后才释放名额。 |

需要调整限制时，可通过 `types.DecryptOptions` 传给 `DecryptPcapngStreamWithOptions`。`DecryptPcapngStream` 使用默认值。[v1.4.4 生命周期变更](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/CHANGELOG.md) · [资源选项定义](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/types/options.go)

## 判断调用结果 {#completion}

单条连接可能在其他连接继续处理期间发出诊断。**只要调用已经返回，本次输入会话就已结束。** 返回 `nil` 表示正常到达 EOF，并成功排空。可以通过 `errors.Is` 分别检查错误标记，因为合并的错误可能同时匹配多个类别。

| 根包导出的错误标记 | 含义 |
| --- | --- |
| `ErrConnectionFailures` | 一个或多个连接处理失败，在调用结束时汇总。消费者仍可使用此前已交付的事件。 |
| `ErrPipelineFailure` | 读取输入或导入密钥失败。若触及密钥容量限制，错误还会匹配 SDK `crypto` 包的 `crypto.ErrKeyLogResourceLimit`。 |
| `ErrStreamCanceled` | 调用方取消上下文或超过上下文期限，同时保留 `context.Canceled` 或 `context.DeadlineExceeded`。 |
| `ErrEmitFailed` | 回调返回错误，SDK 停止读入并排空生产端。原回调错误仍可通过 `errors.Is` 或 `errors.As` 识别。 |

区分调用方取消时应检查 `ErrStreamCanceled`。单条连接超时也可能包含 `context.DeadlineExceeded`。参数或选项校验失败时，调用可能在开始处理前直接返回错误。更多选项见 [Go API 参考](/decryptor/zh/api/)，各模式交付的数据见[协议说明](/decryptor/zh/protocols/)。
