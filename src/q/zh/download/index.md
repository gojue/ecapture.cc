---
title: 下载
description: 从 API 获取 eCaptureQ 最新及历史正式版本，选择桌面版或 Web 版下载。
lang: zh-CN
---

<script setup>
import { nextTick, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import ReleaseDownloads from '../../../../.vitepress/theme/components/ReleaseDownloads.vue'
import DownloadIntro from '@theme/components/DownloadIntro.vue'
const router = useRouter()
onMounted(async () => {
  await nextTick()
  const hash = window.location.hash
  if (['#version', '#desktop', '#macos', '#web', '#next'].includes(hash)) {
    router.go('/q/zh/install/' + hash)
  }
})
</script>

# eCaptureQ 下载

<DownloadIntro product="ecaptureQ" locale="zh">

**eCaptureQ 是图形化分析程序。** 连接 eCapture 数据源，在三栏界面中筛选、搜索和关联消息，查看请求、响应与消息详情。

直接打开应用请选择**桌面版**，通过浏览器使用请选择 **Web 版**。两者都能导出采集器发送的原生 KEYLOG 和 PCAPNG 文件。采集主机需要单独安装 eCapture。[安装 eCaptureQ](/q/zh/install/) · [下载 eCapture](/zh/download/)

</DownloadIntro>

本页从发布 API 读取**最近最多 5 个正式版本**；不足 5 个时显示实际数量。更多历史版本和预发布版本见 [官方 Releases](https://github.com/gojue/ecaptureQ/releases)。安装教程与截图的版本基线见 [适用范围](/q/zh/install/#version)。

中文下载使用 CDN，每个文件都保留 GitHub 官方直链；镜像尚未同步或无法下载时，请选择旁边的 **GitHub**。下载包应与同一发布版本的校验文件一起核对。

<span id="packages"></span>

<ReleaseDownloads product="ecaptureQ" />
