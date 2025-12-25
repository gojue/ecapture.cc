---
footer: false
title: Download eCapture from Github.
---

# Download 高速下载

<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { useRoute } from 'vitepress'

const releases = ref([])
const loading = ref(true)
const route = useRoute()

const CDN_DOMAIN = 'image.cnxct.com'    // assets 镜像域名
const GITHUB_DOMAIN = 'github.com/gojue'    // assets download domain
const GITHUB_API_DOMAIN = 'api.github.com/repos/gojue'    // github api domain

// 根据当前路径判断是否使用 CDN
const shouldUseCDN = () => {
  return route.path.includes('/zh/')
}
// 将 GitHub 下载链接转换为 CDN 链接
const convertToCDNUrl = (url) => {
  if (!url) return url
  return shouldUseCDN() ? url.replace(GITHUB_DOMAIN, CDN_DOMAIN).replace(GITHUB_API_DOMAIN, CDN_DOMAIN) : url
}

// 转换 Markdown 为 HTML
const convertMarkdownToHtml = (markdown) => {
  if (!markdown) return ''
  return marked(markdown)
}

onMounted(async () => {
  try {
    const response = await fetch(convertToCDNUrl('https://api.github.com/repos/gojue/ecapture/releases'))
    const data = await response.json()
    releases.value = Array.isArray(data) ? data.map(release => ({
      ...release,
      body: convertMarkdownToHtml(release.body),
      assets: (release.assets || []).map(asset => ({
        ...asset,
        browser_download_url: convertToCDNUrl(asset.browser_download_url)
      }))
    })) : []
  } catch (error) {
    console.error('Error fetching releases:', error)
    releases.value = []
  } finally {
    loading.value = false
  }
})
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
    <div v-else>No releases available</div>
  </div>
</ClientOnly>