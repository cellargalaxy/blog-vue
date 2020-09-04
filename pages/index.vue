<template>
  <div>
    <navbar :config="navbarConfig"/>

    <full-carousel :config="homeConfig"/>
  </div>
</template>

<script>
  import navbar from '../components/navbar'
  import fullCarousel from '../components/fullCarousel'

  import configService from '../middleware/service/configService'

  export default {
    name: "index",
    async asyncData({error}) {
      const navbarConfig = configService.getNavbarConfig()
      if (!navbarConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
      const homeConfig = configService.getHomeConfig()
      if (!homeConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
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

