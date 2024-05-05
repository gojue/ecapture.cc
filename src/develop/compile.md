## Compile Linux Version
### x86_64 Linux Compilation
Select the operating system `ubuntu 22.04 amd64 (x86_64)`.

```shell
ubuntu@VM-0-5-ubuntu:~$ sudo apt-get update
ubuntu@VM-0-5-ubuntu:~$ sudo apt-get install --yes wget git golang build-essential pkgconf libelf-dev llvm-12 clang-12 linux-tools-generic linux-tools-common
ubuntu@VM-0-5-ubuntu:~$ wget https://golang.google.cn/dl/go1.18.linux-amd64.tar.gz
ubuntu@VM-0-5-ubuntu:~$ sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.18.linux-amd64.tar.gz
ubuntu@VM-0-5-ubuntu:~$ sudo rm -f /usr/bin/go && sudo ln -s /usr/local/go/bin/go /usr/bin/go
ubuntu@VM-0-5-ubuntu:~$ for tool in "clang" "llc" "llvm-strip"
do
  sudo rm -f /usr/bin/$tool
  sudo ln -s /usr/bin/$tool-12 /usr/bin/$tool
done
ubuntu@VM-0-5-ubuntu:~$ export GOPROXY=https://goproxy.cn
ubuntu@VM-0-5-ubuntu:~$ export PATH=$PATH:/usr/local/go/bin
```

### Compilation Method

1. The `make` command compiles the binary program that supports the core version.
2. The `make nocore` command compiles the binary program that only supports the current kernel version.

## Cross-Compile AMD64 (x86_64) Linux
### Environment Setup
Select the operating system `Ubuntu 22.04` and install the initialization script:
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/gojue/ecapture/master/builder/init_env.sh)"
```
### Generate Cross-Compilation Header Files
The Linux Kernel header files are pre-generated in `init_env.sh`. If you still encounter header file not found errors during compilation, execute the following commands:
```shell
yes "" | sudo make ARCH=${ARCH} CROSS_COMPILE=aarch64-linux-gnu- prepare V=0 > /dev/null
yes "" | sudo make prepare V=0 > /dev/null
```

### Compilation
Set the target CPU architecture for the build by specifying the `CROSS_ARCH` environment variable.
```shell
CROSS_ARCH=arm64 make -j4
```
If your system does not support `CORE`, you can build the `non-CORE` version separately:
```shell
CROSS_ARCH=arm64 make nocore -j4
```

## Compile Android Version
### ARM64 Linux Compilation
Most public cloud vendors provide ARM64 CPU servers. The author chose Tencent Cloud. In the `Guangzhou Zone 6`, the server is named `Standard SR1` (SR1 refers to ARM 64 CPU), and the minimum configuration `SR1.MEDIUM2` with 2 cores and 2G memory is sufficient for the compilation environment. It can be purchased on a pay-as-you-go basis, and can be released at any time, which is quite cost-effective.

Select the operating system `ubuntu 20.04 arm64`.

```shell
ubuntu@VM-0-5-ubuntu:~$ sudo apt-get update
ubuntu@VM-0-5-ubuntu:~$ sudo apt-get install --yes wget git golang build-essential pkgconf libelf-dev llvm-12 clang-12 linux-tools-generic linux-tools-common
ubuntu@VM-0-5-ubuntu:~$ wget https://golang.google.cn/dl/go1.18.linux-arm64.tar.gz
ubuntu@VM-0-5-ubuntu:~$ sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.18.linux-arm64.tar.gz
ubuntu@VM-0-5-ubuntu:~$ for tool in "clang" "llc" "llvm-strip"
do
  sudo rm -f /usr/bin/$tool
  sudo ln -s /usr/bin/$tool-12 /usr/bin/$tool
done
ubuntu@VM-0-5-ubuntu:~$ export GOPROXY=https://goproxy.cn
ubuntu@VM-0-5-ubuntu:~$ export PATH=$PATH:/usr/local/go/bin
```

### Compilation Method

1. The `ANDROID=1 make` command compiles the binary program that supports the `CORE` version.
2. The `ANDROID=1 make nocore`command compiles the binary program that supports the `non-CORE` version.

### Demo (Chinese)

1. [[原创]自己编译解决eCapture在x86_64模拟器运行错误（基于eBPF技术实现TLS加密的明文捕获，无需CA证书）](https://bbs.pediy.com/thread-275179.htm)