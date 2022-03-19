// https://derkinzi.de/optimized-responsive-lazyloading-images-with-nuxt/
require('lazysizes')

function init() {
  $('.nuxt-content').find('img').addClass('lazyload')
}

export default {
  init: init,
}
