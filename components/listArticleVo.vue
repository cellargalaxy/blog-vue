<template>
  <div>
    <view-article-vo v-for="(articleVo,articleVoIndex) in articleVos" :key="articleVoIndex" :articleVo="articleVo" :readmore="true" style="padding-bottom: 1em;"/>
  </div>
</template>

<!--<list-article-vo :articleVos="articleVos"/>-->

<script>
  import viewArticleVo from './viewArticleVo'

  export default {
    name: "listArticleVo",
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
    },
    components: {
      viewArticleVo,
    },
  }
</script>

<style scoped>

</style>
