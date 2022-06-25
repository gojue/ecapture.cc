import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'

const nav = [

  //  TODO: dead link
  // {
  //   text: 'API',
  //   activeMatch: `^/api/`,
  //   link: '/api/'
  // },
  {
    text: 'English',
    link: '/'
  },
  {
    text: '中文',
    link: '/zh/'
  },
  { text: 'Guide', link: '/guide/introduction' },
  {
    text: 'Projects',
    items: [
      { text: 'eBPFManager', link: 'https://github.com/ehids/ebpfmanager'},
      { text: 'eBPFSlide', link: 'https://github.com/ehids/ebpf-slide'},
      { text: 'eHIDSAgent', link: 'https://github.com/ehids/ehids-agent'}
    ]
  },
  {
    text: 'BLOG博客',
    link: 'https://www.cnxct.com'
  },
]

export const sidebar = {
  '/guide/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        {
          text: 'Quick Start',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'How eCapture Works',
      items: [
        {
          text: 'How eCapture Works',
          link :'/guide/how-it-works'
        }
      ]
    },
  ],
  '/develop/': [
    {
      text: 'Develop',
      items: [
        { text: 'Environment', link: '/develop/environment' },
        {
          text: 'Kernel Space',
          link: '/develop/kernel_space'
        },{
          text: 'User Space',
          link: '/develop/user_space'
        },
      ]
    },
  ],
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: 'en-US',
  title: 'eCapture',
  description: 'eCapture - Capture SSL/TLS text content without CA certificate using eBPF',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],
  scrollOffset: 'header',

  head: [
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
  ],

  themeConfig: {
    nav,
    sidebar,

    // algolia: {
    //   indexName: 'vuejs',
    //   appId: 'ML0LEBN7FQ',
    //   apiKey: 'f49cbd92a74532cc55cfbffa5e5a7d01',
    //   searchParameters: {
    //     facetFilters: ['version:v3']
    //   }
    // },

    // carbonAds: {
    //   code: 'CEBDT27Y',
    //   placement: 'vuejsorg'
    // },

    socialLinks: [
      //  TODO: dead link
      // { icon: 'languages', link: '/translations/' },
      { icon: 'github', link: 'https://github.com/ehids/ecapture' },
      // { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      // { icon: 'discord', link: 'https://discord.com/invite/HBherRA' }
    ],

    editLink: {
      repo: 'ehids/ecapture.cc#master',
      text: 'Edit this page on GitHub',
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} CFC4N, Powered by Vue.js`,
    }
  },

  markdown: {
    config(md) {
      md.use(headerPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  },

  vue: {
    reactivityTransform: true
  }
})
