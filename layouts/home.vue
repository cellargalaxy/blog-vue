<template>
  <div>
    <b-container>
      <nuxt/>
    </b-container>

    <page-foot class="footer"/>

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

  export default {
    name: "home",
    props: {
      sort: {
        default: function () {
          return ''
        }
      },
    },
    components: {
      pageFoot,
    },
  }
</script>

<style scoped>
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
