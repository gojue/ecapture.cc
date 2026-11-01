import type MarkdownIt from 'markdown-it'

/** Collapse standalone Wiki citations without rewriting generated Markdown. */
export function sourceReferencesPlugin(md: MarkdownIt) {
  md.core.ruler.after('inline', 'source-references', state => {
    for (let i = 1; i < state.tokens.length; i++) {
      const inline = state.tokens[i]
      const paragraph = state.tokens[i - 1]
      const closing = state.tokens[i + 1]
      const children = inline.children
      if (paragraph.type !== 'paragraph_open' || inline.type !== 'inline' || closing?.type !== 'paragraph_close' || !children) continue
      if (children[0]?.type !== 'text' || !/^Sources:\s*$/i.test(children[0].content)) continue

      // Only format a label followed by links and separators; leave prose alone.
      let insideLink = false
      let links = 0
      const citationsOnly = children.slice(1).every(token => {
        if (token.type === 'link_open') { insideLink = true; links++; return true }
        if (token.type === 'link_close') { insideLink = false; return true }
        return insideLink || token.type === 'softbreak' ||
          (token.type === 'text' && /^[\s,;，；.。]*$/.test(token.content))
      })
      if (!citationsOnly || !links) continue

      // Native details supports keyboard interaction and is closed even before hydration.
      paragraph.type = 'details_open'
      paragraph.tag = 'details'
      paragraph.hidden = false
      paragraph.attrJoin('class', 'ec-source-references')
      closing.type = 'details_close'
      closing.tag = 'details'
      closing.hidden = false

      const summaryOpen = new state.Token('summary_open', 'summary', 1)
      const summaryText = new state.Token('text', '', 0)
      summaryText.content = children[0].content.trim().replace(/:$/, '')
      const summaryClose = new state.Token('summary_close', 'summary', -1)
      insideLink = false
      inline.children = children.filter((token, index) => {
        if (index === 0) return false
        if (token.type === 'link_open') { insideLink = true; return true }
        if (token.type === 'link_close') { insideLink = false; return true }
        return insideLink
      })
      state.tokens.splice(i, 0, summaryOpen, summaryText, summaryClose)
      i += 3
    }
  })
}
