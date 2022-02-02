<template>
  <div>
    <file-list :files="files"/>
    <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
  </div>
</template>

<file-list-and-page :files="files" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
import fileList from './fileList'
import pagination from './pagination'

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
    pagination,
  },
}
</script>
