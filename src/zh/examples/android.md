---
footer: false
---

# Android 12的微信APP8.0.2抓包

:::info 案例详情介绍

演示安卓app一般的抓包步骤。

## 下载

使用ecapture进行安卓app抓包有如下限制：

1. 安卓设备的内核版本只有在5.10版本上才可以进行无任何修改的开箱抓包操作。

2. 如果你的设备是安卓13，应该可以正常使用ecapture。低于13的安卓设备，如果内核是5.10，理论也是可行的。
   因为安卓使用的linux内核的ebpf环境受内核版本号的影响，而工作良好的ebpf接口是在内核5.5版本时才全部使能。
   虽然ecapture最低要求的版本是4.18，但安卓上的4.19与5.4内核提供的ebpf接口并不能完整，不能正常的工作。
   
3. 你可以使用apple m1设备的安卓12模拟器进行测试，因为它提供的就是5.10的内核。
   安卓11及以下都不可行，因为内核版本太低，需要修改打补丁才可以。

4. 如果你不知道你的设备的内核版本，可以打开手机，在关于页面中看到内核信息。
   或者手机连接电脑，执行```adb shell cat /proc/version```或者```adb shell uname -a```进行查看。

5. 如何进行低版本内核修改，可以参考```https://github.com/feicong/android_ebpf``` ，目前仓库正在更新中。

如果满足使用的条件，到 https://github.com/ehids/ecapture/releases 下载最新版本的ecapture，解压后执行下面命令完成安装：

```
adb push ecapture /data/local/tmp/
adb shell chmod 777 /data/local/tmp/ecapture
```

## 启动

ecapture目前已经适配安卓13，执行下面的命令就可以开启全局抓包：

```
$ adb root
# adb shell /data/local/tmp/ecapture tls
Linux version 5.10.66-android12-9-00021-g2c152aa32942-ab8087165 (build-user@build-host) (Android (7284624, based on r416183b) clang version 12.0.5 (https://android.googlesource.com/toolchain/llvm-project c935d99d7cf2016289302412d708641d52d2f7ee), LLD 12.0.5 (/buildbot/src/android/llvm-toolchain/out/llvm-project/lld c935d99d7cf2016289302412d708641d52d2f7ee)) #1 SMP PREEMPT Fri Jan 14 17:35:16 UTC 2022
emulator64_arm64:/ # /data/local/tmp/ecapture tls
2022/07/05 10:15:44 pid info :3510
2022/07/05 10:15:44 start to run EBPFProbeOPENSSL module
2022/07/05 10:15:44 start to run EBPFProbeGNUTLS module
2022/07/05 10:15:44 start to run EBPFProbeNSPR module
2022/07/05 10:15:44 start to run EBPFProbeGoSSL module
2022/07/05 10:15:44 go binary not found
2022/07/05 10:15:44 tls module couldn't find binPath.: stat /apex/com.android.conscrypt/lib64/libnspr4.so: no such file or directory
2022/07/05 10:15:44 tls(gnutls) module couldn't find binPath.: stat /apex/com.android.conscrypt/lib64/libgnutls: no such file or directory
2022/07/05 10:15:44 HOOK type:2, binrayPath:/apex/com.android.conscrypt/lib64/libssl.so
2022/07/05 10:15:44 libPthread so Path:/apex/com.android.runtime/lib64/bionic/libc.so
2022/07/05 10:15:44 target all process.
2022/07/05 10:15:44 target all users.
```

## 捕获

在ecapture抓包的时候，你可以安装目标apk到设备，比如wechat:

```
adb install -r /Users/m1/Downloads/weixin8023android2160_arm64.apk
```

安装完成打开app，就可以看到ecapture的输出内容中有抓包的内容了：

注意：

1. 如果目标apk加密了请求，输出的内容会是乱码。
2. 对于非https的socket或者其它包，乱码。
3. 如果app使用了自己的ssl请求库，或者静态链接程序，是不会有显示的，表示这种情况无法直接抓包。
   需要自己找到请求库SSL_read,SSL_write的二进制offset地址，手动指定。
   
   



