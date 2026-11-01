---
footer: false
title: Download eCapture from Github.
---

# Download eCapture

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { loadReleases } from '../../../.vitepress/githubReleases'
import { marked } from 'marked'

const releases = ref([])
const loading = ref(true)

// 转换 Markdown 为 HTML
const convertMarkdownToHtml = (markdown) => {
  if (!markdown) return ''
  return marked(markdown)
}

let controller
const reloadReleases = async () => {
  controller?.abort()
  const request = new AbortController()
  controller = request
  loading.value = true
  const data = await loadReleases(false, request.signal)
  if (request.signal.aborted) return
  releases.value = data.map(release => ({
    ...release,
    body: convertMarkdownToHtml(release.body),
    assets: (release.assets || []).map(asset => ({
      ...asset,
      browser_download_url: asset.browser_download_url
    }))
  }))
  loading.value = false
}
onMounted(reloadReleases)
onUnmounted(() => controller?.abort())

</script>

<ClientOnly>
  <div class="releases-container">
    <div v-if="loading">Loading releases data...</div>
    <div v-else-if="releases.length > 0">
      <!-- Latest Version -->
      <h2>Latest Version ({{ releases[0]?.tag_name || 'Unknown' }})</h2>
      <p v-if="releases[0]?.published_at">Published: {{ new Date(releases[0].published_at).toLocaleDateString() }}</p>
      <div v-if="releases[0]?.body" class="markdown-body" v-html="releases[0].body"></div>
      <h3>Downloads</h3>
      <ul v-if="releases[0]?.assets?.length">
        <li v-for="asset in releases[0].assets" :key="asset.id">
          <a :href="asset.browser_download_url">{{ asset.name }}</a>
        </li>
      </ul>
      <!-- Previous Versions -->
      <h2 class="previous-versions">Previous Versions</h2>
      <div v-for="release in releases.slice(1)" :key="release.id">
        <details>
          <summary>Version {{ release.tag_name }} ({{ new Date(release.published_at).toLocaleDateString() }})</summary>
          <ul v-if="release?.assets?.length">
            <li v-for="asset in release.assets" :key="asset.id">
              <a :href="asset.browser_download_url">{{ asset.name }}</a>
            </li>
          </ul>
          <p v-else>No assets available for this version</p>
        </details>
      </div>
    </div>
    <div v-else class="release-fallback" role="status">
      <p>Release information is temporarily unavailable. Retry, or download directly from GitHub Releases.</p>
      <button class="ec-button" type="button" @click="reloadReleases">Retry</button>
      <a class="ec-button primary" href="https://github.com/gojue/ecapture/releases" target="_blank" rel="noopener noreferrer">GitHub Releases ↗</a>
    </div>
  </div>
</ClientOnly>
