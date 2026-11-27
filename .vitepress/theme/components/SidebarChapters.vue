<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { productForPath } from '../../productNavigation'
const route = useRoute()
const product = computed(() => productForPath(route.path))
</script>
<template>
  <div class="ec-other-chapters">
    <a class="ec-repository" :href="`https://github.com/gojue/${product.repo}`" target="_blank" rel="noopener noreferrer">{{ product.name }} GitHub <span aria-hidden="true">↗</span></a>
  </div>
</template>
<style scoped>
.ec-other-chapters { margin-top:24px; }
.ec-other-chapters a { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:15px 2px; border-top:1px solid var(--ec-border); font-size:13px; font-weight:600; }
.ec-other-chapters a:hover { color:var(--ec-accent); }
.ec-other-chapters a span { color:var(--ec-muted); }
.ec-other-chapters .ec-repository { margin-top:14px; font-weight:400; color:var(--ec-muted); }
</style>
