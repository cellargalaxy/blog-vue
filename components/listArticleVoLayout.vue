<template>
  <div>
    <list-article-vo :articleVos="articleVos"/>
    <pagination :total="total" :pageSize="pageSize" :currentPage="currentPage"/>
  </div>
</template>

<!--<list-article-vo-layout :articleVos="articleVos" :total="total" :pageSize="pageSize" :currentPage="currentPage"/>-->

<script>
  import listArticleVo from './listArticleVo'
  import pagination from './pagination'

  export default {
    name: "listArticleVoLayout",
    data() {
      return {}
    },
    props: {
      articleVos: {
        default: function () {
          return [{
            "article": {
              "articleId": 1,
              "userId": 2,
              "sortId": 1,
              "title": "测试",
              "markdown": "## 文章markdown",
              "view": 50,
              "createTime": 1538124214583,
              "updateTime": 1538124214583,
              "username": "游客",
              "sort": "tag",
              "url": "/article/1",
            },
            "tags": [
              {
                "tagId": 1,
                "articleId": 0,
                "tag": "tag",
                "createTime": 1538124214583,
                "updateTime": 1538124214583
              }
            ],
            "comments": [
              {
                "commentId": 1,
                "userId": 2,
                "articleId": 1,
                "markdown": "# 文章markdown",
                "createTime": 1538124214584,
                "updateTime": 1538124214584,
                "username": "游客"
              }
            ]
          }, {
            "article": {
              "articleId": 1,
              "userId": 2,
              "sortId": 1,
              "title": "测试",
              "markdown": "## 文章markdown",
              "view": 50,
              "createTime": 1538124214583,
              "updateTime": 1538124214583,
              "username": "游客",
              "sort": "tag",
              "url": "/article/1",
            },
            "tags": [
              {
                "tagId": 1,
                "articleId": 0,
                "tag": "tag",
                "createTime": 1538124214583,
                "updateTime": 1538124214583
              }
            ],
            "comments": [
              {
                "commentId": 1,
                "userId": 2,
                "articleId": 1,
                "markdown": "# 文章markdown",
                "createTime": 1538124214584,
                "updateTime": 1538124214584,
                "username": "游客"
              }
            ]
          }, {
            "article": {
              "articleId": 1,
              "userId": 2,
              "sortId": 1,
              "title": "测试",
              "markdown": "## 文章markdown",
              "view": 50,
              "createTime": 1538124214583,
              "updateTime": 1538124214583,
              "username": "游客",
              "sort": "tag",
              "url": "/article/1",
            },
            "tags": [
              {
                "tagId": 1,
                "articleId": 0,
                "tag": "tag",
                "createTime": 1538124214583,
                "updateTime": 1538124214583
              }
            ],
            "comments": [
              {
                "commentId": 1,
                "userId": 2,
                "articleId": 1,
                "markdown": "# 文章markdown",
                "createTime": 1538124214584,
                "updateTime": 1538124214584,
                "username": "游客"
              }
            ]
          }]
        }
      },
      total: {
        default: function () {
          return 25
        }
      },
      pageSize: {
        default: function () {
          return 10
        }
      },
      currentPage: {
        default: function () {
          return 1
        }
      },
    },
    components: {
      listArticleVo,
      pagination,
    },
  }
</script>

<style scoped>
  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
