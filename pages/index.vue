<template>
  <div>
    <navbar :config="navbarConfig"/>

    <full-carousel :config="homeConfig"/>
  </div>
</template>

<script>
import navbar from '../components/navbar'
import fullCarousel from '../components/fullCarousel'

import config from '../middleware/config'

export default {
  name: "index",
  async asyncData() {
    const navbarConfig = config.getNavbarConfig()
    const homeConfig = config.getHomeConfig()
    return {
      navbarConfig: navbarConfig,
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
