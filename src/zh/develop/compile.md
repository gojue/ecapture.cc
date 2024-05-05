## 编译 Linux 版
### x86_64 Linux 编译
操作系统选择`ubuntu 22.04 amd6(x86_64)`。

```shell
ubuntu@VM-0-5-ubuntu:~$sudo apt-get update
ubuntu@VM-0-5-ubuntu:~$sudo apt-get install --yes wget git golang build-essential pkgconf libelf-dev llvm-12 clang-12  linux-tools-generic linux-tools-common
ubuntu@VM-0-5-ubuntu:~$wget https://golang.google.cn/dl/go1.18.linux-amd64.tar.gz
ubuntu@VM-0-5-ubuntu:~$sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.18.linux-amd64.tar.gz
ubuntu@VM-0-5-ubuntu:~$sudo rm -f /usr/bin/go && sudo ln /usr/local/go/bin/go /usr/bin/go
ubuntu@VM-0-5-ubuntu:~$for tool in "clang" "llc" "llvm-strip"
do
sudo rm -f /usr/bin/$tool
sudo ln -s /usr/bin/$tool-12 /usr/bin/$tool
done
ubuntu@VM-0-5-ubuntu:~$export GOPROXY=https://goproxy.cn
ubuntu@VM-0-5-ubuntu:~$export PATH=$PATH:/usr/local/go/bin
```

### 编译方法

1. `make` 命令编译支持core版本的二进制程序。
2. `make nocore`命令编译仅支持当前内核版本的二进制程序。

## 交叉编译AMD64(x86_64) Linux 
### 安装环境
操作系统选择 `Ubuntu 22.04`，安装初始化脚本
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/gojue/ecapture/master/builder/init_env.sh)"
```
### 生成交叉编译头文件
在`init_env.sh`里已经预生成Linux Kernel头文件了，如果你在编译过程中仍提示头文件找不到，则执行以下命令。
```shell
yes "" | sudo make ARCH=${ARCH} CROSS_COMPILE=aarch64-linux-gnu- prepare V=0 > /dev/null
yes "" | sudo make prepare V=0 > /dev/null
```

### 编译
通过指定`CROSS_ARCH`环境变量来设置构建的目标CPU架构产物。
```shell
CROSS_ARCH=arm64 make -j4
```
如果你的系统不支持`CORE`，则可单独构建`non-CORE`版本
```shell
CROSS_ARCH=arm64 make nocore -j4
```

## 编译 Android 版
### ARM64 Linux 编译
公有云厂商大部分都提供了ARM64 CPU服务器，笔者选择了腾讯云的。在`广州六区`中，名字叫`标准型SR1`(SR1即ARM 64CPU)，最低配的`SR1.MEDIUM2` 2核2G即满足编译环境。可以按照`按量计费`方式购买，随时释放，比较划算。

操作系统选择`ubuntu 20.04 arm64`。

```shell
ubuntu@VM-0-5-ubuntu:~$sudo apt-get update
ubuntu@VM-0-5-ubuntu:~$sudo apt-get install --yes wget git golang build-essential pkgconf libelf-dev llvm-12 clang-12  linux-tools-generic linux-tools-common
ubuntu@VM-0-5-ubuntu:~$wget https://golang.google.cn/dl/go1.18.linux-arm64.tar.gz
ubuntu@VM-0-5-ubuntu:~$sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.18.linux-arm64.tar.gz
ubuntu@VM-0-5-ubuntu:~$for tool in "clang" "llc" "llvm-strip"
do
sudo rm -f /usr/bin/$tool
sudo ln -s /usr/bin/$tool-12 /usr/bin/$tool
done
ubuntu@VM-0-5-ubuntu:~$export GOPROXY=https://goproxy.cn
ubuntu@VM-0-5-ubuntu:~$export PATH=$PATH:/usr/local/go/bin
```

### 编译方法

1. `ANDROID=1 make` 命令编译支持core版本的二进制程序。
2. `ANDROID=1 make nocore`命令编译仅支持当前内核版本的二进制程序。

### 其他编译经验分享

1. [[原创]自己编译解决eCapture在x86_64模拟器运行错误（基于eBPF技术实现TLS加密的明文捕获，无需CA证书）](https://bbs.pediy.com/thread-275179.htm)