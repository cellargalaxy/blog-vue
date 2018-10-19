<template>
  <div>
    <b-container>
      <b-card class="text-center translucent white">
        <h2 v-text="error.statusCode"/>
        <p v-text="error.message"/>
        <nuxt-link to="/">回去首页溜达</nuxt-link>
      </b-card>
    </b-container>

    <page-foot class="footer"/>
  </div>
</template>

<script>
  import pageFoot from '../components/pageFoot'
  export default {
    name: "error",
    props: ['error'],
    components: {
      pageFoot,
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
