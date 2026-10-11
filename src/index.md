---
page: true
title: eCapture - Kernel-level TLS plaintext capture with eBPF
description: Capture TLS plaintext without a custom CA. Linux x86_64, ARM64 and LoongArch64; Android x86_64 and ARM64.
---

<script setup>
import { onMounted, ref } from 'vue';
import Home from '@theme/components/Home.vue'
import ImageCarousel from '@theme/components/ImageCarousel.vue'
import ProjectOverview from '@theme/components/ProjectOverview.vue'
import { fetchReleaseTag } from '../.vitepress/githubReleases'

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

const carouselTitle = 'Feature Showcase'
const carouselSubtitle = 'Examples of TLS plaintext, keylog and pcapng capture across supported libraries and protocols.'

onMounted(() => {
  fetchReleaseTag()
})
</script>

<Home />
<ProjectOverview locale="en" />
<ImageCarousel 
  :images="images" 
  :durations="imageDurations"
  :title="carouselTitle"
  :subtitle="carouselSubtitle"
/>
