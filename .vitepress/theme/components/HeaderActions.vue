<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import { localePath } from './localePath'
const { isDark } = useData()
const route = useRoute()
const ready = ref(false)
const zh = computed(() => route.path.startsWith('/zh'))
const alternate = computed(() => localePath(route.path, zh.value ? 'en' : 'zh'))
const modeLabel = computed(() => zh.value ? (isDark.value ? '切换到日间主题' : '切换到深夜主题') : (isDark.value ? 'Switch to light theme' : 'Switch to dark theme'))
onMounted(() => { ready.value = true })
</script>
<template>
  <Teleport v-if="ready" to=".VPNavBar .content">
    <div class="ec-header-actions">
      <button type="button" class="ec-theme-toggle" :aria-label="modeLabel" :title="modeLabel" :aria-pressed="isDark" @click="isDark = !isDark">
        <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 13.2A9 9 0 0 1 10.8 3.3a9 9 0 1 0 10 9.9Z" /></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
      </button>
      <a class="ec-language-link" :href="alternate" :aria-label="zh ? 'Switch to English' : '切换到中文'" :lang="zh ? 'en' : 'zh-CN'">{{ zh ? 'EN' : '中文' }}</a>
    </div>
  </Teleport>
</template>
<style scoped>
.ec-header-actions { order:3; display:flex; align-items:center; gap:10px; margin-left:14px; }
.ec-theme-toggle { display:grid; place-items:center; width:36px; height:36px; border:1px solid var(--ec-border); border-radius:5px; background:var(--ec-bg); color:var(--ec-ink); cursor:pointer; }
.ec-theme-toggle:hover { border-color:var(--ec-accent); }
.ec-theme-toggle svg { width:18px; height:18px; }
.ec-language-link { display:grid; place-items:center; min-width:32px; min-height:40px; color:var(--ec-text); font:12px var(--vt-font-family-mono); }
.ec-language-link:hover { color:var(--ec-accent); }
@media(max-width:480px) { .ec-header-actions { gap:3px; margin-left:5px; } }
</style>
