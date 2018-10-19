<template>
  <div>
    <page-head :name="'后台管理'" :path="'/admin'"/>

    <b-container>
      <edit-article :sorts="sorts" :articleForm="article" @flushArticle="flushArticle"/>
    </b-container>
  </div>
</template>

<script>
  import util from '../../../../utils/util'
  import account from '../../../../utils/account'
  import adminSort from '../../../../adminApi/adminSort'
  import adminArticle from '../../../../adminApi/adminArticle'
  import pageHead from '../../../../components/pageHead'
  import editArticle from '../../../../components/editArticle'

  export default {
    name: "adminEditArticle_createDate_title.vue",
    validate({params, req}) {
      var token = util.getCookieFromString(req.headers.cookie, account.tokenKey)
      return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(params.createDate) && token != null && token != ''
    },
    async asyncData({params}) {
      return {params: params}
    },
    data() {
      return {
        sorts: [],
        article: {},
      }
    },
    created: function () {
      adminSort.listAllSort()
        .then(res => {
          this.sorts = res
        })

      adminArticle.getArticle(this.params)
        .then(res => {
          this.article = res
        })
    },
    methods: {
      flushArticle: function (createDate, title) {
        adminArticle.getArticle({createDate: createDate, title: title})
          .then(res => {
            this.article = res
          })
      },
    },
    components: {
      pageHead,
      editArticle
    },
  }
</script>

<style scoped>

</style>
