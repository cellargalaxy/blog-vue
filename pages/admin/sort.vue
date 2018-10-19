<template>
  <div>
    <page-head :name="'后台管理'" :path="'/admin'"/>

    <b-container>
      <sort-layout :sorts="sorts"/>
      <br/>
    </b-container>
  </div>
</template>

<script>
  import util from '../../utils/util'
  import account from '../../utils/account'
  import adminSort from '../../adminApi/adminSort'
  import pageHead from '../../components/pageHead'
  import sortLayout from '../../components/sortLayout.vue'

  export default {
    name: "adminSort",
    validate({params, req}) {
      var token = util.getCookieFromString(req.headers.cookie, account.tokenKey)
      return token != null && token != ''
    },
    data() {
      return {
        sorts: [],
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
      sortLayout,
    },
  }
</script>

<style scoped>

</style>
