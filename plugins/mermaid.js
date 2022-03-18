//https://github.com/mermaid-js/mermaid
import mermaid from 'mermaid'

$('.nuxt-content').find('.language-chart').each((i, node) => {
  mermaid.mermaidAPI.render('language-chart-' + i, $(node).text(), (html, bindFunctions) => {
    $(node).html(html)
  })
})
