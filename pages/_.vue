<template>
  <article-view :article="article" :isSummary="false"/>
</template>

<script>
  import articleView from '../components/articleView'
  import articleService from '../assets/service/articleService'

  export default {
    name: "articlePath",
    async asyncData({params, error}) {
      const articlePath = '/' + params.pathMatch
      console.log('articlePath')
      console.log(articlePath)
      console.log('articlePath')
      const article = articleService.getArticle(articlePath)
      if (!article) {
        error({statusCode: 404, message: '你找的文章不翼而飞了'})
        return
      }
      return {article: article}
    },
    components: {
      articleView,
    },
    layout: 'default',
  }
</script>

<style scoped>

</style>