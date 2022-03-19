<template>
  <div>
    <navbar :config="navbarConfig"/>

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
    const navbarConfig = service.getNavbarConfig()
    const homeConfig = service.getHomeConfig()
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
