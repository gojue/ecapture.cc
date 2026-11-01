<script setup lang="ts">
import { computed } from 'vue'
import CaptureDiagram from './CaptureDiagram.vue'
const props = defineProps<{ locale: 'en' | 'zh' }>()
const zh = computed(() => props.locale === 'zh')
const prefix = computed(() => zh.value ? '/zh' : '/en')
</script>
<template>
  <div class="ec-home-intro" :class="{ 'is-english': !zh }">
    <section class="ec-hero" aria-labelledby="ec-home-title">
      <div class="ec-hero-copy">
        <p class="ec-eyebrow hero-eyebrow">eBPF · Kernel-Level · Real-Time</p>
        <h1 id="ec-home-title" v-if="zh">让 TLS 明文<br><span>清晰可见。</span></h1>
        <h1 id="ec-home-title" v-else>See TLS<br><span>in plaintext.</span></h1>
        <p class="hero-description" v-if="zh">无需安装 CA 证书，无需修改目标程序。<br>在 TLS 库边界，实时捕获通信明文。</p>
        <p class="hero-description" v-else>Capture TLS plaintext at library boundaries.<br>No custom CA. No application changes.</p>
        <div class="hero-actions">
          <a class="ec-button primary" :href="`${prefix}/1-getting-started/`">{{ zh ? '开始使用' : 'Get started' }} <span aria-hidden="true">↗</span></a>
          <a class="ec-button" id="github_download" :href="`${prefix}/download/`"><span class="button-content">{{ zh ? '下载 eCapture' : 'Download' }}</span></a>
        </div>
        <p class="ec-eyebrow hero-platforms">OPEN SOURCE <span>/</span> LINUX + ANDROID</p>
      </div>
      <CaptureDiagram :zh="zh" />
    </section>
    <div class="ec-value-strip">
      <div class="ec-value">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M25 5H8v30h22V11Z M24 5v8h6M13 19h10M13 24h6"/><circle cx="28" cy="29" r="8"/><path d="m22 23 12 12"/></svg>
        <div><h2>{{ zh ? '无需自定义 CA' : 'No custom CA' }}</h2><p>{{ zh ? '不改应用，直接观察' : 'Observe without changing apps' }}</p></div>
      </div>
      <div class="ec-value">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="9" y="9" width="22" height="22" rx="2"/><path d="M14 3v6m6-6v6m6-6v6M14 31v6m6-6v6m6-6v6M3 14h6m-6 6h6m-6 6h6m22-12h6m-6 6h6m-6 6h6"/></svg>
        <div><h2>{{ zh ? '内核级捕获' : 'Kernel-level capture' }}</h2><p>{{ zh ? '基于 eBPF，深入运行现场' : 'Powered by eBPF probes' }}</p></div>
      </div>
      <div class="ec-value">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 20Q20 0 37 20Q20 40 3 20Z"/><circle cx="20" cy="20" r="5" fill="currentColor" stroke="none"/></svg>
        <div><h2>{{ zh ? '实时观察' : 'Real-time visibility' }}</h2><p>{{ zh ? '在 TLS 库边界获取明文' : 'Plaintext at TLS library boundaries' }}</p></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.ec-home-intro { max-width:1320px; padding:0 36px; margin:0 auto; }
.ec-hero { display:grid; grid-template-columns:.94fr 1.14fr; align-items:center; gap:22px; padding:54px 0 45px; }
.hero-eyebrow { font-size:12px; letter-spacing:.12em; margin:0 0 20px; }
.ec-hero h1 { font-size:clamp(48px,5.2vw,74px); line-height:1.18; font-weight:800; letter-spacing:-.055em; margin:0 0 24px; color:var(--ec-ink); }
.ec-hero h1 span { color:var(--ec-accent); }
.hero-description { font-size:17px; line-height:1.85; color:var(--ec-text); margin:0 0 28px; }
.hero-actions { display:flex; align-items:center; flex-wrap:wrap; gap:14px; }
.hero-platforms { margin:26px 0 0; font-size:10px; letter-spacing:.14em; }
.hero-platforms span { padding:0 12px; }
.ec-value-strip { display:grid; grid-template-columns:repeat(3,1fr); border-block:1px solid var(--ec-border); padding:26px 0; }
.ec-value { display:flex; align-items:center; gap:22px; padding:0 30px; }
.ec-value:first-child { padding-left:6px; }
.ec-value + .ec-value { border-left:1px solid var(--ec-border); }
.ec-value svg { width:42px; height:42px; flex:none; color:var(--ec-ink); }
.ec-value h2 { margin:0 0 5px; font-size:18px; font-weight:700; }
.ec-value p { margin:0; font-size:12px; color:var(--ec-muted); }
:deep(.docs-github-release-tag) { display:inline-block; margin-left:7px; color:var(--ec-muted); font-size:10px; }
@media(min-width:1440px) { .ec-hero { padding-top:65px; padding-bottom:60px; } }
@media(max-width:1050px) { .ec-hero { grid-template-columns:1fr 1.15fr; gap:8px; } .ec-hero h1 { font-size:54px; } .hero-description { font-size:14px; } .hero-actions { gap:10px; } .ec-button { padding:10px 17px; font-size:14px; } .ec-value { padding:0 18px; gap:14px; } .ec-value h2 { font-size:16px; } }
@media(max-width:760px) { .ec-home-intro { padding:0 24px; } .ec-hero { grid-template-columns:1fr; padding:46px 0 30px; gap:12px; } .ec-hero h1 { font-size:58px; } .hero-description { font-size:16px; } .hero-eyebrow { font-size:10px; } .capture-flow { max-width:620px; margin:0 auto; } .ec-value-strip { gap:20px; grid-template-columns:1fr; padding:24px 0; } .ec-value,.ec-value:first-child { padding:0; } .ec-value + .ec-value { border:0; } .ec-value svg { width:33px; height:33px; } .ec-value p { font-size:12px; } }
@media(max-width:380px) { .ec-home-intro { padding:0 20px; } .ec-hero h1 { font-size:50px; } .hero-description { font-size:14px; } }
</style>
