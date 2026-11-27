---
title: eCapture Decryptor — Developer Guide
description: Integrate the Go SDK or C library to decode TLS and QUIC traffic from packet captures and matching session secrets.
lang: en-US
---

# eCapture Decryptor

Use **eCapture Decryptor v1.4.4** to turn a packet capture and its TLS session secrets into application messages in your own program. For example, a test runner can use the SDK to check that a recorded HTTP response carries the expected status. The Go package and module are named `ecapture_decryptor`. [Run the Go quick start](/decryptor/en/quick-start/) · [v1.4.4 release](https://github.com/gojue/ecapture_decryptor/releases/tag/v1.4.4)

## Choose an integration {#integrations}

| What your program has | Where to start | What your program receives |
| --- | --- | --- |
| A completed pcapng with embedded TLS secrets, or a pcap and a matching NSS key log | [Go file API](/decryptor/en/quick-start/) | A channel of decoded events that your program drains |
| A producer writing pcapng blocks to a pipe or connection | [Go streaming API](/decryptor/en/streaming/) | A callback for each decoded event, including events unlocked by a later secrets block |
| A C or C++ executable that processes capture files | [Native library](/decryptor/en/native/) | A JSON file containing event metadata |

In Go, the result type is `*types.DecryptedPacket`. A single HTTP response can span many network packets. By default, the SDK emits the reconstructed message. With incremental HTTP events enabled, it can emit headers, body chunks and the end of the message separately. Choose the representation that your consumer expects. [API and event fields](/decryptor/en/api/) · [Protocols and output modes](/decryptor/en/protocols/)

## Where eCapture and eCaptureQ fit {#ecosystem}

eCapture v2.12.0 embeds this SDK version. Its packet-based text mode sends packets and secrets to the SDK on the capture host. You can also save a pcapng with eCapture and read that file later in a separate Go or C program. Reading a saved test capture requires neither a running collector nor eBPF privileges. [Collector capture modes](/en/3-capture-modes/) · [Pinned SDK dependency](https://github.com/gojue/ecapture/blob/v2.12.0/go.mod)

eCaptureQ subscribes to the collector's `ecapture.v2` WebSocket and can export a native pcapng file. Pass that file to the SDK. A WebSocket message still has its Protobuf envelope, which the SDK's pcapng reader cannot consume directly. [eCaptureQ native file export](/q/en/interface/#native)

## Distribution and licensing {#distribution}

The project publishes Go source and prebuilt C libraries under separate terms. Its license includes an exception for integration in eCapture and works derived from eCapture. For a standalone application, consult the source or binary terms for the form you use. The binary license covers non-commercial linking and specifies attribution and commercial licensing requirements. [Source license and eCapture exception](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/LICENSE) · [Binary license](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/LICENSE-BINARY)
