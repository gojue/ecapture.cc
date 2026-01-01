import './styles/index.css'
import { h, App, Component } from 'vue'
import { VPTheme } from '@vue/theme'
import {
  preferComposition,
  preferSFC,
  filterHeadersByPreference
} from './components/preferences'
import NavTitleBar from './components/NavTitleBar.vue'
import LanguageHint from './components/LanguageHint.vue'
import { setupMermaidZoom } from './composables/mermaidZoom'

export default Object.assign({}, VPTheme, {
  Layout: () => {
    return h('div', null, [
      h(VPTheme.Layout as Component, null, {
        'navbar-title': () => h(NavTitleBar as Component),
      }),
      h(LanguageHint as Component)
    ])
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
