<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { isChinesePath } from './localePath'
import { downloadUrl, officialDownloadUrl, type DownloadAsset } from '../../downloads'
const props = defineProps<{ assets: DownloadAsset[] }>()
const { page } = useData()
const zh = computed(() => isChinesePath('/' + page.value.relativePath))
const items = computed(() => props.assets.filter(asset => officialDownloadUrl(asset.browser_download_url)))
</script>

<template>
  <ul class="download-assets" role="list">
    <li v-for="asset in items" :key="asset.browser_download_url">
      <code class="asset-name">{{ asset.name }}</code>
      <span class="asset-links">
        <a :href="downloadUrl(asset.browser_download_url, zh)" :aria-label="`${zh ? 'CDN 下载' : 'Download'} ${asset.name}`">{{ zh ? 'CDN 下载' : 'Download' }} ↗</a>
        <a v-if="zh" :href="asset.browser_download_url" :aria-label="`从 GitHub 下载 ${asset.name}`">GitHub ↗</a>
      </span>
    </li>
  </ul>
</template>

<style scoped>
.download-assets { list-style:none; padding:0; margin:16px 0 24px; }
.download-assets > li { display:flex; align-items:baseline; justify-content:space-between; flex-wrap:wrap; gap:8px 20px; padding:12px 0; margin:0; border-bottom:1px solid var(--ec-border); }
/* @vue/theme draws bullets with ::before, independently of list-style. */
.download-assets > li::before { display:none; content:none; }
.asset-name { min-width:0; max-width:100%; overflow-wrap:anywhere; white-space:normal; font-size:12px; }
.asset-links { display:flex; flex-wrap:wrap; gap:18px; flex-shrink:0; font-size:13px; }
</style>
