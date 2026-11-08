/** Keep product URLs separate; Chinese downloads share the existing CDN origin. */
export const DOWNLOAD_CDN = 'https://image.cnxct.com'

export type DownloadAsset = { name: string; browser_download_url: string; size?: number }

export function officialDownloadUrl(value: string): string | undefined {
  try {
    const url = new URL(value)
    if (url.origin !== 'https://github.com' || url.username || url.password || url.search || url.hash) return
    if (!/^\/gojue\/(?:ecapture|ecaptureQ)\/releases\/download\/[^/]+\/[^/]+$/.test(url.pathname)) return
    return url.href
  } catch { return }
}

export function downloadUrl(value: string, chinese: boolean): string | undefined {
  const official = officialDownloadUrl(value)
  return official && chinese ? official.replace('https://github.com', DOWNLOAD_CDN) : official
}
