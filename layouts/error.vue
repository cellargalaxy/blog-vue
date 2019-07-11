<template>
  <div>
    <b-card class="text-center translucent white">
      <h2 v-text="error.statusCode"/>
      <p v-text="error.message"/>
      <nuxt-link :to="errorPageReturnLink">{{errorPageReturnText}}</nuxt-link>
    </b-card>
    <br/>
  </div>
</template>

<script>
  import configService from '../assets/service/configService'

  export default {
    name: "error",
    props: ['error'],
    computed: {
      errorPageReturnText: function () {
        return configService.getSiteConfig().errorPageReturnText
      },
      errorPageReturnLink: function () {
        return configService.getSiteConfig().errorPageReturnLink
      },
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
