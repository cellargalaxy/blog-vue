//import marked from 'marked'
// import 'highlight.js/styles/idea.css';

// const hljs = require('highlight.js');

const markdownItWithHtml = require('markdown-it')({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  // highlight: function (str, lang) {
  //   if (lang && hljs.getLanguage(lang)) {
  //     try {
  //       return hljs.highlight(lang, str).value;
  //     } catch (__) {
  //     }
  //   }
  //   return '';
  // }
});

const markdownItWithoutHtml = require('markdown-it')({
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  // highlight: function (str, lang) {
  //   if (lang && hljs.getLanguage(lang)) {
  //     try {
  //       return hljs.highlight(lang, str).value;
  //     } catch (__) {
  //     }
  //   }
  //   return ''; // use external default escaping
  // }
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
