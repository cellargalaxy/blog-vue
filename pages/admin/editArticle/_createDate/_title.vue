<template>
  <div>
    <page-head :name="'后台管理'" :path="'/admin'"/>

    <b-container>
      <edit-article :sorts="sorts" :articleForm="article" @flushArticle="flushArticle"/>
    </b-container>
  </div>
</template>

<script>
  import guestSort from '../../../../guestApi/guestSort'
  import adminArticle from '../../../../adminApi/adminArticle'
  import pageHead from '../../../../components/pageHead'
  import editArticle from '../../../../components/editArticle'

  export default {
    name: "adminEditArticle_createDate_title.vue",
    validate({params}) {
      return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(params.createDate)
    },
    async asyncData({params}) {
      return {params: params}
    },
    data() {
      return {
        sorts: [],
        article: {},
      }
    },
    created: function () {
      guestSort.listAbleSort()
        .then(res => {
          this.sorts = res
        })

      adminArticle.getArticle(this.params)
        .then(res => {
          this.article = res
        })
    },
    methods: {
      flushArticle: function (createDate, title) {
        adminArticle.getArticle({createDate: createDate, title: title})
          .then(res => {
            this.article = res
          })
      },
    },
    components: {
      pageHead,
      editArticle
    },
  }
</script>

<style scoped>

</style>
