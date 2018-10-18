<template>
  <div>
    <page-head :name="'测试分类'" :path="'#'"/>
    <b-container>
      <com/>
    </b-container>
  </div>
</template>

<script>
  import pageHead from '../components/pageHead'
  import com from '../components/articleTable.vue'

  export default {
    name: "test",
    components: {
      com,
      pageHead,
    },
  }
</script>

<style>

</style>
