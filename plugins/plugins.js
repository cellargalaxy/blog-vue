import backstretch from './backstretch'
import bootstrap from './bootstrap'
import lazysizes from './lazysizes'
import mermaid from './mermaid'
import prism from './prism'

$(window).ready(function () {
  backstretch.init()
  bootstrap.init()
  lazysizes.init()
  mermaid.init()
  prism.init()
})


