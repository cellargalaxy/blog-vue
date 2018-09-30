<template>
  <list-article-vo-layout :articleVos="articleVos" :total="total" :pageSize="articleQuery.pageSize"
                          :currentPage="articleQuery.page"/>
</template>

<script>
  import guestArticle from '../../guestApi/guestArticle'
  import listArticleVoLayout from '../../components/listArticleVoLayout'

  export default {
    name: "_page",
    validate({params}) {
      return /^\d+$/.test(params.page)
    },
    async asyncData({params}) {
      var articleQuery = guestArticle.createArticleQuery()
      articleQuery.sort = params.sort
      articleQuery.page = parseInt(params.page)

      var {articleVos} = await guestArticle.listArticleVo(articleQuery)
      var {total} = await guestArticle.getArticleCount(articleQuery)
      return {articleVos: articleVos, articleQuery: articleQuery, total: total}
    },
    components: {
      listArticleVoLayout,
    },
  }
</script>

<style scoped>

</style>
