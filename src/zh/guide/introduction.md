---
footer: false
---

# 介绍

:::info eCapture旁观者无需CA证书，即可抓HTTPS/TLS明文数据 !

## eCapture旁观者是什么?
eBPF HOOK uprobe实现的各种用户态进程的数据捕获，无需改动原程序。
也可以导出为pcap-NG格式的数据包，使用wireshark打开。
支持 Linux/Android 两种操作系统，支持x86_64、aarch64两种CPU架构。

* SSL/HTTPS数据导出功能，针对HTTPS的数据包抓取，不需要导入CA证书。
* bash的命令捕获，HIDS的bash命令监控解决方案。
* mysql query等数据库的数据库审计解决方案。


### 为什么选择eCapture?
Wireshark、tcpdump等工具，只能抓到加密后的流量，无法捕获TLS的明文。eCapture只需要root权限，即可捕获明文的HTTPS通信包明文。

### 如何使用
#### 下载

open `https://github.com/gojue/ecapture/releases` , and choose your version.

* Linux、Android ARM64-aarch64 CPU架构，内核版本 >= 5.5 ,  ecapture-v0.4.1-linux/android-aarch64.tar.gz
* Linux/Android X86_64 CPU架构，内核版本 >= 4.18 , ecapture-v0.4.1-linux/android-x86_64.tar.gz

#### 运行

```shell
./ecapture 
```

#### 参数
```shell
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

## 还有问题？?

[comment]: <> TODO: dead link
[comment]: <> (Check out our [FAQ]&#40;/about/faq&#41;.)

## 我已入门，可以开始使用eCapture了！

根据自己的经验，选择适合你自己的路径：

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/zh/tutorial/">
    <p class="next-steps-link">Try the Tutorial</p>
    <p class="next-steps-caption">For those who prefer learning things hands-on.</p>
  </a>
  <a class="vt-box" href="/zh/guide/quick-start.html">
    <p class="next-steps-link">新手指南</p>
    <p class="next-steps-caption">The guide walks you through every aspect of the framework in full detail.</p>
  </a>
  <a class="vt-box" href="/zh/examples/">
    <p class="next-steps-link">使用案例</p>
    <p class="next-steps-caption">Explore examples of core features and common UI tasks.</p>
  </a>
</div>
