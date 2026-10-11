<script setup lang="ts">
defineProps<{ kind: 'linux' | 'android' | 'loongarch' }>()
</script>

<template>
  <svg v-if="kind === 'linux'" class="platform-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none">
    <ellipse cx="12" cy="13" rx="7" ry="9" fill="currentColor" />
    <ellipse cx="12" cy="15" rx="4.4" ry="5.4" fill="var(--vp-c-bg)" />
    <circle cx="9.8" cy="7.8" r="0.75" fill="var(--vp-c-bg)" />
    <circle cx="14.2" cy="7.8" r="0.75" fill="var(--vp-c-bg)" />
    <path d="m10 10.2 2 1.5 2-1.5-2-.6-2 .6Z" fill="#d9904e" />
    <path d="M5.5 21.2c2.2-1.4 4.2-1.5 6.1-.5M12.4 20.7c2-1 4-.9 6.1.5" stroke="#d9904e" stroke-width="1.7" stroke-linecap="round" />
  </svg>
  <svg v-else-if="kind === 'android'" class="platform-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none">
    <path d="m6.5 3.5 2 2.7M17.5 3.5l-2 2.7M4.5 11a7.5 7.5 0 0 1 15 0v1h-15v-1ZM5 13h14v4.2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V13Z" fill="currentColor" />
    <path d="M8 19v2M16 19v2M3 13.5v4M21 13.5v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    <circle cx="9" cy="9" r="0.75" fill="var(--vp-c-bg)" />
    <circle cx="15" cy="9" r="0.75" fill="var(--vp-c-bg)" />
  </svg>
  <svg v-else class="platform-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none">
    <rect x="5" y="5" width="14" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <text x="12" y="14.8" text-anchor="middle" font-size="6.7" font-weight="700" fill="currentColor">LA</text>
  </svg>
</template>

<style scoped>
.platform-icon {
  width: 19px;
  height: 19px;
  flex: none;
  vertical-align: middle;
}
</style>
