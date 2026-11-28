<script setup lang="ts">
import type { CaptureExample } from './captureFlowData'
defineProps<{ zh: boolean; example: CaptureExample; context: string; note: string }>()
</script>
<template>
  <section class="capture-pipeline" :aria-label="zh ? '从采集事件到用户态解密与明文输出' : 'Captured events, user-space decryption and plaintext output'">
    <div class="pipeline-domain"><span class="event-entry">{{ zh ? '采集事件' : 'CAPTURE EVENTS' }}</span><span>eCapture</span></div>
    <div class="pipeline-distributor" aria-hidden="true"></div>
    <div class="pipeline-inputs"><span>{{ zh ? 'TLS 密钥' : 'TLS secrets' }}</span><b aria-hidden="true">+</b><span>{{ zh ? '网络报文' : 'Packets' }}</span></div>
    <div class="pipeline-merge" aria-hidden="true"></div>
    <div class="pipeline-decoder">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0m-4 8v3" /></svg>
      <div><span>{{ zh ? '用户态' : 'USER SPACE' }}</span><strong>{{ zh ? '解密 · 重建消息' : 'Decrypt & reassemble' }}</strong></div>
    </div>
    <div class="pipeline-arrow" aria-hidden="true"></div>
    <div class="capture-terminal" aria-live="polite" aria-atomic="true">
      <div class="capture-terminal-title"><span>{{ zh ? '明文预览' : 'PLAINTEXT' }}</span><span class="demo-label">{{ zh ? '示例' : 'DEMO' }}</span></div>
      <div class="preview-context">{{ context }}</div>
      <div class="preview-source">{{ example.application }} · {{ example.library }}<code>{{ example.probe }}</code></div>
      <pre><code><span class="terminal-success">{{ example.request }}</span>
Host: {{ example.host }}
<span v-if="example.probe === 'tls' && example.application === 'curl'">{{ example.header }}
</span>
<span class="terminal-success">{{ example.response }}</span><template v-if="example.application !== 'curl'">
{{ example.header }}</template></code></pre>
      <p class="preview-note">{{ note }}</p>
    </div>
    <p class="pipeline-footnote">{{ zh ? '交互示例，非实时捕获数据' : 'Illustrative examples, not live traffic' }}</p>
  </section>
</template>
<style scoped>
.capture-pipeline { min-width:0; color:var(--ec-ink); }
.pipeline-domain { display:flex; justify-content:space-between; gap:8px; margin:0 0 10px; color:var(--ec-muted); font:10px/1.5 var(--vt-font-family-mono); letter-spacing:.03em; }
.event-entry { color:var(--ec-accent); }
.pipeline-distributor { position:relative; height:12px; border-top:1px solid var(--ec-accent); }
.pipeline-distributor::before, .pipeline-distributor::after { content:''; position:absolute; top:0; height:12px; border-left:1px solid var(--ec-accent); }
.pipeline-distributor::before { left:24%; }
.pipeline-distributor::after { right:24%; }
.pipeline-inputs { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:6px; text-align:center; }
.pipeline-inputs > span { padding:8px 4px; border:1px solid var(--ec-wire); border-radius:5px; background:var(--ec-surface-raised); font-size:12px; white-space:nowrap; }
.pipeline-inputs b { color:var(--ec-accent); font-weight:400; }
.pipeline-merge { width:54%; height:17px; margin:auto; border:1px solid var(--ec-accent); border-top:0; border-radius:0 0 5px 5px; position:relative; }
.pipeline-merge::after { content:''; position:absolute; top:100%; left:50%; height:12px; border-left:1px solid var(--ec-accent); }
.pipeline-decoder { display:flex; align-items:center; justify-content:center; gap:9px; margin-top:12px; padding:12px 6px; border:1px solid var(--ec-accent); border-radius:7px; background:var(--ec-accent-soft); }
.pipeline-decoder svg { flex:none; width:23px; height:23px; fill:none; stroke:var(--ec-accent); stroke-width:1.4; stroke-linecap:round; }
.pipeline-decoder span { display:block; color:var(--ec-accent); font:9px/1.5 var(--vt-font-family-mono); letter-spacing:.08em; }
.pipeline-decoder strong { display:block; font-size:12px; line-height:1.7; font-weight:600; }
.pipeline-arrow { position:relative; margin:auto; height:23px; width:1px; background:var(--ec-accent); }
.pipeline-arrow::after { content:''; position:absolute; bottom:2px; left:-3px; width:7px; height:7px; border-right:1px solid var(--ec-accent); border-bottom:1px solid var(--ec-accent); transform:rotate(45deg); }
.capture-terminal { border:1px solid var(--ec-wire); border-radius:8px; background:var(--ec-surface-raised); box-shadow:var(--ec-shadow); overflow:hidden; }
.capture-terminal-title { display:flex; justify-content:space-between; align-items:center; gap:5px; padding:9px 12px; border-bottom:1px solid var(--ec-border); font:10px/1.4 var(--vt-font-family-mono); color:var(--ec-muted); letter-spacing:.04em; }
.demo-label { padding:3px 5px; border-radius:3px; background:var(--ec-yellow); color:#202326; font-size:8px; font-weight:700; }
.preview-context { padding:11px 12px 3px; color:var(--ec-ink); font-size:13px; font-weight:600; line-height:1.4; overflow-wrap:anywhere; }
.preview-source { display:flex; align-items:center; flex-wrap:wrap; gap:5px; padding:0 12px; font-size:10px; line-height:1.5; color:var(--ec-muted); }
.preview-source code { font-size:10px; color:var(--ec-accent); padding:1px 4px; border-radius:3px; background:var(--ec-accent-soft); }
.capture-terminal pre { margin:0; padding:12px; white-space:pre-wrap; overflow-wrap:anywhere; font:10px/1.7 var(--vt-font-family-mono); color:var(--ec-ink); }
.terminal-success { color:var(--ec-success); }
.preview-note { margin:0; padding:10px 12px; border-top:1px solid var(--ec-border); color:var(--ec-text); font-size:11px; line-height:1.6; }
.pipeline-footnote { margin:9px 0 0; color:var(--ec-muted); font-size:10px; line-height:1.5; }
@media(max-width:1050px) and (min-width:761px) {
  .pipeline-domain { font-size:9px; }
  .pipeline-inputs { gap:3px; }
  .pipeline-inputs > span { font-size:10px; }
  .pipeline-decoder { gap:5px; padding-inline:5px; }
  .pipeline-decoder strong { font-size:11px; }
  .pipeline-decoder svg { width:18px; }
}
@media(max-width:620px) {
  .pipeline-domain { font-size:11px; }
  .pipeline-inputs > span { font-size:14px; }
  .pipeline-decoder strong { font-size:16px; }
  .pipeline-decoder span, .pipeline-footnote { font-size:11px; }
  .preview-context { font-size:15px; }
  .preview-source, .preview-source code { font-size:12px; }
  .capture-terminal pre { font-size:12px; }
  .preview-note { font-size:13px; }
}
</style>
