<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vitepress'
import { isChinesePath } from './localePath'
const route = useRoute()
const logo = ref<HTMLImageElement>()
function updateHome() {
  const link = logo.value?.closest('a')
  if (link) link.href = isChinesePath(route.path) ? '/zh/' : '/'
}
onMounted(updateHome)
watch(() => route.path, updateHome)
</script>
<template>
  <img ref="logo" class="ec-logo" src="/logo.svg" alt="" width="38" height="38" />
  <span class="ec-brand">
    <span class="ec-wordmark">eCapture</span>
    <span class="ec-brand-name" lang="zh-CN">旁观者</span>
  </span>
</template>
<style scoped>
.ec-logo { width:38px; height:38px; flex:none; margin-right:10px; }
.ec-brand { display:flex; flex-direction:column; gap:3px; white-space:nowrap; }
.ec-wordmark { color:var(--ec-ink); font-size:23px; font-weight:750; line-height:1.1; letter-spacing:-.9px; }
.ec-brand-name { color:var(--ec-muted); font-size:11px; font-weight:500; line-height:1.3; letter-spacing:.2em; }
@media(max-width:420px) { .ec-logo { width:30px; height:30px; margin-right:6px; } .ec-wordmark { font-size:20px; } }
</style>
