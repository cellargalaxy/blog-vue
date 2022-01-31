<template>
  <div>
    <article-list :contents="contents"/>
    <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
  </div>
</template>

<article-list-and-page :contents="contents" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
  import articleList from './articleList'
  import pagination from './pagination'

  export default {
    name: "articleListAndPage",
    props: {
      contents: {
        default() {
          return undefined
        }
      },
      total: {
        default() {
          return undefined
        }
      },
      pageSize: {
        default() {
          return undefined
        }
      },
      currentPage: {
        default() {
          return undefined
        }
      },
    },
    components: {
      articleList,
      pagination,
    },
  }
</script>
