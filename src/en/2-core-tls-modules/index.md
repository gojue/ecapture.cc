# Core TLS Modules

The module identifies **where eCapture obtains TLS secrets**. The capture mode identifies **what you get back**. You can use the same text, keylog and pcapng workflows with each supported TLS implementation.

| Module | Target on the capture host | Packet-based text | Explicit hook text |
| --- | --- | --- | --- |
| [tls](2.1-tls-capture-openssl-and-boringssl.md) | OpenSSL/BoringSSL shared library on Linux or Android | Library secrets and packets | OpenSSL-style read/write calls |
| [gotls](2.2-gotls-capture.md) | Go `crypto/tls` executable named by `--elfpath` | Go TLS secrets and packets | Go TLS connection reads/writes |
| [gnutls](2.3-gnutls-capture.md) | Supported GnuTLS shared library on Linux | GnuTLS handshake secrets and packets | GnuTLS record receive/send calls |

## From a connection to a decoded event

1. Identify the exact ELF binary or shared library used by the workload. Start eCapture before opening the test connection.
2. For the default `--model text --text-source pcapng`, eCapture collects packets on a single interface, associates available secrets and sends a pcapng stream to the live decryption SDK. Set `-i` when the workload uses a different interface from the one selected at startup.
3. The terminal prints decoded messages and runtime logs. To inspect the underlying traffic in Wireshark, add `--pcapfile session.pcapng` or select native `--model pcapng --pcapfile session.pcapng`.

To compare what each mode writes locally and what a downstream receiver gets, see [choosing a capture mode](../3-capture-modes/3.1-choosing-text-keylog-or-pcapng.md) and [output destinations](../3-capture-modes/3.5-event-destinations-and-rotation.md). [Collector reference](https://github.com/gojue/ecapture/blob/v2.12.0/README.md)
