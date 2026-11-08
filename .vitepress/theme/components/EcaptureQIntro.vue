<script setup lang="ts">
import { computed } from 'vue'
import QRelationship from './QRelationship.vue'
import ReleaseBadge from './ReleaseBadge.vue'
const props = defineProps<{ locale: 'en' | 'zh' }>()
const zh = computed(() => props.locale === 'zh')
const prefix = computed(() => `/q/${props.locale}`)
</script>

<template>
  <section class="q-intro" aria-labelledby="q-intro-title">
    <div class="q-intro-copy">
      <p class="ec-eyebrow">{{ zh ? 'ECAPTUREQ / 消息分析界面' : 'ECAPTUREQ / MESSAGE ANALYSIS' }}</p>
      <h2 id="q-intro-title">eCaptureQ</h2>
      <p class="q-intro-lead">{{ zh ? '将 eCapture 采集到的网络消息，转化为可搜索、可关联、可查看的分析界面。' : 'Turn the network messages captured by eCapture into a searchable, correlated view you can inspect.' }}</p>
      <p>{{ zh ? 'eCapture 负责采集与解密；eCaptureQ 连接数据源，关联消息并展示。连接多个来源，在三栏界面中筛选进程、查看请求与响应，追溯上游提供的 TLS 信息。' : 'eCapture captures and decrypts. eCaptureQ connects to your sources, correlates messages and displays them. Bring multiple sources into a three-pane view to filter by process, inspect requests and responses, and read TLS metadata supplied upstream.' }}</p>
      <div class="q-edition-links">
        <a :href="`${prefix}/download/#desktop-packages`">{{ zh ? '桌面版' : 'Desktop' }} <span aria-hidden="true">↗</span></a>
        <span aria-hidden="true">/</span>
        <a :href="`${prefix}/download/#web-packages`">{{ zh ? '网页版' : 'Web' }} <span aria-hidden="true">↗</span></a>
        <span class="q-platforms">macOS · Windows · Linux</span>
      </div>
      <div class="q-intro-actions">
        <a class="ec-button primary" :href="`${prefix}/`">{{ zh ? '了解 eCaptureQ' : 'Explore eCaptureQ' }} <span aria-hidden="true">→</span></a>
        <a class="ec-button" :href="`${prefix}/download/`">{{ zh ? '下载 eCaptureQ' : 'Download eCaptureQ' }} <ReleaseBadge /></a>
      </div>
    </div>
    <QRelationship :locale="locale" />
  </section>
</template>

<style scoped>
.q-intro { display:grid; grid-template-columns:.9fr 1.25fr; align-items:center; gap:40px; max-width:1320px; margin:20px auto 44px; padding:38px 36px 42px; border-block:1px solid var(--ec-border); }
.q-intro .ec-eyebrow { margin:0 0 12px; }
.q-intro h2 { margin:0 0 16px; font-size:44px; letter-spacing:-.045em; font-weight:750; line-height:1.15; color:var(--ec-ink); }
.q-intro p { color:var(--ec-text); font-size:14px; line-height:1.85; margin:0 0 18px; }
.q-intro p.q-intro-lead { font-size:20px; line-height:1.65; color:var(--ec-ink); }
.q-edition-links { display:flex; gap:12px; align-items:center; flex-wrap:wrap; font-size:13px; margin:22px 0; }
.q-edition-links a { color:var(--ec-accent); font-weight:650; }
.q-edition-links a:hover { text-decoration:underline; text-underline-offset:4px; }
.q-platforms { flex-basis:100%; color:var(--ec-muted); font-size:11px; font-family:var(--vt-font-family-mono); }
.q-intro-actions { display:flex; flex-wrap:wrap; gap:12px; }
.q-intro-actions .ec-button { padding:11px 19px; font-size:14px; }
.q-intro :deep(.q-relationship) { margin:0; }
@media(max-width:1000px) { .q-intro { gap:26px; grid-template-columns:1fr 1.1fr; } .q-intro h2 { font-size:38px; } .q-intro p.q-intro-lead { font-size:18px; } }
@media(max-width:760px) { .q-intro { grid-template-columns:1fr; padding:30px 24px; gap:26px; margin-top:8px; } .q-intro h2 { font-size:38px; } .q-intro p.q-intro-lead { font-size:19px; } }
</style>
