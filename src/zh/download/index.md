---
footer: false
title: eCapture 下载
description: 下载 eCapture 已发布版本：国内 CDN 与 GitHub 官方地址。
---

<script setup>
import ReleaseDownloads from '../../../.vitepress/theme/components/ReleaseDownloads.vue'
import DownloadIntro from '@theme/components/DownloadIntro.vue'
</script>

# eCapture 下载

<DownloadIntro product="ecapture" locale="zh">

**eCapture 是命令行采集工具。** 在受支持的 Linux 或 Android 设备上运行，通过 eBPF 捕获 TLS 明文。可直接在终端查看捕获结果与运行日志，也可将输出写入文件，供后续分析。

选择匹配系统与架构的构建产物后，按照 [快速入门](/zh/1-getting-started/) 开始采集。如需通过桌面或 Web 图形界面搜索、查看消息，请前往 [eCaptureQ 下载](/q/zh/download/)。

</DownloadIntro>

本页从发布 API 读取**最近最多 5 个正式版本**；更多历史版本与预发布版本见 [官方 Releases](https://github.com/gojue/ecapture/releases)。中文下载优先使用 CDN，每个文件旁保留 GitHub 官方直链；镜像未同步或不可用时可切换直链。请使用同一发布版本的校验文件核对下载包。

## Docker 镜像 {#docker}

在 Linux 上通过容器部署时，可从 [Docker Hub — gojue/ecapture](https://hub.docker.com/r/gojue/ecapture) 获取镜像。采集器仍需要受支持的宿主机内核和相应的采集权限，具体步骤见 [Docker 部署说明](https://github.com/gojue/ecapture#docker-image)。

<ReleaseDownloads />
