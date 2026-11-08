import type { DownloadAsset } from './downloads'
import { officialDownloadUrl } from './downloads'

export type ReleaseProduct = 'ecapture' | 'ecaptureQ'
export type Release = {
  id: number | string
  tag_name: string
  published_at: string
  body: string
  assets: DownloadAsset[]
}

/** Both download pages and badges use published metadata, never a fixed version. */
export async function loadReleases(isZh: boolean, signal?: AbortSignal, product: ReleaseProduct = 'ecapture'): Promise<Release[]> {
  const endpoint = `/repos/gojue/${product}/releases`
  const urls = isZh
    ? [`https://image.cnxct.com${endpoint}`, `https://api.github.com${endpoint}`]
    : [`https://api.github.com${endpoint}`]
  for (const url of urls) {
    if (signal?.aborted) return []
    const controller = new AbortController()
    const abort = () => controller.abort()
    signal?.addEventListener('abort', abort, { once: true })
    const timeout = setTimeout(abort, 6000)
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) continue
      const data: unknown = await response.json()
      if (signal?.aborted) return []
      if (!Array.isArray(data)) continue
      const releases = data.filter(item => item && typeof item.tag_name === 'string'
        && !item.draft && !item.prerelease && typeof item.published_at === 'string'
        && Number.isFinite(Date.parse(item.published_at))
        // Some old alpha tags were published without GitHub's prerelease flag.
        && !/^v?\d+\.\d+\.\d+-/.test(item.tag_name))
        .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
        .slice(0, 5)
        .map(item => ({
          id: item.id ?? item.tag_name,
          tag_name: item.tag_name,
          published_at: item.published_at,
          body: typeof item.body === 'string' ? item.body : '',
          assets: (Array.isArray(item.assets) ? item.assets : []).filter((asset: DownloadAsset) => asset
            && typeof asset.name === 'string' && typeof asset.browser_download_url === 'string'
            && officialDownloadUrl(asset.browser_download_url)?.startsWith(`https://github.com/gojue/${product}/releases/download/`)),
        }))
      if (releases.length) return releases
    } catch {
      // Try the other source; callers render a useful offline state if both fail.
    } finally {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', abort)
    }
  }
  return []
}

export async function fetchReleaseTag(signal?: AbortSignal) {
  if (typeof window === 'undefined') return
  const path = window.location.pathname
  const releases = await loadReleases(path.startsWith('/zh/'), signal)
  if (signal?.aborted || window.location.pathname !== path) return
  const tag = releases[0]?.tag_name
  if (!tag) return
  const content = document.querySelector('#github_download .button-content')
  if (!content || content.querySelector('.docs-github-release-tag')) return
  const badge = document.createElement('samp')
  badge.className = 'docs-github-release-tag'
  badge.textContent = tag
  content.appendChild(badge)
}
