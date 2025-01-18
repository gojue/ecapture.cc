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
  15000,
  11000,
  10000,
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
