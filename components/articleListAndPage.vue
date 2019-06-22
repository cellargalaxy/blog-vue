<template>
  <div>
    <article-list :articles="articles"/>
    <pagination :total="total" :pageSize="pageSize" :currentPage="currentPage"/>
  </div>
</template>

<article-list-and-page :articles="articles" :total="total" :pageSize="pageSize" :currentPage="currentPage"/>

<script>
  import articleList from './articleList'
  import pagination from './pagination'

  export default {
    name: "articleListAndPage",
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
      total: {
        default: function () {
          return 25
        }
      },
      pageSize: {
        default: function () {
          return 10
        }
      },
      currentPage: {
        default: function () {
          return 1
        }
      },
    },
    components: {
      articleList,
      pagination,
    },
  }
</script>
