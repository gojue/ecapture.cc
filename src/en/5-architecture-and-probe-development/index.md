# Architecture and Probe Development

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

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



This developer-facing wiki page provides a high-level architectural overview of `ecapture`'s core TLS capture modules (`tls`, `gotls`, and `gnutls`), their lifecycle management, event/output pipelines, and extension patterns. 

For deep technical details, implementations, and ABI specifications, please refer to the dedicated child pages:
- [TLS Capture Architecture](5.1-tls-capture-architecture.md)
- [Probe Framework and Lifecycle](5.2-probe-framework-and-lifecycle.md)
- [Event and Output Pipeline](5.3-event-and-output-pipeline.md)
- [Extending a TLS Probe](5.4-extending-a-tls-probe.md)

---

## 5.1. TLS Capture Architecture

The `ecapture` agent captures TLS traffic across OpenSSL/BoringSSL (`tls`), Go native TLS (`gotls`), and GnuTLS (`gnutls`) by attaching eBPF programs (uprobes, uretprobes, and TC hooks) to target binaries or shared libraries. The architecture resolves symbols and library paths, extracts payload or key material, and converts kernel-space byte structures into user-space events via perf buffers or ring buffers.

The shared runtime flow connects command execution, factory creation, manager setup, and event decoding as illustrated below:

```mermaid
graph TD
    subgraph CLI_Space ["CLI and Factory Space"]
        Main["main.go"] --> Exec["cli/cmd.Execute()"]
        Exec --> RunProbe["runProbe()"]
        RunProbe --> Factory["factory.CreateProbe()"]
    end

    subgraph Probe_Space ["Probe Execution Space"]
        Factory --> OpenSSL["openssl.NewProbe() [internal/probe/openssl/openssl_probe.go:61-69](https://github.com/gojue/ecapture/blob/8c9caada/"openssl.NewProbe() [internal/probe/openssl/openssl_probe.go#L61-L69)"]
        Factory --> GoTLS["gotls.NewProbe() [internal/probe/gotls/gotls_probe.go:70-78](https://github.com/gojue/ecapture/blob/8c9caada/"gotls.NewProbe() [internal/probe/gotls/gotls_probe.go#L70-L78)"]
        Factory --> GnuTLS["gnutls.NewProbe() [internal/probe/gnutls/gnutls_probe.go:48-55](https://github.com/gojue/ecapture/blob/8c9caada/"gnutls.NewProbe() [internal/probe/gnutls/gnutls_probe.go#L48-L55)"]
        OpenSSL --> Init["Probe.Initialize() & Start() [internal/probe/openssl/openssl_probe.go:72-163](https://github.com/gojue/ecapture/blob/8c9caada/"Probe.Initialize() & Start() [internal/probe/openssl/openssl_probe.go#L72-L163)"]
        GoTLS --> GoInit["Probe.Initialize() & Start() [internal/probe/gotls/gotls_probe.go:81-156](https://github.com/gojue/ecapture/blob/8c9caada/"Probe.Initialize() & Start() [internal/probe/gotls/gotls_probe.go#L81-L156)"]
        GnuTLS --> GnuInit["Probe.Initialize() & Start() [internal/probe/gnutls/gnutls_probe.go:57-116](https://github.com/gojue/ecapture/blob/8c9caada/"Probe.Initialize() & Start() [internal/probe/gnutls/gnutls_probe.go#L57-L116)"]
    end

    subgraph eBPF_Space ["eBPF and Kernel Space"]
        Init --> Manager["ebpfmanager.Manager"]
        GoInit --> Manager
        GnuInit --> Manager
        Manager --> Perf["StartPerfEventReader()"]
    end

    style Main fill:_,stroke:#333,stroke-width:2px
    style Manager fill:_,stroke:#333,stroke-width:2px
```

For comprehensive details on eBPF attachments, symbol resolution, and C/Go event ABIs, see [TLS Capture Architecture](5.1-tls-capture-architecture.md).

Sources: [main.go](https://github.com/gojue/ecapture/blob/8c9caada/main.go), [internal/probe/openssl/openssl_probe.go:61-163](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L61-L163), [internal/probe/gotls/gotls_probe.go:70-156](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gotls/gotls_probe.go#L70-L156), [internal/probe/gnutls/gnutls_probe.go:48-116](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gnutls/gnutls_probe.go#L48-L116)

---

## 5.2. Probe Framework and Lifecycle

Concrete probes (`openssl.Probe`, `gotls.Probe`, and `gnutls.Probe`) embed `base.BaseProbe` [internal/probe/openssl/openssl_probe.go:46-47](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L46-L47) to inherit shared logging, dispatcher management, reader tracking, and shutdown orchestration. Factory registration occurs during package initialization via Go's `init()` functions, linking CLI commands directly to probe constructors.

The lifecycle follows a strict sequence: configuration validation, initialization, bytecode selection and asset loading via `assets.Asset()` [internal/probe/openssl/openssl_probe.go:126-129](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L126-L129), eBPF manager initialization and attachment, event map retrieval, and reader execution. During teardown, resources are released safely in reverse order.

For details on factory registration, BaseProbe lifecycle hooks, reader tracking, and concurrency management, see [Probe Framework and Lifecycle](5.2-probe-framework-and-lifecycle.md).

Sources: [internal/probe/openssl/openssl_probe.go:46-209](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L46-L209), [internal/probe/gotls/gotls_probe.go:53-211](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gotls/gotls_probe.go#L53-L211), [internal/probe/gnutls/gnutls_probe.go:39-167](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/gnutls/gnutls_probe.go#L39-L167)

---

## 5.3. Event and Output Pipeline

Captured binary events flow from eBPF perf/ring-buffer readers through `EventDecoder.Decode()` into the `events.Dispatcher`. The dispatcher performs synchronous fan-out to registered handlers corresponding to the selected output mode (`text`, `keylog`, or `pcapng`).

The decoupled output architecture routes records to `ByteSink` destinations (stdout, files, TCP streams, or binary WebSockets) while publishing typed metadata independently via eCaptureQ:

```mermaid
graph TD
    subgraph Event_Source ["Event Source Space"]
        PerfBuf["Perf/Ring Buffer Sample"] --> Decoder["EventDecoder.Decode()"]
        Decoder --> Dispatcher["events.Dispatcher.Dispatch()"]
    end

    subgraph Handlers ["Handler and Representation Space"]
        Dispatcher --> TextH["TextHandler [docs/agent/output-pipeline.md:14-14](https://github.com/gojue/ecapture/blob/8c9caada/"TextHandler [docs/agent/output-pipeline.md#L14-L14)"]
        Dispatcher --> KeylogH["KeylogHandler [docs/agent/output-pipeline.md:15-15](https://github.com/gojue/ecapture/blob/8c9caada/"KeylogHandler [docs/agent/output-pipeline.md#L15-L15)"]
        Dispatcher --> PcapH["PcapngHandler [docs/agent/output-pipeline.md:16-16](https://github.com/gojue/ecapture/blob/8c9caada/"PcapngHandler [docs/agent/output-pipeline.md#L16-L16)"]
    end

    subgraph Destinations ["Destination Space (ByteSink)"]
        TextH --> Sink1["writers.ByteSink [internal/output/writers/factory.go:120-144](https://github.com/gojue/ecapture/blob/8c9caada/"writers.ByteSink [internal/output/writers/factory.go#L120-L144)"]
        KeylogH --> Sink2["writers.ByteSink [internal/output/writers/factory.go:120-144](https://github.com/gojue/ecapture/blob/8c9caada/"writers.ByteSink [internal/output/writers/factory.go#L120-L144)"]
        PcapH --> Sink3["writers.ByteSink [internal/output/writers/factory.go:120-144](https://github.com/gojue/ecapture/blob/8c9caada/"writers.ByteSink [internal/output/writers/factory.go#L120-L144)"]
    end

    subgraph Publishers ["Typed Publisher Space"]
        Dispatcher --> QPub["eCaptureQ EVENT Publisher [docs/agent/output-pipeline.md:17-17](https://github.com/gojue/ecapture/blob/8c9caada/"eCaptureQ EVENT Publisher [docs/agent/output-pipeline.md#L17-L17)"]
    end

    style PerfBuf fill:_,stroke:#333,stroke-width:2px
    style Dispatcher fill:_,stroke:#333,stroke-width:2px
    style Sink1 fill:_,stroke:#333,stroke-width:2px
```

For details on event decoding, dispatcher mechanics, ByteSink transports, and eCaptureQ publication, see [Event and Output Pipeline](5.3-event-and-output-pipeline.md).

Sources: [docs/agent/output-pipeline.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/output-pipeline.md), [internal/output/writers/factory.go:77-176](https://github.com/gojue/ecapture/blob/8c9caada/internal/output/writers/factory.go#L77-L176)

---

## 5.4. Extending a TLS Probe

Extending existing core TLS modules or introducing new capabilities requires maintaining atomic alignment across C eBPF source definitions, `ebpfmanager` mappings, global constants, and Go decoding logic. Developers must preserve CO-RE (`_core.o`) and non-CO-RE (`_noncore.o`) asset paths as well as architecture-specific build tags (`linux,netgo,ebpfassets,dynamic`).

When modifying or adding probe features, ensure that validation rules remain idempotent and that mode-specific handlers respect the separation between captured payloads and operational logging.

For step-by-step guidance on extending `tls`, `gotls`, or `gnutls`, see [Extending a TLS Probe](5.4-extending-a-tls-probe.md).

Sources: [AGENTS.md](https://github.com/gojue/ecapture/blob/8c9caada/AGENTS.md), [docs/agent/probe-development.md](https://github.com/gojue/ecapture/blob/8c9caada/docs/agent/probe-development.md), [internal/probe/openssl/openssl_probe.go:44-163](https://github.com/gojue/ecapture/blob/8c9caada/internal/probe/openssl/openssl_probe.go#L44-L163)