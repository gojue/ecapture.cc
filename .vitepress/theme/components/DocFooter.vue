<script setup lang="ts">
import { useData } from 'vitepress'
import { VTLink } from '@vue/theme'

const { theme, frontmatter, page } = useData()
</script>

<template>
  <footer
    v-if="!frontmatter.page && !page.isNotFound && frontmatter.footer !== false && theme.footer"
    class="VPFooter ec-doc-footer"
  >
    <p v-if="theme.footer.license" class="license">
      {{ theme.i18n?.footerLicense?.before ?? 'Released under the '
      }}<VTLink class="link" :href="theme.footer.license.link" no-icon>{{
        theme.footer.license.text
      }}</VTLink>{{ theme.i18n?.footerLicense?.after ?? '.' }}
    </p>
    <p v-if="theme.footer.copyright" class="copyright">{{ theme.footer.copyright }}</p>
  </footer>
</template>

<style scoped>
.ec-doc-footer { text-align:center; line-height:20px; font-weight:500; }
.link { color:var(--ec-ink); }
.link:hover { color:var(--ec-muted); }
</style>
