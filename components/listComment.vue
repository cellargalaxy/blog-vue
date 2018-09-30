<template>
  <div>
    <comment v-for="(comment,commentIndex) in comments" :key="commentIndex" :comment="comment" :floor="comments.length-commentIndex"
             style="padding-bottom: 0.5em;"/>
  </div>
</template>

<!--<list-comment :comments="comments"/>-->

<script>
  import comment from './comment'

  export default {
    name: "listComment",
    data() {
      return {}
    },
    props: {
      comments: {
        default: function () {
          return [{
            "commentId": 1,
            "userId": 2,
            "articleId": 1,
            "markdown": "## 评论markdown",
            "createTime": 1538124214584,
            "updateTime": 1538124214584,
            "username": "游客"
          }, {
            "commentId": 1,
            "userId": 2,
            "articleId": 1,
            "markdown": "## 评论markdown",
            "createTime": 1538124214584,
            "updateTime": 1538124214584,
            "username": "游客"
          }, {
            "commentId": 1,
            "userId": 2,
            "articleId": 1,
            "markdown": "## 评论markdown",
            "createTime": 1538124214584,
            "updateTime": 1538124214584,
            "username": "游客"
          }]
        }
      },
    },
    components: {
      comment,
    },
  }
</script>

<style scoped>

</style>
