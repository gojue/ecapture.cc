---
footer: false
---

# Introduction

:::info eCapture(旁观者):  capture SSL/TLS text content without CA cert Using eBPF.

## Home Page

1. Source code: [https://github.com/ehids/ecapture](https://github.com/ehids/ecapture)
2. Documents: [https://github.com/ehids/ecapture.cc](https://github.com/ehids/ecapture.cc)
3. Library: [https://github.com/ehids/ebpfmanager](https://github.com/ehids/ebpfmanager)


## What is eCapture?
It supports TLS encryption libraries such as openssl/gnutls/nspr etc. The userspace code is written in Go and uses cilium/ebpf. It can work on Linux Kernel 4.18 and later, and supports CO-RE features. At the same time, it also works without BTF.

### How to used?

#### Download

open `https://github.com/ehids/ecapture/releases` , and choose your version.

* Android version ,Kernel > `4.18` , `CO-RE` **Disabled** :ecapture-v0.2.2-android-aarch64-4.18-5.4.tar.gz
* Android version ,Kernel > `4.18` , `CO-RE` **Enabled** :ecapture-v0.2.2-android-aarch64.tar.gz
* Linux Kernel > 4.18 , ARM64-aarch64 : ecapture-v0.2.2-linux-aarch64.tar.gz
* Linux Kernel > 4.18 , X86_64 : ecapture-v0.2.2-linux-x86_64.tar.gz

#### Run

```shell
./ecapture 
```

#### Args
```shell
cfc4n@vm-server:~/project/ssldump$ bin/ecapture -h
NAME:
	eCapture - capture text SSL content without CA cert by ebpf hook.

USAGE:
	eCapture [flags]

VERSION:
	linux_x86_64:0.2.1-20220705-544c54d:[CORE]

COMMANDS:
	bash		capture bash command
	help		Help about any command
	mysqld		capture sql queries from mysqld 5.6/5.7/8.0 .
	postgres	capture sql queries from postgres 10+.
	tls		alias name:openssl , use to capture tls/ssl text content without CA cert.

DESCRIPTION:
	eCapture(旁观者) is a tool that can capture plaintext packets
	such as HTTPS and TLS without installing a CA certificate.
	It can also capture bash commands, which is suitable for
	security auditing scenarios, such as database auditing of mysqld, etc (disabled on Android).

	Repository: https://github.com/ehids/ecapture

OPTIONS:
  -d, --debug[=false]		enable debug logging
  -h, --help[=false]		help for eCapture
      --hex[=false]		print byte strings as hex encoded strings
      --nosearch[=false]	no lib search
  -p, --pid=0			if pid is 0 then we target all pids
  -u, --uid=0			if uid is 0 then we target all users
  -v, --version[=false]		version for eCapture
  -w, --write-file=""		-w file Write the packets to file
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
