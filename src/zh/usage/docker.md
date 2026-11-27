# 在 Linux 主机上观察 Docker 容器的 TLS 请求

假设你要调试一个运行在容器中的 HTTPS 服务，服务使用动态链接的 OpenSSL。可在 Docker 宿主机上运行 eCapture v2.12.0，并向探针提供**服务进程实际加载的库**。下面的示例使用宿主机进程号和网络接口。

## 找到测试服务与 libssl

在宿主机上列出自己运行的容器和进程。将 `tls-demo` 换为目标容器名，选取实际处理请求的服务进程的宿主机 PID。

```sh
docker ps
docker top tls-demo -eo pid,comm
```

假设服务 PID 为 `12345`。在其内存映射中找到 `libssl.so` 的实际路径：

```sh
sudo awk '/\/libssl\.so/ {print $NF; exit}' /proc/12345/maps
```

下例假设得到 `/usr/lib/x86_64-linux-gnu/libssl.so.3`。使用 `/proc/12345/root` 访问容器文件系统，可以定位同一份库，无需推断 Docker 的存储驱动或 overlay 目录。如果服务使用 Go 的 `crypto/tls`，改用 [GoTLS 探针](/zh/2-core-tls-modules/2.2-gotls-capture) 并指定服务的可执行文件。

## 捕获一个请求并核对结果

先确认服务流量经过的宿主机接口和端口。下面假设容器连接到 `docker0` 网桥，容器内服务监听 8443。自定义网桥、host 网络和端口映射可能使用不同的接口或端口。

```sh
sudo ecapture tls --pid 12345 \
  --libssl /proc/12345/root/usr/lib/x86_64-linux-gnu/libssl.so.3 \
  -i docker0 'tcp port 8443'
```

PID 筛选需要内核 5.2 或更高版本。等待探针就绪，再用测试客户端新建 HTTPS 连接。默认文本模式用网卡数据包和 TLS 密钥重建请求与响应。核对测试路径与响应状态。如果只看到了启动日志，请同时检查服务进程、库路径、接口和该接口上实际可见的端口。

要保留本次捕获用于 Wireshark 分析，可在过滤表达式前加上 `--pcapfile container.pcapng`。归属未知、符合网络过滤条件的数据包也可能写入文件。在共享网桥上可进一步按测试服务的 IP 和端口缩小范围。[抓包与进程筛选](/zh/3-capture-modes/3.4-pcapng-mode)

如果只需诊断按 TLS 函数读写分段的输出，可显式选用 `--text-source hook`，保留同一 PID 和库路径，省略网卡与包过滤表达式。[文本模式](/zh/3-capture-modes/3.2-text-mode) · [在容器内运行采集器的权限要求](https://github.com/gojue/ecapture/blob/v2.12.0/docs/minimum-privileges.md#method-3-docker-with-specific-capabilities)
