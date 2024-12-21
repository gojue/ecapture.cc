<script setup>
import { useRouter, useRoute } from 'vitepress'

const route = useRoute()
const router = useRouter()

const toggleLocale = () => {
  const currentPath = route.path
  const newPath = currentPath.startsWith('/zh/') 
    ? currentPath.replace('/zh/', '/') 
    : '/zh' + currentPath
  router.go(newPath)
}
</script>

<template>
  <button class="locale-switch" @click="toggleLocale">
    {{ route.path.startsWith('/zh/') ? 'English' : '中文' }}
  </button>
</template>

<style scoped>
.locale-switch {
  /* Add your styling here */
}
</style> 