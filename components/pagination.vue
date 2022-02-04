<template>
  <b-pagination :hide-ellipsis="true" :limit="12" :per-page="pageSize"
                :total-rows="total" :value="currentPage" align="center"
                class="white-background-8" pills @change="change"></b-pagination>
</template>

<pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
import service from "../middleware/service"

export default {
  name: "pagination", //分页
  props: {
    total: {
      default() {
        return 1000
      }
    },
    pageSize: {
      default() {
        return 10
      }
    },
    currentPage: {
      default() {
        return 15
      }
    },
  },
  methods: {
    change(page) {
      const basePath = service.getBasePath()
      const path = window.location.pathname.replace(basePath, '')
      const {folderPath} = service.parsePath(path)
      window.location.href = folderPath + '/' + page + '/'
    },
  },
}
</script>

<style scoped>

</style>
