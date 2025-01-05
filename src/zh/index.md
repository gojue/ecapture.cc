---
page: true
title: 旁观者 - eBPF技术强力驱动，无需CA证书即可捕获HTTPS/TLS明文数据包。
---

<script setup>
import { onMounted, ref } from 'vue';
import Home from '@theme/components/HomeZh.vue'
import ImageCarousel from '@theme/components/ImageCarousel.vue'
import { fetchReleaseTag } from '../../.vitepress/githubReleases'

const images = ref([
  '/assets/ecapture_gnutls.png',
  '/assets/gnutls-github-wireshark.png',
  '/assets/gnutls-github-wireshark-1.png',
  '/assets/ecapture_http3_quic_decrypt.jpg'
])

const carouselTitle = '功能展示'
const carouselSubtitle = 'eCapture 捕获OpenSSL、GnuTLS的密钥、明文通讯展示。'

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

