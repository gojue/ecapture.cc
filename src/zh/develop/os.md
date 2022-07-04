---
footer: false
---

# 操作系统

## 内核版本

要求：内核版本 >= 4.18

```bash
cfc4n@vm-server:~$# uname -r
4.18.0-305.3.1.el8.x86_64
```

## 系统参数

> 对于 CO-RE，需要内核开启 BTF

```bash
cfc4n@vm-server:~$# cat /boot/config-`uname -r` | grep CONFIG_DEBUG_INFO_BTF
CONFIG_DEBUG_INFO_BTF=y
```

## 编译参数

### 查看编译帮助

```bash
make help
# environment
    $ make env          # 展示当前环境
# build
    $ make all          # 编译 ecapture （默认 CO-RE）
# clean
    $ make clean        # 清除编译文件
# test
    $ make test         # 运行测试
# flags
    $ CORE=0 make ...   # 编译 ecapture （非 CO-RE）
```

### 其余编译参数

|     参数     |                 说明                 |
| :----------: | :----------------------------------: |
|    clean     |             清除编译文件             |
|    assets    | 根据 .o 文件生成对应的 go 用户态文件 |
|    build     |      编译 go 文件（默认 CO-RE）      |
| build_nocore |       编译 go 文件（非 CO-RE）       |
|     ebpf     |     编译 ebpf 程序（默认 CO-RE）     |
| ebpf_nocore  |      编译 ebpf 程序（非 CO-RE）      |
