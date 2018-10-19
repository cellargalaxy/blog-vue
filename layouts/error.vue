<template>
  <div>
    <page-head :name="''" :path="''"/>

    <b-container>
      <b-card class="text-center translucent white">
        <h2 v-text="error.statusCode"/>
        <p v-text="error.message"/>
        <nuxt-link to="/">回去首页溜达</nuxt-link>
      </b-card>
      <br/>
    </b-container>

  </div>
</template>

<script>
  import pageHead from '../components/pageHead'

  export default {
    name: "error",
    props: ['error'],
    components: {
      pageHead,
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
