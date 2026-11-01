<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import navigation from '../../navigation.json'
const route=useRoute()
const sections=computed(() => Object.entries(navigation.sidebar).filter(([path])=>path.startsWith(route.path.startsWith('/zh')?'/zh/':'/en/')&&!path.includes('/download/')&&!route.path.startsWith(path)).map(([path,groups])=>({path,title:groups[0].text})))
</script>
<template>
  <div class="ec-other-chapters">
    <a v-for="section in sections" :key="section.path" :href="section.path">{{ section.title }}<span aria-hidden="true">›</span></a>
    <a class="ec-repository" href="https://github.com/gojue/ecapture" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
  </div>
</template>
<style scoped>
.ec-other-chapters { margin-top:24px; }
.ec-other-chapters a { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:15px 2px; border-top:1px solid var(--ec-border); font-size:13px; font-weight:600; }
.ec-other-chapters a:hover { color:var(--ec-accent); }
.ec-other-chapters a span { color:var(--ec-muted); }
.ec-other-chapters .ec-repository { margin-top:14px; font-weight:400; color:var(--ec-muted); }
</style>
