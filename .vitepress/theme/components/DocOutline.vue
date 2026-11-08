<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, type Header } from 'vitepress'
const { page, frontmatter, lang } = useData()
type OutlineItem = { title: string; link: string; depth: number }
const active = ref('')
const renderedHeadings = ref<OutlineItem[] | null>(null)
const staticHeadings = computed(() => {
  const result: OutlineItem[] = []
  const walk = (items: Header[], depth: number) => {
    for (const item of items) {
      result.push({ title: item.title, link: item.link, depth })
      if (frontmatter.value.ecOutline === 'deep' && item.children) walk(item.children, depth + 1)
    }
  }
  walk(page.value.headers || [], 0)
  return result
})
const headings = computed(() => renderedHeadings.value ?? staticHeadings.value)
let frame = 0
let observer: MutationObserver | undefined
let content: HTMLElement | null = null
let pendingHash = ''
let binding = 0
let mounted = false
function headingId(link: string) {
  try { return decodeURIComponent(link.slice(1)) } catch { return link.slice(1) }
}
function findHeading(link: string) {
  const target = document.getElementById(headingId(link))
  return target && content?.contains(target) ? target : null
}
function reveal(target: HTMLElement, smooth: boolean) {
  let parent = target.parentElement
  while (parent && parent !== content) {
    if (parent instanceof HTMLDetailsElement) parent.open = true
    parent = parent.parentElement
  }
  target.scrollIntoView({ behavior: smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto', block: 'start' })
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}
function restoreHash() {
  if (!pendingHash || !headings.value.some(item => headingId(item.link) === headingId(pendingHash))) return
  const target = findHeading(pendingHash)
  if (!target) return
  reveal(target, false)
  pendingHash = ''
}
function updateActive() {
  frame = 0
  let current = headings.value[0]?.link || ''
  for (const item of headings.value) {
    const heading = findHeading(item.link)
    if (heading && heading.getClientRects().length && heading.getBoundingClientRect().top <= 130) current = item.link
  }
  active.value = current
}
function onScroll() { if (!frame) frame = requestAnimationFrame(updateActive) }
function scanHeadings() {
  // Only explicit runtime headings join Markdown's compiled outline. Release
  // notes may contain arbitrary headings, which should not become site navigation.
  if (content?.querySelector('[data-ec-outline][id]')) {
    const compiled = new Map(staticHeadings.value.map(item => [headingId(item.link), item]))
    const items: OutlineItem[] = []
    for (const element of content.querySelectorAll<HTMLElement>('h2[id], h3[id], h4[id]')) {
      const existing = compiled.get(element.id)
      if (existing) items.push(existing)
      else if (element.hasAttribute('data-ec-outline') && (element.tagName === 'H2' || frontmatter.value.ecOutline === 'deep')) {
        const title = element.dataset.ecOutline || element.textContent?.trim() || ''
        if (title) items.push({ title, link: '#' + element.id, depth: Number(element.tagName.slice(1)) - 2 })
      }
    }
    renderedHeadings.value = items
  } else renderedHeadings.value = null
  restoreHash()
  onScroll()
}
async function bindContent() {
  const currentBinding = ++binding
  observer?.disconnect()
  content = null
  renderedHeadings.value = null
  pendingHash = location.hash
  await nextTick()
  if (!mounted || binding !== currentBinding) return
  content = document.querySelector<HTMLElement>('.VPContentDoc main .vt-doc')
  scanHeadings()
  if (content) {
    observer = new MutationObserver(scanHeadings)
    observer.observe(content, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['id', 'data-ec-outline'] })
  }
}
function onHashChange() {
  pendingHash = location.hash
  restoreHash()
  onScroll()
}
function jump(event: MouseEvent, link: string) {
  const target = findHeading(link)
  if (!target) return
  event.preventDefault()
  history.pushState(null, '', link)
  pendingHash = ''
  reveal(target, true)
  active.value = link
}
onMounted(() => {
  mounted = true
  void bindContent()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  window.addEventListener('hashchange', onHashChange)
})
watch(() => page.value.relativePath, () => { if (mounted) void bindContent() }, { flush: 'post' })
onUnmounted(() => {
  mounted = false
  binding++
  observer?.disconnect()
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('hashchange', onHashChange)
})
</script>
<template>
  <nav v-if="frontmatter.ecOutline !== false && headings.length" class="ec-doc-outline" :aria-label="lang.startsWith('zh') ? '本页目录' : 'On this page'">
    <p class="outline-title"><span aria-hidden="true">#</span> {{ lang.startsWith('zh') ? '本页目录' : 'On this page' }}</p>
    <a v-for="item in headings" class="vp-raw" :key="item.link" :href="item.link" :class="{ active: active === item.link }" :aria-current="active === item.link ? 'location' : undefined" :style="{ paddingLeft: `${item.depth * 12}px` }" @click="jump($event, item.link)">{{ item.title }}</a>
  </nav>
</template>
<style scoped>
.outline-title { font-size:12px; color:var(--ec-muted); font-weight:500; margin:0 0 15px; }
.outline-title span { margin-right:5px; }
a { position:relative; display:block; font-size:12px; line-height:1.7; padding:6px 0; color:var(--ec-muted); overflow-wrap:anywhere; }
a:hover,a.active { color:var(--ec-accent); }
a.active::before { content:''; position:absolute; left:-17px; top:6px; width:3px; height:20px; background:var(--ec-yellow); }
</style>
