<template>
  <b-container>
    <b-row align-v="center" class="text-center" style="height: 100vh">
      <b-col lg="3" md="2" sm="0" xl="3"/>
      <b-col lg="6" md="8" sm="12" xl="6">
        <b-card :title="error.statusCode+''" class="text-center white-background-8 white" style="border:none;">
          <b-card-text>{{ error.statusCode === 404 ? 'Page not found' : 'unknown error' }}</b-card-text>
          <nuxt-link to="/">go back home page</nuxt-link>
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

</style>
