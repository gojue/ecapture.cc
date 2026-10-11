<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import { localePath } from './localePath'

const route = useRoute()

function alternatePath(path: string): string {
  return localePath(path, path === '/zh' || path.startsWith('/zh/') ? 'en' : 'zh')
}

function updateLinks() {
  if (typeof document === 'undefined') return
  const target = alternatePath(route.path)
  const label = route.path.startsWith('/zh/') ? '切换到英文' : 'Switch to Chinese'
  document.querySelectorAll<HTMLAnchorElement>('a.vt-social-link[title="languages"]').forEach(link => {
    link.href = target
    link.setAttribute('aria-label', label)
  })
}

// The mobile social links are mounted when the menu opens. Keep their hrefs
// current as well as the always-mounted desktop icon's href.
let observer: MutationObserver | undefined

function onLanguageClick(event: MouseEvent) {
  const element = event.target
  if (!(element instanceof Element)) return
  const link = element.closest<HTMLAnchorElement>('a.vt-social-link[title="languages"]')
  if (link) link.href = alternatePath(window.location.pathname)
}

onMounted(() => {
  updateLinks()
  observer = new MutationObserver(updateLinks)
  observer.observe(document.querySelector('.VPNav') || document.body, { childList: true, subtree: true })
  document.addEventListener('click', onLanguageClick, true)
})

watch(() => route.path, async () => {
  await nextTick()
  updateLinks()
}, { flush: 'post' })

onUnmounted(() => {
  observer?.disconnect()
  document.removeEventListener('click', onLanguageClick, true)
})
</script>

<template></template>
