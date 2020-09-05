<template>
  <div :style="{backgroundImage:'url('+scrubUrl+'), url('+imageUrl+')'}" class="full-scrub-image"></div>
</template>

<full-scrub-image :imageUrl="imageUrl" :scrubUrl="scrubUrl"/>

<script>
  export default {
    name: "fullScrubImage",
    props: {
      scrubUrl: {
        default: function () {
          return '/image/blurry.png'
        }
      },
      imageUrl: {
        default: function () {
          return 'https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png'
        }
      },
    },
  }
</script>

<style scoped>
  .full-scrub-image {
    background-repeat: repeat, no-repeat;
    background-position: 0% 0%, center;
    background-attachment: scroll, fixed;
    background-size: auto, cover;
    height: 100vh;
  }
</style>
