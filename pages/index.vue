<template>
  <div>
    <navbar :config="siteConfig"/>

    <full-carousel :config="homeConfig"/>
  </div>
</template>

<script>
import navbar from '../components/navbar'
import fullCarousel from '../components/fullCarousel'

import service from '../middleware/service'

export default {
  name: "index",
  async asyncData() {
    const siteConfig = service.getSiteConfig()
    const homeConfig = service.getHomeConfig()
    return {
      siteConfig: siteConfig,
      homeConfig: homeConfig,
    }
  },
  components: {
    navbar,
    fullCarousel,
  },
}
</script>

<style scoped>

</style>
