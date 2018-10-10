<template>
  <div>
    <page-head :sort="''"/>

    <b-container>
      <edit-article :sorts="sorts"/>
    </b-container>
  </div>
</template>

<script>
  import guestSort from '../../../guestApi/guestSort'
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
      guestSort.listAllSort()
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
