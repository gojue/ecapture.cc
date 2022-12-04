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
