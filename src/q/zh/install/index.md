---
title: 安装
description: 安装 eCaptureQ 桌面版或启动 Web 服务，了解依赖与首次运行步骤。
lang: zh-CN
---

# 安装

先从 [下载页](/q/zh/download/) 选择适合系统和 CPU 的发布包。希望直接打开应用时选择 **桌面版**；希望运行一个服务、通过浏览器访问时选择 **Web 版**。两者都连接 eCapture，安装包均不包含采集探针。

## 本文版本与适用范围 {#version}

安装包示例与现有截图以 **eCaptureQ v1.0.0** 为基线，截图使用合成数据。下文 Web 启动命令采用新增认证实现中的参数名称；旧包用法见[参数迁移](#cli)。下载页从 API 读取发布版本，可能包含更新版本；**下方命令中的 `1.0.0` 是文件名示例，请替换为实际下载的版本与文件名**。安装其他版本前，先阅读该版本的发布说明。

该基线版本发布于 2026 年 11 月 8 日，提供 15 个应用安装包和一份 `SHA256SUMS`。可在 [官方 v1.0.0 发布页](https://github.com/gojue/ecaptureQ/releases/tag/v1.0.0) 核对。部分进程/TLS 字段仍依赖更新的 **采集端** 能力，详见 [协议兼容性](/q/zh/protocols/#tls)。

截至 **2026 年 11 月 13 日**，官方最新正式版仍为 v1.0.0。新增登录认证、配置及刷新行为已按主分支提交 [`1bb574d`](https://github.com/gojue/ecaptureQ/commit/1bb574da5e1fb98650a3ae604956d9f3ac2329cc) 核对，**不代表 v1.0.0 发布包已经包含这些能力**。体验新功能需构建该提交或使用后续包含相应改动的发布包；仅看 `VERSION` 中的 `1.0.0` 不能区分构建，请核对包内 `BUILD-INFO.json` 的源码提交及 `--help`。源码构建参见[当前编译指南](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/docs/compilation.md)。

较早的 alpha.2 下载使用 `desktop` / `server` 文件名，Web 程序名为 `ecaptureq-server`，不适用下方的 v1.0.0 安装命令。从源码构建请按 [官方编译指南](https://github.com/gojue/ecaptureQ/blob/v1.0.0/docs/compilation.md) 操作。

## 命令行参数迁移 {#cli}

| 用途 | 已发布 v1.0.0 | 新源码 |
| --- | --- | --- |
| eCaptureQ Web HTTP 监听 | `--addr` | `--listen` |
| eCaptureQ 连接采集端，可重复提供 | `--ecaptureq` | `--data-source` |
| 生成 Web 登录密码哈希 | 不支持 | `--hash-password` |

新源码不接受旧参数别名。更新服务脚本时一并修改名称；**采集器 `ecapture` 自己的 `--ecaptureq` 参数不变**，它仍负责开启事件监听。配置文件仍用 `--sources` 加载。

```sh
# 新源码：Web 页面监听与采集端地址分别配置
ecaptureq-web --listen 127.0.0.1:28257 \
  --data-source ws://127.0.0.1:28256/ --mode live

# 已发布 v1.0.0 的等效旧命令（没有内置登录认证）
ecaptureq-web --addr 127.0.0.1:28257 \
  --ecaptureq ws://127.0.0.1:28256/ --mode live
```

## 选择安装包 {#packages}

桌面包以 `ecaptureq-` 开头，Web 包以 `ecaptureq-web-` 开头。`amd64` 即 x86_64 / x64，`arm64` 即 aarch64。macOS 使用 universal 通用包，同时包含 Intel 和 Apple Silicon 两种架构。下载后先用同一发布版本的 `SHA256SUMS` 核对文件。

新源码增加 **Linux loong64 的 Web DEB/RPM 构建**，对应 LoongArch64；未增加 loong64 桌面包，也未增加 macOS/Windows loong64 包。实际可下载产物以发布页为准，v1.0.0 的原有 15 个应用包不包含这项新增构建。

这里描述的是 eCaptureQ 客户端及服务支持的平台。**eCapture 采集端运行于受支持的 Linux、Android 系统**，并受内核、架构、权限和采集模块条件约束。eCaptureQ 的 Android、iOS 客户端尚不作支持承诺。

## 安装桌面版 {#desktop}

- **macOS**：打开 universal DMG，将 `eCaptureQ.app` 拖到 Applications，再打开应用；也可以使用 ZIP。构建最低目标为 macOS 12，这不代表每种旧设备都已经验证。
- **Windows**：解压对应 CPU 的 ZIP，运行 `eCaptureQ.exe`。缺少 WebView2 时安装微软官方的 [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)。
- **Linux**：Ubuntu/Debian 安装 DEB，Fedora 安装 RPM。桌面版需要 GTK4、WebKitGTK 6.0，由包管理器处理依赖。发布目标为 Ubuntu 24.04 / Fedora 43 或具有兼容更新库的系统，不承诺旧 RHEL/CentOS 可用。

```sh
# Ubuntu / Debian，amd64 示例
sudo apt install ./ecaptureq-1.0.0-linux-amd64.deb

# Fedora，amd64 示例
sudo dnf install ./ecaptureq-1.0.0-linux-amd64.rpm
```

ARM64 主机请改用 `arm64` 文件名。在应用菜单打开 **eCaptureQ**，或在图形会话运行 `ecaptureq`。打开后默认进入 **模拟** 模式，无需采集器，也不需要另启 Web 服务。

### macOS 首次打开 {#macos}

先用 `SHA256SUMS` 核对下载文件，并检查包内 `BUILD-INFO.json`。macOS 默认构建采用 **ad-hoc 签名，未经公证**，不具备 Apple 认证的开发者身份。若系统阻止首次启动，在确认来源后通过 **系统设置 → 隐私与安全 → 仍要打开**，仅授权该应用。参见 [Apple 官方说明](https://support.apple.com/en-us/102445)；受管理的 Mac 可能限制此操作。

## 运行 Web 版 {#web}

选择 `ecaptureq-web-` 包，它不需要 GTK/WebKit 或图形桌面。Linux 使用 `apt install ./文件名.deb` 或 `dnf install ./文件名.rpm` 安装；macOS/Windows 解压 ZIP。Linux 安装不会自动启动服务或覆盖用户配置。

```sh
# Linux，安装 Web 包后
ecaptureq-web --listen 127.0.0.1:28257

# macOS，在 ZIP 解压目录中
./ecaptureq-web --listen 127.0.0.1:28257
```

```powershell
# Windows PowerShell，在 ZIP 解压目录中
.\ecaptureq-web.exe --listen 127.0.0.1:28257
```

在同机浏览器访问 [http://127.0.0.1:28257/](http://127.0.0.1:28257/)。终端中的服务需要保持运行，打开网页不会自动启动服务。

上面的本机启动命令没有加载 `auth`，不会要求登录。启用认证请按 [Web 登录认证](/q/zh/authentication/) 生成哈希、配置 `--sources` 并登录。新版示例配置包含公开初始账号，使用前需改密码；本机 HTTP 与线上 HTTPS 的 `secureCookie` 设置也不同。

远程部署参见 [远程 Web 访问指南](/q/zh/data-sources/#web-access)。连接采集端的是 **Web 服务所在主机**，不是浏览器所在主机。

## 其他新增能力 {#updates}

以下同样适用于上述新源码，现有 v1.0.0 截图不展示全部变化：

- **配置文件扩展**：顶层由来源数组改为对象，可同时设置 `sources`、`auth`、`headerCenter` 和 `hiddenDomains`；旧配置需按[配置说明](/q/zh/data-sources/#configuration)迁移。
- **按变化刷新**：Web 与桌面版通过长轮询等待变更，记录变化后才重新读取当前页，减少空闲请求；见[刷新行为](/q/zh/interface/#display)。
- **启动更新提示**：分析界面启动时查询官方 GitHub Releases，发现更高版本后显示下载入口；仅提示，不自动安装。请求失败不影响分析界面。
- **较大载荷保留**：源码中的单载荷截断上限由 256 KiB 提升到 256 MiB；这不表示默认可接收 256 MiB 消息，WebSocket 帧、保留缓存与正文解压仍有各自限制，见[容量边界](/q/zh/faq/#retention)。

实现依据：[命令行解析](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/internal/cli/options.go)、[发布构建](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/.github/workflows/build.yml)、[更新检查](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/frontend/update-check.js)、[载荷映射](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/internal/app/mapper.go)。

## 升级与下一步 {#next}

请保留旧配置和用户数据。重写后的应用不会自动导入原 Tauri 应用的配置或会话。SQL 过滤和集成探针启动器不在本版本范围内。

接下来按 [快速开始](/q/zh/quick-start/) 连接采集器，或在 [界面操作练习](/q/zh/interface/#practice) 中先使用内置模拟数据。
