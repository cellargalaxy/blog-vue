<template>
  <div>
    <navbar :config="navbarConfig"/>
    <page-head :config="pageHeadConfig"/>

    <b-container>
      <time-line-component :timeLineArticles="timeLineArticles"/>
    </b-container>

    <page-foot :config="pageFootConfig"/>
    <goto :config="gotoConfig"/>
  </div>
</template>

<script>
  import navbar from '../components/navbar'
  import pageHead from '../components/pageHead'
  import pageFoot from '../components/pageFoot'
  import goto from '../components/goto'
  import timeLineComponent from '../components/timeLine'
  import articleService from '../assets/service/articleService'
  import configService from '../assets/service/configService'

  export default {
    name: "timeLine",
    async asyncData({}) {
      return {
        timeLineArticles: articleService.getTimeLineArticles(),
        navbarConfig: configService.getNavbarConfig(),
        pageHeadConfig: configService.getPageHeadConfig(),
        pageFootConfig: configService.getPageFootConfig(),
        gotoConfig: configService.getGotoConfig(),
      }
    },
    components: {
      timeLineComponent,
      navbar,
      pageHead,
      pageFoot,
      goto,
    },
  }
</script>

<style scoped>

</style>