<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <time-line-component :timeLines="timeLines"/>
    </b-container>
    <br/>
    <page-foot :buildTimeString="buildTimeString" :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
  import navbar from '../components/navbar'
  import pageHead from '../components/pageHead'
  import timeLineComponent from '../components/timeLine'
  import pageFoot from '../components/pageFoot'
  import backtop from '../components/backtop'

  import fileService from '../middleware/service/fileService'
  import configService from '../middleware/service/configService'
  import utils from "../middleware/utils/utils"

  export default {
    name: "timeLine",
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
      const pageFootConfig = configService.getPageFootConfig()
      if (!pageFootConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
      const timeLines = fileService.getTimeLines()
      if (!timeLines || timeLines.length == 0) {
        return
      }
      for (let i = 0; i < timeLines.length; i++) {
        for (let j = 0; j < timeLines[i].files.length; j++) {
          timeLines[i].files[j] = {
            title: timeLines[i].files[j].title,
            url: timeLines[i].files[j].url,
            dateString: timeLines[i].files[j].dateString
          }
        }
      }
      return {
        navbarConfig: navbarConfig,
        homeConfig: homeConfig,
        timeLines: timeLines,
        pageFootConfig: pageFootConfig,
        buildTimeString: utils.formatDate(new Date(), pageFootConfig.buildTimeFormat),
      }
    },
    components: {
      navbar,
      pageHead,
      timeLineComponent,
      pageFoot,
      backtop,
    },
  }
</script>

<style scoped>

</style>