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
| **TLS** (`tls`) | OpenSSL, LibreSSL and BoringSSL |
| **GoTLS** (`gotls`) | Applications using Go's TLS implementation |
| **GnuTLS** (`gnutls`) | Applications linked to GnuTLS |

The [core TLS modules](/en/2-core-tls-modules/) guide explains library paths and probe options.

## Read, save or analyze {#outputs}

Use **text mode** to view captured plaintext in the terminal and write output to files. Operational logs describe the collector's activity; captured messages contain the observed application traffic.

For other workflows, **Keylog** saves TLS session keys, while **PCAPNG** stores packets and TLS secrets for analysis in tools such as Wireshark. See [capture modes](/en/3-capture-modes/) to choose an output format.

## Command line or graphical interface? {#relationship}

**eCapture collects and decrypts on the capture machine. eCaptureQ provides the graphical analysis interface.** You can use eCapture independently from a terminal, or connect eCaptureQ to a compatible collector to search and correlate messages.

| | eCapture | eCaptureQ |
| --- | --- | --- |
| Interface | Command line | Desktop app or Web interface |
| Main task | Capture TLS plaintext; show or save output | Filter, correlate and inspect messages |
| Where it runs | Supported Linux / Android capture machine | Windows, macOS or Linux workstation / Web host |
| Get it | [Download eCapture](/en/download/) | [Download eCaptureQ](/q/en/download/) |

Learn about the graphical workflow in the existing [eCaptureQ Overview](/q/en/).

## Start on a supported capture machine {#start}

Linux supports **amd64**, **arm64** and **loong64**, with minimum kernels **4.18**, **5.5** and **6.6** respectively. Android supports **amd64** and **arm64**. Loading probes requires root or the appropriate Linux capabilities.

Download a build for your system, then follow [Getting Started](/en/1-getting-started/) to make your first capture. For an OpenSSL-linked application, the basic command is:

```sh
sudo ecapture tls
```

Use the documentation and `ecapture --help` for your installed release when choosing options. [Advanced usage](/en/4-advanced-usage/) covers more deployment and output scenarios; [architecture and probe development](/en/5-architecture-and-probe-development/) explains the internals.

[Official releases](https://github.com/gojue/ecapture/releases) · [Source and platform requirements](https://github.com/gojue/ecapture) · [Changelog](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md)
