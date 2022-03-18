//https://github.com/jquery-backstretch/jquery-backstretch
require('jquery-backstretch')
import service from '../middleware/service'

const type = window.innerWidth >= window.innerHeight ? 'wide' : 'high'
const backgroundImage = service.getBackgroundImage()
const urls = []
for (let j = 0; j < backgroundImage.images.length; j++) {
  const image = backgroundImage.images[j]
  if (image.type === undefined || image.type == null || image.type === '' || image.type === type) {
    urls.push(image.url)
  }
}
if (urls.length === 0) {
  for (let j = 0; j < backgroundImage.images.length; j++) {
    const image = backgroundImage.images[j]
    urls.push(image.url)
  }
}
$.backstretch(urls, backgroundImage)
