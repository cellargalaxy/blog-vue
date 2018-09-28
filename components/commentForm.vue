<template>
  <b-form @submit="postComment" class="translucent">
    <b-form-group>
      <b-form-textarea v-model="commentForm.markdown" placeholder="支持markdown" :rows="5" class="translucent"/>
    </b-form-group>

    <b-form-group>
      <b-button variant="success" style="width: 100%;">发表评论</b-button>
    </b-form-group>
  </b-form>
</template>

<script>
  export default {
    name: "commentForm",
    data() {
      return {
        commentForm: {
          userId: 2,
          articleId: 1,
          markdown: null,
        }
      }
    },
    methods: {
      postComment: function () {
        console.log('postComment')
      },
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
