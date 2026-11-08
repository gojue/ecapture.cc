---
title: 下载
description: 从 API 获取 eCaptureQ 最新及历史正式版本，选择桌面版或 Web 版下载。
lang: zh-CN
---

<script setup>
import { nextTick, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import ReleaseDownloads from '../../../../.vitepress/theme/components/ReleaseDownloads.vue'
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

选择 **桌面版** 直接打开应用，或选择 **Web 版** 在服务主机运行、通过浏览器访问。安装依赖及启动步骤请参阅 [安装指南](/q/zh/install/)。需要采集探针，请前往 [eCapture 下载](/zh/download/)。

本页从发布 API 读取**最近最多 5 个正式版本**；不足 5 个时显示实际数量。更多历史版本和预发布版本见 [官方 Releases](https://github.com/gojue/ecaptureQ/releases)。安装教程与截图的版本基线见 [适用范围](/q/zh/install/#version)。

中文下载使用 CDN，每个文件都保留 GitHub 官方直链；镜像尚未同步或无法下载时，请选择旁边的 **GitHub**。下载包应与同一发布版本的校验文件一起核对。

<span id="packages"></span>

<ReleaseDownloads product="ecaptureQ" />
