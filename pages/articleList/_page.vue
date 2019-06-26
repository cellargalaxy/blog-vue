<template>
  <div>
    <navbar :config="navbarConfig"/>
    <page-head :config="pageHeadConfig"/>

    <b-container>
      <article-list-and-page :articles="articles" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
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
  import articleListAndPage from '../../components/articleListAndPage'
  import articleService from '../../assets/service/articleService'
  import configService from '../../assets/service/configService'

  export default {
    name: "page",
    validate({params}) {
      return /^\d+$/.test(params.page)
    },
    async asyncData({params, error}) {
      const pageSize = configService.getArticleConfig().pageSize
      const currentPage = params.page
      const total = articleService.listArticle().length
      const articles = articleService.listArticlePage(pageSize, currentPage)
      if (articles && articles.length == 0) {
        error({statusCode: 404, message: '翻页翻过头了'})
        return
      }
      return {
        pageSize: pageSize,
        currentPage: currentPage,
        total: total,
        articles: articles,
        navbarConfig: configService.getNavbarConfig(),
        pageHeadConfig: configService.getPageHeadConfig(),
        pageFootConfig: configService.getPageFootConfig(),
        gotoConfig: configService.getGotoConfig(),
      }
    },
    components: {
      articleListAndPage,
      navbar,
      pageHead,
      pageFoot,
      goto,
    },
    layout: 'default',
  }
</script>

<style scoped>

</style>