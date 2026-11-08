<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ locale: 'en' | 'zh' }>()
const zh = computed(() => props.locale === 'zh')
</script>

<template>
  <figure class="q-relationship" :aria-label="zh ? 'eCapture 与 eCaptureQ 的消息流向' : 'Message flow from eCapture to eCaptureQ'">
    <figcaption class="q-flow-key">
      <div><strong>eCapture</strong><span>{{ zh ? '采集 · 终端文本' : 'Capture · terminal output' }}</span></div>
      <div><strong>eCaptureQ</strong><span>{{ zh ? '关联 · 图形化查看' : 'Correlate · visual inspection' }}</span></div>
    </figcaption>
    <div class="q-flow-art">
      <img src="/assets/q/terminal-to-interface-fine.webp" width="1752" height="897" loading="lazy" :alt="zh ? '概念示意图：左侧终端展示 eCapture 的文本采集结果；应用消息通过 --ecaptureq WebSocket 接口送到右侧 eCaptureQ，在图形界面中关联并查看消息及捕获的图片内容。' : 'Concept illustration: a terminal represents eCapture’s text capture output; application messages travel through the --ecaptureq WebSocket interface to eCaptureQ for correlation and visual inspection, including captured image content.'" />
    </div>
    <p class="q-flow-channel">{{ zh ? '应用消息' : 'Application messages' }} · <code>--ecaptureq</code> WebSocket</p>
  </figure>
</template>

<style scoped>
.q-relationship { width:100%; max-width:680px; min-width:0; margin:28px auto; }
.q-flow-key { display:grid; grid-template-columns:1fr 1fr; align-items:center; gap:16px; padding-bottom:18px; border-bottom:1px solid var(--ec-border); }
.q-flow-key > div:last-child { text-align:right; }
.q-flow-key strong { display:block; color:var(--ec-ink); font-size:20px; font-weight:700; line-height:1.4; letter-spacing:-.02em; }
.q-flow-key span { display:block; margin-top:3px; color:var(--ec-muted); font-size:12px; line-height:1.5; }
.q-flow-art { position:relative; margin-top:12px; }
.q-flow-art img { display:block; width:100%; height:auto; }
.q-flow-channel { margin:12px 0 0; color:var(--ec-muted); font-size:12px; line-height:1.6; text-align:center; }
.q-flow-channel code { font-size:inherit; }
@media(max-width:600px) {
  .q-relationship { margin:24px auto; }
  .q-flow-key { gap:10px; padding-bottom:12px; }
  .q-flow-key strong { font-size:18px; }
  .q-flow-key span, .q-flow-channel { font-size:11px; }
}
</style>
