---
title: Go API 与事件
description: 选择 eCapture Decryptor v1.4.4 的 Go 解密入口，读取 DecryptedPacket 事件，处理部分结果与错误。
lang: zh-CN
---

# Go API 与事件

下列函数位于 `github.com/gojue/ecapture_decryptor` 根包，选项、回调事件与诊断类型位于 `github.com/gojue/ecapture_decryptor/types`。可以先运行[快速入门](../quick-start/)中的文件解密示例。原生程序请参阅[原生接口](../native/)。

## 选择入口 {#entry-points}

| 根包函数 | 输入与密钥 | 输出及生命周期 |
| --- | --- | --- |
| `DecryptPcapFile(keys, capture, out)` | 读取有限长度的经典 pcap 或 pcapng。`keys` 为外部 SSLKEYLOG 的 `io.Reader`。pcapng 已内嵌所需密钥时可传 `nil`。 | 将完整应用消息写入 `chan *types.DecryptedPacket`，处理完输入并等待连接退出后返回。 |
| `DecryptWithConfig(config)` | 支持相同的文件和密钥来源。用 `NewDecryptorConfig()`、`WithPcapReader`、`WithSSLKeyLog`、`WithPacketChan` 和 `WithOptions` 构造配置。 | 读取文件时需要选择输出模式或调整连接上限，使用此入口。 |
| `DecryptLiveTraffic(keys, capture, out)` | 单遍读取调用方传入的 pcap 或 pcapng `io.Reader`。接受外部密钥读取器，并按流式策略保留密钥。 | 使用通道输出。采集源由调用方提供，接入网卡也由调用方负责。 |
| `DecryptPcapngStream(ctx, input, emit)` 与 `DecryptPcapngStreamWithOptions(ctx, input, emit, opts)` | 从 `io.ReadCloser` 增量读取 pcapng。密钥通过解密密钥块（DSB）提供，可以晚于数据包到达。 | 通过 `func(*types.DecryptedPacket) error` 串行回调，支持 context 取消。前者使用默认选项。 |

经典 pcap 需要外部密钥。读取 pcapng 文件时，SDK 会合并外部和内嵌密钥。可定位的 pcapng 能预先扫描密钥，不可定位的输入按块到达顺序读取。通道模式下，即便设置了缓冲，调用方也要在解密期间并发消费，等 SDK 返回后再自行关闭通道。[文件入口实现](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/api.go)

回调模式下，`emit` 处理慢会减慢解密。回调报错或 context 被取消时，SDK 会关闭输入，使阻塞的读取返回。若回调本身等待外部操作，该操作也应响应取消并及时返回。[流式接入指南](../streaming/) · [流式入口实现](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/pcapng_stream.go)

## 读取 DecryptedPacket {#events}

一条事件可以表示一条消息、一段正文或一次状态变更。先确定输出模式，再按 `Protocol` 和该模式可能提供的 `Metadata["kind"]` 解释数据。HTTP trailers、空数据报等事件的 `Data` 长度都可以为零。[协议与输出对照表](../protocols/#matrix)

| 字段或方法 | 使用方式 |
| --- | --- |
| `ConnectionID()`、`Transport`、`Protocol` | 把 ID 作为本次连接实例的关联键，按原样保存。`Transport` 为 `tcp` 或 `udp`。`Protocol` 标识已解析的应用协议或原始传输协议。 |
| `Direction`、`SrcIP`、`SrcPort`、`DstIP`、`DstPort` | `request` 表示客户端到服务端，`response` 表示服务端到客户端。源和目的地址随方向变化。事务配对和推送识别需使用协议专属元数据。 |
| `Timestamp`、`Data`、`DataLength` | 分别为捕获时间、当前事件的载荷字节及其长度。按字节存储二进制载荷。`Meta()` 以及整个包的 JSON 编码都会省略 `Data`。 |
| `Metadata` | 类型为 `map[string]interface{}`，键随事件而变化。若捕获到了相应握手字段，内层 `tls` 映射可以包含 `server_name`、`alpn` 或 `cipher_suite`。 |
| `PID`、`PName`、`ProcessArgs` | 来自捕获时的进程信息。PID 为零、名称为空或参数为 nil 表示对应信息不可用。`ProcessArgs.Data` 保留 NUL 分隔符。`Truncated` 为真时，保存的 256 字节可能在参数中间结束。 |

例如，将结果写成逐行 JSON 时，可以同时保存连接 ID、包元数据和载荷。Go 的 JSON 编码器会以 base64 表示 `[]byte`。把编码错误直接返回，流式调用方就能获知写入失败。[事件定义与 JSON 字段](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/types/packet.go)

```go
package sink

import (
	"encoding/json"
	"io"

	"github.com/gojue/ecapture_decryptor/types"
)

func jsonSink(w io.Writer) func(*types.DecryptedPacket) error {
	enc := json.NewEncoder(w)
	return func(p *types.DecryptedPacket) error {
		return enc.Encode(struct {
			Connection string
			Packet     *types.DecryptedPacket
			Payload    []byte
		}{p.ConnectionID(), p, p.Data})
	}
}
```

## 处理诊断与错误 {#errors}

两个可配置入口都支持 `types.DecryptOptions.OnDiagnostic`，诊断字段为 `ConnectionID`、`Transport`、`Stage` 和 `Code`。例如，`waiting_secret` 表示连接仍在等密钥，之后仍有机会输出数据。诊断回调可能并发执行，应尽快返回，避免在回调内再次调用解密器。默认密钥等待时间为 30 秒，连接空闲超时为 5 分钟，同时处理的连接上限为 1,024 个。两个超时都按实际经过的时间计算。[选项与诊断类型](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/types/options.go)

即使已经收到事件，处理结束时仍应检查返回值。用 `errors.Is` 独立检查需要处理的错误，一次调用可能同时命中多项。[错误分类测试](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/pcapng_stream_test.go)

| 根包错误 | 含义 |
| --- | --- |
| `ErrConnectionFailures` | 一个或多个连接处理失败，其他连接仍可能正常输出。 |
| `ErrPipelineFailure` | 输入处理失败，例如无法读取捕获数据或加载密钥日志。 |
| `ErrEmitFailed` | 流式回调返回了错误。最终错误也包装了回调返回的原始错误。 |
| `ErrStreamCanceled` | 流的 context 被取消或超过期限，`errors.Is` 也能匹配原始 context 错误。 |
