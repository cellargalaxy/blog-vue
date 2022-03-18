//https://github.com/equk/nuxt-medium-zoom
import Vue from 'vue'
import zoom from 'medium-zoom'

$('.nuxt-content').find('img').addClass('zoom')

const initZoom = () => {
  zoom('img.zoom:not(.medium-zoom-image)', {background: 'rgba(0, 0, 0, 0.6)'})
}

Vue.mixin({
  mounted: function () {
    initZoom()
  },
  updated: function () {
    initZoom()
  },
})
