<template>
  <div>
    <archives :archives="archives"/>
    <br/>
    <pagination :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
  </div>
</template>

<archives-and-page :archives="archives" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>

<script>
  import archives from './archives'
  import pagination from './pagination'

  export default {
    name: "archivesAndPage", //归档与分页
    props: {
      archives: {
        default() {
          return [
            {
              "dateString": "2020-01",
              "files": [
                {
                  "title": "测试文章标题-1-1",
                  "url": "#",
                  "dateString": "2020-01-01",
                  "attributes": [{"name": "name", "value": "value", "url": "#"}]
                },
                {
                  "title": "测试文章标题-1-2",
                  "url": "#",
                  "dateString": "2020-01-02",
                  "attributes": [{"name": "name", "value": "value", "url": "#"}]
                },
                {
                  "title": "测试文章标题-1-3",
                  "url": "#",
                  "dateString": "2020-01-03",
                  "attributes": [{"name": "name", "value": "value", "url": "#"}]
                },
              ],
            },
            {
              "dateString": "2020-02",
              "files": [
                {"title": "测试文章标题-2-1", "url": "#", "dateString": "2020-02-01"},
                {"title": "测试文章标题-2-2", "url": "#", "dateString": "2020-02-02"},
                {"title": "测试文章标题-2-3", "url": "#", "dateString": "2020-02-03"},
              ],
            },
            {
              "dateString": "2020-03",
              "files": [
                {"title": "测试文章标题-3-1", "url": "#", "dateString": "2020-03-01"},
                {"title": "测试文章标题-3-2", "url": "#", "dateString": "2020-03-02"},
                {"title": "测试文章标题-3-3", "url": "#", "dateString": "2020-03-03"},
              ],
            },
          ]
        }
      },
      total: {
        default() {
          return 5
        }
      },
      pageSize: {
        default() {
          return 1
        }
      },
      currentPage: {
        default() {
          return 1
        }
      },
    },
    components: {
      archives,
      pagination,
    },
  }
</script>

<style scoped>

</style>
