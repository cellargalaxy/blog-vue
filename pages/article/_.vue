<template>
  <div>
    <navbar :config="navbarConfig"/>
    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <article-view :article="article" :isSummary="false"/>
    </b-container>
    <page-foot :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
  import navbar from '../../components/navbar'
  import pageHead from '../../components/pageHead'
  import articleView from '../../components/articleView'
  import pageFoot from '../../components/pageFoot'
  import backtop from '../../components/backtop'

  import articleService from '../../middleware/service/articleService'
  import configService from '../../middleware/service/configService'

  export default {
    name: "articlePath",
    async asyncData({params, error}) {
      let articlePath = params.pathMatch//-> a/b/c/
      const article = articleService.getArticle(articlePath)//-> root/a/b/c.md
      if (article) {
        return {
          siteName: configService.getSiteConfig().siteName,
          navbarConfig: configService.getNavbarConfig(),
          homeConfig: configService.getHomeConfig(),
          article: article,
          pageFootConfig: configService.getPageFootConfig(),
        }
      }

      const errorConfig = configService.getErrorPageConfig("404")
      error(errorConfig)
    },
    head() {
      if (this.article.title) {
        return {
          title: this.article.title + ' | ' + this.siteName,
          meta: [{hid: 'article_description', name: 'description', content: this.article.title}]
        }
      }
      return {title: this.siteName}
    },
    components: {
      navbar,
      pageHead,
      articleView,
      pageFoot,
      backtop,
    },
  }
</script>

<style scoped>

</style>