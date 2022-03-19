//https://www.zemna.net/articles/how-to-use-codeblocks-syntax-highlighting-in-nuxtjs-content/

import prism from 'prismjs'

// Include the toolbar plugin: (optional)
import "prismjs/plugins/toolbar/prism-toolbar"

// Include the line numbers plugin: (optional)
import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

// Include the line highlight plugin: (optional)
import "prismjs/plugins/line-highlight/prism-line-highlight"
import "prismjs/plugins/line-highlight/prism-line-highlight.css"

// Include additional languages
import "prismjs/components/prism-bash.js"
import "prismjs/components/prism-css.js"
import "prismjs/components/prism-go.js"
import "prismjs/components/prism-java.js"
import "prismjs/components/prism-javascript.js"
import "prismjs/components/prism-json.js"
import "prismjs/components/prism-markdown.js"
import "prismjs/components/prism-sql.js"
import "prismjs/components/prism-yaml.js"

// Set vue SFC to markdown
prism.languages.vue = prism.languages.markup

function init() {
  prism.highlightAll()
}

export default {
  init: init,
}
