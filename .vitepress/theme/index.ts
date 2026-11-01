import { h, type App, type Component } from 'vue'
import { VPTheme } from '@vue/theme'
import './styles/index.css'
import { preferComposition, preferSFC, filterHeadersByPreference } from './components/preferences'
import NavTitleBar from './components/NavTitleBar.vue'
import HeaderActions from './components/HeaderActions.vue'
import DocContext from './components/DocContext.vue'
import DocOutline from './components/DocOutline.vue'
import SidebarChapters from './components/SidebarChapters.vue'
import { setupMermaidZoom } from './composables/mermaidZoom'

export default Object.assign({}, VPTheme, {
  Layout: () => h('div', { class: 'ec-site' }, [
    h(VPTheme.Layout as Component, null, {
      'navbar-title': () => h(NavTitleBar),
      'content-top': () => h(DocContext),
      'aside-top': () => h(DocOutline),
      'sidebar-top': () => h('p', { class: 'ec-eyebrow ec-sidebar-label' }, 'DOCUMENTATION'),
      'sidebar-bottom': () => h(SidebarChapters),
    }),
    h(HeaderActions),
  ]),
  enhanceApp({ app }: { app: App }) {
    app.provide('prefer-composition', preferComposition)
    app.provide('prefer-sfc', preferSFC)
    app.provide('filter-headers', filterHeadersByPreference)
    if (typeof window !== 'undefined') setupMermaidZoom()
  },
})
