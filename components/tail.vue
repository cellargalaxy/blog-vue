<template>
  <b-card class="text-center translucent">
    <p v-text="'Copyright © 2017-'+year+' cellargalaxy. All rights reserved.'"/>
    <p>Powered by Spring Boot & Nuxt.js</p>
  </b-card>
</template>

<script>
  import util from '../utils/util'

  export default {
    name: "tail",
    computed: {
      year: function () {
        return util.formatDate(new Date(), 'yyyy')
      }
    }
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
