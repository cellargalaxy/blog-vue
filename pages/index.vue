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
    async asyncData({}) {
      return {
        navbarConfig: configService.getNavbarConfig(),
        homeConfig: configService.getHomeConfig(),
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

