<template>
  <b-list-group>
    <b-list-group-item class="translucent">
      <b-badge v-text="comment.username" variant="light" class="transparent"/>
      <b-badge v-text="comment.updateTime" variant="light" class="transparent"/>
      <b-badge v-text="floor+'楼'" variant="light" class="transparent"/>
    </b-list-group-item>

    <b-list-group-item class="translucent" v-html="comment.html"/>
  </b-list-group>
</template>

<!--<comment :comment="comment" :floor="floor"/>-->

<script>
  import common from '../commonApi/common'

  export default {
    name: "comment",
    data() {
      return {}
    },
    props: {
      comment: {
        default: function () {
          return {
            "commentId": 1,
            "userId": 2,
            "articleId": 1,
            "markdown": "## 评论markdown",
            "createTime": 1538124214584,
            "updateTime": 1538124214584,
            "username": "游客"
          }
        }
      },
      floor: {
        default: function () {
          return 1
        }
      },
    },
    watch: {
      articleVo(val) {
        common.initComment(val)
      },
    },
    created: function () {
      common.initComment(this.comment)
    },
  }
</script>

<style scoped>
  .transparent {
    background-color: rgba(255, 255, 255, 0);
  }
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
