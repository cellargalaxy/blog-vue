<template>
  <div>
    <view-article-vo :articleVo="articleVo" :readmore="false"/>
    <br/>
    <comment-form :userId="userId" :articleId="articleVo.article.articleId"/>
    <list-comment :comments="articleVo.comments"/>
  </div>
</template>

<!--<article-vo-layout :articleVo="articleVo" :userId="userId"/>-->

<script>
  import viewArticleVo from './viewArticleVo'
  import commentForm from './commentForm'
  import listComment from './listComment'

  export default {
    name: "articleVoLayout",
    props: {
      articleVo: {
        default: function () {
          return {
            "article": {
              "articleId": 1,
              "userId": 2,
              "sortId": 1,
              "title": "测试",
              "markdown": "# 文章markdown",
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
                "markdown": "## 评论markdown",
                "createTime": 1538124214584,
                "updateTime": 1538124214584,
                "username": "游客"
              }
            ]
          }
        }
      },
      userId: {
        default: function () {
          return 0
        }
      },
    },
    components: {
      viewArticleVo,
      commentForm,
      listComment,
    },
  }
</script>

<style scoped>

</style>
