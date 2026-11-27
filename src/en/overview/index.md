---
title: eCapture — Overview
description: Capture TLS plaintext with the eCapture command-line tool, inspect it in your terminal, save output to files, or connect a graphical analysis interface.
lang: en-US
---

# eCapture

See TLS traffic in plaintext with a **command-line capture tool powered by eBPF**. Run eCapture on a supported Linux or Android capture machine, inspect results and operational logs in your terminal, or write output to files for later analysis.

## Capture at the source {#capture}

eCapture observes supported TLS libraries and Go applications without installing a custom CA or changing the target application's code. Use it to investigate requests and responses, troubleshoot encrypted connections, and collect evidence for authorized security analysis.

Choose the probe that matches your application:

| Probe | Target |
| --- | --- |
| **TLS** (`tls`) | Applications using supported OpenSSL or BoringSSL builds |
| **GoTLS** (`gotls`) | Applications using Go's TLS implementation |
| **GnuTLS** (`gnutls`) | Linux applications linked to GnuTLS |

The [core TLS modules](/en/2-core-tls-modules/) guide explains library paths and probe options.

## Read, save or analyze {#outputs}

In **eCapture v2.12.0**, the three core probes default to text mode with the `pcapng` source. The collector combines packets from one interface with TLS secrets to reconstruct HTTP/1.x and HTTP/2 messages. It prints messages and runtime logs on stdout. Use `-i lo` for a local loopback test. To keep the terminal view and also save structured records, add `--output stdout --output capture.jsonl`.

For offline analysis, `-m pcapng --pcapfile capture.pcapng` saves packets and TLS secrets together for Wireshark. If you already collect packets separately, `-m keylog --keylogfile capture.keys` saves the matching secrets. To read the capture in your own Go program, follow the [Decryptor SDK quick start](/decryptor/en/quick-start/). [Compare capture modes](/en/3-capture-modes/).

## Command line or graphical interface? {#relationship}

**eCapture collects and decrypts on the capture machine. eCaptureQ provides the graphical analysis interface.** If both run on one host, start eCapture v2.12.0 with `--stream-listen ws://127.0.0.1:28256/` and enter that address as a source in eCaptureQ v1.2.0. With the Web edition, the Q service connects to the collector. The browser opens Q at `http://127.0.0.1:28257/` by default. [Connection settings](/q/en/data-sources/)

Use text mode to search decoded messages. With `-m keylog` or `-m pcapng`, Q can save the native data it receives from the time it subscribes. Connect Q before the test handshake if you need the whole session. [Native file export](/q/en/interface/#native)

| | eCapture | eCaptureQ |
| --- | --- | --- |
| Interface | Command line | Desktop app or Web interface |
| Main task | Capture TLS plaintext; show or save output | Filter, correlate and inspect messages |
| Where it runs | Supported Linux / Android capture machine | Windows, macOS or Linux workstation / Web host |
| Get it | [Download eCapture](/en/download/) | [Download eCaptureQ](/q/en/download/) |

For the listener command and connection settings, see the [eCaptureQ quick start](/q/en/quick-start/).

## Start on a supported capture machine {#start}

Linux supports **amd64**, **arm64** and **loong64**, with minimum kernels **4.18**, **5.5** and **6.6** respectively. Android supports **amd64** and **arm64**. Loading probes requires root or the appropriate Linux capabilities.

Download a build for your system, then follow [Getting Started](/en/1-getting-started/) to make your first capture. For an OpenSSL-linked application, the basic command is:

```sh
sudo ecapture tls
```

Use the documentation and `ecapture --help` for your installed release when choosing options. [Advanced usage](/en/4-advanced-usage/) covers more deployment and output scenarios; [architecture and probe development](/en/5-architecture-and-probe-development/) explains the internals.

[Official releases](https://github.com/gojue/ecapture/releases) · [Source and platform requirements](https://github.com/gojue/ecapture) · [Changelog](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md)
