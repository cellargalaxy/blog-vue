<template>
  <div>
    <page-head :sort="articleQuery.sort"/>

    <b-container>
      <list-article-layout :articles="articles" :total="total"
                           :pageSize="articleQuery.pageSize" :currentPage="articleQuery.page"/>
    </b-container>
  </div>
</template>

<script>
  import guestArticle from '../../guestApi/guestArticle'
  import pageHead from '../../components/pageHead'
  import listArticleLayout from '../../components/listArticleLayout'

  export default {
    name: "_sort_page",
    validate({params}) {
      return /^\d+$/.test(params.page)
    },
    async asyncData({params}) {
      return {params:params}
    },
    data() {
      return {
        articleQuery: guestArticle.createArticleQuery(),
        articles: [],
        total: 0
      }
    },
    created: function () {
      this.articleQuery.sort = this.params.sort
      this.articleQuery.page = parseInt(this.params.page)

      guestArticle.listArticleBySort(this.articleQuery)
        .then(res => {
          this.articles = res
        })

      guestArticle.getArticleCountBySort(this.articleQuery)
        .then(res => {
          this.total = res
        })
    },
    components: {
      pageHead,
      listArticleLayout,
    },
  }
</script>

<style scoped>

</style>
