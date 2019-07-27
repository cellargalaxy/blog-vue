<template>
  <div>
    <article-view v-for="(article,articleIndex) in articles" :key="articleIndex" :article="article" :isSummary="true"/>
  </div>
</template>

<article-list :articles="articles"/>

<script>
  import articleView from './articleView'

  export default {
    name: "articleList",
    props: {
      articles: {
        default: function () {
          return [
            {
              "title": "测试",
              "url": "#",
              "attributes": [{"name": "时间", "value": "2019-01-01"}],
              "summaryHtml": "summaryHtml",
              "html": "html",
            },
            {
              "title": "测试",
              "url": "#",
              "attributes": [{"name": "时间", "value": "2019-01-01"}],
              "summaryHtml": "summaryHtml",
              "html": "html",
            },
            {
              "title": "测试",
              "url": "#",
              "attributes": [{"name": "时间", "value": "2019-01-01"}],
              "summaryHtml": "summaryHtml",
              "html": "html",
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
