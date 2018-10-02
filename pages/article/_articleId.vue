<template>
  <article-vo-layout :articleVo="articleVo" :userId="userId"/>
</template>

<script>
  import publicApi from '../../commonApi/publicApi'
  import guestArticle from '../../guestApi/guestArticle'
  import articleVoLayout from '../../components/articleVoLayout.vue'

  export default {
    name: "article_articleId.vue",
    validate({params}) {
      return /^\d+$/.test(params.articleId)
    },
    async asyncData({params, error}) {
      let viewArticle = await guestArticle.viewArticle(params)
      if (viewArticle != null) {
        return {articleVo: viewArticle}
      } else {
        error({statusCode: 404, message: '你找的文章不翼而飞了！'})
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
      articleVoLayout
    },
  }
</script>

<style scoped>

</style>
