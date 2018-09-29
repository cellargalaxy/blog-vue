<template>
  <b-form class="translucent">
    <b-form-group>
      <b-form-textarea v-model="commentForm.markdown" placeholder="支持markdown" :rows="5" class="translucent"/>
    </b-form-group>

    <b-form-group>
      <b-button @click="postComment" variant="success" style="width: 100%;">发表评论</b-button>
    </b-form-group>
  </b-form>
</template>

<!--<comment-form :userId="userId" :articleId="articleId"/>-->

<script>
  import util from '../utils/util'
  import guestComment from '../guestApi/guestComment'

  export default {
    name: "commentForm",
    data() {
      return {
        commentForm: {userId: this.userId, articleId: this.articleId, markdown: null,}
      }
    },
    props: {
      userId: {
        default: function () {
          return 0
        }
      },
      articleId: {
        default: function () {
          return 0
        }
      },
    },
    methods: {
      postComment: function () {
        guestComment.addComment(this.commentForm)
          .then(res => {
            util.successInfo('添加成功')
            this.commentForm = {userId: this.userId, articleId: this.articleId, markdown: null,}
            location.reload();
          })
      },
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
