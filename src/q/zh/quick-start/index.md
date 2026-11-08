---
title: 快速开始
description: 将 eCapture 连接到 eCaptureQ，查看第一条应用消息。
lang: zh-CN
---

# 快速开始

本教程以同一可信内网为例：**Linux 采集主机是 `192.168.1.10`**，**运行 eCaptureQ 的电脑是 `192.168.1.20`**。请替换成自己的地址。eCaptureQ 可运行于 Windows、macOS 或 Linux；两个程序在同一台 Linux 主机时，使用下文的同机地址。请使用你有权检查的目标程序与流量。

## 1. 准备采集端 {#prepare}

在 **Linux 采集主机** 下载 [eCapture](https://github.com/gojue/ecapture/releases)。已发布 **v2.10.0** 提供 `--ecaptureq` 和 `--text-source pcapng`，启动前先检查自己的下载构建：

```sh
./ecapture tls --help
```

下方完整消息路径需要这些接口和兼容的 Decryptor。即使 eCaptureQ 连接成功，也不能补充采集端未提供的字段或协议能力。参见 [协议采集条件](/q/zh/protocols/#capture) 与 [上游兼容性记录](https://github.com/gojue/ecaptureQ/blob/v1.0.0/docs/upstream-status.md)。eCapture 需要受支持的 Linux/Android 内核及采集权限；这里的 macOS、Windows 支持指 eCaptureQ。

## 2. 启动 eCapture 事件监听 {#collector}

在 **Linux 采集主机（`192.168.1.10`）** 的 eCapture 解压目录，以下命令用于受支持的 OpenSSL TLS 应用：

```sh
sudo ./ecapture tls -m text --text-source pcapng -i eth0 \
  --ecaptureq ws://0.0.0.0:28256/
```

把 `eth0` 换成目标流量经过的网卡，本机 loopback 流量使用 `lo`。保持进程运行，检查启动日志中的探针附加与事件监听是否成功。Go TLS 程序改用 `gotls --elfpath /path/to/go-app`，GnuTLS 程序使用 `gnutls --gnutls /path/to/libgnutls.so`；BoringSSL/LibreSSL 目标可能需要显式选择库和版本，详见 [协议与消息详情](/q/zh/protocols/#capture)。

这里 `--ecaptureq` 指 **由 eCapture 打开的监听地址**。`0.0.0.0:28256` 表示监听采集主机的 IPv4 接口；采集主机防火墙需允许 eCaptureQ 主机（`192.168.1.20`）访问 TCP 28256 端口。如果仅同机使用，将监听地址改为 `ws://127.0.0.1:28256/`。不要用另一种输出接口 `--eventaddr` 替代它。

## 3. 选择连接地址 {#tunnel}

在 eCaptureQ 中填写 **它能够访问的采集主机地址**：

| 你的场景 | eCaptureQ 填写的地址 |
| --- | --- |
| 同一内网：采集主机 `192.168.1.10`，eCaptureQ 主机 `192.168.1.20` | `ws://192.168.1.10:28256/` |
| 公网地址 `203.0.113.10` 的 28256 端口映射到采集主机 | `ws://203.0.113.10:28256/`，用于说明地址映射；实际连接需满足下方的保护条件 |
| 两个程序在同一台 Linux 主机 | `ws://127.0.0.1:28256/` |

`203.0.113.10` 是文档专用地址，请替换为自己的地址。公网连接需使用受保护链路或已有 TLS/WSS 入口，并将防火墙/安全组的来源限制为 eCaptureQ 主机的出口 IP：原生 `ws` 没有认证，也不加密传输。详见 [公网连接与 NAT 说明](/q/zh/data-sources/#public)。

桌面版由桌面电脑发起连接，Web 版由 **Web 服务主机** 发起连接。不要把 `0.0.0.0` 填为连接目标，也不要用 `127.0.0.1` 代表另一台机器。

## 4. 打开 eCaptureQ {#open}

在 **分析电脑或服务主机（本例为 `192.168.1.20`）** 上 [安装桌面版或 Web 版](/q/zh/install/)。桌面版直接打开应用；Web 包启动命令为：

```sh
# Linux，安装 Web 包后
ecaptureq-web --addr 127.0.0.1:28257
# macOS，在 ZIP 解压目录中
./ecaptureq-web --addr 127.0.0.1:28257
```

Windows 使用 `.\ecaptureq-web.exe` 并保留相同参数。在同机浏览器访问 [http://127.0.0.1:28257/](http://127.0.0.1:28257/)。从另一台电脑打开页面时，参见 [访问远程 Web 服务](/q/zh/data-sources/#web-access)。

**28256 是采集端事件端口，28257 是 Web 页面端口。** 浏览器能打开网页，只证明浏览器与服务连通，不代表服务已经能连接采集端。

## 5. 添加来源并切换实时模式 {#connect}

1. 点击右上角的数据源状态按钮，再点击 **添加数据源**。
2. 填写易辨认的名称；内网示例填写 **`ws://192.168.1.10:28256/`**。其他场景使用第 3 步对应的地址。
3. 点击 **添加并连接**，确认来源显示已连接，顶部的已连接数 / 总来源数增加。
4. 将顶部模式切换到 **实时**。添加来源不会自动改变当前显示模式。

[![eCaptureQ v1.0.0 数据源表单，使用合成 WebSocket 地址与仅作描述的启动命令](/assets/q/sources.png)](/assets/q/sources.png)

*点击放大。真实 eCaptureQ v1.0.0 Web 界面，使用合成设置。*

启动命令字段只是描述，不会启动 eCapture、登录主机或修改远端探针。

## 6. 产生流量并查看记录 {#traffic}

在 **采集主机** 上，先用 `curl -V` 确认示例 curl 链接的是 **OpenSSL**，再在采集启动后产生请求：

```sh
curl -V
curl --http1.1 https://example.com/
```

可将示例 URL 替换为自己的 HTTPS 服务。如果 curl 使用其他 TLS 后端，应选择对应受支持的探针。Go 应用应使用 `gotls` 和匹配的可执行文件路径。请求必须经过前面选择的网卡。

回到 eCaptureQ，清除已有筛选。实时列表应出现新记录；选中一条后依次查看 **请求、响应、连接**，检查消息和可用的进程、TLS 元数据。已连接但没有记录只说明事件通道可用，请检查目标程序、模块、网卡与来源日志，再判断采集是否成功。

接下来完成 [三栏操作练习](/q/zh/interface/#practice)。需要多个采集器时，按各自可连接的端点重复添加来源。

## 不连接采集器，先试模拟模式 {#demo}

不添加任何来源也能打开 eCaptureQ。默认 **模拟** 模式包含九个进程、60 条合成记录。选择进程、协议并查看消息；**开始模拟** 会追加虚构样例，**重置模拟数据** 图标恢复初始数据。模拟与实时数据彼此分离，模拟耗时与关联关系都是虚构字段。

实时来源连接期间也可以切回模拟。模式只改变显示内容，不停止后台接收。这是本地产品演示；当前文档网站不会连接你的采集器。
