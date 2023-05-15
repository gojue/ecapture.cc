---
footer: false
---

# Introduction

:::info eCapture(旁观者):  capture SSL/TLS text content without CA cert Using eBPF.

## Home Page

1. Source code: [https://github.com/gojue/ecapture](https://github.com/gojue/ecapture)
2. Documents: [https://github.com/gojue/ecapture.cc](https://github.com/gojue/ecapture.cc)
3. Library: [https://github.com/ehids/ebpfmanager](https://github.com/ehids/ebpfmanager)


## What is eCapture?
It supports TLS encryption libraries such as openssl/gnutls/nspr etc. The userspace code is written in Go and uses cilium/ebpf. It can work on Linux Kernel 4.18 and later, and supports CO-RE features. At the same time, it also works without BTF.

### How to used?

#### Download

open `https://github.com/gojue/ecapture/releases` , and choose your version.

* Linux/Android Kernel >= 5.5 , ARM64-aarch64 : ecapture-v0.4.1-linux/android-aarch64.tar.gz
* Linux/Android Kernel >= 4.18 , X86_64 : ecapture-v0.4.1-linux/android-x86_64.tar.gz

#### Run

```shell
./ecapture 
```

#### Args
```shell
cfc4n@vm-server:~/project/ssldump$ bin/ecapture -h
NAME:
	ecapture - capture text SSL content without CA cert by ebpf hook.

USAGE:
	ecapture [flags]

VERSION:
	linux_x86_64:0.4.11-20230205-09197fd:5.4.0-131-generic

COMMANDS:
	bash		capture bash command
	help		Help about any command
	mysqld		capture sql queries from mysqld 5.6/5.7/8.0 .
	postgres	capture sql queries from postgres 10+.
	tls		use to capture tls/ssl text content without CA cert. (Support Linux(Android)  X86_64 4.18/aarch64 5.5 or newer).

DESCRIPTION:
	eCapture(旁观者) is a tool that can capture plaintext packets
	such as HTTPS and TLS without installing a CA certificate.
	It can also capture bash commands, which is suitable for
	security auditing scenarios, such as database auditing of mysqld, etc (disabled on Android).
	
	Repository: https://github.com/gojue/ecapture
	HomePage: https://ecapture.cc
	
	Usage:
	  ecapture tls -h
	  ecapture bash -h

OPTIONS:
  -d, --debug[=false]		enable debug logging
  -h, --help[=false]		help for ecapture
      --hex[=false]		print byte strings as hex encoded strings
  -l, --log-file=""		-l save the packets to file
      --nosearch[=false]	no lib search
  -p, --pid=0			if pid is 0 then we target all pids
  -u, --uid=0			if uid is 0 then we target all users
  -v, --version[=false]		version for ecapture
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
