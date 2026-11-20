// Hand-maintained product navigation. Wiki migration owns navigation.json only.
import generated from './navigation.json'

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

export function productItems(locale: 'en' | 'zh') {
  return [
    ...productPages.map(([slug, en, zh]) => ({
      text: locale === 'zh' ? zh : en,
      link: `/q/${locale}/${slug ? slug + '/' : ''}`,
    })),
    { text: locale === 'zh' ? '在线演示' : 'Online DEMO', link: 'https://ecapture.loongfans.cn/' },
  ]
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

// One manifest drives all four locale configurations and both desktop/mobile menus.
export function siteNav(locale: 'en' | 'zh') {
  return [
    { text: 'eCapture', activeMatch: '^(?:en|zh)/(?!download/)', items: collectorItems(locale) },
    productNav(locale),
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
}
