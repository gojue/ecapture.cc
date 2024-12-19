---
footer: false
title: Download eCapture from Github.
---

<script setup>
// 复用主要的下载页面组件
import DownloadPage from '../../download/index.md'
</script>

<ClientOnly>
  <!-- 使用主下载页面组件，但传入中文语言参数 -->
  <DownloadPage lang="zh" />
</ClientOnly>