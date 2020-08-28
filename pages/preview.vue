<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <preview-component/>
      <br/>
    </b-container>

    <page-foot :buildTimeString="buildTimeString" :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
  import navbar from '../components/navbar'
  import configService from "../middleware/service/configService"
  import pageHead from "../components/pageHead"
  import previewComponent from "../components/preview"
  import pageFoot from "../components/pageFoot"
  import backtop from "../components/backtop"
  import utils from "../middleware/utils/utils"

  export default {
    name: "preview",
    async asyncData({}) {
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
      const pageFootConfig = configService.getPageFootConfig()
      if (!pageFootConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }

      return {
        navbarConfig: navbarConfig,
        homeConfig: homeConfig,
        pageFootConfig: pageFootConfig,
        buildTimeString: utils.formatDate(new Date(), pageFootConfig.buildTimeFormat),
      }
    },
    components: {
      navbar,
      pageHead,
      previewComponent,
      pageFoot,
      backtop,
    },
  }
</script>

<style scoped>

</style>