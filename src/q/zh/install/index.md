---
title: 安装
description: 安装 eCaptureQ 桌面版或启动 Web 服务，了解依赖与首次运行步骤。
lang: zh-CN
---

# 安装

先从 [下载页](/q/zh/download/) 选择适合系统和 CPU 的发布包。希望直接打开应用时选择 **桌面版**；希望运行一个服务、通过浏览器访问时选择 **Web 版**。两者都连接 eCapture，安装包均不包含采集探针。

## 本文版本与适用范围 {#version}

本教程及截图以 **eCaptureQ v1.0.0** 为基线，截图使用合成数据。下载页从 API 读取发布版本，可能包含更新版本；**下方命令中的 `1.0.0` 是文件名示例，请替换为实际下载的版本与文件名**。安装其他版本前，先阅读该版本的发布说明。

该基线版本发布于 2026 年 11 月 8 日，提供 15 个应用安装包和一份 `SHA256SUMS`。可在 [官方 v1.0.0 发布页](https://github.com/gojue/ecaptureQ/releases/tag/v1.0.0) 核对。部分进程/TLS 字段仍依赖更新的 **采集端** 能力，详见 [协议兼容性](/q/zh/protocols/#tls)。

较早的 alpha.2 下载使用 `desktop` / `server` 文件名，Web 程序名为 `ecaptureq-server`，不适用下方的 v1.0.0 安装命令。从源码构建请按 [官方编译指南](https://github.com/gojue/ecaptureQ/blob/v1.0.0/docs/compilation.md) 操作。

## 选择安装包 {#packages}

桌面包以 `ecaptureq-` 开头，Web 包以 `ecaptureq-web-` 开头。`amd64` 即 x86_64 / x64，`arm64` 即 aarch64。macOS 使用 universal 通用包，同时包含 Intel 和 Apple Silicon 两种架构。下载后先用同一发布版本的 `SHA256SUMS` 核对文件。

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
ecaptureq-web --addr 127.0.0.1:28257

# macOS，在 ZIP 解压目录中
./ecaptureq-web --addr 127.0.0.1:28257
```

```powershell
# Windows PowerShell，在 ZIP 解压目录中
.\ecaptureq-web.exe --addr 127.0.0.1:28257
```

在同机浏览器访问 [http://127.0.0.1:28257/](http://127.0.0.1:28257/)。终端中的服务需要保持运行，打开网页不会自动启动服务。

远程部署参见 [远程 Web 访问指南](/q/zh/data-sources/#web-access)。连接采集端的是 **Web 服务所在主机**，不是浏览器所在主机。

## 升级与下一步 {#next}

请保留旧配置和用户数据。重写后的应用不会自动导入原 Tauri 应用的配置或会话。SQL 过滤和集成探针启动器不在本版本范围内。

接下来按 [快速开始](/q/zh/quick-start/) 连接采集器，或在 [界面操作练习](/q/zh/interface/#practice) 中先使用内置模拟数据。
