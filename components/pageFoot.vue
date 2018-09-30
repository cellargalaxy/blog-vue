<template>
  <b-card class="text-center black-translucent white">
    <p v-text="'Copyright © 2017-'+year+' cellargalaxy.'"/>
    <p v-text="'All rights reserved.'"/>
    <p>Powered by Spring Boot & Nuxt.js</p>
  </b-card>
</template>

<!--<page-foot/>-->

<script>
  import util from '../utils/util'

  export default {
    name: "pageFoot",
    computed: {
      year: function () {
        return util.formatDate(new Date(), 'yyyy')
      }
    }
  }
</script>

<style scoped>
  .black-translucent {
    background-color: rgba(83, 154, 196, 0.7);
  }

  .white {
    color: rgba(255, 255, 255, 1);
  }
</style>
