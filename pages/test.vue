<template>
  <div>
    <page-head :sort="'测试分类'"/>
    <b-container>
      <!--<com/>-->
    </b-container>
  </div>
</template>

<script>
  import pageHead from '../components/pageHead'
  import com from '../components/viewArticleLayout.vue'

  export default {
    name: "test",
    components: {
      com,
      pageHead,
    },
  }
</script>

<style >

</style>
