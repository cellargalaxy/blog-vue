<template>
  <div>
    <navbar/>

    <b-container>
      <b-row align-v="center" class="text-center" style="height: 100vh">
        <b-col>
          <nuxt/>
        </b-col>
      </b-row>
    </b-container>

    <goto/>
  </div>
</template>

<script>
  import navbar from '../components/navbar'
  import goto from '../components/goto'

  export default {
    name: "home",
    components: {
      navbar,
      goto,
    },
  }
</script>

<style scoped>

</style>
