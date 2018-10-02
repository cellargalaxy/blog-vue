<template>
  <div>
    <page-head :sort="sort"/>

    <br/>

    <b-container>
      <nuxt/>
    </b-container>

    <page-foot/>
    <goto-top/>
  </div>
</template>

<script>
  import pageHead from '../components/pageHead'
  import pageFoot from '../components/pageFoot'
  import gotoTop from '../components/gotoTop'

  export default {
    name: "default",
    props: {
      sort: {
        default: function () {
          return ''
        }
      },
    },
    components: {
      pageHead,
      pageFoot,
      gotoTop,
    },
  }
</script>

<style scoped>
</style>
