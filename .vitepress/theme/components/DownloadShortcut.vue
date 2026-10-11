<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isChinese = computed(() => route.path === '/zh' || route.path.startsWith('/zh/'))
const label = computed(() => isChinese.value ? '下载' : 'Download')
const destination = computed(() => isChinese.value ? '/zh/download/' : '/en/download/')
</script>

<template>
  <a class="download-shortcut" :href="destination" :aria-label="label" :title="label">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
    </svg>
    <span>{{ label }}</span>
  </a>
</template>

<style scoped>
.download-shortcut {
  position: fixed;
  right: 20px;
  bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  z-index: 20;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: 999px;
  background: #17614f;
  box-shadow: 0 6px 20px rgba(20, 78, 62, 0.25);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.download-shortcut:hover {
  background: #0f503f;
  box-shadow: 0 8px 24px rgba(20, 78, 62, 0.32);
  transform: translateY(-2px);
}

.download-shortcut:focus-visible {
  outline: 3px solid var(--ec-c-yellow);
  outline-offset: 3px;
}

.download-shortcut svg {
  width: 18px;
  height: 18px;
  flex: none;
}

@media (max-width: 640px) {
  .download-shortcut {
    right: 12px;
    bottom: calc(88px + env(safe-area-inset-bottom, 0px));
    width: 48px;
    min-height: 48px;
    padding: 0;
  }

  .download-shortcut span {
    display: none;
  }

  .download-shortcut svg {
    width: 21px;
    height: 21px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .download-shortcut {
    transition: none;
  }
}
</style>
