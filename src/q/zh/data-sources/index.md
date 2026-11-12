---
title: 数据源连接
description: 通过内网或公网入口连接 eCapture 数据源，理解地址并保存连接配置。
lang: zh-CN
---

# 数据源连接

一个数据源是一个 eCapture **WebSocket 事件端点**。桌面版从桌面电脑发起连接；Web 版从 `ecaptureq-web` 服务所在主机发起连接。浏览器只与这个 Web 服务通信。

本页命令和对象格式配置适用于含登录认证的新源码。已发布 v1.0.0 的旧参数及版本范围见[安装说明](/q/zh/install/#cli)；采集端的 `--ecaptureq` 保持不变。

## 分清三类地址 {#addresses}

| 地址 | 在哪里配置 | 含义 |
| --- | --- | --- |
| 监听 `ws://0.0.0.0:28256/` | eCapture 的 `--ecaptureq` | 采集端在采集主机上开启事件监听 |
| 连接 `ws://…:28256/` | eCaptureQ 来源表单或 `--data-source` | 正在运行的 eCaptureQ 进程能够连接的端点 |
| 页面 `http://127.0.0.1:28257/` | Web 的 `--listen 127.0.0.1:28257` | 浏览器打开的 HTTP 界面 |

`127.0.0.1` 始终表示 **发起连接的进程所在机器**。即使从另一台电脑打开来源表单，Web 表单里的它仍指 Web 服务主机。`0.0.0.0` 用于监听所有 IPv4 接口，不应填写为客户端连接目标。端口用于区分同机不同服务；示例使用两个端口避免冲突。

`--eventaddr` 是 eCapture 的普通事件输出地址，不是 eCaptureQ 专用的结构化事件接口，不能替代 `--ecaptureq`。

## 内网、公网与同机连接 {#scenarios}

### 内网示例 {#lan}

Linux 采集主机是 **`192.168.1.10`**，运行桌面版或 Web 服务的主机是 **`192.168.1.20`**。请替换为自己可信内网中的地址。

1. 在 `192.168.1.10` 上，启动 eCapture 时选择对应采集参数，并加上 **`--ecaptureq ws://0.0.0.0:28256/`**。完整 TLS 命令见 [快速开始](/q/zh/quick-start/#collector)。
2. 在采集主机防火墙中，允许 `192.168.1.20` 访问 TCP 28256。
3. 在 eCaptureQ 中添加 **`ws://192.168.1.10:28256/`**。来源显示已连接、顶部已连接数增加，说明事件通道已经连通。

监听用 `0.0.0.0`，连接用采集主机的实际 IP。来源连接成功不会自动切换到实时模式，也不代表探针已经产生消息。

### 公网地址示例 {#public}

假设采集主机的公网地址是 **`203.0.113.10`**，或者网关将这个地址的 TCP 28256 端口映射到采集主机：

| 配置项 | 示例 |
| --- | --- |
| 采集主机上的 eCapture 监听 | `--ecaptureq ws://0.0.0.0:28256/` |
| 能到达该监听的公网 IP 与端口 | `203.0.113.10:28256` |
| 对应的 eCaptureQ 来源地址 | `ws://203.0.113.10:28256/` |

`203.0.113.10` 是文档保留地址，不是可连接的服务，请替换为自己的 IP 或域名。云主机的公网 IP 可能映射到内网接口，因此采集端不一定直接绑定公网 IP。云安全组、主机防火墙及所需的 NAT 映射应允许 **运行 eCaptureQ 的机器的出口 IP**；Web 模式下指 Web 服务的出口 IP，而不是浏览器电脑的出口 IP。

上表说明地址映射。原生 `ws` 没有应用层认证，也不加密传输。实际跨公网部署请使用已有的 VPN 等受保护链路，或已有的 TLS 终止入口，例如 **`wss://capture.example.com/`**，并限制可连接的来源。使用 TLS 入口时，在 eCaptureQ 中填写该 `wss` 地址，由代理转发到采集端的 `ws` 监听。仅把 `ws` 改成 `wss` 不会启用 TLS，TLS 入口本身也不等于用户认证。

### 同机与可选 SSH 连接 {#same-host}

两个进程都运行在同一台 Linux 主机时，采集监听与 eCaptureQ 来源地址都用 **`ws://127.0.0.1:28256/`**，不需要网络转发。

<details>
<summary>可选：通过已有的 SSH 登录连接</summary>

如果采集端需要继续只监听自身回环地址，可以使用 SSH 代替直接连接。在 **运行桌面版的电脑** 或 **运行 Web 服务的主机** 执行：

```sh
ssh -N -L 127.0.0.1:28256:127.0.0.1:28256 user@linux-host
```

把 `user@linux-host` 换成自己的登录目标。保持 SSH 会话运行，在 eCaptureQ 填写 `ws://127.0.0.1:28256/`。本地 28256 被占用时，将命令中的转发参数改为 `127.0.0.1:29256:127.0.0.1:28256`，并填写 `ws://127.0.0.1:29256/`。

</details>

端点支持 `ws`、`wss`，拒绝 URL 内用户名密码、查询参数和片段。

## 添加多个来源与查看状态 {#add}

点击右上角数据源状态按钮，再点击 **添加数据源**。输入端点和可选的易辨认名称；每个采集器单独添加，一个实例最多 **16 个来源**。

[![eCaptureQ v1.0.0 来源表单，从合成地址与命令推导可编辑的采集登记信息](/assets/q/sources.png)](/assets/q/sources.png)

*点击放大。真实 eCaptureQ v1.0.0 Web 界面，使用合成设置。*

来源表单会从端点主机名初始化 **采集主机**，从普通的 `ecapture tls`、`gotls`、`gnutls` 命令识别 **采集模块**。这些值都能手动修改，SSH 隧道场景尤其应登记真实采集主机。启动命令和模块只是设置描述，**不会执行命令**，登记值也不能证明已捕获什么。

每个来源独立显示连接状态、重试/重连次数和运行日志，顶部显示已连接数 / 总来源数。单个来源断开不影响其他来源；断线后自动退避重连，不会跨重连代次配对消息，也不会回放断线期间遗漏的事件。运行日志与消息列表分开展示。

## 保存连接配置 {#save}

未指定配置文件时，界面新增来源只保留到当前实例退出。要在重启后保留来源，创建可写的 JSON 文件，例如 `sources.local.json`：

```json
{
  "sources": [
    {
      "endpoint": "ws://192.168.1.10:28256/",
      "label": "LAN capture host"
    }
  ]
}
```

使用 Web 程序启动（Linux 安装包安装后）：

```sh
ecaptureq-web --sources ./sources.local.json --mode live
```

macOS/Windows ZIP 则在解压目录使用 `./ecaptureq-web` 或 `.\ecaptureq-web.exe`，参数相同。桌面版也支持 `--sources`，先退出已有应用，再从终端运行：

```sh
# macOS
/Applications/eCaptureQ.app/Contents/MacOS/eCaptureQ --sources ./sources.local.json --mode live
# Linux，安装包安装后
ecaptureq --sources ./sources.local.json --mode live
```

```powershell
# Windows，在解压后的目录中
.\eCaptureQ.exe --sources .\sources.local.json --mode live
```

也可以复制包内 `config/sources.example.json` 后修改（Linux 位于 `/usr/share/doc/ecaptureq/config/` 或 `/usr/share/doc/ecaptureq-web/config/`）。界面新增来源会原子写回文件；保存失败或检测到外部修改冲突时会显示错误，并且不新增连接。通过 CLI `--data-source` 提供的来源仍由 CLI 管理。JSON 保存连接配置、登记元数据和下述可选设置，**不保存捕获记录**；清单上限为 128 KiB。

## 页头、隐藏域名与认证配置 {#configuration}

新源码要求配置顶层为 **JSON 对象**。迁移旧版的 `[...]` 来源数组时，先备份，再将其放入 `{"sources": [...]}` 中。最小对象 `{"sources": []}` 不设置来源或登录认证。

除 `sources` 外，还可在同一对象中添加以下字段：

| 字段 | 行为 |
| --- | --- |
| `auth` | Web 登录设置；见 [Web 登录认证](/q/zh/authentication/)。省略或 `null` 不启用认证 |
| `headerCenter` | 页头中央的富文本 HTML 字符串；空值使用默认文案，仅写入维护者信任的内容 |
| `hiddenDomains` | 要排除的域名后缀数组；非空列表替换内置列表，省略或空数组使用内置默认值 |

例如，在上面的来源对象中加入 `"headerCenter": "测试环境"`、`"hiddenDomains": ["example.com"]`。域名填写裸后缀，不带协议、端口或路径；匹配不区分大小写，包括该域名本身及子域名。默认列表包含 `github.com`、`githubusercontent.com`、`ghcr.io` 等 GitHub 域名，完整列表见[源码](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/internal/app/hidden_domains.go)。

**匹配隐藏域名的实时记录会在进入缓存前被丢弃**，不是仅在当前页面隐藏，清除搜索条件不能恢复。空数组 `[]` 不表示关闭排除。修改配置后重启应用，变化对后续接收生效；重启会清空内存记录。

界面保存新增来源时会保留这些字段，Desktop 也保留 `auth` 但不启用 Web 登录。复制新版示例配置会同时带入公开初始账号、页头与隐藏域名设置；应按自己的环境修改，认证步骤见[启用登录](/q/zh/authentication/#configure)。

## 访问远程 Web 服务 {#web-access}

浏览器到 Web 服务、Web 服务到采集端是两段独立连接。以内网为例，`ecaptureq-web` 运行在 **`192.168.1.20`**，浏览器在另一台电脑。在 `192.168.1.20` 上启动：

```sh
ecaptureq-web --listen 192.168.1.20:28257
```

该主机防火墙允许浏览器电脑访问 TCP 28257 后，打开 [http://192.168.1.20:28257/](http://192.168.1.20:28257/)。来源表单中，内网采集端仍填写 **`ws://192.168.1.10:28256/`**。能打开页面，不代表这段独立的事件连接也已经连通。

上面是未启用认证的内网连通性示例。远程共享或公网部署时，通过 `--sources` 加载带 `auth` 的配置，并使用 HTTPS 反向代理覆盖完整的 Web 界面/API 前缀。`--listen` 只控制 HTTP 监听；登录由配置启用，HTTPS 由代理提供。子路径及 Secure Cookie 设置见 [HTTPS 登录部署](/q/zh/authentication/#https)。来源表单不会安装或重配置代理。

<details>
<summary>可选：通过 SSH 打开仅监听回环地址的 Web 服务</summary>

如果服务仍只监听 `127.0.0.1:28257`，在 **浏览器所在电脑** 执行：

```sh
ssh -N -L 127.0.0.1:28257:127.0.0.1:28257 user@web-host
```

随后在本地打开 [http://127.0.0.1:28257/](http://127.0.0.1:28257/)。这条隧道只用于打开 Web 页面；另外连接采集器的隧道应建在 **Web 服务主机**。

</details>

## 会话与缓存 {#sessions}

每个运行中的桌面或 Web 实例有独立的实时会话和有界缓存。同一 Web 服务下的多个浏览器页签看到该服务的实时缓存，但各自的显示筛选和星标属于页面本身；分别启动的实例不共享记录。重启服务或应用会清空实时记录和日志，已保存来源能重新连接，却不能恢复旧消息。参见 [常见问题](/q/zh/faq/#retention)。
