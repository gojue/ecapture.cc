<script setup lang="ts">
import DocOutline from './DocOutline.vue'
import { computed } from 'vue'
import { useData } from 'vitepress'
import { sidebar } from '../../productNavigation'
import { isChinesePath, isProductPath } from './localePath'
const { page } = useData()
const section = computed(() => {
  const path = '/' + page.value.relativePath
  const match = Object.entries(sidebar).find(([prefix]) => path.startsWith(prefix))
  return match ? { prefix: match[0], title: match[1][0].text } : null
})
const zh = computed(() => isChinesePath('/' + page.value.relativePath))
const product = computed(() => isProductPath('/' + page.value.relativePath))
const inlineOutline = computed(() => product.value || /^(en|zh)\/download\//.test(page.value.relativePath))
const eyebrow = computed(() => section.value?.title || (zh.value ? '使用文档' : 'DOCUMENTATION'))
</script>
<template>
  <div v-if="section" class="ec-doc-context">
    <nav :aria-label="zh ? '面包屑导航' : 'Breadcrumb'">
      <a :href="zh ? '/zh/' : '/'">{{ product ? 'eCapture' : zh ? '文档' : 'Docs' }}</a><span>/</span><a :href="section.prefix">{{ section.title }}</a>
    </nav>
    <p class="ec-eyebrow">{{ eyebrow }}</p>
    <details v-if="inlineOutline" class="q-inline-outline">
      <summary>{{ zh ? '本页目录' : 'On this page' }}</summary>
      <DocOutline />
    </details>
  </div>
</template>
<style scoped>
.ec-doc-context nav { display:flex; gap:12px; flex-wrap:wrap; color:var(--ec-muted); font-size:12px; margin-bottom:24px; }
.ec-doc-context a:hover { color:var(--ec-accent); }
.ec-doc-context .ec-eyebrow { margin-bottom:12px; color:var(--ec-accent); }
.q-inline-outline { border:1px solid var(--ec-border); border-radius:5px; padding:12px 16px; margin:0 0 24px; background:var(--ec-surface); }
.q-inline-outline summary { cursor:pointer; font-size:13px; font-weight:600; }
.q-inline-outline[open] summary { margin-bottom:16px; }
@media(min-width:1280px) { .q-inline-outline { display:none; } }
</style>
