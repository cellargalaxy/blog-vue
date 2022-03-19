//https://github.com/equk/nuxt-medium-zoom
import zoom from 'medium-zoom'

function init() {
  $('.nuxt-content').find('img').addClass('zoom')
  zoom('img.zoom:not(.medium-zoom-image)', {background: 'rgba(0, 0, 0, 0.6)'})
}

export default {
  init: init,
}


