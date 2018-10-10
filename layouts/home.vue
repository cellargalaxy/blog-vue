<template>
  <div>
    <b-container>
      <nuxt/>
    </b-container>

    <page-foot class="footer"/>
  </div>
</template>

<script>
  import pageHead from '../components/pageHead'
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
      pageHead,
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
