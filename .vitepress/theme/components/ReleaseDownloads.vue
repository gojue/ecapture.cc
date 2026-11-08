<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import { marked } from 'marked'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { loadReleases, type Release, type ReleaseProduct } from '../../githubReleases'
import { isChinesePath } from './localePath'
import DownloadAssets from './DownloadAssets.vue'
import type { DownloadAsset } from '../../downloads'

const props = withDefaults(defineProps<{ product?: ReleaseProduct }>(), { product: 'ecapture' })
const releasePage = computed(() => `https://github.com/gojue/${props.product}/releases`)
const isQ = computed(() => props.product === 'ecaptureQ')
const { page } = useData()
const zh = computed(() => isChinesePath('/' + page.value.relativePath))
const releases = ref<Release[]>([])
const loading = ref(true)
const releaseId = (tag: string) => 'release-' + tag.replace(/[^a-zA-Z0-9_-]/g, '-')
const date = (value: string) => new Date(value).toLocaleDateString(zh.value ? 'zh-CN' : 'en-US')
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))
// Release descriptions are remote Markdown: render text, never raw HTML.
const renderer = new marked.Renderer()
renderer.html = ({ text }) => escapeHtml(text)
renderer.link = function ({ href, tokens }) {
  const safe = sanitizeUrl(href)
  const text = this.parser.parseInline(tokens)
  return /^https?:\/\//.test(safe) ? `<a href="${escapeHtml(safe)}" rel="noopener noreferrer">${text}</a>` : text
}
function assetGroups(assets: DownloadAsset[]) {
  const groups = [
    { id: 'desktop-packages', title: zh.value ? '桌面版安装包' : 'Desktop packages', assets: [] as DownloadAsset[] },
    { id: 'web-packages', title: zh.value ? 'Web 版安装包' : 'Web packages', assets: [] as DownloadAsset[] },
    { id: 'checksums', title: zh.value ? '校验文件' : 'Checksums', assets: [] as DownloadAsset[] },
    { id: 'other-assets', title: zh.value ? '其他发布附件' : 'Other release assets', assets: [] as DownloadAsset[] },
  ]
  for (const asset of assets) {
    const group = /^(?:sha\d+sum|checksum)/i.test(asset.name) || /\.(?:sha256|sha512|sig)$/i.test(asset.name) ? 2
      : /^ecaptureq-web-/.test(asset.name) ? 1
      : /^ecaptureq-\d/.test(asset.name) ? 0 : 3
    groups[group].assets.push(asset)
  }
  return groups.filter(group => group.assets.length)
}
const notes = computed(() => marked.parse(releases.value[0]?.body || '', { renderer, async: false }))
let controller: AbortController | undefined
async function reloadReleases() {
  controller?.abort()
  const request = new AbortController()
  controller = request
  loading.value = true
  const data = await loadReleases(zh.value, request.signal, props.product)
  if (request.signal.aborted) return
  releases.value = data
  loading.value = false
  await nextTick()
  // A stale release hash can disappear when CDN and GitHub snapshots differ.
  const hash = window.location.hash
  if (/^#(?:latest|downloads|history|release-[a-zA-Z0-9_-]+|desktop-packages|web-packages|checksums|other-assets)$/.test(hash) && !document.getElementById(hash.slice(1))) {
    history.replaceState(history.state, '', location.pathname + location.search)
    window.scrollTo(0, 0)
  }
}
onMounted(reloadReleases)
onUnmounted(() => controller?.abort())
</script>

<template>
  <div class="releases-container" :aria-busy="loading">
    <p v-if="loading" role="status">{{ zh ? '加载版本数据中…' : 'Loading releases…' }}</p>
    <template v-else-if="releases.length">
      <h2 id="latest" data-ec-outline tabindex="-1">{{ zh ? '最新版本' : 'Latest version' }} ({{ releases[0].tag_name }})</h2>
      <p><a :href="`${releasePage}/tag/${encodeURIComponent(releases[0].tag_name)}`">{{ zh ? '官方发布页' : 'Official release' }} ↗</a></p>
      <p v-if="releases[0].published_at">{{ zh ? '发布时间：' : 'Published: ' }}{{ date(releases[0].published_at) }}</p>
      <h3 id="downloads" data-ec-outline tabindex="-1">{{ zh ? '下载安装包' : 'Download packages' }}</h3>
      <template v-if="isQ">
        <section v-for="group in assetGroups(releases[0].assets)" :key="group.id">
          <h4 :id="group.id" data-ec-outline tabindex="-1">{{ group.title }}</h4>
          <DownloadAssets :assets="group.assets" />
        </section>
      </template>
      <DownloadAssets v-else :assets="releases[0].assets" />
      <p v-if="!releases[0].assets.length">{{ zh ? '该版本没有可用的下载文件，请查看官方发布页。' : 'No download files are available for this release. See the official release page.' }}</p>
      <details v-if="releases[0].body" class="release-notes">
        <summary>{{ zh ? '查看发布说明（原文）' : 'Release notes' }}</summary>
        <div class="markdown-body" v-html="notes"></div>
      </details>
      <template v-if="releases.length > 1">
        <h2 id="history" data-ec-outline tabindex="-1">{{ zh ? '历史版本' : 'Previous versions' }}</h2>
        <details v-for="release in releases.slice(1)" :key="release.id" class="previous-release">
          <summary><h3 :id="releaseId(release.tag_name)" data-ec-outline tabindex="-1">{{ release.tag_name }}</h3><span v-if="release.published_at">{{ date(release.published_at) }}</span></summary>
          <p><a :href="`${releasePage}/tag/${encodeURIComponent(release.tag_name)}`">{{ zh ? '查看该版本说明' : 'Read this release’s notes' }} ↗</a></p>
          <p v-if="isQ">{{ zh ? '历史版本的功能、安装方式和平台支持以该版本说明为准。' : 'Features, installation and platform support follow this release’s own documentation.' }}</p>
          <DownloadAssets v-if="release.assets?.length" :assets="release.assets" />
          <p v-else>{{ zh ? '该版本没有可用的下载文件。' : 'No download files for this release.' }}</p>
        </details>
      </template>
    </template>
    <div v-else class="release-fallback" role="status">
      <p>{{ zh ? '暂时无法加载版本信息。请重试，或从 GitHub 发行页下载。' : 'Release information is temporarily unavailable. Retry or download from GitHub Releases.' }}</p>
      <button class="ec-button" type="button" @click="reloadReleases">{{ zh ? '重试加载' : 'Retry' }}</button>
      <a class="ec-button primary" :href="releasePage">{{ zh ? '前往 GitHub 发行页' : 'GitHub Releases' }} ↗</a>
    </div>
  </div>
</template>

<style scoped>
.release-notes, .previous-release { margin:20px 0; padding:16px; border:1px solid var(--ec-border); border-radius:5px; }
summary { cursor:pointer; font-weight:600; }
.previous-release summary h3 { display:inline; margin:0 16px 0 0; border:0; font-size:18px; }
.previous-release summary span { color:var(--ec-muted); font-weight:400; font-size:13px; }
</style>
