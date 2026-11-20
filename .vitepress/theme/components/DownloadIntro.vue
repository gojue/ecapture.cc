<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ product: 'ecapture' | 'ecaptureQ'; locale: 'en' | 'zh' }>()
const isQ = computed(() => props.product === 'ecaptureQ')
const zh = computed(() => props.locale === 'zh')
const caption = computed(() => isQ.value
  ? zh.value ? '图形界面 · 桌面版 / Web 版' : 'Graphical interface · Desktop / Web'
  : zh.value ? '命令行工具 · 终端查看 / 文件输出' : 'Command-line tool · Terminal / File output')
</script>

<template>
  <section class="download-intro" :aria-label="isQ ? 'eCaptureQ' : 'eCapture'">
    <div class="download-intro-copy"><slot /></div>
    <figure>
      <img
        :src="isQ ? '/assets/products/ecaptureq-interface.png' : '/assets/products/ecapture-terminal.png'"
        :width="isQ ? 1752 : 1448"
        :height="isQ ? 897 : 1086"
        :alt="isQ
          ? zh ? 'eCaptureQ 图形界面示意：筛选、消息列表和详情面板。' : 'eCaptureQ interface illustration with filters, a message list and a details pane.'
          : zh ? 'eCapture 命令行示意：终端显示 TLS 请求与响应明文。' : 'eCapture command-line illustration showing TLS request and response plaintext in a terminal.'"
      />
      <figcaption>{{ caption }}</figcaption>
    </figure>
  </section>
</template>

<style scoped>
.download-intro { display:grid; grid-template-columns:minmax(0, 1.15fr) minmax(0, 1fr); align-items:center; gap:24px; margin:24px 0 28px; padding-bottom:24px; border-bottom:1px solid var(--ec-border); }
.download-intro-copy :deep(p:first-child) { margin-top:0; }
.download-intro-copy :deep(p:last-child) { margin-bottom:0; }
figure { min-width:0; margin:0; }
img { display:block; width:100%; height:auto; }
figcaption { margin-top:12px; color:var(--ec-muted); font-size:14px; line-height:1.6; text-align:center; }
@media(max-width:639px) {
  .download-intro { grid-template-columns:1fr; gap:20px; }
  figure { width:100%; max-width:360px; margin-inline:auto; }
}
</style>
