<template>
  <div>
    <article-list :files="files"/>
    <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
  </div>
</template>

<article-list-and-page :files="files" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
import articleList from './articleList'
import pagination from './pagination'

export default {
  name: "articleListAndPage",
  props: {
    files: {
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
