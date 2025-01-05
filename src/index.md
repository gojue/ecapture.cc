---
page: true
title: eCapture - Capture SSL/TLS text content without CA cert using eBPF.
---

<script setup>
import { onMounted, ref } from 'vue';
import Home from '@theme/components/Home.vue'
import ImageCarousel from '@theme/components/ImageCarousel.vue'
import { fetchReleaseTag } from '../.vitepress/githubReleases'

const images = ref([
    '/assets/ecapture_tls_https.gif',
  '/assets/ecapture_tls_https.gif',
  '/assets/ecapture_gnutls.png',
  '/assets/gnutls-github-wireshark.png',
  '/assets/gnutls-github-wireshark-1.png'
])

const imageDurations = [
  15000,
  5000,
  5000,
  5000,
  5000
]

const carouselTitle = 'Feature Showcase'
const carouselSubtitle = 'Capturing SSLKEYLOG and plaintext communications from OpenSSL and GnuTLS. Support HTTP/3 QUIC, IPv6, TLS 1.3 etc.'

onMounted(() => {
  fetchReleaseTag()
})
</script>

<Home />
<ImageCarousel 
  :images="images" 
  :durations="imageDurations"
  :title="carouselTitle"
  :subtitle="carouselSubtitle"
/>
