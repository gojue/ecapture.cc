# 在 Android 测试设备上查看 HTTPS 请求

下面以自己维护的测试应用为例。应用使用系统 Conscrypt/BoringSSL 发起 HTTPS 请求，eCapture v2.12.0 在设备上解码，结果可在 adb 终端查看。上游对 Android 13–16（API 33–36）系统库的测试分别验证了 hook 文本输出、独立密钥以及回环接口上 TLS 1.2 和 1.3 的 pcapng 解密。下例使用默认的 pcapng 文本数据源查看 Wi-Fi 请求。[Android 测试范围](https://github.com/gojue/ecapture/blob/v2.12.0/test/e2e/README.md#android) · [测试用例](https://github.com/gojue/ecapture/blob/v2.12.0/test/e2e/android/android_tls_e2e_test.sh)

## 确认设备与安装包

使用可执行 `adb root` 的 userdebug 设备或模拟器。在开发机上查看设备架构、内核和权限：

```sh
adb shell getprop ro.product.cpu.abi
adb shell uname -r
adb root
adb wait-for-device
adb shell id
```

从[下载页](/zh/download/)选 **Android** 包。`arm64-v8a` 对应 arm64，`x86_64` 对应 amd64。架构的最低内核分别为 5.5 和 4.18，设备内核还需提供相应的 eBPF 能力。下面按 PID 筛选的示例需要内核 5.2 或更高版本。解压后把可执行文件放到设备上：

```sh
adb push ecapture /data/local/tmp/ecapture
adb shell chmod 755 /data/local/tmp/ecapture
adb shell /data/local/tmp/ecapture tls --help
```

## 查看一次测试请求

先打开测试应用，暂缓发起请求。在设备 shell 中取得应用进程的 PID 并查看网卡。下面用包名 `com.example.tlsdemo` 和 Wi-Fi 接口 `wlan0` 举例，请替换为实际值。如果应用有多个进程，选择实际发起请求的进程。

```sh
adb shell
pidof com.example.tlsdemo
ip route
```

假设上一步得到的 PID 为 `12345`，在同一个设备 shell 中执行：

```sh
/data/local/tmp/ecapture tls --pid 12345 -i wlan0 'tcp port 443'
```

等待探针就绪，再让应用向测试服务建立**新的** HTTPS 连接并发送请求。默认文本模式结合该接口上的包与系统 TLS 库提供的密钥重建 HTTP 消息。终端应能看到请求路径、响应状态以及用于区分事件和运行日志的标签。完成后按 Ctrl+C。若目标是通过设备回环访问的服务，抓包接口改为 `lo`，并将端口改为设备端实际使用的端口。

## 有运行日志，但没有请求

- 确认客户端使用系统 Conscrypt。采集器会查找 Conscrypt APEX 和系统库路径。应用自带 BoringSSL 时，需核实该库是否受支持，并用 `--libssl` 指定实际加载的文件。
- 核对测试连接是否经过选定网卡。上述 TCP 过滤器只适用于基于 TCP 的 HTTPS 请求。复用旧连接时，让测试客户端重新建立连接，以便同时捕获握手、密钥和请求。
- 如需用 Wireshark 复核，在命令的 `'tcp port 443'` 前加上 `--pcapfile /data/local/tmp/demo.pcapng`。停止采集后，在开发机上执行 `adb pull /data/local/tmp/demo.pcapng`。文件内含数据包及可用的 TLS 密钥。同一网卡上归属未知、符合网络过滤条件的包也可能写入；核对时请选择测试服务对应的连接。[抓包与进程筛选](/zh/3-capture-modes/3.4-pcapng-mode)

[OpenSSL 与 BoringSSL 探针](/zh/2-core-tls-modules/2.1-tls-capture-openssl-and-boringssl) · [Wireshark 解密流程](/zh/3-capture-modes/3.6-wireshark-decryption-workflows)

## 早期版本演示

原视频演示了 Android 12 上的操作，当前版本的参数与输出格式见上文。

<iframe src="//player.bilibili.com/player.html?aid=900387088&bvid=BV1xP4y1Z7HB&cid=831143179&page=1" title="Android 12 上的早期 eCapture 演示" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="500"></iframe>
