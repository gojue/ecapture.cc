import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
import { sourceReferencesPlugin } from './sourceReferencesPlugin'
import navigation from './navigation.json'

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
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        i18n: { search: 'Search docs', toc: 'On this page', ariaToC: 'Anchors in this article' },
        nav: [
          { text: 'Docs', items: Object.entries(navigation.sidebar).filter(([path]) => path.startsWith('/en/') && !path.includes('/download/')).map(([link, groups]) => ({ text: groups[0].text, link })) },
          { text: 'Get started', link: '/en/1-getting-started/' },
          { text: 'Download', link: '/en/download/' },
          { text: 'Docker Hub', link: 'https://hub.docker.com/r/gojue/ecapture' },
          { text: 'GitHub Community', link: 'https://github.com/gojue/ecapture' },
          { text: 'Blog', link: 'https://www.cnxct.com' },
        ],
        sidebar: navigation.sidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/gojue/ecapture' }],
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        i18n: { search: '搜索文档', toc: '本页目录', ariaToC: '本文正文的锚点目录', menu: '章节导航', previous: '上一篇', next: '下一篇', returnToTop: '返回顶部' },
        editLink: { repo: 'gojue/ecapture.cc#master', text: '在 GitHub 上编辑此页' },
        nav: [
          { text: '文档', items: Object.entries(navigation.sidebar).filter(([path]) => path.startsWith('/zh/') && !path.includes('/download/')).map(([link, groups]) => ({ text: groups[0].text, link })) },
          { text: '快速开始', link: '/zh/1-getting-started/' },
          { text: '下载', link: '/zh/download/' },
          { text: 'Docker Hub', link: 'https://hub.docker.com/r/gojue/ecapture' },
          { text: 'GitHub 社区', link: 'https://github.com/gojue/ecapture' },
          { text: '作者博客', link: 'https://www.cnxct.com' },
        ],
        sidebar: navigation.sidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/gojue/ecapture' }],
      },
    }
  },

  themeConfig: {
    appearance: false, // HeaderActions uses VitePress's shared isDark state.
    search: {
      provider: 'local',
      options: {
        disableQueryPersistence: true,
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细结果',
                resetButtonTitle: '清除搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到相关结果：',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '移动',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc',
                },
              },
            },
          },
        },
      },
    },
    editLink: {
      repo: 'gojue/ecapture.cc#master',
      text: 'Edit this page on GitHub',
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2024-${new Date().getFullYear()} CFC4N, Powered by Vue.js`,
    }
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
