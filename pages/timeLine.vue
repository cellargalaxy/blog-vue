<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <time-line-component :timeLineArticles="timeLineArticles"/>
    </b-container>
    <br/>
    <page-foot :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
  import navbar from '../components/navbar'
  import pageHead from '../components/pageHead'
  import timeLineComponent from '../components/timeLine'
  import pageFoot from '../components/pageFoot'
  import backtop from '../components/backtop'

  import articleService from '../middleware/service/articleService'
  import configService from '../middleware/service/configService'

  export default {
    name: "timeLine",
    async asyncData({}) {
      return {
        navbarConfig: configService.getNavbarConfig(),
        homeConfig: configService.getHomeConfig(),
        timeLineArticles: articleService.getTimeLineArticles(),
        pageFootConfig: configService.getPageFootConfig(),
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