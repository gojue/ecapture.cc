import { sidebar } from '../../productNavigation'

export type Locale = 'en' | 'zh'

const normalizePath = (path: string) =>
  path.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '') || '/'

const pagePaths = new Set(
  Object.values(sidebar).flatMap(groups =>
    groups.flatMap(group => group.items.map(item => normalizePath(item.link)))
  )
)

const productPrefix = /^\/(q|decryptor)(?:\/(?:en|zh))?(?:\/|$)/
export const isChinesePath = (path: string) => /^\/(?:(?:q|decryptor)\/)?zh(?:\/|$)/.test(path)
export const isProductPath = (path: string) => productPrefix.test(path)
export const isDownloadPath = (path: string) => /^\/(?:q\/)?(?:en|zh)\/download(?:\/|\.html$|$)/.test(path)

export function localePath(path: string, targetLocale: Locale): string {
  const product = path.match(productPrefix)
  if (product) return `/${product[1]}/${targetLocale}/${path.slice(product[0].length)}`
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
