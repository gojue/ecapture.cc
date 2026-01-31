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
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 8px rgba(67, 170, 139, 0.3));
}

.logo:hover {
  transform: rotate(360deg) scale(1.1);
  filter: drop-shadow(0 0 12px rgba(67, 170, 139, 0.6));
}

.text {
  background: linear-gradient(135deg, var(--ec-c-teal) 0%, var(--ec-c-green) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  transition: all 0.3s ease;
}

.dark .text {
  background: linear-gradient(135deg, #5cd0ae 0%, #a8d88f 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.github-stars {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 12px;
  padding: 4px 10px;
  background: var(--ec-c-teal-mute);
  border-radius: 12px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(67, 170, 139, 0.2);
  position: relative;
  overflow: hidden;
}

.dark .github-stars {
  background: rgba(92, 208, 174, 0.08);
  border-color: rgba(92, 208, 174, 0.3);
}

.github-stars::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(67, 170, 139, 0.3), transparent);
  transition: left 0.5s ease;
}

.github-stars:hover::before {
  left: 100%;
}

.github-stars:hover {
  background: var(--ec-c-teal-soft);
  border-color: var(--ec-c-teal);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 170, 139, 0.3);
}

.dark .github-stars:hover {
  background: rgba(92, 208, 174, 0.15);
  border-color: #5cd0ae;
  box-shadow: 0 4px 12px rgba(92, 208, 174, 0.4);
}

.star-icon {
  color: #F9C74F;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.github-stars:hover .star-icon {
  transform: rotate(72deg) scale(1.2);
}

.star-count {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
