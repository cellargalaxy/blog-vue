$(() => {
  try {
    console.log('exec static init start')
    staticInit()
    console.log('exec static init finish')
  } catch (e) {
    console.log('exec static init error:', e)
  }
  try {
    console.log('exec base init start')
    baseInit()
    console.log('exec base init finish')
  } catch (e) {
    console.log('exec base init error:', e)
  }
})

function baseInit() {
  initMermaid()
  initTableClass()
  initCodeRow()
  initMathjax()
  initZoom()
  initBackstretch()
}

function initBackstretch() {
  //https://github.com/jquery-backstretch/jquery-backstretch
  const isPc = window.innerWidth >= window.innerHeight
  console.log('is pc windows: ' + isPc)
  $('[data-hid="background-image"]').each((i, node) => {
    const backgroundImage = JSON.parse($(node).attr('content'))
    const urls = []
    for (let j = 0; j < backgroundImage.images.length; j++) {
      const image = backgroundImage.images[j]
      if (image.isPc == undefined || image.isPc == null || image.isPc == isPc) {
        urls.push(image.url)
        console.log('add background image: ' + image.description)
      }
    }
    if (urls.length == 0) {
      for (let j = 0; j < backgroundImage.images.length; j++) {
        const image = backgroundImage.images[j]
        urls.push(image.url)
        console.log('add background image: ' + image.description)
      }
    }
    $.backstretch(urls, backgroundImage)
  })
}

function initZoom() {
  //https://github.com/fat/zoom.js
  $('#__nuxt').find('img').attr('data-action', 'zoom')
}

function initMermaid() {
  //https://github.com/mermaid-js/mermaid
  $('#__nuxt').find('.language-chart').each((i, node) => {
    mermaid.mermaidAPI.render('language-chart-' + i, $(node).text(), (html, bindFunctions) => {
      $(node).removeClass('hljs')
      $(node).html(html)
    })
  })
}

function initMathjax() {
  //https://mathjax.github.io/MathJax-demos-web/tex-chtml.html
  //不知道为什么，经过markdown的反斜杠会被转义，需要在那些用括号或者方括号的，以及换行的地方用\\
  MathJax = {tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]}}
}

function initTableClass() {
  $('#__nuxt').find('table').addClass('table b-table table-striped table-hover table-responsive')
}

function initCodeRow() {
  $('#__nuxt').find('.hljs').each((i, node) => {
    $(node).html('<ol><li>' + $(node).html().trim().replace(/\n/g, '\n</li><li>') + '\n</li></ol>')
  })
}