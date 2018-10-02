<template>
  <edit-article :userId="userId" :sorts="sorts"/>
</template>

<script>
  import util from '../../../utils/util'
  import axios from '../../../utils/axios'
  import guestSort from '../../../guestApi/guestSort'
  import publicApi from '../../../commonApi/publicApi'
  import editArticle from '../../../components/editArticle'

  export default {
    name: "adminEditArticleIndex.vue",
    validate({params}) {
      return true
    },
    async asyncData({params, req, error}) {
      axios.setToken(util.getCookieFromString(req.headers.cookie, 'Authorization'))
      let listAllSort = await guestSort.listAllSort()
      return {sorts: listAllSort}
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
