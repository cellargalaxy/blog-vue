<template>
  <div>
    <page-head :sort="article.sort"/>

    <b-container>
      <view-article-layout :article="article"/>
    </b-container>
  </div>
</template>

<script>
  import guestArticle from '../../../guestApi/guestArticle'
  import pageHead from '../../../components/pageHead'
  import viewArticleLayout from '../../../components/viewArticleLayout.vue'

  export default {
    name: "article_createDate_title.vue",
    validate({params}) {
      return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(params.createDate)
    },
    async asyncData({params, error}) {
      let viewArticle = await guestArticle.viewArticle(params)
      if (viewArticle != null) {
        return {article: viewArticle,params:params}
      } else {
        error({statusCode: 404, message: '你找的文章不翼而飞了！'})
      }
    },
    components: {
      pageHead,
      viewArticleLayout,
    },
  }
</script>

<style scoped>

</style>
