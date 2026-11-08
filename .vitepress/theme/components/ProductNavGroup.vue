<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import OriginalGroup from '../../../node_modules/@vue/theme/src/vitepress/components/VPNavBarMenuGroup.vue'
import type { NavItemWithChildren } from '../../../node_modules/@vue/theme/src/vitepress/config'
const props = defineProps<{ item: NavItemWithChildren }>()
const { lang } = useData()
const route = useRoute()
const open = ref(false)
let openedByHover = false
const root = ref<HTMLElement>()
const toggle = ref<HTMLButtonElement>()
const links = computed(() => props.item.items.filter(item => 'link' in item))
const label = computed(() => lang.value.startsWith('zh') ? '展开 eCaptureQ 使用文档' : 'Open eCaptureQ documentation')
function close(event?: KeyboardEvent) {
  open.value = false
  openedByHover = false
  if (event) { event.preventDefault(); toggle.value?.focus() }
}
async function focusFirst() {
  open.value = true
  await nextTick()
  root.value?.querySelector<HTMLAnchorElement>('.q-nav-links a')?.focus()
}
function blur(event: FocusEvent) {
  if (!root.value?.contains(event.relatedTarget as Node)) close()
}
function hover(event: PointerEvent, entering: boolean) {
  if (event.pointerType !== 'mouse') return
  if (entering) {
    openedByHover = !open.value
    open.value = true
  } else if (!root.value?.contains(document.activeElement)) close()
}
function toggleMenu(event: MouseEvent) {
  // A pointer click can follow pointerenter; keep that first click open.
  open.value = openedByHover && event.detail > 0 ? true : !open.value
  openedByHover = false
}
function outside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}
onMounted(() => document.addEventListener('pointerdown', outside))
onUnmounted(() => document.removeEventListener('pointerdown', outside))
watch(() => route.path, () => close())
</script>
<template>
  <div v-if="item.text === 'eCaptureQ'" ref="root" class="VPNavBarMenuGroup q-nav-group" :class="{ active: route.path.startsWith('/q/') }" @pointerenter="hover($event, true)" @pointerleave="hover($event, false)" @focusout="blur" @keydown.esc="close($event)">
    <a class="q-product-link" :href="links[0]?.link">eCaptureQ</a>
    <button ref="toggle" type="button" :aria-label="label" :aria-expanded="open" aria-controls="q-desktop-docs" @click="toggleMenu" @keydown.down.prevent="focusFirst"><span aria-hidden="true">⌄</span></button>
    <div v-show="open" id="q-desktop-docs" class="q-nav-links">
      <a v-for="link in links" :key="link.link" :href="link.link">{{ link.text }}</a>
    </div>
  </div>
  <OriginalGroup v-else :item="item" />
</template>
<style scoped>
.q-nav-group { position:relative; display:flex; align-items:center; gap:2px; height:var(--vt-nav-height); font-size:13px; font-weight:500; }
.q-product-link { display:flex; align-items:center; height:100%; white-space:nowrap; }
.q-nav-group.active > a,.q-product-link:hover { color:var(--ec-accent); }
.q-nav-group button { width:28px; height:36px; color:var(--ec-text); cursor:pointer; border-radius:4px; }
.q-nav-group button:hover { background:var(--ec-accent-soft); }
.q-nav-links { position:absolute; top:calc(100% - 10px); left:0; width:248px; max-height:calc(100vh - 90px); overflow:auto; padding:8px; background:var(--ec-surface-raised); border:1px solid var(--ec-border); border-radius:6px; box-shadow:var(--ec-shadow); }
.q-nav-links a { display:block; padding:10px 12px; line-height:1.5; color:var(--ec-text); border-radius:3px; }
.q-nav-links a:hover { color:var(--ec-accent); background:var(--ec-accent-soft); }
</style>
