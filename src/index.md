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
  '/assets/ecapture_gnutls.png',
  '/assets/gnutls-github-wireshark.png',
  '/assets/gnutls-github-wireshark-1.png',
  '/assets/ecapture_http3_quic_decrypt.jpg'
])

const carouselTitle = 'Feature Showcase'
const carouselSubtitle = 'eCapture demonstrates capturing keys and plaintext communications from OpenSSL and GnuTLS.'

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
