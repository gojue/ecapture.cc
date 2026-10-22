import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
import navigation from './navigation.json'

export default withMermaid(defineConfigWithTheme<ThemeConfig>({
  extends: async () => {
    const base = await baseConfig()
    // The upstream theme preloads /logo.svg and a fixed font filename that
    // this site does not ship. Our own head entries below provide the icons.
    return { ...base, head: [] }
  },
  lang: 'en-US',
  title: 'eCapture',
  description: 'eCapture captures TLS plaintext with eBPF through TLS, GoTLS and GnuTLS probes. Supports Linux x86_64, ARM64 and LoongArch64, plus Android x86_64 and ARM64.',
  srcDir: './src',
  outDir: './dist',
  scrollOffset: 'header',
  // assetsDir: 'assets',

  ignoreDeadLinks: false,

  // Keep generated Wiki diagrams aligned with the site's quiet teal palette.
  mermaid: {
    theme: 'base',
    themeVariables: {
      fontSize: '16px',
      background: '#f4faf8',
      primaryColor: '#e5f3ee',
      primaryTextColor: '#173d34',
      primaryBorderColor: '#79b7a5',
      secondaryColor: '#edf5f1',
      secondaryTextColor: '#173d34',
      secondaryBorderColor: '#a9cabc',
      tertiaryColor: '#f3f7f5',
      tertiaryTextColor: '#2d5146',
      tertiaryBorderColor: '#cadbd2',
      lineColor: '#5a9c87',
      arrowheadColor: '#5a9c87',
      textColor: '#173d34',
      clusterBkg: '#f3f7f5',
      clusterBorder: '#cadbd2',
      edgeLabelBackground: '#f4faf8',
    },
  },
  transformPageData(pageData) {
    pageData.frontmatter.outline = pageData.frontmatter.outline ?? 'deep';
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
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: "theme-color", content: "#43AA8B"}],
    ['meta', { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent"}],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        i18n: { search: 'Search', toc: 'On this page', ariaToC: 'Anchors in this article' },
        nav: navigation.nav.en,
        sidebar: navigation.sidebar,
        socialLinks: [
          { icon: 'languages', link: '/zh/'},
          { icon: 'github', link: 'https://github.com/gojue/ecapture' },
          { icon: 'twitter', link: 'https://twitter.com/cfc4n' },
        ],
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        i18n: { search: '搜索', toc: '本页锚点', ariaToC: '本文正文的锚点目录' },
        nav: navigation.nav.zh,
        sidebar: navigation.sidebar,
        socialLinks: [
          { icon: 'languages', link: '/'},
          { icon: 'github', link: 'https://github.com/gojue/ecapture' },
          { icon: 'twitter', link: 'https://weibo.com/n/CFC4N' },
        ],
      },
    }
  },

  themeConfig: {
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
    config(md) {
      md.use(headerPlugin)
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
