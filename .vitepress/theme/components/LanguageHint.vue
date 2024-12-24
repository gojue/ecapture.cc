<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const show = ref(false)
const isZh = ref(false)

onMounted(() => {
  // 延迟一秒执行，确保页面完全加载
  setTimeout(() => {
    const userLang = navigator.language || navigator.userLanguage
    const currentPath = window.location.pathname
    const isUserZh = userLang.toLowerCase().includes('zh')
    const isZhPath = currentPath.startsWith('/zh/')
    
    console.log('Debug:', { userLang, currentPath, isUserZh, isZhPath })

    // 检查用户语言和当前路径是否匹配
    if (isUserZh !== isZhPath) {
      isZh.value = isUserZh
      show.value = true
    }

    // 10秒后自动隐藏
    if (show.value) {
      setTimeout(() => {
        show.value = false
      }, 10000)
    }
  }, 1000)
})

const handleSwitch = () => {
  const currentPath = window.location.pathname
  const newPath = isZh.value 
    ? '/zh' + currentPath
    : currentPath.replace('/zh/', '/')
  router.go(newPath)
  show.value = false
}

const handleClose = () => {
  show.value = false
}
</script>

<template>
  <div v-if="show" class="vp-hint">
    <div class="vp-hint-content">
      <span>{{ isZh ? '是否切换到您更熟悉的语言？' : 'Switch to English version?' }}</span>
      <button class="vp-hint-switch" @click="handleSwitch">{{ isZh ? '切换' : 'Switch' }}</button>
      <button class="vp-hint-close" @click="handleClose" title="Close">×</button>
    </div>
  </div>
</template>

<style scoped>
.vp-hint {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99999;
}

.vp-hint-content {
  background: var(--vt-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  padding: 12px 40px 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  max-width: 400px;
  backdrop-filter: blur(8px);
}

.vp-hint-switch {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.vp-hint-switch:hover {
  background: var(--vp-c-brand-dark);
}

.vp-hint-close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.vp-hint-close:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .vp-hint {
    bottom: 10px;
    right: 10px;
    left: 10px;
  }
  
  .vp-hint-content {
    padding: 10px 36px 10px 12px;
    font-size: 13px;
  }
}
</style> 