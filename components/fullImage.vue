<template>
  <div :style="{backgroundImage:'url('+imageUrl+')'}" class="full-image"/>
</template>

<full-image :imageUrl="imageUrl"/>

<script>
  export default {
    name: "fullImage",
    props: {
      imageUrl: {
        default() {
          return 'https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png'
        }
      },
    },
  }
</script>

<style scoped>
  .full-image {
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    background-size: cover;
    height: 100vh;
  }
</style>