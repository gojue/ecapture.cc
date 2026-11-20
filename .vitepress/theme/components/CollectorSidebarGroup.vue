<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRoute } from 'vitepress'
import OriginalGroup from '../../../node_modules/@vue/theme/src/vitepress/components/VPSidebarGroup.vue'
import type { MenuItemWithLink } from '../../../node_modules/@vue/theme/src/core'
import { collectorItems } from '../../productNavigation'
import { isChinesePath, isDownloadPath, isProductPath } from './localePath'

defineProps<{ text: string; items: MenuItemWithLink[] }>()
const route = useRoute()
const closeSidebar = inject<() => void>('close-sidebar')
const sections = computed(() => collectorItems(isChinesePath(route.path) ? 'zh' : 'en'))
const currentSection = computed(() => isProductPath(route.path) || isDownloadPath(route.path)
  ? undefined
  : sections.value.find(section => route.path.startsWith(section.link)))
</script>

<template>
  <!-- Keep the current chapter's native links in its position in the manifest. -->
  <div v-if="currentSection" class="ec-collector-chapters">
    <section v-for="section in sections" :key="section.link" class="ec-sidebar-chapter" :data-chapter="section.link">
      <OriginalGroup v-if="section.link === currentSection.link" :text="section.text" :items="items" />
      <a v-else class="ec-chapter-link" :href="section.link" @click="closeSidebar?.()">{{ section.text }}<span aria-hidden="true">›</span></a>
    </section>
  </div>
  <OriginalGroup v-else :text="text" :items="items" />
</template>

<style scoped>
.ec-sidebar-chapter { padding:15px 0; }
.ec-sidebar-chapter:first-child { padding-top:0; }
.ec-sidebar-chapter + .ec-sidebar-chapter { border-top:1px solid var(--ec-border); }
.ec-chapter-link { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:2px; font-size:13px; font-weight:600; line-height:1.6; }
.ec-chapter-link:hover { color:var(--ec-accent); }
.ec-chapter-link span { color:var(--ec-muted); }
</style>
