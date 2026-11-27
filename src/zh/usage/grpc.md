# 分析 TLS 加密的 gRPC 调用

对使用 HTTP/2 和 TLS 的 gRPC 服务，eCapture v2.12.0 可以在终端逐条显示 gRPC 消息事件，也可以同时保存带 TLS 密钥的 pcapng，供 Wireshark 检查 HTTP/2 帧和 Protobuf 字段。下面以自己运行的 Go 服务为例。

## 在流结束前查看消息

假设服务程序为 `/app/grpc-server`，测试客户端通过本机回环访问 TCP 8443。先运行采集器，再用客户端新建连接并调用一个已知的 RPC：

```sh
sudo ecapture gotls --elfpath /app/grpc-server -i lo \
  --text-http-events --pcapfile grpc.pcapng 'tcp port 8443'
```

`gotls` 的默认文本数据源是 `pcapng`。加上 `--text-http-events` 后，解码器能在长连接返回最终状态前发出 HTTP/2 gRPC 消息事件。核对本次方法的路径、流 ID、消息方向和长度。gRPC 负载可以是二进制数据，字段名称和类型需结合服务的 `.proto` 定义解释。这里的 `--pcapfile` 是文本模式的可选副本，终端仍然显示解码事件。[上游 gRPC 实时验证范围](https://github.com/gojue/ecapture/blob/v2.12.0/test/e2e/README.md)

如果服务使用 OpenSSL，把 `gotls --elfpath /app/grpc-server` 换成 `tls`，必要时用 `--libssl` 指向该进程加载的库。如果客户端位于其他机器，改用流量经过的网卡及端口。只需离线抓包时，可单独运行：

```sh
sudo ecapture gotls --elfpath /app/grpc-server -i lo \
  -m pcapng --pcapfile grpc-offline.pcapng 'tcp port 8443'
```

## 在 Wireshark 验证

1. 完成一次调用并停止采集。上例用 `sudo` 新建的文件默认只有 root 可读写。若要用自己的账号打开第一条命令生成的文件，先执行 `sudo chown "$(id -u)" grpc.pcapng`；离线示例的文件名为 `grpc-offline.pcapng`。可用 `capinfos -c -D grpc.pcapng` 查看包数和解密密钥统计，密钥块可能出现在相关数据包之后。[capinfos 选项](https://www.wireshark.org/docs/man-pages/capinfos.html)
2. 在 Wireshark 使用 `http2` 显示过滤器。找到带有预期 `:path` 的请求头，沿同一 HTTP/2 流检查 DATA 和 trailers，核对 `grpc-status`。如果只看到 TLS，先确认本次连接的握手、数据包和配套密钥均已捕获。
3. 需要字段名时，在 Wireshark 的 Protobuf 协议首选项中配置服务对应的 `.proto` 搜索路径，并加载所需定义。没有匹配的定义时，仍可检查消息长度、字段编号和原始字节。

[GoTLS 模块](/zh/2-core-tls-modules/2.2-gotls-capture) · [Wireshark 解密流程](/zh/3-capture-modes/3.6-wireshark-decryption-workflows)
