---
footer: false
---

# Introduction

## What is eCapture?

eCapture(旁观者) is a tool that captures SSL/TLS text content without CA cert Using eBPF. It supports TLS encryption libraries such as openssl/gnutls/nspr etc. The userspace code is written in Go and uses cilium/ebpf. It can work on Linux Kernel 4.18 and later, and supports CO-RE features. At the same time, it also works without BTF.

## Project Links

- Source code: [https://github.com/gojue/ecapture](https://github.com/gojue/ecapture)
- Documents: [https://github.com/gojue/ecapture.cc](https://github.com/gojue/ecapture.cc)
- Library: [https://github.com/gojue/ebpfmanager](https://github.com/gojue/ebpfmanager)

## Quick Start

### Download

Open [https://github.com/gojue/ecapture/releases](https://github.com/gojue/ecapture/releases) and choose your version:

- Linux/Android Kernel >= 5.5, ARM64-aarch64: ecapture-v0.8.0-linux/android-arm64.tar.gz
- Linux/Android Kernel >= 4.18, X86_64: ecapture-v0.8.0-linux/android-amd64.tar.gz

### Basic Usage

Run the following command:

```shell
./ecapture 
```

### Available Commands

```shell
NAME:
    ecapture - capture text SSL content without CA cert by ebpf hook.

USAGE:
    ecapture [flags]

COMMANDS:
    bash        capture bash command
    gnutls      capture gnutls text content without CA cert for gnutls libraries.
    gotls       Capturing plaintext communication from Golang programs encrypted with TLS/HTTPS.
    help        Help about any command
    mysqld      capture sql queries from mysqld 5.6/5.7/8.0 .
    nss         capture nss/nspr encrypted text content without CA cert for nss/nspr libraries.
    postgres    capture sql queries from postgres 10+.
    tls         use to capture tls/ssl text content without CA cert. (Support openssl 1.0.x/1.1.x/3.0.x or newer).
```

## Learning Path

Different developers have different learning styles. Feel free to pick a learning path that suits your preference:

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Try the Tutorial</p>
    <p class="next-steps-caption">For those who prefer learning things hands-on.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Read the Guide</p>
    <p class="next-steps-caption">The guide walks you through every aspect of the framework in full detail.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Check out the Examples</p>
    <p class="next-steps-caption">Explore examples of core features and common UI tasks.</p>
  </a>
</div>
