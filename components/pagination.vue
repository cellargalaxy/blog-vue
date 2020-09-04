<template>
  <b-pagination :hide-ellipsis="true" :limit="12" :per-page="pageSize" :total-rows="total" :value="currentPage"
                @change="change" align="center" class="white-background-8" pills></b-pagination>
</template>

<pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
  export default {
    name: "pagination",
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
        window.location.href = '../' + page + '/'
      },
    },
  }
</script>

<style scoped>
  .white-background-8 {
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>
