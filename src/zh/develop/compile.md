## 编译 Linux 版
### x86_64 Linux 编译

操作系统选择`ubuntu 22.04 Amd6 x86_64`。

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


## 编译 Android 版
### ARM Linux 编译
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