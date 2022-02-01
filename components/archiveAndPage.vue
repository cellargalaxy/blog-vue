<template>
  <div>
    <archive-by-content :contents="contents"/>
    <br/>
    <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
  </div>
</template>

<archive-and-page :contents="contents" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
import archiveByContent from './archiveByContent'
import pagination from './pagination'

export default {
  name: "archiveAndPage", //归档与分页
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
    archiveByContent,
    pagination,
  },
}
</script>

<style scoped>

</style>
