<template>
  <div>
    <page-head :name="'后台管理'" :path="'/admin'"/>

    <b-container>
      <edit-article :sorts="sorts"/>
    </b-container>
  </div>
</template>

<script>
  import adminSort from '../../../adminApi/adminSort'
  import pageHead from '../../../components/pageHead'
  import editArticle from '../../../components/editArticle'

  export default {
    name: "adminEditArticleIndex.vue",
    validate({params}) {
      return true
    },
    data() {
      return {
        sorts: []
      }
    },
    created: function () {
      adminSort.listAllSort()
        .then(res => {
          this.sorts = res
        })
    },
    components: {
      pageHead,
      editArticle
    },
  }
</script>

<style scoped>

</style>
