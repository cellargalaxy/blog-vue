<template>
  <div>
    <article-view :article="article" :isSummary="isSummary"/>
    <comment/>
  </div>
</template>

<article-comment :article="article" :isSummary="isSummary"/>

<script>
  import articleView from './articleView'
  import comment from './comment'

  export default {
    name: "articleComment",
    props: {
      article: {
        default() {
          return {
            "title": "测试文章标题-1-1", "url": "#", "content": "content", "summary": "summary",
            "attributes": [
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            ],
          }
        }
      },
      isSummary: {
        default() {
          return false
        }
      },
    },
    components: {
      articleView,
      comment,
    },
  }
</script>

<style scoped>

</style>