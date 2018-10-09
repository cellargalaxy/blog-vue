<template>
  <b-form class="translucent">
    <b-form-group>
      <b-form-textarea v-model="commentForm.markdown" placeholder='支持markdown。由于缓存，新评论需要过几分钟，刷新页面才能显示。'
                       :rows="5" class="translucent"/>
    </b-form-group>

    <b-form-group>
      <b-button @click="postComment" variant="outline-success" style="width: 100%;">发表评论</b-button>
    </b-form-group>
  </b-form>
</template>

<comment-form :articleId="articleId"/>

<script>
  import util from '../utils/util'
  import guestComment from '../guestApi/guestComment'

  export default {
    name: "commentForm",
    data() {
      return {
        commentForm: {userId: 0, articleId: this.articleId, markdown: null,}
      }
    },
    props: {
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
            util.successInfo('成功评论')
            this.commentForm = {userId: 0, articleId: this.articleId, markdown: null,}
            location.reload();
          })
      },
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
