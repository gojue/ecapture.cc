import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
import navigation from './navigation.json'

export default withMermaid(defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  lang: 'en-US',
  title: 'eCapture',
  description: 'eCapture - Capture SSL/TLS text content without CA certificate using eBPF',
  srcDir: './src',
  outDir: './dist',
  scrollOffset: 'header',
  // assetsDir: 'assets',

  ignoreDeadLinks: false,
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
    ['link', { rel: 'shortcut icon', href: '/assets/logo-300x300-v2.svg' }],
    ['link', { rel: "icon", type: "image/svg", sizes: "32x32", href: '/assets/logo-300x300-v2.svg'}],
    ['meta', { name: "theme-color", content: "#ffffff"}],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
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
      },
      force: true, // 强制重新加载
    },
    assetsDir:"assets",
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  },

  vue: {
    reactivityTransform: true,
  }
}))
