<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import OriginalGroup from '../../../node_modules/@vue/theme/src/vitepress/components/VPNavBarMenuGroup.vue'
import type { NavItemWithChildren } from '../../../node_modules/@vue/theme/src/vitepress/config'
import NavDropdown from './NavDropdown.vue'

const props = defineProps<{ item: NavItemWithChildren }>()
const { lang } = useData()
const route = useRoute()
const isProduct = computed(() => props.item.text === 'eCaptureQ')
const isDocs = computed(() => props.item.text === 'Docs' || props.item.text === '文档')
const links = computed(() => props.item.items.filter(item => 'link' in item))
const productLabel = computed(() => lang.value.startsWith('zh') ? '展开 eCaptureQ 使用文档' : 'Open eCaptureQ documentation')
</script>

<template>
  <NavDropdown
    v-if="isProduct || isDocs"
    :id="isProduct ? 'q-desktop-docs' : 'collector-desktop-docs'"
    :text="item.text"
    :links="links"
    :href="isProduct ? links[0]?.link : undefined"
    :toggle-label="isProduct ? productLabel : undefined"
    :active="isProduct && route.path.startsWith('/q/')"
  />
  <OriginalGroup v-else :item="item" />
</template>
