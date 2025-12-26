<template>
  <img class="logo" src="../../public/logo-300x300-v2.svg"  alt="eCapture Logo"/>
  <span class="text">eCapture(旁观者)</span>
  <a v-if="stars !== null" href="https://github.com/gojue/ecapture" target="_blank" class="github-stars">
    <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
    </svg>
    <span class="star-count">{{ formatStars(stars) }}</span>
  </a>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vitepress';

const stars = ref<number | null>(null);
const route = useRoute();

// 检测是否为中文页面 - 使用 VitePress 路由，响应式更新
const isZhPage = computed(() => {
  return route.path.includes('/zh/');
});

onMounted(async () => {
  try {
    const response = await fetch('https://api.github.com/repos/gojue/ecapture');
    if (response.ok) {
      const data = await response.json();
      stars.value = data.stargazers_count;
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error);
  }
});

const formatStars = (count: number | null) => {
  if (count === null) return '';

  // 中文页面使用"万"进制
  if (isZhPage.value) {
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '万';
    }
    return count.toString();
  }

  // 英文页面使用"k"进制
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};
</script>

<style scoped>
.logo {
  width: 32px;
  margin-right: 8px;
}

.github-stars {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 12px;
  padding: 4px 10px;
  background-color: var(--vt-c-bg-mute);
  border-radius: 12px;
  text-decoration: none;
  color: var(--vt-c-text-1);
  transition: all 0.25s ease;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--vt-c-divider);
}

.github-stars:hover {
  background-color: var(--vt-c-gray-light-4);
  border-color: var(--vt-c-brand);
  transform: translateY(-1px);
}

.dark .github-stars:hover {
  background-color: var(--vt-c-gray-dark-3);
}

.star-icon {
  color: #f1c40f;
  flex-shrink: 0;
}

.star-count {
  font-weight: 600;
  color: var(--vt-c-text-1);
}
</style>
