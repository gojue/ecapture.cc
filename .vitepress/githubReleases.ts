/** Release metadata is optional: navigation remains usable when APIs are offline. */
export async function loadReleases(isZh: boolean, signal?: AbortSignal) {
  const urls = isZh
    ? ['https://image.cnxct.com/repos/gojue/ecapture/releases', 'https://api.github.com/repos/gojue/ecapture/releases']
    : ['https://api.github.com/repos/gojue/ecapture/releases']
  for (const url of urls) {
    if (signal?.aborted) return []
    const controller = new AbortController()
    const abort = () => controller.abort()
    signal?.addEventListener('abort', abort, { once: true })
    const timeout = setTimeout(abort, 6000)
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) continue
      const releases = await response.json()
      if (Array.isArray(releases) && releases.length) return releases.slice(0, 5)
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
