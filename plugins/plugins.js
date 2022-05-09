import backstretch from './backstretch'
import bootstrap from './bootstrap'
import lazysizes from './lazysizes'
import zoom from './medium-zoom'
import mermaid from './mermaid'
import prism from './prism'
import giscus from './giscus'

$(window).ready(function () {
  backstretch.init()
  bootstrap.init()
  lazysizes.init()
  zoom.init()
  mermaid.init()
  prism.init()
  giscus.init()
})


