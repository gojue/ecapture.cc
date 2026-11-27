---
title: Go 快速开始
description: 使用 eCapture Decryptor v1.4.4 解密回环测试流量，从 TLS 1.3 抓包中验证 HTTP 请求与响应。
lang: zh-CN
---

# Go 快速开始

这份示例从 TLS 1.3 抓包中读出一条 HTTP/1.0 请求及其响应。v1.4.4 自带的测试文件记录了两个回环测试进程之间的流量，会话密钥已写入 pcapng 解密密钥块（DSB）。安装好 Go 模块后，示例可以离线运行。[测试文件及预期消息](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/http_tcp_integration_test.go)

## 创建独立的 Go 模块 {#setup}

准备 Go 1.26.0 或更新版本，以及 Linux 或 macOS 的 shell。Go 文件解码器在用户态运行，支持 `CGO_ENABLED=0`。本例无需启动采集器或安装 libpcap 开发头文件。SDK 固定使用一个 gopacket 分支。Go 只采用主模块中的 `replace` 指令，因此需要在自己的应用中先声明相同的替换，再获取 v1.4.4。[SDK 模块定义](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/go.mod)

```sh
mkdir decrypt-demo
cd decrypt-demo
go mod init example.org/decrypt-demo
go mod edit -replace=github.com/google/gopacket@v1.1.19=github.com/cfc4n/gopacket@v1.1.20
go get github.com/gojue/ecapture_decryptor@v1.4.4

sdk_dir=$(go list -m -f '{{.Dir}}' github.com/gojue/ecapture_decryptor)
cp "$sdk_dir/test/testdata/http10_ecapture_dsb.pcapng" sample.pcapng
```

最后一条命令从已下载的模块中复制约 11 KB 的测试抓包，其中已包含与该连接匹配的密钥。[回环测试数据说明](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/test/fixtures/http_tcp_capture/README.md)

## 解码抓包 {#decode}

在 `decrypt-demo` 目录中将以下程序保存为 `main.go`。`DecryptPcapFile` 的第一个参数传 `nil`，表示使用文件内嵌的密钥。程序在 SDK 读取抓包的同时消费输出通道。负责调用 SDK 的 goroutine 会等待调用返回，无论成功或失败都会关闭通道。

```go
package main

import (
	"bytes"
	"fmt"
	"log"
	"os"

	sdk "github.com/gojue/ecapture_decryptor"
	"github.com/gojue/ecapture_decryptor/types"
)

func run() error {
	capture, err := os.Open("sample.pcapng")
	if err != nil {
		return err
	}
	defer capture.Close()

	packets := make(chan *types.DecryptedPacket)
	result := make(chan error, 1)
	go func() {
		err := sdk.DecryptPcapFile(nil, capture, packets)
		close(packets)
		result <- err
	}()

	for packet := range packets {
		firstLine, _, _ := bytes.Cut(packet.Data, []byte("\r\n"))
		fmt.Printf("%s %s | %s\n", packet.Protocol, packet.Direction, firstLine)
	}
	return <-result
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
```

## 验证请求与响应 {#verify}

```sh
go run .
```

除 SDK 自身的诊断信息外，输出中应包含以下两行。

```text
http/1.0 request | GET /legacy HTTP/1.0
http/1.0 response | HTTP/1.0 200 OK
```

这里的 `http/1.0` 是解码后的应用协议，测试连接协商的加密协议为 TLS 1.3。`packet.Data` 保留完整消息，其中响应正文为 `legacy-response`。示例只打印首行。[测试断言](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/http_tcp_integration_test.go)

分析自己有权访问的抓包时，如果另有独立的 NSS 密钥日志，将打开的日志文件作为第一个参数传入即可。SDK 也会加载抓包中的 DSB。如果输入端要持续写入 pcapng 块，请参见[流式集成](/decryptor/zh/streaming/)。
