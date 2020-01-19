<template>
  <b-container>
    <b-row align-v="center" class="text-center" style="height: 100vh">
      <b-col>

        <b-card no-body class="text-center translucent white" style="border:none;">
          <h2 v-text="error.statusCode"/>
          <p v-text="error.message"/>
          <nuxt-link :to="error.returnUrl">{{error.returnText}}</nuxt-link>
        </b-card>

      </b-col>
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
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
