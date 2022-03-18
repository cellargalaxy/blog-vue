//https://github.com/mermaid-js/mermaid
import mermaid from 'mermaid'

$(window).ready(function () {
  $('.nuxt-content').find('.language-flow').each((i, node) => {
    node = $(node)
    const flow = node.text()
    node = node.parent()
    mermaid.mermaidAPI.render('language-flow-' + i, flow, (html, bindFunctions) => {
      $(node).html(html)
    })
  })
})
