<template>
  <div>
    <navbar :config="navbarConfig"/>
    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <article-comment :article="article" :isSummary="false"/>
      <br/>
    </b-container>
    <page-foot :buildTimeString="buildTimeString" :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
  import navbar from '../../components/navbar'
  import pageHead from '../../components/pageHead'
  import articleComment from '../../components/articleComment'
  import pageFoot from '../../components/pageFoot'
  import backtop from '../../components/backtop'

  import articleService from '../../middleware/service/articleService'
  import configService from '../../middleware/service/configService'
  import utils from "../../middleware/utils/utils"

  export default {
    name: "articlePath",
    async asyncData({params, error}) {
      const siteConfig = configService.getSiteConfig()
      if (!siteConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
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

      let articlePath = params.pathMatch//-> a/b/c/
      let article = articleService.getArticle(articlePath)//-> root/a/b/c.md
      if (!article) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
      article = {
        content: article.content,
        title: article.title,
        url: article.url,
        attributes: article.attributes
      }

      return {
        siteName: siteConfig.siteName,
        navbarConfig: navbarConfig,
        homeConfig: homeConfig,
        article: article,
        pageFootConfig: pageFootConfig,
        buildTimeString: utils.formatDate(new Date(), pageFootConfig.buildTimeFormat),
      }
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
      articleComment,
      pageFoot,
      backtop,
    },
  }
</script>

<style scoped>

</style>