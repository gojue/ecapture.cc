<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vitepress'
const route = useRoute()
const logo = ref<HTMLImageElement>()
function updateHome() {
  const link = logo.value?.closest('a')
  if (link) link.href = route.path.startsWith('/zh') ? '/zh/' : '/'
}
onMounted(updateHome)
watch(() => route.path, updateHome)
</script>
<template>
  <img ref="logo" class="ec-logo" src="/logo.svg" alt="" width="38" height="38" />
  <span class="ec-wordmark">eCapture</span>
</template>
<style scoped>
.ec-logo { width:38px; height:38px; flex:none; margin-right:10px; }
.ec-wordmark { color:var(--ec-ink); font-size:23px; font-weight:750; letter-spacing:-.9px; }
@media(max-width:420px) { .ec-logo { width:30px; height:30px; margin-right:6px; } .ec-wordmark { font-size:20px; } }
</style>
