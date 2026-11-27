---
title: Go API and events
description: Choose a Go decryption entry point, consume DecryptedPacket events, and handle partial results in eCapture Decryptor v1.4.4.
lang: en-US
---

# Go API and events

Import `github.com/gojue/ecapture_decryptor` for the functions below. Their options, callback events and diagnostics are in `github.com/gojue/ecapture_decryptor/types`. For a runnable file reader, see the [Go quick start](../quick-start/). Native callers have a separate [native interface](../native/).

## Choose an entry point {#entry-points}

| Function in the root package | Input and keys | Output and lifecycle |
| --- | --- | --- |
| `DecryptPcapFile(keys, capture, out)` | Finite classic pcap or pcapng. `keys` is an external SSLKEYLOG `io.Reader`. Pass `nil` for a pcapng containing the matching secrets. | Sends complete application messages to `chan *types.DecryptedPacket`. Returns after processing and draining workers. |
| `DecryptWithConfig(config)` | Same file formats and key sources. Build with `NewDecryptorConfig()`, `WithPcapReader`, `WithSSLKeyLog`, `WithPacketChan` and `WithOptions`. | Use this entry point to select a different output mode or configure connection limits for a file. |
| `DecryptLiveTraffic(keys, capture, out)` | A caller-supplied pcap or pcapng `io.Reader`, read once. Accepts an external key reader and uses streaming key retention. | Channel output. The caller supplies the capture source, including any capture device integration. |
| `DecryptPcapngStream(ctx, input, emit)` and `DecryptPcapngStreamWithOptions(ctx, input, emit, opts)` | Incremental pcapng from an `io.ReadCloser`. Provide keys in Decryption Secrets Blocks (DSBs), which can arrive after packet data. | Serial `func(*types.DecryptedPacket) error` callback, with context cancellation. The first function uses the default options. |

Classic pcap needs external keys. The file API merges external and embedded keys for pcapng. It can scan a seekable pcapng for secrets before decoding, while a non-seekable reader observes blocks as they arrive. For channel output, drain the channel concurrently, even with a buffer. The caller closes the channel after the SDK returns. [File API implementation](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/api.go)

For callback output, a slow `emit` slows the decoder. A callback error or context cancellation causes the SDK to close the input to unblock reading. Make the callback return when its own work is canceled. See the [streaming guide](../streaming/) and the [stream implementation](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/pcapng_stream.go).

## Read a DecryptedPacket {#events}

One event may describe a message, a piece of a body, or a state change. Select the output mode first, then interpret `Protocol` and any `Metadata["kind"]` for that mode. A zero-length `Data` is valid on events such as HTTP trailers or an empty datagram. [Protocol and output matrix](../protocols/#matrix)

| Field or method | How to use it |
| --- | --- |
| `ConnectionID()`, `Transport`, `Protocol` | Treat the ID as an opaque correlation key for this connection generation. `Transport` is `tcp` or `udp`. `Protocol` identifies the decoded application or raw transport. |
| `Direction`, `SrcIP`, `SrcPort`, `DstIP`, `DstPort` | `request` means client to server, `response` means server to client. The endpoint fields follow that direction. Use protocol-specific metadata to pair transactions or identify pushes. |
| `Timestamp`, `Data`, `DataLength` | Capture time, event payload bytes, and their length. Store binary data as bytes. `Meta()` and JSON encoding of the packet omit `Data`. |
| `Metadata` | A `map[string]interface{}`. Available keys depend on the event. An optional `tls` map may include the observed `server_name`, `alpn` or `cipher_suite`. |
| `PID`, `PName`, `ProcessArgs` | Process observation from the capture. PID zero, an empty name or nil arguments indicate unavailable information. `ProcessArgs.Data` preserves NUL separators. If `Truncated` is true, its 256 bytes may end inside an argument. |

For example, a JSON Lines sink can store the connection ID, packet metadata and payload together. Go's JSON encoder encodes a `[]byte` as base64. Returning the encoder error propagates a failed write to the stream caller. [Packet definition and JSON tags](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/types/packet.go)

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

## Handle diagnostics and errors {#errors}

On either configurable entry point, `types.DecryptOptions.OnDiagnostic` receives `ConnectionID`, `Transport`, `Stage` and `Code`. For example, `waiting_secret` means the connection is waiting for a key and may still produce output. Diagnostic callbacks can run concurrently. Keep them brief and avoid calling back into the decoder. The defaults are a 30-second key wait, a five-minute idle timeout and 1,024 concurrent connections. Both timeouts use wall-clock time. [Options and diagnostics](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/types/options.go)

Check the final return value even if some events arrived successfully. Use `errors.Is` for each condition you need to handle. A returned error can match more than one condition. [Error classification tests](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/pcapng_stream_test.go)

| Root-package error | What happened |
| --- | --- |
| `ErrConnectionFailures` | One or more connections failed. Other connections could still produce events. |
| `ErrPipelineFailure` | The input pipeline failed, for example while reading a capture or loading the key log. |
| `ErrEmitFailed` | The streaming callback returned an error. The returned error also wraps the callback's error. |
| `ErrStreamCanceled` | The stream context was canceled or its deadline expired. The context error is also available through `errors.Is`. |
