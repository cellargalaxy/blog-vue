<template>
  <div>
    <nuxt/>
    <page-foot/>
    <goto-top/>
  </div>
</template>

<script>
  import pageFoot from '../components/pageFoot'
  import gotoTop from '../components/gotoTop'

  export default {
    name: "default",
    props: {
      sort: {
        default: function () {
          return this.$route.params.sort != undefined ? this.$route.params.sort : ''
        }
      },
    },
    components: {
      pageFoot,
      gotoTop,
    },
  }
</script>

<style scoped>

</style>
