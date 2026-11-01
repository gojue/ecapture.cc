<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { VTIconGitHub } from '@vue/theme'
import { formatGitHubStars, loadGitHubStars } from '../../githubStars'

const props = defineProps<{ zh: boolean }>()
const stars = ref<number | null>(null)
const label = computed(() => {
  const repo = 'GitHub · gojue/ecapture'
  if (stars.value === null) return repo
  const count = stars.value.toLocaleString(props.zh ? 'zh-CN' : 'en-US')
  return `${repo} · ${count}${props.zh ? ' 个 Star' : ' stars'}`
})
let request: AbortController | undefined
onMounted(async () => {
  request = new AbortController()
  const count = await loadGitHubStars(request.signal)
  if (!request.signal.aborted) stars.value = count
})
onUnmounted(() => request?.abort())
</script>

<template>
  <a class="ec-github-link" href="https://github.com/gojue/ecapture" target="_blank" rel="noopener noreferrer" :aria-label="label" :title="label">
    <VTIconGitHub class="ec-github-icon" />
    <span v-if="stars !== null" class="ec-github-stars" aria-hidden="true">
      <svg class="ec-star-icon" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.76 5.82 21 7 14.14 2 9.27l6.91-1.01Z" /></svg>
      <span>{{ formatGitHubStars(stars, zh) }}</span>
    </span>
  </a>
</template>

<style scoped>
.ec-github-link { display:inline-flex; align-items:center; gap:7px; min-height:40px; color:var(--ec-text); }
.ec-github-link:hover { color:var(--ec-accent); }
.ec-github-icon { width:20px; height:20px; fill:currentColor; flex:none; }
.ec-github-stars { display:inline-flex; align-items:center; gap:4px; white-space:nowrap; font:12px var(--vt-font-family-mono); font-variant-numeric:tabular-nums; }
.ec-star-icon { width:13px; height:13px; color:var(--ec-yellow); flex:none; }
@media(max-width:1023px) { .ec-github-link { display:none; } }
</style>
