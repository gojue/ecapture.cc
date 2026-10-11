# 架构与探针开发

<details>
<summary>相关源文件</summary>

以下文件被用作生成此维基页面的上下文：

- [AGENTS.md](https://github.com/gojue/ecapture/blob/8c9caada/AGENTS.md)
- [docs/agent/architecture.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/architecture.md)
- [docs/agent/build-test.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/build-test.md)
- [docs/agent/output-pipeline-refactor-taskbook.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/output-pipeline-refactor-taskbook.md)
- [docs/agent/output-pipeline.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/output-pipeline.md)
- [docs/agent/probe-development.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/probe-development.md)
- [internal/output/writers/factory.go](https://github.com/gojue/ecapture/blob/8c9caada/internal/output/writers/factory.go)
- [internal/output/writers/pipeline_test.go](https://github.com/gojue/ecapture/blob/8c9caada/internal/output/writers/pipeline_test.go)
- [internal/probe/gnutls/gnutls_probe.go](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gnutls/gnutls_probe.go)
- [internal/probe/gotls/gotls_probe.go](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gotls/gotls_probe.go)
- [internal/probe/openssl/openssl_probe.go](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go)
- [test/e2e/fixtures/ecaptureq_assert/main.go](https://github.com/gojue/ecapture/blob/8c9caada/test/e2e/fixtures/ecaptureq_assert/main.go)

</details>

本页面面向开发者，提供了 `ecapture` 核心 TLS 捕获模块（`tls`、`gotls` 和 `gnutls`）的高层架构概览，包括其生命周期管理、事件/输出流水线以及扩展模式。

有关深层技术细节、实现和 ABI 规范，请参阅专用的子页面：
- [TLS 捕获架构](5.1-tls-capture-architecture.md)
- [探针框架与生命周期](5.2-probe-framework-and-lifecycle.md)
- [事件与输出流水线](5.3-event-and-output-pipeline.md)
- [扩展 TLS 探针](5.4-extending-a-tls-probe.md)

---

## 5.1. TLS 捕获架构

`ecapture` 代理通过将 eBPF 程序（uprobes、uretprobes 和 TC hooks）挂载到目标二进制文件或共享库，实现对 OpenSSL/BoringSSL (`tls`)、Go 原生 TLS (`gotls`) 和 GnuTLS (`gnutls`) 的流量捕获。该架构负责解析符号和库路径，提取有效负载或密钥材料，并通过 perf buffer 或 ring buffer 将内核态字节结构转换为用户态事件。

共享的运行时流程连接了命令执行、工厂创建、管理器设置和事件解码，如下图所示：

```mermaid
graph TD
    subgraph CLI_Space ["CLI 与工厂空间"]
        Main["main.go"] --> Exec["cli/cmd.Execute()"]
        Exec --> RunProbe["runProbe()"]
        RunProbe --> Factory["factory.CreateProbe()"]
    end

    subgraph Probe_Space ["探针执行空间"]
        Factory --> OpenSSL["openssl.NewProbe() [internal/probe/openssl/openssl_probe.go:61-69](https://github.com/gojue/ecapture/blob/8c9caada/"openssl.NewProbe() [internal/probe/openssl/openssl_probe.go#L61-L69)"]
        Factory --> GoTLS["gotls.NewProbe() [internal/probe/gotls/gotls_probe.go:70-78](https://github.com/gojue/ecapture/blob/8c9caada/"gotls.NewProbe() [internal/probe/gotls/gotls_probe.go#L70-L78)"]
        Factory --> GnuTLS["gnutls.NewProbe() [internal/probe/gnutls/gnutls_probe.go:48-55](https://github.com/gojue/ecapture/blob/8c9caada/"gnutls.NewProbe() [internal/probe/gnutls/gnutls_probe.go#L48-L55)"]
        OpenSSL --> Init["Probe.Initialize() & Start() [internal/probe/openssl/openssl_probe.go:72-163](https://github.com/gojue/ecapture/blob/8c9caada/"Probe.Initialize() & Start() [internal/probe/openssl/openssl_probe.go#L72-L163)"]
        GoTLS --> GoInit["Probe.Initialize() & Start() [internal/probe/gotls/gotls_probe.go:81-156](https://github.com/gojue/ecapture/blob/8c9caada/"Probe.Initialize() & Start() [internal/probe/gotls/gotls_probe.go#L81-L156)"]
        GnuTLS --> GnuInit["Probe.Initialize() & Start() [internal/probe/gnutls/gnutls_probe.go:57-116](https://github.com/gojue/ecapture/blob/8c9caada/"Probe.Initialize() & Start() [internal/probe/gnutls/gnutls_probe.go#L57-L116)"]
    end

    subgraph eBPF_Space ["eBPF 与内核空间"]
        Init --> Manager["ebpfmanager.Manager"]
        GoInit --> Manager
        GnuInit --> Manager
        Manager --> Perf["StartPerfEventReader()"]
    end

    style Main fill:_,stroke:#333,stroke-width:2px
    style Manager fill:_,stroke:#333,stroke-width:2px
```

有关 eBPF 挂载、符号解析和 C/Go 事件 ABI 的全面细节，请参阅 [TLS 捕获架构](5.1-tls-capture-architecture.md)。

Sources: [main.go](https://github.com/gojue/ecapture/blob/8c9caada/main.go), [internal/probe/openssl/openssl_probe.go:61-163](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L61-L163), [internal/probe/gotls/gotls_probe.go:70-156](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gotls/gotls_probe.go#L70-L156), [internal/probe/gnutls/gnutls_probe.go:48-116](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gnutls/gnutls_probe.go#L48-L116)

---

## 5.2. 探针框架与生命周期

具体的探针（`openssl.Probe`、`gotls.Probe` 和 `gnutls.Probe`）嵌入了 `base.BaseProbe` [internal/probe/openssl/openssl_probe.go:46-47](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L46-L47)，以继承共享的日志记录、分发器管理、读取器跟踪和停机编排。工厂注册在包初始化期间通过 Go 的 `init()` 函数进行，将 CLI 命令直接链接到探针构造函数。

生命周期遵循严格的顺序：配置验证、初始化、通过 `assets.Asset()` 进行字节码选择和资源加载 [internal/probe/openssl/openssl_probe.go:126-129](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L126-L129)、eBPF 管理器初始化与挂载、事件映射获取以及读取器执行。在卸载期间，资源将按相反顺序安全释放。

有关工厂注册、BaseProbe 生命周期钩子、读取器跟踪和并发管理的细节，请参阅 [探针框架与生命周期](5.2-probe-framework-and-lifecycle.md)。

Sources: [internal/probe/openssl/openssl_probe.go:46-209](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L46-L209), [internal/probe/gotls/gotls_probe.go:53-211](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gotls/gotls_probe.go#L53-L211), [internal/probe/gnutls/gnutls_probe.go:39-167](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gnutls/gnutls_probe.go#L39-L167)

---

## 5.3. 事件与输出流水线

捕获的二进制事件从 eBPF perf/ring-buffer 读取器流经 `EventDecoder.Decode()` 进入 `events.Dispatcher`。分发器向与所选输出模式（`text`、`keylog` 或 `pcapng`）对应的已注册处理器执行同步扇出。

解耦的输出架构将记录路由到 `ByteSink` 目标（stdout、文件、TCP 流或二进制 WebSockets），同时通过 eCaptureQ 独立发布类型化元数据：

```mermaid
graph TD
    subgraph Event_Source ["事件源空间"]
        PerfBuf["Perf/Ring Buffer 样本"] --> Decoder["EventDecoder.Decode()"]
        Decoder --> Dispatcher["events.Dispatcher.Dispatch()"]
    end

    subgraph Handlers ["处理器与表示空间"]
        Dispatcher --> TextH["文本处理器 [docs/agent/output-pipeline.md:14-14](https://github.com/gojue/ecapture/blob/8c9caada/"文本处理器 [docs/agent/output-pipeline.md#L14-L14)"]
        Dispatcher --> KeylogH["密钥日志处理器 [docs/agent/output-pipeline.md:15-15](https://github.com/gojue/ecapture/blob/8c9caada/"密钥日志处理器 [docs/agent/output-pipeline.md#L15-L15)"]
        Dispatcher --> PcapH["Pcapng 处理器 [docs/agent/output-pipeline.md:16-16](https://github.com/gojue/ecapture/blob/8c9caada/"Pcapng 处理器 [docs/agent/output-pipeline.md#L16-L16)"]
    end

    subgraph Destinations ["目标空间 (ByteSink)"]
        TextH --> Sink1["writers.ByteSink [internal/output/writers/factory.go:120-144](https://github.com/gojue/ecapture/blob/8c9caada/"writers.ByteSink [internal/output/writers/factory.go#L120-L144)"]
        KeylogH --> Sink2["writers.ByteSink [internal/output/writers/factory.go:120-144](https://github.com/gojue/ecapture/blob/8c9caada/"writers.ByteSink [internal/output/writers/factory.go#L120-L144)"]
        PcapH --> Sink3["writers.ByteSink [internal/output/writers/factory.go:120-144](https://github.com/gojue/ecapture/blob/8c9caada/"writers.ByteSink [internal/output/writers/factory.go#L120-L144)"]
    end

    subgraph Publishers ["类型化发布者空间"]
        Dispatcher --> QPub["eCaptureQ 事件发布者 [docs/agent/output-pipeline.md:17-17](https://github.com/gojue/ecapture/blob/8c9caada/"eCaptureQ 事件发布者 [docs/agent/output-pipeline.md#L17-L17)"]
    end

    style PerfBuf fill:_,stroke:#333,stroke-width:2px
    style Dispatcher fill:_,stroke:#333,stroke-width:2px
    style Sink1 fill:_,stroke:#333,stroke-width:2px
```

有关事件解码、分发器机制、ByteSink 传输和 eCaptureQ 发布细节，请参阅 [事件与输出流水线](5.3-event-and-output-pipeline.md)。

Sources: [docs/agent/output-pipeline.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/output-pipeline.md), [internal/output/writers/factory.go:77-176](https://github.com/gojue/ecapture/blob/8c9caada/internal/output/writers/factory.go#L77-L176)

---

## 5.4. 扩展 TLS 探针

扩展现有的核心 TLS 模块或引入新功能，需要保持 C eBPF 源码定义、`ebpfmanager` 映射、全局常量和 Go 解码逻辑之间的原子级对齐。开发者必须保留 CO-RE (`_core.o`) 和 non-CO-RE (`_noncore.o`) 资源路径，以及特定架构的构建标签 (`linux,netgo,ebpfassets,dynamic`)。

在修改或添加探针功能时，确保验证规则保持幂等性，并且特定模式的处理器遵循捕获的有效负载与运行日志之间的分离原则。

有关扩展 `tls`、`gotls` 或 `gnutls` 的分步指南，请参阅 [扩展 TLS 探针](5.4-extending-a-tls-probe.md)。

Sources: [AGENTS.md](https://github.com/gojue/ecapture/blob/8c9caada/AGENTS.md), [docs/agent/probe-development.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/probe-development.md), [internal/probe/openssl/openssl_probe.go:44-163](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L44-L163)