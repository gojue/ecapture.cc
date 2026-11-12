// Hand-maintained product navigation. Wiki migration owns navigation.json only.
import generated from './navigation.json'

export const productPages = [
  ['', 'Overview', '产品概览'],
  ['quick-start', 'Quick Start', '快速开始'],
  ['data-sources', 'Data Sources', '数据源连接'],
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
  return { text: 'eCaptureQ', activeMatch: '^q/', items: productItems(locale) }
}

// Keep collector download labels independent of generated Wiki titles.
// The URL determines the language; product-specific downloads keep their own paths.
function collectorDownloadSidebar(locale: 'en' | 'zh') {
  return [{
    text: locale === 'zh' ? '下载' : 'Download',
    items: [{
      text: locale === 'zh' ? 'eCapture 下载' : 'eCapture Download',
      link: `/${locale}/download/`,
    }],
  }]
}

export const sidebar = {
  ...generated.sidebar,
  '/en/download/': collectorDownloadSidebar('en'),
  '/zh/download/': collectorDownloadSidebar('zh'),
  '/q/en/': [{ text: 'eCaptureQ', items: productItems('en') }],
  '/q/zh/': [{ text: 'eCaptureQ', items: productItems('zh') }],
  '/q/': [{ text: 'eCaptureQ', items: productItems('en') }],
}
