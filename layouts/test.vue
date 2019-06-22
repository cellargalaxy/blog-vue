<template>
  <nuxt/>
</template>

<script>
  import navbar from '../components/navbar'
  import pageHead from '../components/pageHead'
  import pageFoot from '../components/pageFoot'
  import goto from '../components/goto'

  export default {
    name: "test",
    components: {
      navbar,
      pageHead,
      pageFoot,
      goto,
    },
  }
</script>

<style scoped>

</style>