<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

defineProps<{
  id: string
  text: string
  links: { text: string; link: string }[]
  href?: string
  toggleLabel?: string
  active?: boolean
}>()

const route = useRoute()
const open = ref(false)
let openedByHover = false
const root = ref<HTMLElement>()
const toggle = ref<HTMLButtonElement>()
function close(event?: KeyboardEvent) {
  open.value = false
  openedByHover = false
  if (event) { event.preventDefault(); toggle.value?.focus() }
}
async function focusFirst() {
  open.value = true
  await nextTick()
  root.value?.querySelector<HTMLAnchorElement>('.nav-dropdown-links a')?.focus()
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
  <div
    ref="root"
    class="VPNavBarMenuGroup nav-dropdown"
    :class="{ active }"
    @pointerenter="hover($event, true)"
    @pointerleave="hover($event, false)"
    @focusout="blur"
    @keydown.esc="close($event)"
  >
    <div class="nav-dropdown-trigger">
      <a v-if="href" class="nav-dropdown-link" :href="href" @click="close()">{{ text }}</a>
      <button
        ref="toggle"
        type="button"
        class="nav-dropdown-toggle"
        :class="{ 'with-label': !href }"
        :aria-label="toggleLabel"
        :aria-expanded="open"
        :aria-controls="id"
        @click="toggleMenu"
        @keydown.down.prevent="focusFirst"
      >
        <span v-if="!href">{{ text }}</span>
        <span class="nav-dropdown-chevron" aria-hidden="true">⌄</span>
      </button>
    </div>
    <div v-show="open" :id="id" class="nav-dropdown-links">
      <a v-for="link in links" :key="link.link" :href="link.link" @click="close()">{{ link.text }}</a>
    </div>
  </div>
</template>

<style scoped>
.nav-dropdown {
  position:relative;
  display:flex;
  align-items:center;
  height:var(--vt-nav-height);
  font-size:13px;
  font-weight:500;
}
.nav-dropdown-trigger { gap:2px; }
.nav-dropdown-link { display:flex; align-items:center; height:100%; padding-left:10px; color:inherit; white-space:nowrap; }
.nav-dropdown.active .nav-dropdown-trigger { color:var(--ec-accent); }
.nav-dropdown-toggle {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:4px;
  width:28px;
  height:36px;
  color:inherit;
  cursor:pointer;
  border-radius:4px;
}
.nav-dropdown-toggle.with-label { width:auto; padding:0 12px; }
.nav-dropdown-chevron { width:14px; }
.nav-dropdown-links {
  position:absolute;
  top:calc(100% - 10px);
  left:0;
  width:248px;
  max-height:calc(100vh - 90px);
  overflow:auto;
  padding:8px;
  background:var(--ec-surface-raised);
  border:1px solid var(--ec-border);
  border-radius:6px;
  box-shadow:var(--ec-shadow);
}
.nav-dropdown-links a {
  display:block;
  padding:10px 12px;
  font-size:13px;
  font-weight:500;
  line-height:1.5;
  white-space:normal;
  color:var(--ec-text);
  border-radius:3px;
}
.nav-dropdown-links a:is(:hover, :focus-visible) { color:var(--ec-accent); background:var(--ec-accent-soft); }
</style>
