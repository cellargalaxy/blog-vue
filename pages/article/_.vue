<template>
  <div>
    <navbar :config="navbarConfig"/>
    <page-head :config="pageHeadConfig"/>

    <b-container>
      <article-view :article="article" :isSummary="false" v-if="isArticle"/>
      <article-list-and-page :articles="articles" :currentPage="currentPage" :pageSize="pageSize" :total="total"
                             v-if="!isArticle"/>
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
  import articleListAndPage from '../../components/articleListAndPage'

  import articleService from '../../assets/service/articleService'
  import configService from '../../assets/service/configService'

  export default {
    name: "articlePath",
    async asyncData({params, query, error}) {
      const articlePath = '/' + params.pathMatch

      const article = articleService.getArticle(articlePath)
      if (article) {
        return {
          isArticle: true,
          article: article,
          navbarConfig: configService.getNavbarConfig(),
          pageHeadConfig: configService.getPageHeadConfig(),
          pageFootConfig: configService.getPageFootConfig(),
          gotoConfig: configService.getGotoConfig(),
        }
      }

      const pageSize = configService.getArticleConfig().pageSize
      const currentPage = query.page ? query.page : 1
      const total = articleService.listArticleByPath(articlePath).length
      const articles = articleService.listArticlePageByPath(articlePath, pageSize, currentPage)
      if (articles && articles.length > 0) {
        return {
          isArticle: false,
          pageSize: pageSize,
          currentPage: currentPage,
          total: total,
          articles: articles,
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
      articleListAndPage,
      navbar,
      pageHead,
      pageFoot,
      goto,
    },
  }
</script>

<style scoped>

</style>