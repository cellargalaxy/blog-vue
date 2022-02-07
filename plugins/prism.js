//https://www.zemna.net/articles/how-to-use-codeblocks-syntax-highlighting-in-nuxtjs-content/

import Prism from 'prismjs'

// Include the toolbar plugin: (optional)
import "prismjs/plugins/toolbar/prism-toolbar"

// Include the line numbers plugin: (optional)
import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

// Include the line highlight plugin: (optional)
import "prismjs/plugins/line-highlight/prism-line-highlight"
import "prismjs/plugins/line-highlight/prism-line-highlight.css"

// Include some other plugins: (optional)
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard"
import "prismjs/plugins/highlight-keywords/prism-highlight-keywords"
import "prismjs/plugins/show-language/prism-show-language"

// Include additional languages
import "prismjs/components/prism-bash.js"
import "prismjs/components/prism-cpp.js"
import "prismjs/components/prism-css.js"
import "prismjs/components/prism-csv.js"
import "prismjs/components/prism-flow.js"
import "prismjs/components/prism-go.js"
import "prismjs/components/prism-java.js"
import "prismjs/components/prism-javascript.js"
import "prismjs/components/prism-json.js"
import "prismjs/components/prism-latex.js"
import "prismjs/components/prism-markdown.js"
import "prismjs/components/prism-matlab.js"
import "prismjs/components/prism-sql.js"
import "prismjs/components/prism-xml-doc.js"
import "prismjs/components/prism-yaml.js"

// Set vue SFC to markdown
Prism.languages.vue = Prism.languages.markup

export default Prism
