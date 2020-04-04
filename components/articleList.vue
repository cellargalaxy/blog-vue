<template>
  <div>
    <article-view v-for="(article,i) in articles" :key="i" :article="article" :isSummary="true"/>
  </div>
</template>

<article-list :articles="articles"/>

<script>
  import articleView from './articleView'

  export default {
    name: "articleList",
    props: {
      articles: {
        default() {
          return [
            {
              "title": "测试文章标题-1-1", "url": "#", "content": "content", "summary": "summary",
              "attributes": [
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              ],
            },
            {
              "title": "测试文章标题-1-2", "url": "#", "content": "content", "summary": "summary",
              "attributes": [
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              ],
            },
            {
              "title": "测试文章标题-1-3", "url": "#", "content": "content", "summary": "summary",
              "attributes": [
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
                {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              ],
            },
          ]
        }
      },
    },
    components: {
      articleView,
    },
  }
</script>
