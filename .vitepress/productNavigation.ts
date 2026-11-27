// Hand-maintained product navigation. Wiki migration owns navigation.json only.
import generated from './navigation.json'

type Locale = 'en' | 'zh'
type PageEntry = readonly [slug: string, en: string, zh: string]

const products = {
  collector: { name: 'eCapture', repo: 'ecapture' },
  q: { name: 'eCaptureQ', repo: 'ecaptureQ' },
  decryptor: { name: 'Decryptor', repo: 'ecapture_decryptor' },
} as const

export function productForPath(path: string) {
  const prefix = path.split('/')[1]
  return prefix === 'q' || prefix === 'decryptor' ? products[prefix] : products.collector
}

export function productMenuId(name: string) {
  return Object.entries(products).find(([, product]) => product.name === name)?.[0]
}

export const productPages = [
  ['', 'Overview', '产品概览'],
  ['quick-start', 'Quick Start', '快速开始'],
  ['data-sources', 'Data Sources', '数据源连接'],
  ['authentication', 'Web Authentication', '网页登录认证'],
  ['interface', 'Interface Guide', '界面使用指南'],
  ['protocols', 'Protocols & Details', '协议与消息详情'],
  ['download', 'Download', '下载'],
  ['install', 'Installation', '安装'],
  ['faq', 'FAQ', '常见问题'],
] as const

export const decryptorPages = [
  ['', 'Overview', '产品概览'],
  ['quick-start', 'Go Quick Start', 'Go 快速开始'],
  ['api', 'Go API and Events', 'Go API 与事件'],
  ['streaming', 'Streaming Integration', '流式集成'],
  ['protocols', 'Protocol Support and Options', '协议支持与选项'],
  ['native', 'C and C++ Integration', 'C 与 C++ 集成'],
] as const

function pageItems(prefix: string, locale: Locale, pages: readonly PageEntry[]) {
  return pages.map(([slug, en, zh]) => ({
    text: locale === 'zh' ? zh : en,
    link: `/${prefix}/${locale}/${slug ? slug + '/' : ''}`,
  }))
}

export function productItems(locale: Locale) {
  return [
    ...pageItems('q', locale, productPages),
    { text: locale === 'zh' ? '在线演示' : 'Online DEMO', link: 'https://ecapture.loongfans.cn/' },
  ]
}

function decryptorNav(locale: Locale) {
  return { text: products.decryptor.name, activeMatch: '^decryptor/', items: pageItems('decryptor', locale, decryptorPages) }
}

export function productNav(locale: 'en' | 'zh') {
  return { text: 'eCaptureQ', activeMatch: '^q/(?:en|zh)/(?!download/)', items: productItems(locale).filter(item => item.link !== `/q/${locale}/download/`) }
}

// Collector chapters continue to come from the Wiki manifest. Overview is manual.
export function collectorItems(locale: 'en' | 'zh') {
  return [
    { text: locale === 'zh' ? '产品概览' : 'Overview', link: `/${locale}/overview/` },
    ...Object.entries(generated.sidebar)
      .filter(([path]) => path.startsWith(`/${locale}/`) && !/\/(?:download|overview)\//.test(path))
      .map(([link, groups]) => ({ text: groups[0].text, link })),
  ]
}

export function downloadItems(locale: 'en' | 'zh') {
  return [
    { text: locale === 'zh' ? 'eCapture · 命令行程序' : 'eCapture · CLI App', link: `/${locale}/download/` },
    { text: locale === 'zh' ? 'eCaptureQ · 界面程序' : 'eCaptureQ · GUI App', link: `/q/${locale}/download/` },
  ]
}

// Every locale uses the same manifest for its desktop and mobile menus.
export function siteNav(locale: 'en' | 'zh') {
  return [
    { text: 'eCapture', activeMatch: '^(?:en|zh)/(?!download/)', items: collectorItems(locale) },
    productNav(locale),
    decryptorNav(locale),
    { text: locale === 'zh' ? '下载' : 'Download', activeMatch: '^(?:q/)?(?:en|zh)/download/', items: downloadItems(locale) },
    { text: locale === 'zh' ? '作者博客' : 'Blog', link: 'https://www.cnxct.com' },
  ]
}

function downloadSidebar(locale: 'en' | 'zh') {
  return [{ text: locale === 'zh' ? '下载' : 'Download', items: downloadItems(locale) }]
}

export const sidebar = {
  ...generated.sidebar,
  '/en/overview/': [{ text: 'eCapture', items: [collectorItems('en')[0]] }],
  '/zh/overview/': [{ text: 'eCapture', items: [collectorItems('zh')[0]] }],
  '/en/download/': downloadSidebar('en'),
  '/zh/download/': downloadSidebar('zh'),
  '/q/en/download/': downloadSidebar('en'),
  '/q/zh/download/': downloadSidebar('zh'),
  '/q/en/': [{ text: 'eCaptureQ', items: productItems('en').filter(item => item.link !== '/q/en/download/') }],
  '/q/zh/': [{ text: 'eCaptureQ', items: productItems('zh').filter(item => item.link !== '/q/zh/download/') }],
  '/q/': [{ text: 'eCaptureQ', items: productItems('en').filter(item => item.link !== '/q/en/download/') }],
  '/decryptor/en/': [decryptorNav('en')],
  '/decryptor/zh/': [decryptorNav('zh')],
  '/decryptor/': [decryptorNav('en')],
}
