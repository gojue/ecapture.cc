<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import OriginalGroup from '../../../node_modules/@vue/theme/src/vitepress/components/VPNavScreenMenuGroup.vue'
import type { MenuItemChild } from '../../../node_modules/@vue/theme/src/core/types/menu'
const props = defineProps<{ text: string; items: MenuItemChild[] }>()
const { lang } = useData()
const route = useRoute()
const closeScreen = inject<() => void>('close-screen')
const open = ref(false)
const toggle = ref<HTMLButtonElement>()
const links = computed(() => props.items.filter(item => 'link' in item))
function close() { open.value = false; toggle.value?.focus() }
watch(() => route.path, () => { open.value = false; closeScreen?.() })
</script>
<template>
  <div v-if="text === 'eCaptureQ'" class="q-mobile-group" @keydown.esc.stop="close">
    <div class="q-mobile-heading">
      <a :href="links[0]?.link" @click="closeScreen?.()">eCaptureQ</a>
      <button ref="toggle" type="button" :aria-label="lang.startsWith('zh') ? '展开 eCaptureQ 使用文档' : 'Open eCaptureQ documentation'" :aria-expanded="open" aria-controls="q-mobile-docs" @click="open = !open"><span aria-hidden="true">{{ open ? '−' : '+' }}</span></button>
    </div>
    <div v-show="open" id="q-mobile-docs" class="q-mobile-links">
      <a v-for="link in links" :key="link.link" :href="link.link" @click="closeScreen?.()">{{ link.text }}</a>
    </div>
  </div>
  <OriginalGroup v-else :text="text" :items="items" />
</template>
<style scoped>
.q-mobile-group { border-bottom:1px solid var(--ec-border); }
.q-mobile-heading { display:flex; align-items:center; justify-content:space-between; font-size:14px; font-weight:500; }
.q-mobile-heading > a { flex:1; padding-block:14px; }
.q-mobile-heading button { width:44px; height:48px; font-size:20px; cursor:pointer; }
.q-mobile-links { padding:0 0 14px 12px; }
.q-mobile-links a { display:block; padding:11px 0; font-size:14px; color:var(--ec-text); }
.q-mobile-links a:hover { color:var(--ec-accent); }
</style>
