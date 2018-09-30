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
    asyncData({params}) {
      return guestArticle.viewArticle(params)
        .then(res => {
          return {articleVo: res.data.data}
        })
    },
    data() {
      return {
        userId: 0
      }
    },
    create: function () {
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
