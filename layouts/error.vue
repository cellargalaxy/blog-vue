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

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-129312781-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-129312781-1');
    </script>

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
