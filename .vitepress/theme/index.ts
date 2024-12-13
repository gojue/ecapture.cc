import './styles/index.css'
import { h, App } from 'vue'
import { VPTheme } from '@vue/theme'
import {
  preferComposition,
  preferSFC,
  filterHeadersByPreference
} from './components/preferences'
import NavTitleBar from './components/NavTitleBar.vue';

export default Object.assign({}, VPTheme, {
  Layout: () => {
    return h(VPTheme.Layout, null, {
      'navbar-title': ()=>h(NavTitleBar),
    })
  },
  enhanceApp({ app }: { app: App }) {
    app.provide('prefer-composition', preferComposition)
    app.provide('prefer-sfc', preferSFC)
    app.provide('filter-headers', filterHeadersByPreference)
    // app.component('VueSchoolLink', VueSchoolLink)
  },
})
