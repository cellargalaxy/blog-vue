<template>
  <div>
    <file-list :files="files"/>
    <pagination-page :total="total" :size="pageSize" :current="currentPage"/>
  </div>
</template>

<file-list-and-page :files="files" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
import fileList from './fileList'
import paginationPage from './paginationPage'

export default {
  name: "fileListAndPage",
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
    fileList,
    paginationPage,
  },
}
</script>
