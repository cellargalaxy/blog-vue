<template>
  <edit-article :userId="userId" :sorts="sorts" :articleForm="articleForm"/>
</template>

<script>
  import util from '../../../utils/util'
  import axios from '../../../utils/axios'
  import adminArticle from '../../../adminApi/adminArticle'
  import guestSort from '../../../guestApi/guestSort'
  import publicApi from '../../../commonApi/publicApi'
  import editArticle from '../../../components/editArticle'

  export default {
    name: "adminEditArticle_articleId.vue",
    validate({params}) {
      return /^\d+$/.test(params.articleId)
    },
    async asyncData({params, req, error}) {
      axios.setTokenFromCookieString(req.headers.cookie)
      let getArticle = await adminArticle.getArticle(params)
      if (getArticle != null) {
        let listAllSort = await guestSort.listAllSort()
        return {articleForm: getArticle, sorts: listAllSort}
      } else {
        error({statusCode: 404, message: '文章不存在！'})
      }
    },
    data() {
      return {
        userId: 0
      }
    },
    created: function () {
      let userVo = publicApi.getCurrentUserVo()
      if (userVo != null) {
        this.userId = userVo.user.userId
      }
    },
    components: {
      editArticle
    },
    layout: 'admin',
  }
</script>

<style scoped>

</style>
