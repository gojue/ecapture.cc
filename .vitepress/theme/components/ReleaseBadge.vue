<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import { loadReleases, type ReleaseProduct } from '../../githubReleases'
import { isChinesePath } from './localePath'
const props = withDefaults(defineProps<{ product?: ReleaseProduct }>(), { product: 'ecaptureQ' })
const { page } = useData()
const zh = computed(() => isChinesePath('/' + page.value.relativePath))
const tag = ref('')
let controller: AbortController | undefined
onMounted(async () => {
  controller = new AbortController()
  const releases = await loadReleases(zh.value, controller.signal, props.product)
  if (!controller.signal.aborted) tag.value = releases[0]?.tag_name || ''
})
onUnmounted(() => controller?.abort())
</script>
<template>
  <samp v-if="tag" class="release-badge" :aria-label="`${zh ? '最新正式版本' : 'Latest stable release'} ${tag}`">{{ tag }}</samp>
</template>
<style scoped>
.release-badge { font-size:11px; font-weight:400; white-space:nowrap; }
</style>
