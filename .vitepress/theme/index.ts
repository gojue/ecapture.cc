import './styles/index.css'
import { h, App, Component } from 'vue'
import { VPTheme } from '@vue/theme'
import { useRoute } from 'vitepress'
import {
  preferComposition,
  preferSFC,
  filterHeadersByPreference
} from './components/preferences'
import NavTitleBar from './components/NavTitleBar.vue'
import LanguageHint from './components/LanguageHint.vue'
import TechBackground from './components/TechBackground.vue'
import NetworkCaptureEffect from './components/NetworkCaptureEffect.vue'
import { setupMermaidZoom } from './composables/mermaidZoom'

export default Object.assign({}, VPTheme, {
  Layout: () => {
    const route = useRoute()
    const isHomePage = route.path === '/' || route.path === '/zh/' || route.path === '/zh'

    return h('div', null, [
      h(TechBackground as Component),
      // Only show advanced effects on homepage
      isHomePage ? h(NetworkCaptureEffect as Component) : null,
      h(VPTheme.Layout as Component, null, {
        'navbar-title': () => h(NavTitleBar as Component),
      }),
      h(LanguageHint as Component)
    ].filter(Boolean))
  },
  enhanceApp({ app }: { app: App }) {
    app.provide('prefer-composition', preferComposition)
    app.provide('prefer-sfc', preferSFC)
    app.provide('filter-headers', filterHeadersByPreference)

    // Setup mermaid zoom functionality
    if (typeof window !== 'undefined') {
      setupMermaidZoom()
    }
  },
})
