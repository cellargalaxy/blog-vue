<template>
  <div>
    <archive-by-file :files="files"/>
    <br/>
    <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
  </div>
</template>

<archive-and-page :files="files" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
import archiveByFile from './archiveByFile'
import pagination from './pagination'

export default {
  name: "archiveAndPage", //归档与分页
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
    archiveByFile,
    pagination,
  },
}
</script>

<style scoped>

</style>
