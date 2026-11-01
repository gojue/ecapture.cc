<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import navigation from '../../navigation.json'
const { page } = useData()
const section = computed(() => {
  const path = '/' + page.value.relativePath
  const match = Object.entries(navigation.sidebar).find(([prefix]) => path.startsWith(prefix))
  return match ? { prefix: match[0], title: match[1][0].text } : null
})
const zh = computed(() => page.value.relativePath.startsWith('zh/'))
const eyebrow = computed(() => {
  if (!section.value) return 'DOCUMENTATION'
  const english = section.value.prefix.replace('/zh/', '/en/') as keyof typeof navigation.sidebar
  return navigation.sidebar[english]?.[0].text || 'DOCUMENTATION'
})
</script>
<template>
  <div v-if="section" class="ec-doc-context">
    <nav :aria-label="zh ? '面包屑导航' : 'Breadcrumb'">
      <a :href="zh ? '/zh/' : '/'">{{ zh ? '文档' : 'Docs' }}</a><span>/</span><a :href="section.prefix">{{ section.title }}</a>
    </nav>
    <p class="ec-eyebrow">{{ eyebrow }}</p>
  </div>
</template>
<style scoped>
.ec-doc-context nav { display:flex; gap:12px; flex-wrap:wrap; color:var(--ec-muted); font-size:12px; margin-bottom:24px; }
.ec-doc-context a:hover { color:var(--ec-accent); }
.ec-doc-context .ec-eyebrow { margin-bottom:12px; color:var(--ec-accent); }
</style>
