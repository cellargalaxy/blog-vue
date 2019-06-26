<template>
  <div>
    <navbar :config="navbarConfig"/>
    <page-head :config="pageHeadConfig"/>

    <b-container>
      <article-view :article="article" :isSummary="false"/>
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
  import articleView from '../components/articleView'
  import articleService from '../assets/service/articleService'
  import configService from '../assets/service/configService'

  export default {
    name: "articlePath",
    async asyncData({params, error}) {
      const articlePath = '/' + params.pathMatch
      const article = articleService.getArticle(articlePath)
      if (!article) {
        error({statusCode: 404, message: '你找的文章不翼而飞了'})
        return
      }
      return {
        article: article,
        navbarConfig: configService.getNavbarConfig(),
        pageHeadConfig: configService.getPageHeadConfig(),
        pageFootConfig: configService.getPageFootConfig(),
        gotoConfig: configService.getGotoConfig(),
      }
    },
    components: {
      articleView,
      navbar,
      pageHead,
      pageFoot,
      goto,
    },
  }
</script>

<style scoped>

</style>