<template>
  <b-list-group>
    <b-list-group-item class="translucent">
      <h2>
        <b-link :href="articleVo.article.url" v-text="articleVo.article.title"/>
      </h2>

      发布
      <b-badge v-text="articleVo.article.createTime"/>
      更新
      <b-badge v-text="articleVo.article.updateTime"/>
      作者
      <b-badge v-text="articleVo.article.username"/>
      浏览
      <b-badge v-text="articleVo.article.view"/>
      评论
      <b-badge v-text="articleVo.comments.length"/>
    </b-list-group-item>

    <b-list-group-item class="translucent" v-html="articleVo.article.html"/>

    <b-list-group-item class="translucent" v-if="readmore">
      <b-link :href="articleVo.article.url">阅读更多</b-link>
    </b-list-group-item>
  </b-list-group>
</template>

<!--<view-article :articleVo="articleVo"/>-->

<script>
  import common from '../commonApi/common'

  export default {
    name: "viewArticle",
    data() {
      return {}
    },
    props: {
      articleVo: {
        default: function () {
          return {
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
          }
        }
      },
      readmore: {
        default: function () {
          return false
        }
      },
    },
    watch: {
      articleVo(val) {
        common.initArticle(val.article)
        for (let i = 0; i < val.tags.length; i++) {
          common.initTag(val.tags[i])
        }
        for (let i = 0; i < val.comments.length; i++) {
          common.initTag(val.comments[i])
        }
      },
    },
    created: function () {
      common.initArticle(this.articleVo.article)
      for (let i = 0; i < this.articleVo.tags.length; i++) {
        common.initTag(this.articleVo.tags[i])
      }
      for (let i = 0; i < this.articleVo.comments.length; i++) {
        common.initTag(this.articleVo.comments[i])
      }
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
