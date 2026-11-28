// Deliberately illustrative transactions, never live capture output.
// Kernel selections retain the current transaction so its full path stays coherent.
type Copy = { en: string; zh: string }
const copy = (en: string, zh: string): Copy => ({ en, zh })
export const captureExamples = {
  openssl: { application: 'curl', library: 'OpenSSL', probe: 'tls', request: 'GET / HTTP/1.1', host: 'example.com', header: 'User-Agent: curl', response: 'HTTP/1.1 200 OK' },
  nginx: { application: 'NGINX', library: 'OpenSSL', probe: 'tls', request: 'GET /index.html HTTP/1.1', host: 'www.example.com', header: 'Server: nginx', response: 'HTTP/1.1 200 OK' },
  gotls: { application: 'Go app', library: 'Go TLS', probe: 'gotls', request: 'GET /api/health HTTP/1.1', host: 'service.example.com', header: 'Content-Type: application/json', response: 'HTTP/1.1 200 OK' },
  gnutls: { application: 'GnuTLS client', library: 'GnuTLS', probe: 'gnutls', request: 'GET /status HTTP/1.1', host: 'api.example.com', header: 'Content-Type: text/plain', response: 'HTTP/1.1 200 OK' },
}
export type CaptureExampleId = keyof typeof captureExamples
export type CaptureExample = typeof captureExamples[CaptureExampleId]
const exampleByItem: Partial<Record<string, CaptureExampleId>> = { nginx: 'nginx', curl: 'openssl', 'go-app': 'gotls', openssl: 'openssl', gotls: 'gotls', gnutls: 'gnutls' }
export const exampleForItem = (id: string, current: CaptureExampleId): CaptureExampleId => exampleByItem[id] ?? current
export const flowNotes: Record<string, Copy> = {
  overview: copy('Three layers collect the inputs. User space decrypts and reconstructs this message.', '三层协作采集输入，由用户态解密并重建这条消息。'),
  application: copy('The application starts this exchange; the following layers make it observable.', '应用发起这次通信，后续层级协作让它变得可观测。'),
  nginx: copy('Example response from an OpenSSL-based NGINX server.', '示例：使用 OpenSSL 的 NGINX 服务端返回响应。'),
  curl: copy('Example HTTPS request from an OpenSSL-linked curl client.', '示例：使用 OpenSSL 的 curl 客户端发起 HTTPS 请求。'),
  'go-app': copy('The Go application’s traffic is reconstructed with the gotls probe.', '示例：使用 gotls 探针采集并重建 Go 应用的流量。'),
  tls: copy('Session secrets from the selected TLS library enable packet decryption.', '从当前 TLS 库采集的会话密钥，用于解密网络报文。'),
  openssl: copy('The tls probe supplies OpenSSL secrets; captured packets supply the traffic.', 'tls 探针提供 OpenSSL 密钥，捕获的网络报文提供通信数据。'),
  gotls: copy('The gotls probe supplies Go TLS secrets for this application’s packets.', 'gotls 探针提供 Go TLS 密钥，用于解密该应用的报文。'),
  gnutls: copy('The gnutls probe supplies secrets; kernel packet capture completes the inputs.', 'gnutls 探针提供密钥，内核报文采集提供另一部分输入。'),
  kernel: copy('Kernel-side capture delivers secrets and packets; decryption happens in user space.', '内核侧采集并传递密钥与报文，解密在用户态完成。'),
  ebpf: copy('eBPF observes TLS execution and network traffic to collect both inputs.', 'eBPF 观察 TLS 执行过程与网络流量，采集两类输入。'),
  events: copy('Event transport carries the captured inputs to the user-space decoder.', '事件通道把采集到的输入传递给用户态解码器。'),
  tcpip: copy('Encrypted packets need the matching TLS secrets before plaintext can be reconstructed.', '加密报文需要匹配的 TLS 密钥，才能重建出明文。'),
}
