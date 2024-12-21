import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'

// 分别定义英文和中文导航
const navEn = [
  { text: 'Guide', link: '/guide/introduction' },
  { text: 'Develop', link: '/develop/compile' },
  { text: 'Download', link: '/download' },
  {
    text: 'Projects',
    items: [
      { text: 'eCapture', link: 'https://github.com/gojue/ecapture'},
      { text: 'eBPFManager', link: 'https://github.com/gojue/ebpfmanager'},
      { text: 'eBPFSlide', link: 'https://github.com/gojue/ebpf-slide'},
      { text: 'eHIDSAgent', link: 'https://github.com/gojue/ehids-agent'}
    ]
  },
  {
    text: 'BLOG',
    link: 'https://www.cnxct.com'
  }
]

const navZh = [
  { text: '快速上手', link: '/zh/guide/introduction' },
  { text: '自助开发', link: '/zh/develop' },
  { text: '本地下载', link: '/zh/download' },
  { text:'使用案例', link:'/zh/examples/'},
  {
    text: '其他项目',
    items: [
      { text: 'eBPFManager', link: 'https://github.com/gojue/ebpfmanager'},
      { text: 'eBPF幻灯片', link: 'https://github.com/gojue/ebpf-slide'},
      { text: 'eHIDSAgent', link: 'https://github.com/gojue/ehids-agent'},
      { text: 'eCapture旁观者', link: 'https://github.com/gojue/ecapture'}
    ]
  },
  {
    text: '作者博客',
    link: 'https://www.cnxct.com'
  }
]

export const sidebar = {
  '/guide/': [
    {
      text: 'Getting Started',
      items: [
        {
          text: 'Introduction',
          link: '/guide/introduction'
        },
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
        {
          text: 'Compile',
          link:'/develop/compile'
        },
      ]
    },
  ],
  '/zh/develop/':[
    {
      activeMatch: `^/zh/`,
      text: '自助开发',
      items:[
        {
          text: '目录',
          link:'/zh/develop/index'
        },
        {
          text: '项目结构',
          link:'/zh/develop/architecture'
        },
        {
          text: 'kern目录',
          link:'/zh/develop/kern'
        },
        {
          text: 'user目录',
          link:'/zh/develop/user'
        },
        {
          text: '操作系统',
          link:'/zh/develop/os'
        },
        {
          text: '工具链',
          link:'/zh/develop/toolchain'
        },
        {
          text: '编译方法',
          link:'/zh/develop/compile'
        },
      ]
    }
  ],
  '/zh/examples/':[
    {
      text: '使用案例',
      activeMatch: `^/zh/`,
      items:[
        {
          text: '安卓12 知乎APP抓包',
          link:'/zh/examples/android'
        },
        {
          text: '容器环境里抓包',
          link:'/zh/examples/docker'
        },
        {
          text: 'Linux环境里抓包',
          link:'/zh/examples/index'
        },
      ]
    }
  ],

  '/zh/guide/' :[
    {
      text: '快速上手',
      activeMatch: `^/zh/`,
      items : [
        {text: '目录', link:'/zh/guide/index'},
        {text: '功能介绍', link:'/zh/guide/introduction'},
        {text: '运行原理', link:'/zh/guide/how-it-works'},
        {text: '直接使用', link:'/zh/guide/quick-start'},
      ]
    }
  ],
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: 'en-US',
  title: 'eCapture',
  description: 'eCapture - Capture SSL/TLS text content without CA certificate using eBPF',
  srcDir: './src',
  srcExclude: ['tutorial/**/description.md'],
  scrollOffset: 'header',
  assetsDir: 'assets',

  ignoreDeadLinks: false,
  chainWebpack: (config) => {
    // 找到处理 JSON 文件的规则
    const jsonRule = config.module.rule('json');


    // 禁用 source map
    jsonRule.include.add(/src\/assets\/releases/) // 只包括 src/assets/releases 目录
        .end()
        .use('json-loader').tap((options) => {
      return {
        ...options,
        sourceMap: false, // 确保不生成 source map
      };
    });
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
    // ['link', { rel: "apple-touch-icon", sizes: "180x180", href: path.resolve(__dirname, "./public/apple-touch-icon.png")}],
    // ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: path.resolve(__dirname, "./public/favicon-16x16.png")}],
    // ['link', { rel: "manifest", href: path.resolve(__dirname, "./public/site.webmanifest")}],
    // ['link', { rel: "mask-icon", href: path.resolve(__dirname, "./public/safari-pinned-tab.svg"), color: "#3a0839"}],
    // ['link', { rel: "shortcut icon", href: path.resolve(__dirname, "./public/favicon.ico")}],
    // ['meta', { name: "msapplication-TileColor", content: "#3a0839"}],
    // ['meta', { name: "msapplication-config", content: path.resolve(__dirname, "./public/browserconfig.xml")}],
    ['meta', { name: "theme-color", content: "#ffffff"}],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: navEn,
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
        nav: navZh,
        socialLinks: [
          { icon: 'languages', link: '/'},
          { icon: 'github', link: 'https://github.com/gojue/ecapture' },
          { icon: 'twitter', link: 'https://weibo.com/n/CFC4N' },
        ],
      },
    }
  },

  themeConfig: {
    sidebar,

    // algolia: {
    //   indexName: 'vuejs',
    //   appId: 'ML0LEBN7FQ',
    //   apiKey: 'f49cbd92a74532cc55cfbffa5e5a7d01',
    //   searchParameters: {
    //     facetFilters: ['version:v3']
    //   }
    // },

    editLink: {
      repo: 'gojue/ecapture.cc#master',
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
})

