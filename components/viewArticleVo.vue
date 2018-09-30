<template>
  <b-list-group>
    <b-list-group-item class="translucent">
      <b-row>
        <h2>
          <b-link :href="articleVo.article.url" v-text="articleVo.article.title"/>
        </h2>
      </b-row>

      <b-row>
        <b-col align-self="start">
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
        </b-col>

        <b-col v-if="readmore" cols="auto">
          <b-link :href="articleVo.article.url">阅读更多</b-link>
        </b-col>
      </b-row>
    </b-list-group-item>

    <b-list-group-item class="translucent" v-html="readmore?articleVo.article.summary:articleVo.article.html"/>
  </b-list-group>
</template>

<!--<view-article-vo :articleVo="articleVo" :readmore="readmore"/>-->

<script>
  import common from '../commonApi/common'

  export default {
    name: "viewArticleVo",
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
      readmore: {
        default: function () {
          return true
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
