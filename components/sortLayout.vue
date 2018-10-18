<template>
    <div>
      <sort-form/>
      <br/>
      <sort-table :sorts="sorts"/>
    </div>
</template>

<sort-layout :sorts="sorts"/>

<script>
  import sortForm from './sortForm'
  import sortTable from './sortTable'

  export default {
    name: "sortLayout",
    props: {
      sorts: {
        default: function () {
          return [{"sortId": 1, "sort": "一个分类", "status": 1}, {"sortId": 2, "sort": "两个分类", "status": 2}]
        }
      },
    },
    components: {
      sortForm,
      sortTable,
    },
  }
</script>

<style scoped>

</style>
