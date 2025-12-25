---
page: true
title: eCapture - 基于 eBPF 技术，无需 CA 证书即可捕获 SSL/TLS 明文内容。
---

<script setup>
import { onMounted, ref } from 'vue';
import Home from '@theme/components/HomeZh.vue'
import ImageCarousel from '@theme/components/ImageCarousel.vue'
import { fetchReleaseTag } from './../../.vitepress/githubReleases'

const images = ref([
  '/assets/ecapture-help.svg',
  '/assets/ecapture_zsh.jpeg',
  '/assets/ecapture_tls_https.gif',
  '/assets/ecapture_sshkeylog.gif',
  '/assets/ecapture_pcapng.gif',
  '/assets/gnutls-github-wireshark.png',
  '/assets/gnutls-github-wireshark-1.png',
  '/assets/ecapture_http3_quic_decrypt.jpg'
])

const imageDurations = [
  5000,
  5000,
  15000,
  11000,
  10000,
  5000,
  5000,
  5000
]

const carouselTitle = '功能展示'
const carouselSubtitle = '捕获 OpenSSL 和 GnuTLS 的 SSLKEYLOG 和明文通信。支持 HTTP/3 QUIC、IPv6、TLS 1.3 等。'

onMounted(() => {
  fetchReleaseTag()
})
</script>

<Home />
<ImageCarousel 
  :images="images" 
  :title="carouselTitle"
  :subtitle="carouselSubtitle"
/>