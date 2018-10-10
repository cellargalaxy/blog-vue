import 'highlight.js/styles/darcula.css';
const hljs = require('highlight.js');

const markdownItWithHtml = require('markdown-it')({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + markdownItWithHtml.utils.escapeHtml(str) + '</code></pre>';
  }
});

const markdownItWithoutHtml = require('markdown-it')({
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + markdownItWithoutHtml.utils.escapeHtml(str) + '</code></pre>';
  }
});

function markdown2htmlWithHtml(markdown) {
  if (markdown == null) {
    return ''
  }
  return markdownItWithHtml.render(markdown);
}

function markdown2htmlWithoutHtml(markdown) {
  if (markdown == null) {
    return ''
  }
  return markdownItWithoutHtml.render(markdown);
}

export default {
  markdown2htmlWithHtml: markdown2htmlWithHtml,
  markdown2htmlWithoutHtml: markdown2htmlWithoutHtml,
}
