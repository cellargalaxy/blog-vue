<template>
  <div>
    <page-head :name="'后台管理'" :path="'/admin'"/>

    <b-container>
      <edit-article :sorts="sorts"/>
    </b-container>
  </div>
</template>

<script>
  import util from '../../../utils/util'
  import account from '../../../utils/account'
  import adminSort from '../../../adminApi/adminSort'
  import pageHead from '../../../components/pageHead'
  import editArticle from '../../../components/editArticle'

  export default {
    name: "adminEditArticleIndex.vue",
    validate({params, req}) {
      var token = util.getCookieFromString(req.headers.cookie, account.tokenKey)
      return token != null && token != ''
    },
    data() {
      return {
        sorts: []
      }
    },
    created: function () {
      adminSort.listAllSort()
        .then(res => {
          this.sorts = res
        })
    },
    components: {
      pageHead,
      editArticle
    },
  }
</script>

<style scoped>

</style>
