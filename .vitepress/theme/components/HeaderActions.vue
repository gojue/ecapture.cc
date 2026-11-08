<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData, useRoute, useRouter } from 'vitepress'
import { localePath, isChinesePath } from './localePath'
import GitHubStars from './GitHubStars.vue'
const { isDark } = useData()
const route = useRoute()
const router = useRouter()
const ready = ref(false)
const zh = computed(() => isChinesePath(route.path))
const alternate = computed(() => localePath(route.path, zh.value ? 'en' : 'zh'))
const modeLabel = computed(() => zh.value ? (isDark.value ? '切换到日间主题' : '切换到深夜主题') : (isDark.value ? 'Switch to light theme' : 'Switch to dark theme'))
// vp-raw excludes this link from VitePress's capture-phase navigation handler.
// Preserve a shared heading; unknown or translated-only IDs return to the top.
async function switchLanguage(event: MouseEvent) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  const target = alternate.value
  const hash = window.location.hash
  let runtimeHeading = false
  try { runtimeHeading = !!document.getElementById(decodeURIComponent(hash.slice(1)))?.hasAttribute('data-ec-outline') } catch { /* Invalid fragment. */ }
  await router.go(target + hash)
  await nextTick()
  if (hash && route.path === target) {
    let heading: HTMLElement | null = null
    try { heading = document.getElementById(decodeURIComponent(hash.slice(1))) } catch { /* Invalid fragments are not headings. */ }
    if (!heading && !(runtimeHeading && /^\/(?:q\/)?(?:en|zh)\/download\/$/.test(target))) {
      history.replaceState(history.state, '', target)
      window.scrollTo(0, 0)
    }
  }
}
function localizeControls() {
  document.querySelectorAll<HTMLButtonElement>('button.copy').forEach(button => {
    const label = zh.value ? '复制代码' : 'Copy code'
    button.title = label
    button.setAttribute('aria-label', label)
  })
  document.querySelectorAll<HTMLAnchorElement>('.header-anchor').forEach(link => {
    const heading = link.parentElement?.textContent?.replace(/[\u200b#]/g, '').trim() || ''
    link.setAttribute('aria-label', zh.value ? `链接到：${heading}` : `Permalink to ${heading}`)
  })
  const hamburger = document.querySelector('.VPNavBarHamburger')
  hamburger?.setAttribute('aria-label', zh.value ? '展开主导航' : 'Open main navigation')
}
onMounted(async () => { ready.value = true; await nextTick(); localizeControls() })
watch(() => route.path, async () => { await nextTick(); localizeControls() })
</script>
<template>
  <Teleport v-if="ready" to=".VPNavBar .content">
    <div class="ec-header-actions">
      <button type="button" class="ec-theme-toggle" :aria-label="modeLabel" :title="modeLabel" :aria-pressed="isDark" @click="isDark = !isDark">
        <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 13.2A9 9 0 0 1 10.8 3.3a9 9 0 1 0 10 9.9Z" /></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
      </button>
      <a class="ec-language-link vp-raw" :href="alternate" @click="switchLanguage" :aria-label="zh ? '切换到英文' : 'Switch to Chinese'" :lang="zh ? 'en' : 'zh-CN'">{{ zh ? 'EN' : '中文' }}</a>
      <GitHubStars :zh="zh" />
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
