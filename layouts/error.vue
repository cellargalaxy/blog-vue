<template>
  <b-card class="text-center translucent white">
    <p v-if="error.statusCode===404" v-text="'你找的页面不翼而飞了呀'"/>
    <p v-else v-text="error.statusCode+'？什么鬼异常'"/>
    <nuxt-link to="/">回去首页溜达</nuxt-link>
  </b-card>
</template>

<script>
  export default {
    name: "error",
    props: ['error'],
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
