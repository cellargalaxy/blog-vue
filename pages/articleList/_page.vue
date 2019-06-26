<template>
  <article-list-and-page :articles="articles" :total="total" :pageSize="pageSize" :currentPage="currentPage"/>
</template>

<script>
  import articleListAndPage from '../../components/articleListAndPage'
  import configService from '../../assets/service/configService'
  import articleService from '../../assets/service/articleService'

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
      }
    },
    components: {
      articleListAndPage,
    },
    layout: 'default',
  }
</script>

<style scoped>

</style>