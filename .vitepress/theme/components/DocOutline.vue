<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, type Header } from 'vitepress'
const { page, frontmatter, lang } = useData()
const active = ref('')
const headings = computed(() => {
  const result: { title: string; link: string; depth: number }[] = []
  const walk = (items: Header[], depth: number) => {
    for (const item of items) {
      result.push({ title: item.title, link: item.link, depth })
      if (frontmatter.value.ecOutline === 'deep' && item.children) walk(item.children, depth + 1)
    }
  }
  walk(page.value.headers || [], 0)
  return result
})
let frame = 0
function updateActive() {
  frame = 0
  let current = headings.value[0]?.link || ''
  for (const item of headings.value) {
    const heading = document.getElementById(decodeURIComponent(item.link.slice(1)))
    if (heading && heading.getBoundingClientRect().top <= 130) current = item.link
  }
  active.value = current
}
function onScroll() { if (!frame) frame = requestAnimationFrame(updateActive) }
function jump(event: MouseEvent, link: string) {
  const target = document.getElementById(decodeURIComponent(link.slice(1)))
  if (!target) return
  event.preventDefault()
  history.pushState(null, '', link)
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  target.focus({ preventScroll: true })
  active.value = link
}
onMounted(() => {
  updateActive()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
watch(() => page.value.relativePath, async () => { await nextTick(); updateActive() })
onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>
<template>
  <nav v-if="frontmatter.ecOutline !== false && headings.length" class="ec-doc-outline" :aria-label="lang.startsWith('zh') ? '本页目录' : 'On this page'">
    <p class="outline-title"><span aria-hidden="true">#</span> {{ lang.startsWith('zh') ? '本页目录' : 'On this page' }}</p>
    <a v-for="item in headings" :key="item.link" :href="item.link" :class="{ active: active === item.link }" :aria-current="active === item.link ? 'location' : undefined" :style="{ paddingLeft: `${item.depth * 12}px` }" @click="jump($event, item.link)">{{ item.title }}</a>
  </nav>
</template>
<style scoped>
.outline-title { font-size:12px; color:var(--ec-muted); font-weight:500; margin:0 0 15px; }
.outline-title span { margin-right:5px; }
a { position:relative; display:block; font-size:12px; line-height:1.7; padding:6px 0; color:var(--ec-muted); overflow-wrap:anywhere; }
a:hover,a.active { color:var(--ec-accent); }
a.active::before { content:''; position:absolute; left:-17px; top:6px; width:3px; height:20px; background:var(--ec-yellow); }
</style>
