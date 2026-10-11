---
page: true
title: eCapture - 基于 eBPF 的内核级 TLS 明文捕获
description: 无需自定义 CA 证书。支持 Linux x86_64、ARM64、LoongArch64 和 Android x86_64、ARM64。
---

<script setup>
import { onMounted, ref } from 'vue';
import Home from '@theme/components/HomeZh.vue'
import ImageCarousel from '@theme/components/ImageCarousel.vue'
import ProjectOverview from '@theme/components/ProjectOverview.vue'
import { fetchReleaseTag } from './../../.vitepress/githubReleases'

const images = ref([
  '/assets/ecapture_tls_https.gif',
  '/assets/ecapture_pcapng.gif',
  '/assets/gnutls-github-wireshark.png',
  '/assets/gnutls-github-wireshark-1.png',
  '/assets/ecapture_http3_quic_decrypt.jpg'
])

const imageDurations = [
  15000,
  10000,
  5000,
  5000,
  5000
]

const carouselTitle = '功能展示'
const carouselSubtitle = '展示受支持的 TLS 库和协议的明文、Keylog 与 PCAPNG 捕获效果。'

onMounted(() => {
  fetchReleaseTag()
})
</script>

<Home />
<ProjectOverview locale="zh" />
<ImageCarousel 
  :images="images" 
  :title="carouselTitle"
  :subtitle="carouselSubtitle"
/>
