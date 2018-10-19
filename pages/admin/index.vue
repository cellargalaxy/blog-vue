<template>
  <div>
    <page-head :name="'后台管理'" :path="'/admin'"/>

    <b-container>
      <fool-nav :navs="sorts" :isFool="false"/>
    </b-container>
  </div>
</template>

<script>
  import util from '../../utils/util'
  import account from '../../utils/account'
  import pageHead from '../../components/pageHead'
  import foolNav from '../../components/foolNav'

  export default {
    name: "adminIndex",
    validate({params, req}) {
      var token = util.getCookieFromString(req.headers.cookie, account.tokenKey)
      return token != null && token != ''
    },
    async asyncData({params}) {
      return {
        sorts: [{"path": "/admin/editArticle", "name": "编写文章"}, {"path": "/admin/sort", "name": "分类管理"},
          {"path": "/admin/listArticle/1", "name": "文章管理"}]
      }
    },
    components: {
      pageHead,
      foolNav,
    },
    layout: 'home',
  }
</script>

<style scoped>
</style>

