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
  import navbar from '../../components/navbar'
  import pageHead from '../../components/pageHead'
  import pageFoot from '../../components/pageFoot'
  import goto from '../../components/goto'
  import articleView from '../../components/articleView'

  import articleService from '../../middleware/service/articleService'
  import configService from '../../middleware/service/configService'

  export default {
    name: "articlePath",
    async asyncData({params, error}) {
      let articlePath = params.pathMatch//-> a/b/c/
      articlePath = articlePath.substring(0, articlePath.length - 1) //-> a/b/c

      const article = articleService.getArticle(articlePath)//-> root/a/b/c.md
      if (article) {
        return {
          article: article,
          navbarConfig: configService.getNavbarConfig(),
          pageHeadConfig: configService.getPageHeadConfig(),
          pageFootConfig: configService.getPageFootConfig(),
          gotoConfig: configService.getGotoConfig(),
        }
      }

      const errorConfig = configService.getErrorPageConfig("404")
      error(errorConfig)
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