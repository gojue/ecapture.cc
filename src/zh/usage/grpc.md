# 抓包加密grpc

:::info 案例详情介绍

在微服务架构中，gRPC（基于 HTTP/2 + Protobuf）通常运行在 TLS 加密之上，且其载荷是二进制格式。这给抓包调试带来了巨大挑战：传统的 `tcpdump` 只能看到加密的乱码。

本文介绍一种非侵入式的“黑科技”方案：利用 eBPF 工具 **eCapture** 直接从内核层面 Hook TLS 函数，导出带有解密密钥的 `pcapng` 文件，或者直接导出明文，从而在 Wireshark 中完美还原 gRPC 调用详情。

## 核心原理

传统的 TLS 解密方法（如设置 `SSLKEYLOGFILE` 环境变量）往往需要重启服务，且对静态编译的 Go 程序（常见于 gRPC 服务）支持不佳。

**eCapture** 基于 eBPF 技术，工作原理如下：
1.  **uprobe Hook**: 在用户态动态追踪 OpenSSL `SSL_write/SSL_read` 或 Go `crypto/tls` 的相关函数。
2.  **获取明文/密钥**: 在数据加密前（发送）或解密后（接收）直接截获明文数据，或者截获 TLS 握手阶段的 `Master Secret`。
3.  **Pcapng 导出**: 将捕获的数据或密钥封装成 Wireshark 可识别的 `pcapng` 格式（支持 Decryption Secrets Block, DSB）。

## 准备工作

*   **Linux 内核**: 需支持 eBPF (建议 kernel >= 4.18, 最好 >= 5.5 以支持 BPF CO-RE)。
*   **权限**: Root 权限。
*   **工具**:
    *   [eCapture](https://ecapture.cc/)
    *   Wireshark (建议 v3.0+ 以支持 HTTP/2 和 Protobuf)

## 实战步骤

### 场景一：分析 Go 语言编写的 gRPC 服务

Go 语言编写的程序通常是静态链接，不依赖系统的 `libssl.so`，因此需要使用专门的 `gotls` 模块。

#### 1. 找到目标进程和二进制文件
假设你的 gRPC 服务进程 ID 为 `12345`，二进制文件路径为 `/app/grpc-server`。

```bash
ps -ef | grep grpc-server
# 输出: root 12345 ... /app/grpc-server
```

#### 2. 使用 eCapture 捕获并导出 pcapng

使用 `gotls` 子命令，指定 `--elf` 参数为目标二进制文件。

```bash
# -e: 目标二进制文件路径
# --pcap: 输出的 pcapng 文件名
# --pid: (可选) 仅捕获特定进程，不加则捕获所有使用该二进制的进程
sudo ecapture gotls -e /app/grpc-server -m pcap --pcapfile=grpc_traffic.pcapng --pid=12345 -i eth0 host xxx and port xxx
```

运行后，eCapture 会在控制台打印捕获到的部分明文摘要。保持运行，并在此时触发几次 gRPC 请求。完成后按 `Ctrl+C` 停止。

### 场景二：分析使用 OpenSSL 的服务 (Python/C++/Nginx等)

对于动态链接 OpenSSL 库的程序（如 Python 的 gRPC 客户端，或 C++ gRPC 服务），eCapture 使用 `tls` 子命令通过 hook `libssl.so` 工作。

```bash
# 自动 hook 系统默认的 libssl
# 如果库位置特殊，可用 --libssl /path/to/libssl.so 指定
sudo ecapture tls -m pcap --pcapfile=openssl_traffic.pcapng -i eth0
```
## 如何验证 pcapng 是否包含解密密钥 (DSB)？

在打开 Wireshark 之前，你可以通过以下方式确认 eCapture 是否成功将 TLS 密钥嵌入到了 `pcapng` 文件中。

### 1. 使用命令行工具 `capinfos`
`capinfos` 是 Wireshark 自带的命令行工具，可以快速查看文件元数据。

```bash
capinfos grpc_traffic.pcapng
```
如果包含 DSB，你会在输出中看到如下行：
*   **Number of Decryption Secrets**: 1 (或者更多)
*   **Type of Decryption Secrets**: TLS Key Log

### 2. 在 Wireshark GUI 中查看
打开文件后：
1.  点击菜单栏的 **Statistics (统计)** -> **Capture File Properties (捕获文件属性)**。
2.  滚动到弹窗的最底部。
3.  如果包含密钥，你会看到一个名为 **Decryption Secrets (解密密钥)** 的面板，其中列出了嵌入的 `CLIENT_RANDOM` 等信息。

---

## Wireshark 分析流程

### 1. 打开 Pcapng 文件
直接用 Wireshark 打开生成的 `grpc_traffic.pcapng`。

**关键点**：eCapture 生成的 pcapng 文件利用了 **DSB (Decryption Secrets Block)** 标准，将捕获到的 TLS Master Secret 直接嵌入到了 pcapng 文件头部。Wireshark 读取该文件时，会**自动加载密钥并解密流量**，无需手动配置 Key Log File。

### 2. 验证解密状态
*   查看数据包列表，你应该能看到绿色的 **HTTP2** 协议包，而不是纯粹的 TCP/TLS 包。
*   如果依然显示为 TLS Application Data，请检查 Wireshark 版本是否过低。

### 3. 解码 gRPC (Protobuf)
虽然流量解密了，但 HTTP/2 的 DATA 帧中承载的是 Protobuf 二进制数据，Wireshark 默认可能只能显示为 Hex dump。

为了看清字段名和数值（如 `{"name": "Alice", "age": 18}`），有两种方法：

**方法 A：手动分析 (无 Proto 文件)**
*   在 Wireshark 中选中 HTTP2 的 `DATA` 帧。
*   右键 -> `Protocol Preferences` -> `ProtoBuf` -> 确保启用了 "Dissect Protobuf fields"。
*   你只能看到 Field 1, Field 2 这样的标签，需要对照代码猜测含义。

**方法 B：加载 Proto 文件 (推荐)**
1.  准备好你的 `.proto` 定义文件。
2.  在 Wireshark 中：`Edit` -> `Preferences` -> `Protocols` -> `Protobuf`。
3.  在 "Protobuf Search Paths" 中添加你的 `.proto` 文件所在目录。
4.  确保 "Load .proto files" 已勾选。
5.  应用设置后，Wireshark 会尝试根据 gRPC 的路径（如 `/helloworld.Greeter/SayHello`）自动匹配 Proto 定义，显示人类可读的 JSON 树状结构。

## 常见问题排查

1.  **无法捕获 Go 程序？**
    *   确保 Go 程序编译时没有完全去除符号表（`strip`）。eCapture 依赖符号表来定位 `crypto/tls` 的函数地址。
    *   检查 Go 版本，太老（< 1.17）或太新（eCapture 未适配）的版本可能会有偏移量差异。

2.  **Wireshark 显示 "Encrypted Handshake Message"？**
    *   这是正常的。TLS 1.3 的握手部分也是加密的。只要后续的 "Application Data" 被解析为 HTTP2，就说明解密成功。

3.  **捕获不到本地回环流量 (Localhost)？**
    *   eCapture 是通过 uProbe 捕获的用户态函数调用数据，**与网卡无关**。无论流量是走 `lo` 还是 `eth0`，只要发生了 TLS 加密/解密函数调用，就能捕获到。这是相比 `tcpdump` 的一大优势。
