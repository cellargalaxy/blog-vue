<template>
  <div>
    <page-head :name="'后台管理'" :path="'/admin'"/>

    <b-container>
      <article-table-layout :articles="articles" :total="total" :pageSize="articleQuery.pageSize"
                            :currentPage="articleQuery.page"/>
    </b-container>
  </div>
</template>

<script>
  import util from '../../../utils/util'
  import account from '../../../utils/account'
  import adminArticle from '../../../adminApi/adminArticle'
  import guestArticle from '../../../guestApi/guestArticle'
  import pageHead from '../../../components/pageHead'
  import articleTableLayout from '../../../components/articleTableLayout'

  export default {
    name: "adminListArticle_page",
    validate({params, req}) {
      var token = util.getCookieFromString(req.headers.cookie, account.tokenKey)
      return /^\d+$/.test(params.page) && token != null && token != ''
    },
    async asyncData({params}) {
      return {params: params}
    },
    data() {
      return {
        articleQuery: guestArticle.createArticleQuery(),
        articles: [],
        total: 0
      }
    },
    created: function () {
      this.articleQuery.page = parseInt(this.params.page)

      adminArticle.listArticle(this.articleQuery)
        .then(res => {
          this.articles = res
        })

      guestArticle.getArticleCountBySortAndStatus(this.articleQuery)
        .then(res => {
          this.total = res
        })
    },
    components: {
      pageHead,
      articleTableLayout,
    },
  }
</script>

<style scoped>

</style>
