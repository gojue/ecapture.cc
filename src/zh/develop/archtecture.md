---
footer: false
---

# 项目结构

```
> assets        (编译生成文件 - 用户态)
> bin           (编译生成文件 - 内核态)
> cli           (命令文件目录)
> images
> kern          (内核态代码)
  > bpf         (BPF header文件)
    > arm64
    > x86
    ...
  *_kern.c      (监测函数挂载)
  ...
> pkg           (其余通用函数)
  > proc        (提取Golang版本相关函数)
  > util
    > ebpf      (ebpf配置等相关函数)
    > kernel    (内核版本相关函数)
> user          (用户态代码)
  > bytecode    (ebpf .o 文件)
  config_*.go   (config 文件)
  event_*.go    (用户态数据解析程序)
  probe_*.go    (基于 ebpfmanager 的 probe 级别管理)
  ...
```
