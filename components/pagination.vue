<template>
  <b-pagination :total-rows="total" :per-page="pageSize" v-model="currentPage" @change="change"
                align="center" class="translucent"/>
</template>

<pagination :total="total" :pageSize="pageSize" :currentPage="currentPage"/>

<script>
  export default {
    name: "pagination",
    props: {
      total: {
        default: function () {
          return 100
        }
      },
      pageSize: {
        default: function () {
          return 10
        }
      },
      currentPage: {
        default: function () {
          return 1
        }
      },
    },
    methods: {
      change: function (page) {
        window.location.href = '../' + page
      },
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
