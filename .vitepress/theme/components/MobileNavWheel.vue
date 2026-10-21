<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

function handleWheel(event: WheelEvent) {
  if (event.ctrlKey || event.defaultPrevented || !matchMedia('(max-width: 767px)').matches) return
  if (document.body.classList.contains('vp-local-search-open')) return

  const menu = document.querySelector<HTMLElement>('header.VPNav .VPNavScreen')
  if (!menu) return

  // The menu locks body scrolling. Route wheel and trackpad input to it even
  // when the pointer rests on the title bar outside the scrollable panel.
  const lineHeight = Number.parseFloat(getComputedStyle(menu).lineHeight) || 16
  const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? lineHeight
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? menu.clientHeight
      : 1

  menu.scrollTop += event.deltaY * unit
  event.preventDefault()
}

onMounted(() => document.addEventListener('wheel', handleWheel, { capture: true, passive: false }))
onUnmounted(() => document.removeEventListener('wheel', handleWheel, true))
</script>

<template></template>
