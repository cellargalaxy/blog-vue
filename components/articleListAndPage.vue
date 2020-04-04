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
      total: {
        default() {
          return 25
        }
      },
      pageSize: {
        default() {
          return 10
        }
      },
      currentPage: {
        default() {
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
