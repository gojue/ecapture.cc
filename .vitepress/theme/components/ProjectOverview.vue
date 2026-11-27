<script setup lang="ts">
import { computed } from 'vue'
import PlatformIcon from './PlatformIcon.vue'

const props = defineProps<{ locale: 'en' | 'zh' }>()

const translations = {
  en: {
    updateLabel: 'v2.12.0 · NOVEMBER 2026',
    updateTitle: 'Stream capture records to eCaptureQ v1.2.0',
    updateLink: 'Read the upstream changelog',
    capabilitiesLabel: 'CAPABILITIES',
    capabilitiesTitle: 'Three probes. One clear view.',
    capabilities: [
      {
        number: '01',
        title: 'TLS',
        body: 'Read HTTPS requests and responses from applications using OpenSSL or BoringSSL. Use --libssl when your application uses a different library from the system default.',
        detail: 'OpenSSL · BoringSSL'
      },
      {
        number: '02',
        title: 'GoTLS',
        body: 'Inspect TLS traffic from Go programs. Use --elfpath to select the target executable so eCapture can resolve its Go TLS symbols.',
        detail: 'Go TLS · executable path'
      },
      {
        number: '03',
        title: 'GnuTLS',
        body: 'Inspect Linux applications linked to GnuTLS. The probe selects a layout for the installed library version to capture the TLS secrets needed for decryption.',
        detail: 'GnuTLS · text · keylog · pcapng'
      }
    ],
    capabilitiesNote: 'All three probes reconstruct HTTP messages from packets and TLS secrets by default. Use --output capture.jsonl to save structured records or --pcapfile capture.pcapng to save packets and secrets for Wireshark.',
    startLabel: 'GET STARTED',
    startTitle: 'Start with a TLS capture',
    startBody: 'Run eCapture on a supported Linux host. Once the probe attaches, use an OpenSSL-linked curl in the second terminal. The first terminal shows runtime logs and decoded messages.',
    terminalExample: '$ sudo ecapture tls\n\n# In another terminal\n$ curl https://example.com',
    download: 'Download releases',
    guide: 'Read the getting started guide',
    platformsLabel: 'PLATFORMS',
    platformsTitle: 'Choose the right build and kernel',
    system: 'System',
    architecture: 'Architecture',
    kernel: 'Minimum kernel',
    platforms: [
      { system: 'Linux', architecture: 'x86_64 / amd64', kernel: '4.18+' },
      { system: 'Linux', architecture: 'AArch64 / arm64', kernel: '5.5+' },
      { system: 'Linux', architecture: 'LoongArch64 / loong64', kernel: '6.6+' },
      { system: 'Android', architecture: 'x86_64 / amd64', kernel: '4.18+' },
      { system: 'Android', architecture: 'AArch64 / arm64', kernel: '5.5+' }
    ],
    platformNote: 'Linux LoongArch64 releases include archive and Debian packages. The upstream test suite also exercises OpenSSL and GoTLS on native LoongArch hardware.',
    privileges: 'Minimum privileges',
    loongGuide: 'LoongArch64 build guide'
  },
  zh: {
    updateLabel: 'v2.12.0 · 2026 年 11 月',
    updateTitle: '通过订阅接口将捕获记录发送至 eCaptureQ v1.2.0',
    updateLink: '查看主仓库更新记录',
    capabilitiesLabel: '核心能力',
    capabilitiesTitle: '三种模块，同一份清晰。',
    capabilities: [
      {
        number: '01',
        title: 'TLS',
        body: '查看 OpenSSL 或 BoringSSL 应用的 HTTPS 请求与响应。如果应用加载的库与系统默认版本不同，可用 --libssl 指定实际库路径。',
        detail: 'OpenSSL · BoringSSL'
      },
      {
        number: '02',
        title: 'GoTLS',
        body: '观察 Go 程序的 TLS 通信。通过 --elfpath 指定目标可执行文件，供 eCapture 解析 Go TLS 符号。',
        detail: 'Go TLS · 可执行文件路径'
      },
      {
        number: '03',
        title: 'GnuTLS',
        body: '检查 Linux 上链接 GnuTLS 的应用。探针依据实际库版本选择匹配的内存布局，获取解密所需的 TLS 会话密钥。',
        detail: 'GnuTLS · text · keylog · pcapng'
      }
    ],
    capabilitiesNote: '三个探针默认结合数据包和 TLS 密钥重建 HTTP 消息。用 --output capture.jsonl 保存结构化记录，用 --pcapfile capture.pcapng 保存数据包和密钥供 Wireshark 分析。',
    startLabel: '快速开始',
    startTitle: '运行一次 TLS 捕获',
    startBody: '在受支持的 Linux 主机上运行 eCapture。探针就绪后，在另一终端用链接 OpenSSL 的 curl 发起请求，即可在第一个终端看到运行日志和解码后的消息。',
    terminalExample: '$ sudo ecapture tls\n\n# 在另一终端\n$ curl https://example.com',
    download: '下载发行版',
    guide: '阅读快速上手',
    platformsLabel: '平台支持',
    platformsTitle: '选择匹配的架构与内核',
    system: '系统',
    architecture: '架构',
    kernel: '最低内核',
    platforms: [
      { system: 'Linux', architecture: 'x86_64 / amd64', kernel: '4.18+' },
      { system: 'Linux', architecture: 'AArch64 / arm64', kernel: '5.5+' },
      { system: 'Linux', architecture: 'LoongArch64 / loong64', kernel: '6.6+' },
      { system: 'Android', architecture: 'x86_64 / amd64', kernel: '4.18+' },
      { system: 'Android', architecture: 'AArch64 / arm64', kernel: '5.5+' }
    ],
    platformNote: 'Linux LoongArch64 提供压缩包和 Debian 软件包。上游测试也在原生 LoongArch 硬件上验证 OpenSSL 和 GoTLS 捕获。',
    privileges: '最小权限要求',
    loongGuide: 'LoongArch64 构建指南'
  }
}

const copy = computed(() => translations[props.locale])
const docsLink = computed(() => props.locale === 'zh' ? '/zh/1-getting-started/' : '/en/1-getting-started/')
const downloadLink = computed(() => props.locale === 'zh' ? '/zh/download/' : '/en/download/')
</script>


<template>
  <div class="project-overview">
    <section class="overview-section" aria-labelledby="capabilities-title">
      <div class="section-heading"><div><p class="ec-eyebrow">01 / {{ copy.capabilitiesLabel }}</p><h2 id="capabilities-title">{{ copy.capabilitiesTitle }}</h2></div><a class="ec-text-link" :href="`/${locale}/2-core-tls-modules/`">{{ locale === 'zh' ? '探索核心能力' : 'Explore the probes' }} ↗</a></div>
      <div class="capability-grid">
        <article v-for="(item,index) in copy.capabilities" :key="item.number" class="capability-card">
          <span class="card-number">{{ item.number }}</span><h3>{{ item.title }}</h3><p class="card-detail">{{ item.detail }}</p>
          <div class="module-flow" aria-hidden="true"><span class="flow-app">{{ index === 1 ? 'Go APP' : 'APP' }}</span><span class="flow-arrow">→</span><span class="flow-library">{{ ['OpenSSL  /  BoringSSL', 'crypto/tls', 'GnuTLS'][index] }}</span><span class="flow-arrow accent">→</span><svg viewBox="0 0 26 34" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 1h14l7 7v25H3ZM17 1v8h7M7 15h12M7 20h12M7 25h9"/></svg></div>
          <p class="card-description">{{ item.body }}</p>
        </article>
      </div>
      <p class="capabilities-note">{{ copy.capabilitiesNote }}</p>
    </section>
    <section class="start-section" aria-labelledby="start-title">
      <div class="start-copy"><p class="ec-eyebrow">QUICKSTART</p><h2 id="start-title">{{ locale === 'zh' ? '从一次捕获开始。' : 'Start with a capture.' }}</h2><a class="ec-text-link" :href="docsLink">{{ copy.guide }} →</a></div>
      <div class="terminal-example"><pre><code><span class="prompt">$ </span><span class="command">sudo ecapture tls</span></code></pre><div class="second-terminal"><pre><code><span class="prompt">$ </span>curl https://example.com</code></pre><span>{{ locale === 'zh' ? '在另一终端' : 'In another terminal' }}</span></div></div>
    </section>
    <p class="start-note">{{ copy.startBody }}</p>
    <details class="platform-details">
      <summary><span>{{ copy.platformsTitle }}</span><span class="platform-summary">Linux · Android <span aria-hidden="true">＋</span></span></summary>
      <div class="platform-content"><div class="platform-table-wrap"><table><thead><tr><th>{{ copy.system }}</th><th>{{ copy.architecture }}</th><th>{{ copy.kernel }}</th></tr></thead><tbody><tr v-for="(platform,index) in copy.platforms" :key="index"><td><span class="platform-cell"><PlatformIcon :kind="platform.system === 'Android' ? 'android' : 'linux'" />{{ platform.system }}</span></td><td>{{ platform.architecture }}</td><td>{{ platform.kernel }}</td></tr></tbody></table></div><p>{{ copy.platformNote }}</p><a class="ec-text-link" :href="docsLink + '1.1-requirements-and-installation'">{{ copy.privileges }} →</a><a class="ec-text-link guide-link" href="https://github.com/gojue/ecapture/blob/master/docs/loong64-support.md" target="_blank" rel="noopener noreferrer">{{ copy.loongGuide }} ↗</a></div>
    </details>
    <div class="release-highlight"><p><span class="ec-eyebrow">{{ copy.updateLabel }}</span><strong>{{ copy.updateTitle }}</strong></p><a class="ec-text-link" href="https://github.com/gojue/ecapture/blob/master/CHANGELOG.md" target="_blank" rel="noopener noreferrer">{{ copy.updateLink }} ↗</a></div>
  </div>
</template>
<style scoped>
.project-overview { max-width:1320px; margin:0 auto; padding:0 36px; }
.overview-section { padding:34px 0 26px; }
.section-heading { display:flex; justify-content:space-between; align-items:end; gap:20px; margin-bottom:28px; }
.ec-eyebrow { margin:0 0 9px; }
h2 { font-size:32px; line-height:1.3; letter-spacing:-.035em; font-weight:750; margin:0; color:var(--ec-ink); }
.capability-grid { display:grid; grid-template-columns:repeat(3,1fr); }
.capability-card { padding:0 30px; min-width:0; }
.capability-card:first-child { padding-left:0; }
.capability-card:last-child { padding-right:0; }
.capability-card + .capability-card { border-left:1px solid var(--ec-border); }
.card-number { font:11px var(--vt-font-family-mono); color:var(--ec-muted); }
h3 { font-size:35px; font-weight:750; letter-spacing:-.04em; margin:4px 0; }
.card-detail { font:11px/1.7 var(--vt-font-family-mono); color:var(--ec-muted); min-height:38px; }
.module-flow { display:flex; align-items:center; justify-content:space-between; gap:8px; min-height:100px; font:10px var(--vt-font-family-mono); color:var(--ec-text); }
.flow-app { border:1px solid var(--ec-wire); padding:15px 8px; background:var(--ec-surface); }
.flow-library { padding:18px 9px; border:1px dashed var(--ec-accent); border-radius:4px; text-align:center; }
.flow-arrow { font-size:23px; }
.flow-arrow.accent { color:var(--ec-accent); }
.module-flow svg { width:23px; height:32px; flex:none; }
.card-description { margin:4px 0 0; font-size:13px; line-height:1.85; color:var(--ec-text); }
.capabilities-note { color:var(--ec-muted); font-size:11px; line-height:1.8; margin:20px 0 0; }
.start-section { display:grid; grid-template-columns: .85fr 1.4fr; gap:35px; padding:25px; border:1px solid var(--ec-border); border-radius:6px; background:var(--ec-surface); }
.start-copy { border-right:1px solid var(--ec-border); }
.start-copy h2 { margin:0 0 12px; }
.terminal-example { border:1px solid var(--ec-border); border-radius:5px; background:var(--ec-bg); align-self:center; min-width:0; }
.terminal-example pre { margin:0; padding:12px 16px; font:13px/1.6 var(--vt-font-family-mono); overflow:auto; }
.prompt { color:var(--ec-muted); }
.command { color:var(--ec-accent); }
.second-terminal { border-top:1px solid var(--ec-border); display:flex; align-items:center; justify-content:space-between; gap:8px; }
.second-terminal span:not(.prompt) { font-size:10px; color:var(--ec-muted); padding-right:12px; flex-shrink:0; }
.start-note { font-size:11px; line-height:1.8; color:var(--ec-muted); margin:12px 0 25px; }
.platform-details { border-block:1px solid var(--ec-border); }
.platform-details summary { display:flex; justify-content:space-between; gap:16px; cursor:pointer; padding:20px 0; font-size:14px; font-weight:600; list-style:none; }
.platform-details summary::-webkit-details-marker { display:none; }
.platform-summary { font:11px/1.5 var(--vt-font-family-mono); color:var(--ec-muted); }
.platform-summary span { color:var(--ec-accent); margin-left:20px; }
.platform-details[open] .platform-summary span { display:inline-block; transform:rotate(45deg); }
.platform-content { padding:0 0 24px; font-size:13px; color:var(--ec-text); line-height:1.8; }
.platform-table-wrap { overflow-x:auto; }
table { border-collapse:collapse; width:100%; text-align:left; }
th,td { padding:10px 14px; border-bottom:1px solid var(--ec-border); white-space:nowrap; }
th { background:var(--ec-surface); color:var(--ec-ink); }
.platform-cell { display:flex; align-items:center; gap:8px; }
.guide-link { margin-left:24px; }
.release-highlight { display:flex; justify-content:space-between; align-items:center; gap:20px; padding:22px 0; }
.release-highlight p { margin:0; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.release-highlight .ec-eyebrow { margin:0; font-size:9px; }
.release-highlight strong { font-size:12px; font-weight:500; color:var(--ec-text); }
.release-highlight a { font-size:11px; }
@media(max-width:1000px) { .capability-card { padding:0 20px; } .flow-library { padding:16px 6px; font-size:9px; } .module-flow { gap:4px; } .second-terminal span:not(.prompt) { display:none; } h2 { font-size:28px; } }
@media(max-width:760px) { .project-overview { padding:0 24px; } .section-heading { align-items:start; flex-direction:column; gap:12px; } .capability-grid { grid-template-columns:1fr; } .capability-card,.capability-card:first-child,.capability-card:last-child { padding:24px 0; } .capability-card + .capability-card { border-left:0; border-top:1px solid var(--ec-border); } .card-detail { min-height:0; } .module-flow { max-width:330px; justify-content:flex-start; gap:18px; } .start-section { grid-template-columns:1fr; gap:20px; padding:22px; } .start-copy { border:0; } .start-copy h2 { font-size:28px; } .release-highlight { align-items:start; flex-direction:column; gap:12px; } .platform-summary { flex-shrink:0; } }
</style>
