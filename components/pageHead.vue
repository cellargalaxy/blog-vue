<template>
  <b-card class="text-center transparent">
    <b-img v-if="config.avatarUrl" :src="config.avatarUrl" thumbnail fluid class="translucent"/>
    <br v-if="config.siteName"/>
    <br v-if="config.siteName"/>
    <h2 v-if="config.siteName">
      <b class="white">
        <b-link v-text="config.siteName" :href="config.siteUrl" class="white"/>
      </b>
    </h2>
  </b-card>
</template>

<page-head/>

<script>
  import configService from '../assets/service/configService'

  export default {
    name: "pageHead",
    computed: {
      config: function () {
        return configService.getPageHeadConfig()
      }
    },
  }
</script>

<style scoped>
  .white {
    color: rgba(255, 255, 255, 1);
  }

  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
