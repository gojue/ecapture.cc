---
footer: false
---

# Introduction

:::info eCapture(旁观者):  capture SSL/TLS text content without CA cert Using eBPF.

## Home Page

1. Source code: [https://github.com/gojue/ecapture](https://github.com/gojue/ecapture)
2. Documents: [https://github.com/gojue/ecapture.cc](https://github.com/gojue/ecapture.cc)
3. Library: [https://github.com/gojue/ebpfmanager](https://github.com/gojue/ebpfmanager)


## What is eCapture?
It supports TLS encryption libraries such as openssl/gnutls/nspr etc. The userspace code is written in Go and uses cilium/ebpf. It can work on Linux Kernel 4.18 and later, and supports CO-RE features. At the same time, it also works without BTF.

### How to used?

#### Download

open [https://github.com/gojue/ecapture/releases](https://github.com/gojue/ecapture/releases) , and choose your version.

* Linux/Android Kernel >= 5.5 , ARM64-aarch64 : ecapture-v0.4.1-linux/android-aarch64.tar.gz
* Linux/Android Kernel >= 4.18 , X86_64 : ecapture-v0.4.1-linux/android-x86_64.tar.gz

#### Run

```shell
./ecapture 
```

#### Args
```shell
cfc4n@vmserver:~/ecapture$ sudo ecapture -h
NAME:
	ecapture - capture text SSL content without CA cert by ebpf hook.

USAGE:
	ecapture [flags]

VERSION:
	linux_arm64:v0.8.0:5.15.0-105-generic

COMMANDS:
	bash		capture bash command
	gnutls		capture gnutls text content without CA cert for gnutls libraries.
	gotls		Capturing plaintext communication from Golang programs encrypted with TLS/HTTPS.
	help		Help about any command
	mysqld		capture sql queries from mysqld 5.6/5.7/8.0 .
	nss		capture nss/nspr encrypted text content without CA cert for nss/nspr libraries.
	postgres	capture sql queries from postgres 10+.
	tls		use to capture tls/ssl text content without CA cert. (Support openssl 1.0.x/1.1.x/3.0.x or newer).

DESCRIPTION:
	eCapture(旁观者) is a tool that can capture plaintext packets
	such as HTTPS and TLS without installing a CA certificate.
	It can also capture bash commands, which is suitable for
	security auditing scenarios, such as database auditing of mysqld, etc (disabled on Android).
	Support Linux(Android)  X86_64 4.18/aarch64 5.5 or newer.
	Repository: https://github.com/gojue/ecapture
	HomePage: https://ecapture.cc
	
	Usage:
	  ecapture tls -h
	  ecapture bash -h

OPTIONS:
  -b, --btf=0		enable BTF mode.(0:auto; 1:core; 2:non-core)
  -d, --debug[=false]	enable debug logging.(coming soon)
  -h, --help[=false]	help for ecapture
      --hex[=false]	print byte strings as hex encoded strings
  -l, --logaddr=""	-l /tmp/ecapture.log or -l tcp://127.0.0.1:8080
      --mapsize=1024	eBPF map size per CPU,for events buffer. default:1024 * PAGESIZE. (KB)
  -p, --pid=0		if pid is 0 then we target all pids
  -u, --uid=0		if uid is 0 then we target all users
  -v, --version[=false]	version for ecapture
```


## Still Got Questions?

[//]: # ([comment]: <> TODO: dead link)
[comment]: <> (More Detail [Quick-Start]&#40;/guide/quick-start&#41;.)

## Pick Your Learning Path

Different developers have different learning styles. Feel free to pick a learning path that suits your preference - although we do recommend going over all of the content, if possible!

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
