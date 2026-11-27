import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
import { sourceReferencesPlugin } from './sourceReferencesPlugin'
import { productForPath, siteNav, sidebar } from './productNavigation'

const chineseSearch = {
  button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
  modal: { displayDetails: '显示详细结果', resetButtonTitle: '清除搜索', backButtonTitle: '关闭搜索', noResultsText: '没有找到相关结果：', footer: { selectText: '选择', selectKeyAriaLabel: '回车', navigateText: '移动', navigateUpKeyAriaLabel: '上箭头', navigateDownKeyAriaLabel: '下箭头', closeText: '关闭', closeKeyAriaLabel: 'Esc' } },
}

function docLocale(locale: 'en' | 'zh', link: string) {
  const zh = locale === 'zh'
  const themeConfig: ThemeConfig = {
    i18n: zh ? {
      search: '搜索文档', toc: '本页目录', ariaToC: '本文正文的锚点目录',
      menu: '章节导航', previous: '上一篇', next: '下一篇', returnToTop: '返回顶部',
      ariaSkipToContent: '跳转到正文', ariaSidebarNav: '侧栏导航', ariaMobileNav: '主导航', ariaMainNav: '主导航',
      footerLicense: { before: '本站采用 ', after: '。' },
    } : {
      search: 'Search docs', toc: 'On this page', ariaToC: 'Anchors in this article',
      footerLicense: { before: 'This website is licensed under the ', after: '.' },
    },
    footer: {
      license: { text: zh ? 'MIT 许可证' : 'MIT License', link: 'https://opensource.org/licenses/MIT' },
      copyright: `Copyright © 2024-${new Date().getFullYear()} CFC4N, Powered by Vue.js`,
    },
    nav: siteNav(locale),
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/gojue/ecapture' }],
  }
  if (zh) themeConfig.editLink = { repo: 'gojue/ecapture.cc#master', text: '在 GitHub 上编辑此页' }
  return { label: zh ? '简体中文' : 'English', lang: zh ? 'zh-CN' : 'en-US', link, themeConfig }
}

export default withMermaid(defineConfigWithTheme<ThemeConfig>({
  extends: async () => {
    const base = await baseConfig()
    // Replace the upstream preloads, including a fixed font filename this
    // site does not ship. Our own head entries below provide the brand assets.
    return { ...base, head: [] }
  },
  lang: 'en-US',
  title: 'eCapture 旁观者',
  description: 'eCapture captures TLS plaintext with eBPF through TLS, GoTLS and GnuTLS probes. Supports Linux x86_64, ARM64 and LoongArch64, plus Android x86_64 and ARM64.',
  srcDir: './src',
  outDir: './dist',
  scrollOffset: 'header',
  // assetsDir: 'assets',

  ignoreDeadLinks: false,

  // Shared paper / graphite palette; CSS supplies the matching night colors.
  mermaid: {
    theme: 'base',
    themeVariables: {
      fontSize: '16px',
      background: '#faf9f6',
      primaryColor: '#f1f2ef',
      primaryTextColor: '#202326',
      primaryBorderColor: '#a1abb1',
      secondaryColor: '#fff3c5',
      secondaryTextColor: '#202326',
      secondaryBorderColor: '#c4b373',
      tertiaryColor: '#f1f2ef',
      tertiaryTextColor: '#454d54',
      tertiaryBorderColor: '#daddd8',
      lineColor: '#9c7410',
      arrowheadColor: '#9c7410',
      textColor: '#202326',
      clusterBkg: '#f1f2ef',
      clusterBorder: '#daddd8',
      edgeLabelBackground: '#faf9f6',
    },
  },
  transformPageData(pageData) {
    // Our outline handles encoded Chinese anchors and the 76px header offset.
    pageData.frontmatter.ecOutline = pageData.frontmatter.outline ?? 'deep';
    pageData.frontmatter.outline = false;
    const product = productForPath('/' + pageData.relativePath)
    if (product.name !== 'eCapture') pageData.titleTemplate = `:title | ${product.name}`
  },
  head: [
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: '/favicon.svg' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: "theme-color", content: "#ffcc1a"}],
    ['meta', { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent"}],
  ],

  locales: {
    root: docLocale('en', '/'),
    zh: docLocale('zh', '/zh/'),
    'q/en': docLocale('en', '/q/en/'),
    'q/zh': docLocale('zh', '/q/zh/'),
    'decryptor/en': docLocale('en', '/decryptor/en/'),
    'decryptor/zh': docLocale('zh', '/decryptor/zh/'),
  },

  themeConfig: {
    appearance: false, // HeaderActions uses VitePress's shared isDark state.
    search: {
      provider: 'local',
      options: {
        disableQueryPersistence: true,
        locales: {
          zh: { translations: chineseSearch },
          'q/zh': { translations: chineseSearch },
          'decryptor/zh': { translations: chineseSearch },
        },
      },
    },
    editLink: {
      repo: 'gojue/ecapture.cc#master',
      text: 'Edit this page on GitHub',
    },

  },
  //
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    config(md) {
      md.use(headerPlugin)
      md.use(sourceReferencesPlugin)
    },
    headers: {
      level: [2, 3, 4]  // 提取 h2, h3, h4 到大纲
    }
  },

  vite: {
    resolve: {
      alias: [
        // Keep the pinned theme and its normal menus; add a split product link.
        { find: './VPNavBarMenuGroup.vue', replacement: path.resolve(__dirname, 'theme/components/ProductNavGroup.vue') },
        { find: './VPNavScreenMenuGroup.vue', replacement: path.resolve(__dirname, 'theme/components/ProductMobileGroup.vue') },
        { find: './VPSidebarGroup.vue', replacement: path.resolve(__dirname, 'theme/components/CollectorSidebarGroup.vue') },
      ],
    },
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js', 'mermaid'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      noExternal: ['mermaid', 'vitepress-plugin-mermaid'],
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..'],
        cachedChecks: false
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  }
}))
