<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { productMenuId } from '../../productNavigation'
import OriginalGroup from '../../../node_modules/@vue/theme/src/vitepress/components/VPNavScreenMenuGroup.vue'
import type { MenuItemChild } from '../../../node_modules/@vue/theme/src/core/types/menu'
const props = defineProps<{ text: string; items: MenuItemChild[] }>()
const { lang } = useData()
const route = useRoute()
const closeScreen = inject<() => void>('close-screen')
const open = ref(false)
const toggle = ref<HTMLButtonElement>()
const productId = computed(() => productMenuId(props.text))
const isDownloads = computed(() => props.text === 'Download' || props.text === '下载')
const menuId = computed(() => productId.value ? `${productId.value}-mobile-docs` : 'mobile-downloads')
const label = computed(() => lang.value.startsWith('zh') ? `展开 ${props.text}` : `Open ${props.text}`)
const links = computed(() => props.items.filter(item => 'link' in item))
function close() { open.value = false; toggle.value?.focus() }
watch(() => route.path, () => { open.value = false; closeScreen?.() })
</script>
<template>
  <div v-if="productId || isDownloads" class="nav-mobile-group" @keydown.esc.stop="close">
    <div class="nav-mobile-heading">
      <a v-if="productId" :href="links[0]?.link" @click="closeScreen?.()">{{ text }}</a>
      <button ref="toggle" type="button" :class="{ 'with-label': !productId }" :aria-label="label" :aria-expanded="open" :aria-controls="menuId" @click="open = !open"><span v-if="!productId">{{ text }}</span><span aria-hidden="true">{{ open ? '−' : '+' }}</span></button>
    </div>
    <div v-show="open" :id="menuId" class="nav-mobile-links">
      <a v-for="link in links" :key="link.link" :href="link.link" @click="closeScreen?.()">{{ link.text }}</a>
    </div>
  </div>
  <OriginalGroup v-else :text="text" :items="items" />
</template>
<style scoped>
.nav-mobile-group { border-bottom:1px solid var(--ec-border); }
.nav-mobile-heading { display:flex; align-items:center; justify-content:space-between; font-size:14px; font-weight:500; }
.nav-mobile-heading > a { flex:1; padding-block:14px; }
.nav-mobile-heading button { width:44px; height:48px; font-size:20px; cursor:pointer; }
.nav-mobile-heading button.with-label { display:flex; align-items:center; justify-content:space-between; width:100%; font-size:14px; font-weight:500; }
.nav-mobile-links { padding:0 0 14px 12px; }
.nav-mobile-links a { display:block; padding:11px 0; font-size:14px; color:var(--ec-text); }
.nav-mobile-links a:hover { color:var(--ec-accent); }
</style>
