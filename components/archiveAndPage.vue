<template>
  <div>
    <archive :archives="archives"/>
    <br/>
    <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
  </div>
</template>

<archive-and-page :archives="archives" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
  import archive from './archive'
  import pagination from './pagination'

  export default {
    name: "archiveAndPage", //归档与分页
    props: {
      archives: {
        default() {
          return undefined
        }
      },
      total: {
        default() {
          return undefined
        }
      },
      pageSize: {
        default() {
          return undefined
        }
      },
      currentPage: {
        default() {
          return undefined
        }
      },
    },
    components: {
      archive,
      pagination,
    },
  }
</script>

<style scoped>

</style>
