<template>
  <div>
    <page-head :name="''" :path="''"/>

    <b-container>
      <b-row>
        <b-col>
          <fool-nav :navs="sorts" :isFool="false"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import guestSort from '../guestApi/guestSort'
  import pageHead from '../components/pageHead'
  import foolNav from '../components/foolNav'

  export default {
    name: "index",
    async asyncData({params}) {
      let listAbleSort = await guestSort.listShowSort()
      for (let i = 0; i < listAbleSort.length; i++) {
        listAbleSort[i].path = 'http://blog.cellargalaxy.top/' + listAbleSort[i].sort + '/1'
        listAbleSort[i].name = listAbleSort[i].sort
      }
      return {sorts: listAbleSort}
    },
    components: {
      pageHead,
      foolNav,
    },
    layout: 'home',
  }
</script>

<style scoped>
</style>

