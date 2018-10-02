<template>
  <list-article-vo-layout :articleVos="articleVos" :total="total" :pageSize="articleQuery.pageSize"
                          :currentPage="articleQuery.page"/>
</template>

<script>
  import guestArticle from '../../guestApi/guestArticle'
  import listArticleVoLayout from '../../components/listArticleVoLayout'

  export default {
    name: "_sort_page",
    validate({params}) {
      return /^\d+$/.test(params.page)
    },
    async asyncData({params}) {
      let articleQuery = guestArticle.createArticleQuery()
      articleQuery.sort = params.sort
      articleQuery.page = parseInt(params.page)

      let listArticleVo = await guestArticle.listArticleVo(articleQuery)
      let getArticleCount = await guestArticle.getArticleCount(articleQuery)
      return {articleVos: listArticleVo, articleQuery: articleQuery, total: getArticleCount}
    },
    components: {
      listArticleVoLayout,
    },
  }
</script>

<style scoped>

</style>
