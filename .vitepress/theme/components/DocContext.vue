<script setup lang="ts">
import DocOutline from './DocOutline.vue'
import { computed } from 'vue'
import { useData } from 'vitepress'
import { productForPath, sidebar } from '../../productNavigation'
import { isChinesePath, isProductPath, isDownloadPath } from './localePath'
const { page } = useData()
const path = computed(() => '/' + page.value.relativePath)
const section = computed(() => {
  const match = Object.entries(sidebar).find(([prefix]) => path.value.startsWith(prefix))
  return match ? { prefix: match[0], title: match[1][0].text } : null
})
const zh = computed(() => isChinesePath(path.value))
const product = computed(() => isProductPath(path.value))
const download = computed(() => isDownloadPath(path.value))
const sectionTitle = computed(() => download.value
  ? `${productForPath(path.value).name} ${zh.value ? '下载' : 'Download'}`
  : section.value?.title)
const inlineOutline = computed(() => product.value || /^(en|zh)\/(?:download|overview)\//.test(page.value.relativePath))
const eyebrow = computed(() => sectionTitle.value || (zh.value ? '使用文档' : 'DOCUMENTATION'))
</script>
<template>
  <div v-if="section" class="ec-doc-context">
    <nav class="ec-breadcrumb" :aria-label="zh ? '面包屑导航' : 'Breadcrumb'">
      <a :href="zh ? '/zh/' : '/'">{{ product ? 'eCapture' : zh ? '文档' : 'Docs' }}</a><span>/</span><a :href="section.prefix">{{ sectionTitle }}</a>
    </nav>
    <p class="ec-eyebrow" :class="{ 'download-label': download }">{{ eyebrow }}</p>
    <details v-if="inlineOutline" class="q-inline-outline">
      <summary>{{ zh ? '本页目录' : 'On this page' }}</summary>
      <DocOutline :show-title="false" />
    </details>
  </div>
</template>
<style scoped>
.ec-breadcrumb { display:flex; gap:12px; flex-wrap:wrap; color:var(--ec-muted); font-size:12px; margin-bottom:24px; }
.ec-doc-context a:hover { color:var(--ec-accent); }
.ec-doc-context .ec-eyebrow { margin-bottom:12px; color:var(--ec-accent); }
.ec-doc-context .download-label { text-transform:none; }
.q-inline-outline { border:1px solid var(--ec-border); border-radius:5px; padding:12px 16px; margin:0 0 24px; background:var(--ec-surface); }
.q-inline-outline summary { cursor:pointer; font-size:13px; font-weight:600; }
.q-inline-outline[open] summary { margin-bottom:16px; }
@media(min-width:1280px) { .q-inline-outline { display:none; } }
</style>
