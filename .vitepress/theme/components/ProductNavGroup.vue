<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import OriginalGroup from '../../../node_modules/@vue/theme/src/vitepress/components/VPNavBarMenuGroup.vue'
import type { NavItemWithChildren } from '../../../node_modules/@vue/theme/src/vitepress/config'
import NavDropdown from './NavDropdown.vue'

const props = defineProps<{ item: NavItemWithChildren }>()
const { lang } = useData()
const route = useRoute()
const isProduct = computed(() => ['eCapture', 'eCaptureQ'].includes(props.item.text))
const isDownloads = computed(() => props.item.text === 'Download' || props.item.text === '下载')
const menuId = computed(() => props.item.text === 'eCaptureQ' ? 'q-desktop-docs' : isProduct.value ? 'collector-desktop-docs' : 'desktop-downloads')
const active = computed(() => !!props.item.activeMatch && new RegExp(props.item.activeMatch).test(route.path.slice(1)))
const links = computed(() => props.item.items.filter(item => 'link' in item))
const productLabel = computed(() => lang.value.startsWith('zh') ? `展开 ${props.item.text} 使用文档` : `Open ${props.item.text} documentation`)
</script>

<template>
  <NavDropdown
    v-if="isProduct || isDownloads"
    :id="menuId"
    :text="item.text"
    :links="links"
    :href="isProduct ? links[0]?.link : undefined"
    :toggle-label="isProduct ? productLabel : undefined"
    :active="active"
  />
  <OriginalGroup v-else :item="item" />
</template>
