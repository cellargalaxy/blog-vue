<template>
  <div>
    <b-card class="text-center translucent white">
      <h2 v-text="error.statusCode"/>
      <p v-text="error.message"/>
      <nuxt-link to="/">回去首页溜达</nuxt-link>
    </b-card>
    <br/>
  </div>
</template>

<script>

  export default {
    name: "error",
    props: ['error'],
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
