---
footer: false
title: 从国内CDN下载.
---

<script setup>
// 复用主要的下载页面组件
import DownloadPage from './../../en/download/index.md'
</script>

<ClientOnly>
  <!-- 使用主下载页面组件，但传入中文语言参数 -->
  <DownloadPage lang="zh" />
</ClientOnly>