---
footer: false
---

# Getting started

## Download
:::tip Use ELF binary file

Download ELF zip file [release](https://github.com/ehids/ecapture/releases) 
unzip ,exec command `./ecapture --help`
  :::

* Linux kernel version >= 4.15 is required.
* Enable BTF [BPF Type Format (BTF)](https://www.kernel.org/doc/html/latest/bpf/btf.html)  (Optional, 2022-04-17)

### check your server BTF config：
```shell
cfc4n@vm-server:~$# uname -r
4.18.0-305.3.1.el8.x86_64
cfc4n@vm-server:~$# cat /boot/config-`uname -r` | grep CONFIG_DEBUG_INFO_BTF
CONFIG_DEBUG_INFO_BTF=y
```

### tls command
capture tls text context.
Step 1:
```shell
./ecapture tls --hex
```

Step 2:
```shell
curl https://github.com
```

## Next Steps

If you skipped the [Introduction](/guide/introduction), we strongly recommend reading it before moving on to the rest of the documentation.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/examples/docker.html">
    <p class="next-steps-link">eCapture in netshoot</p>
    <p class="next-steps-caption">ecapture in netshoot pod to capture other container traffic.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Try the Tutorial</p>
    <p class="next-steps-caption">For those who prefer learning things hands-on.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Check out the Examples</p>
    <p class="next-steps-caption">Explore examples of core features and common UI tasks.</p>
  </a>
</div>
