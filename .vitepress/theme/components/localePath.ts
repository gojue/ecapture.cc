import { sidebar } from '../../productNavigation'

export type Locale = 'en' | 'zh'

const normalizePath = (path: string) =>
  path.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '') || '/'

const pagePaths = new Set(
  Object.values(sidebar).flatMap(groups =>
    groups.flatMap(group => group.items.map(item => normalizePath(item.link)))
  )
)

export const isChinesePath = (path: string) => /^\/(?:q\/)?zh(?:\/|$)/.test(path)
export const isProductPath = (path: string) => /^\/q(?:\/|$)/.test(path)

export function localePath(path: string, targetLocale: Locale): string {
  if (isProductPath(path)) {
    const article = path.replace(/^\/q(?:\/(?:en|zh))?(?:\/|$)/, '')
    return `/q/${targetLocale}/${article}`
  }
  const isChinese = isChinesePath(path)
  if (targetLocale === 'zh' && isChinese) return path
  if (targetLocale === 'en' && !isChinese) return path
  if (targetLocale === 'zh' && (path === '/' || path === '/en' || path === '/en/')) return '/zh/'
  if (targetLocale === 'en' && (path === '/zh' || path === '/zh/')) return '/'

  const candidate = targetLocale === 'zh'
    ? path.startsWith('/en/') ? `/zh/${path.slice('/en/'.length)}` : `/zh${path}`
    : `/en/${path.slice('/zh/'.length)}`

  // Generated docs have matching paths. Manual pages can exist in only one
  // language; send those to the other language's homepage instead of a 404.
  if (pagePaths.has(normalizePath(path)) && !pagePaths.has(normalizePath(candidate))) {
    return targetLocale === 'zh' ? '/zh/' : '/'
  }
  return candidate
}
