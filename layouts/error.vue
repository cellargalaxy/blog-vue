<template>
  <b-container>
    <b-row align-v="center" class="text-center" style="height: 100vh">
      <b-col lg="3" md="2" sm="0" xl="3"/>
      <b-col lg="6" md="8" sm="12" xl="6">
        <b-card :title="error.statusCode" class="text-center white-background-8 white" style="border:none;">
          <b-card-text>{{error.message}}</b-card-text>
          <nuxt-link :to="error.url">{{error.text}}</nuxt-link>
        </b-card>
      </b-col>
      <b-col lg="3" md="2" sm="0" xl="3"/>
    </b-row>
  </b-container>
</template>

<script>
  export default {
    name: "error",
    props: ['error'],
  }
</script>

<style scoped>
  .white-background-8 {
    background-color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.8);
  }
</style>
