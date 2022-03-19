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
      const path = window.location.pathname
      const paths = path.split('/')
      for (let i = paths.length - 1; i >= 0; i--) {
        if (paths[i] === '') {
          continue
        }
        paths[i] = page
        window.location.href = paths.join('/')
        return
      }
      window.location.href = '/'
    },
  },
}
</script>

<style scoped>

</style>
