<template>
  <b-pagination class="white-background-8" pills align="center" :hide-ellipsis="true" :limit="12"
                :value="currentPage" :total-rows="total" :per-page="pageSize" @change="change"></b-pagination>
</template>

<pagination :total="total" :pageSize="pageSize" :currentPage="currentPage"/>

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
