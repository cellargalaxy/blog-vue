<template>
  <div>
    <archive-by-file :files="files"/>
    <br/>
    <pagination :start="startPage" :end="endPage" :current="currentPage"/>
  </div>
</template>

<archive-and-page :files="files" :startPage="startPage" :endPage="endPage" :currentPage="currentPage"/>

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
    startPage: {
      default() {
        return undefined
      }
    },
    endPage: {
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
