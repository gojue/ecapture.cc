type Copy = { en: string; zh: string }
type Detail = { label: Copy; value: Copy }
export interface CaptureItem {
  id: string
  label: string
  title: Copy
  description: Copy
  details: Detail[]
  doc: string
  command?: string
  shape?: 'server' | 'terminal' | 'code' | 'library' | 'chip'
}
export interface CaptureLayer extends CaptureItem { components: CaptureItem[] }
const copy = (en: string, zh: string): Copy => ({ en, zh })
const detail = (en: string, zh: string, value: string, valueZh: string): Detail => ({ label: copy(en, zh), value: copy(value, valueZh) })
const architecture = '/5-architecture-and-probe-development/5.1-tls-capture-architecture'
const openssl = '/2-core-tls-modules/2.1-tls-capture-openssl-and-boringssl'
const gotls = '/2-core-tls-modules/2.2-gotls-capture'
const gnutls = '/2-core-tls-modules/2.3-gnutls-capture'

// Logical layers, not physical hardware or a one-to-one app/library mapping.
// Capture paths checked against gojue/ecapture README, CHANGELOG and
// internal/probe/openssl/openssl_probe.go (2026-11-28).
export const captureLayers: CaptureLayer[] = [
  {
    id: 'application', label: 'APPLICATION', title: copy('Application', '应用层'),
    description: copy('The clients and services that send and receive TLS traffic. eCapture observes their TLS implementation without changing application code or installing a custom CA.', '发起和接收 TLS 通信的客户端与服务。eCapture 观察其使用的 TLS 实现，无需修改应用代码或安装自定义 CA 证书。'),
    details: [detail('Contains', '包含内容', 'Web servers, command-line clients and Go services', 'Web 服务器、命令行客户端与 Go 服务'), detail('Choose a probe', '选择探针', 'Match the TLS library or runtime used by the process.', '根据进程实际使用的 TLS 库或运行时选择探针。')],
    doc: '/1-getting-started/',
    components: [
      {
        id: 'nginx', label: 'NGINX', shape: 'server', title: copy('NGINX', 'NGINX'),
        description: copy('An example HTTPS server. For an OpenSSL-based build, the tls probe targets the SSL library used by its worker processes.', '以 HTTPS 服务端为例：对于使用 OpenSSL 的 NGINX，tls 探针针对工作进程实际加载的 SSL 库进行捕获。'),
        details: [detail('Role', '作用', 'Serve HTTPS requests and responses', '处理 HTTPS 请求与响应'), detail('Capture target', '捕获目标', 'The SSL library used by this NGINX build', '当前 NGINX 构建实际使用的 SSL 库')], doc: openssl,
      },
      {
        id: 'curl', label: 'curl', shape: 'terminal', title: copy('curl', 'curl'),
        description: copy('A convenient client for generating an HTTPS request. Its TLS backend depends on how curl was built; check curl -V before choosing a probe.', '用于发起 HTTPS 请求的命令行客户端。curl 的 TLS 后端取决于构建方式，可先通过 curl -V 确认，再选择对应探针。'),
        details: [detail('Role', '作用', 'Generate traffic for a capture', '产生用于捕获的测试流量'), detail('TLS backend', 'TLS 后端', 'For example, OpenSSL or GnuTLS', '例如 OpenSSL 或 GnuTLS')],
        command: 'curl https://example.com', doc: '/1-getting-started/1.3-first-openssl-and-boringssl-capture',
      },
      {
        id: 'go-app', label: 'Go app', shape: 'code', title: copy('Go application', 'Go 应用'),
        description: copy('A client or service using Go’s crypto/tls package. The gotls probe resolves capture points in the application executable.', '使用 Go 标准库 crypto/tls 的客户端或服务。gotls 探针从应用可执行文件中定位捕获点。'),
        details: [detail('Runtime', '运行时', 'Go standard-library TLS', 'Go 标准库 TLS'), detail('Capture target', '捕获目标', 'The running application’s executable', '正在运行的应用可执行文件')],
        command: 'sudo ecapture gotls --elfpath ./app', doc: gotls,
      },
    ],
  },
  {
    id: 'tls', label: 'TLS LIBRARY', title: copy('TLS library', 'TLS 库层'),
    description: copy('TLS libraries negotiate encrypted connections and hold session secrets. The matching probe collects those secrets for packet decryption; explicit hook mode can observe plaintext reads and writes.', 'TLS 库负责建立加密连接并持有会话密钥。对应探针采集密钥，用于网络报文解密；显式选择 hook 模式时，也可观察明文读写。'),
    details: [detail('Core probes', '核心探针', 'tls · gotls · gnutls', 'tls · gotls · gnutls'), detail('Default text path', '默认文本路径', 'TLS secrets + packets → decoded messages', 'TLS 密钥 + 网络报文 → 解密后的消息')], doc: '/2-core-tls-modules/',
    components: [
      {
        id: 'openssl', label: 'OpenSSL', shape: 'library', title: copy('OpenSSL / BoringSSL', 'OpenSSL / BoringSSL'),
        description: copy('The tls module observes applications using OpenSSL or BoringSSL. Its default text path combines captured TLS secrets with packets to reconstruct messages.', 'tls 模块观察使用 OpenSSL 或 BoringSSL 的应用。默认文本路径将采集到的 TLS 密钥与网络报文结合，重建消息。'),
        details: [detail('Probe', '探针', 'tls', 'tls'), detail('Library selection', '库选择', 'System libssl, or a path supplied with --libssl', '系统 libssl，或通过 --libssl 指定的路径')], command: 'sudo ecapture tls', doc: openssl,
      },
      {
        id: 'gotls', label: 'Go TLS', shape: 'library', title: copy('Go TLS', 'Go TLS'),
        description: copy('The gotls module targets crypto/tls inside a Go executable. Session secrets from the runtime enable decryption of captured traffic.', 'gotls 模块针对 Go 可执行文件中的 crypto/tls。运行时产生的会话密钥可用于解密采集到的流量。'),
        details: [detail('Probe', '探针', 'gotls', 'gotls'), detail('Executable selection', '程序选择', 'Point --elfpath at the target Go binary.', '通过 --elfpath 指向目标 Go 程序。')], command: 'sudo ecapture gotls --elfpath ./app', doc: gotls,
      },
      {
        id: 'gnutls', label: 'GnuTLS', shape: 'library', title: copy('GnuTLS', 'GnuTLS'),
        description: copy('The gnutls module observes applications linked to GnuTLS. It selects a layout for the detected library version to collect the secrets needed for decryption.', 'gnutls 模块观察链接 GnuTLS 的应用，根据检测到的库版本选择相应布局，采集解密所需的密钥。'),
        details: [detail('Probe', '探针', 'gnutls', 'gnutls'), detail('Library selection', '库选择', 'Select a custom library with --gnutls.', '通过 --gnutls 指定自定义库路径。')], command: 'sudo ecapture gnutls', doc: gnutls,
      },
    ],
  },
  {
    id: 'kernel', label: 'KERNEL', title: copy('Kernel', '内核层'),
    description: copy('eBPF programs run in the kernel, observing TLS execution and network traffic. Captured events travel to the user-space collector, where messages are decrypted and decoded.', 'eBPF 程序在内核中运行，观察 TLS 执行过程与网络流量。采集到的事件传递给用户态采集器，在用户态完成解密和消息解析。'),
    details: [detail('Contains', '包含内容', 'eBPF probes, event transport and network capture', 'eBPF 探针、事件传输与网络捕获'), detail('Processing', '处理流程', 'Kernel collection → user-space decoding', '内核采集 → 用户态解码')], doc: architecture,
    components: [
      {
        id: 'ebpf', label: 'eBPF', shape: 'chip', title: copy('eBPF probes', 'eBPF 探针'),
        description: copy('Kernel-side programs attach to selected observation points. Uprobes observe user-space TLS functions; packet capture uses network hooks.', '内核侧程序附着在选定的观测点。uprobe 观察用户态 TLS 函数，网络钩子则负责采集报文。'),
        details: [detail('Runs in', '运行位置', 'The kernel', '内核'), detail('Observes', '观测内容', 'TLS secrets, packets and process context', 'TLS 密钥、报文及进程上下文')], doc: architecture,
      },
      {
        id: 'events', label: 'Events', shape: 'chip', title: copy('Event transport', '事件通道'),
        description: copy('Event buffers carry records from eBPF programs to the user-space collector. Module-specific decoders interpret them before they enter the output pipeline.', '事件缓冲区将 eBPF 程序产生的记录传递给用户态采集器。各模块的解码器解释这些记录，再交给输出流水线。'),
        details: [detail('Carries', '传输内容', 'Captured data and available process metadata', '采集数据及可用的进程元数据'), detail('Destination', '接收端', 'The eCapture user-space collector', 'eCapture 用户态采集器')], doc: architecture,
      },
      {
        id: 'tcpip', label: 'TCP/IP', shape: 'chip', title: copy('Network traffic', '网络流量'),
        description: copy('The network stack carries encrypted traffic. In the default text path, captured packets and TLS secrets feed a user-space decryption pipeline; the packets alone are not plaintext.', '网络协议栈承载加密流量。默认文本路径将采集的报文与 TLS 密钥送入用户态解密流水线；网络报文本身并不是明文。'),
        details: [detail('Capture point', '捕获位置', 'The selected network interface', '选定的网络接口'), detail('Interface selection', '接口选择', 'Use -i to choose an interface, such as -i lo for loopback.', '使用 -i 选择接口，例如用 -i lo 捕获回环流量。')], doc: '/3-capture-modes/3.2-text-mode',
      },
    ],
  },
]
