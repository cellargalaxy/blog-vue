<template>
  <div>
    <page-head :sort="''"/>

    <b-container>
      <login-form/>
    </b-container>
  </div>
</template>

<script>
  import pageHead from '../components/pageHead'
  import loginForm from '../components/loginForm.vue'

  export default {
    name: "login",
    components: {
      pageHead,
      loginForm,
    },
  }
</script>

<style scoped>

</style>
