<template>
  <div>
    <nuxt/>
    <page-foot/>
    <goto-top/>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-129312781-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-129312781-1');
    </script>

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
