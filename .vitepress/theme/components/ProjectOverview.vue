<script setup lang="ts">
import { computed } from 'vue'
import PlatformIcon from './PlatformIcon.vue'

const props = defineProps<{ locale: 'en' | 'zh' }>()

const translations = {
  en: {
    updateLabel: 'UPSTREAM v2.8 · OCTOBER 2026',
    updateTitle: 'LoongArch64 joins the Linux builds',
    updateBody: 'The v2.8 codebase also adds text, keylog and pcapng modes for GnuTLS and separates captured events from operational logs.',
    updateLink: 'Read the upstream changelog',
    capabilitiesLabel: 'CAPABILITIES',
    capabilitiesTitle: 'Three probes for TLS plaintext',
    capabilities: [
      {
        number: '01',
        title: 'TLS',
        body: 'Capture plaintext from OpenSSL, LibreSSL and BoringSSL at library boundaries. Point the probe at a shared library or a statically linked binary.',
        detail: 'OpenSSL · LibreSSL · BoringSSL'
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
        body: 'Capture GnuTLS plaintext and session keys with version-aware probes. The current module supports text, keylog and pcapng capture modes.',
        detail: 'GnuTLS · text · keylog · pcapng'
      }
    ],
    capabilitiesNote: 'All three modules support text, keylog and pcapng modes. --eventaddr routes captured events to stdout, files, TCP or WebSocket; operational logs use --logaddr.',
    startLabel: 'GET STARTED',
    startTitle: 'Start with a TLS capture',
    startBody: 'Use a published build for your system, or build from source. Run eCapture with root privileges or the required Linux capabilities, then make a TLS request in another terminal.',
    startNote: 'The default text mode writes captured events to stdout. Operational logs use stderr; --logaddr configures their separate destination.',
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
    platformNote: 'Android/loong64, Windows and macOS are not supported. Check published assets for a LoongArch64 package; its build path has cross-build and user-mode smoke checks, so verify eBPF capture on target hardware.',
    privileges: 'Minimum privileges',
    loongGuide: 'LoongArch64 build guide'
  },
  zh: {
    updateLabel: '主仓库 v2.8 · 2026 年 10 月',
    updateTitle: 'Linux 新增 LoongArch64 架构',
    updateBody: 'v2.8 代码还为 GnuTLS 增加文本、Keylog、PCAPNG 三种模式，并将捕获事件与程序运行日志分开。',
    updateLink: '查看主仓库更新记录',
    capabilitiesLabel: '核心能力',
    capabilitiesTitle: '三种 TLS 明文捕获模块',
    capabilities: [
      {
        number: '01',
        title: 'TLS',
        body: '在库函数边界捕获 OpenSSL、LibreSSL 和 BoringSSL 明文。可指定动态库路径，也可定位静态链接的目标程序。',
        detail: 'OpenSSL · LibreSSL · BoringSSL'
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
        body: '通过适配库版本的探针捕获 GnuTLS 明文与会话密钥。当前模块支持文本、Keylog 和 PCAPNG 三种模式。',
        detail: 'GnuTLS · text · keylog · pcapng'
      }
    ],
    capabilitiesNote: '三个模块均支持文本、Keylog 和 PCAPNG 模式。--eventaddr 将捕获事件送往 stdout、文件、TCP 或 WebSocket；程序运行日志由 --logaddr 单独配置。',
    startLabel: '快速开始',
    startTitle: '运行一次 TLS 捕获',
    startBody: '使用已发布的对应架构构建产物，或从源码编译。以 root 或所需 Linux capabilities 启动 eCapture，再从另一终端发起 TLS 请求。',
    startNote: '默认文本模式将捕获事件写到 stdout，程序日志写到 stderr；--logaddr 用于配置单独的日志目的端。',
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
    platformNote: '暂不支持 Android/loong64、Windows 和 macOS。下载前请核对发行页是否已有 LoongArch64 产物；构建流程包含交叉编译和用户态冒烟检查，eBPF 捕获仍应在目标硬件上验证。',
    privileges: '最小权限要求',
    loongGuide: 'LoongArch64 构建指南'
  }
}

const copy = computed(() => translations[props.locale])
const docsLink = computed(() => props.locale === 'zh' ? '/zh/2-getting-started/' : '/en/2-getting-started/')
const downloadLink = computed(() => props.locale === 'zh' ? '/zh/download/' : '/en/download/')
</script>

<template>
  <div class="project-overview">
    <section class="release-highlight" aria-labelledby="release-title">
      <div>
        <p class="eyebrow">{{ copy.updateLabel }}</p>
        <h2 id="release-title">{{ copy.updateTitle }}</h2>
        <p>{{ copy.updateBody }}</p>
      </div>
      <a href="https://github.com/gojue/ecapture/blob/master/CHANGELOG.md" target="_blank" rel="noopener noreferrer">
        {{ copy.updateLink }} <span aria-hidden="true">↗</span>
      </a>
    </section>

    <section class="overview-section" aria-labelledby="capabilities-title">
      <p class="eyebrow">{{ copy.capabilitiesLabel }}</p>
      <h2 id="capabilities-title">{{ copy.capabilitiesTitle }}</h2>
      <div class="capability-grid">
        <article v-for="item in copy.capabilities" :key="item.number" class="capability-card">
          <span class="card-number">{{ item.number }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
          <span class="card-detail">{{ item.detail }}</span>
        </article>
      </div>
      <p class="capabilities-note">{{ copy.capabilitiesNote }}</p>
    </section>

    <section class="overview-section start-section" aria-labelledby="start-title">
      <div class="start-copy">
        <p class="eyebrow">{{ copy.startLabel }}</p>
        <h2 id="start-title">{{ copy.startTitle }}</h2>
        <p>{{ copy.startBody }}</p>
        <div class="section-actions">
          <a class="primary-link" :href="downloadLink">{{ copy.download }} →</a>
          <a :href="docsLink">{{ copy.guide }} →</a>
        </div>
      </div>
      <div class="terminal-example">
        <div class="terminal-top"><span></span><span></span><span></span><strong>terminal</strong></div>
        <pre><code>{{ copy.terminalExample }}</code></pre>
        <p>{{ copy.startNote }}</p>
      </div>
    </section>

    <section class="overview-section" aria-labelledby="platforms-title">
      <p class="eyebrow">{{ copy.platformsLabel }}</p>
      <h2 id="platforms-title">{{ copy.platformsTitle }}</h2>
      <div class="platform-table-wrap">
        <table class="platform-table">
          <thead>
            <tr>
              <th scope="col">{{ copy.system }}</th>
              <th scope="col">{{ copy.architecture }}</th>
              <th scope="col">{{ copy.kernel }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(platform, index) in copy.platforms" :key="index">
              <td><span class="platform-cell"><PlatformIcon :kind="platform.system === 'Android' ? 'android' : 'linux'" />{{ platform.system }}</span></td>
              <td><span class="platform-cell"><PlatformIcon v-if="platform.architecture.includes('LoongArch')" kind="loongarch" />{{ platform.architecture }}</span></td>
              <td>{{ platform.kernel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="platform-note">{{ copy.platformNote }}</p>
      <a class="text-link" href="https://github.com/gojue/ecapture/blob/master/docs/minimum-privileges.md" target="_blank" rel="noopener noreferrer">
        {{ copy.privileges }} ↗
      </a>
      <a class="text-link guide-link" href="https://github.com/gojue/ecapture/blob/master/docs/loong64-support.md" target="_blank" rel="noopener noreferrer">
        {{ copy.loongGuide }} ↗
      </a>
    </section>
  </div>
</template>

<style scoped>
.project-overview {
  max-width: 1180px;
  margin: 0 auto;
  padding: 8px 32px 64px;
  color: var(--vp-c-text-1);
}

.project-overview a {
  text-decoration: none;
  font-weight: 600;
}

.release-highlight {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
  padding: 30px 36px;
  border: 1px solid rgba(67, 170, 139, 0.35);
  border-radius: 20px;
  background: linear-gradient(120deg, rgba(67, 170, 139, 0.16), rgba(144, 190, 109, 0.08));
}

.release-highlight h2,
.overview-section h2 {
  margin: 0 0 14px;
  border: 0;
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.2;
}

.release-highlight p:last-child,
.overview-section p {
  line-height: 1.7;
}

.release-highlight > div > p:last-child {
  max-width: 720px;
  margin-bottom: 0;
}

.release-highlight > a {
  flex-shrink: 0;
  color: var(--ec-c-teal);
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--ec-c-teal);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.overview-section {
  padding-top: 84px;
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.capability-card {
  display: flex;
  flex-direction: column;
  min-height: 290px;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
}

.card-number {
  color: var(--ec-c-teal);
  font-size: 13px;
  font-weight: 700;
}

.capability-card h3 {
  margin: 18px 0 8px;
  font-size: 22px;
}

.capability-card p {
  margin: 0 0 24px;
  color: var(--vp-c-text-2);
}

.card-detail {
  margin-top: auto;
  color: var(--ec-c-teal);
  font-size: 13px;
  font-weight: 600;
}

.capabilities-note {
  max-width: 840px;
  margin: 22px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
}

.start-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
}

.start-copy > p:not(.eyebrow) {
  color: var(--vp-c-text-2);
}

.section-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  margin-top: 28px;
}

.section-actions a,
.text-link {
  color: var(--ec-c-teal);
}

.section-actions .primary-link {
  padding: 11px 18px;
  border-radius: 10px;
  background: var(--ec-c-teal);
  color: #fff;
}

.terminal-example {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: #14231f;
  color: #e8f5ec;
  box-shadow: 0 18px 48px rgba(10, 24, 18, 0.16);
}

.terminal-top {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-top span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #f8961e;
}

.terminal-top span:nth-child(2) { background: #f9c74f; }
.terminal-top span:nth-child(3) { background: #90be6d; }

.terminal-top strong {
  margin-left: auto;
  color: #a8b8ae;
  font-size: 12px;
}

.terminal-example pre {
  margin: 0;
  padding: 24px;
  overflow-x: auto;
  font-size: 15px;
  line-height: 1.8;
}

.terminal-example p {
  margin: 0;
  padding: 0 24px 24px;
  color: #b8d0bf;
  font-size: 13px;
}

.platform-table-wrap {
  overflow-x: auto;
  margin-top: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
}

.platform-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
  background: var(--vp-c-bg-soft);
}

.platform-table th,
.platform-table td {
  padding: 15px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
}

.platform-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.platform-table tr:last-child td {
  border-bottom: 0;
}

.platform-table th {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.platform-note {
  margin: 18px 0 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.guide-link {
  display: inline-block;
  margin-left: 20px;
}

@media (max-width: 600px) {
  .guide-link {
    margin-left: 0;
    margin-top: 10px;
  }
}

@media (max-width: 800px) {
  .release-highlight {
    align-items: start;
    flex-direction: column;
  }

  .capability-grid,
  .start-section {
    grid-template-columns: 1fr;
  }

  .capability-card {
    min-height: 0;
  }
}

@media (max-width: 600px) {
  .project-overview {
    padding: 8px 20px 48px;
  }

  .release-highlight {
    padding: 24px;
  }

  .overview-section {
    padding-top: 64px;
  }
}
</style>
