<template>
  <div :style="{backgroundImage:'url('+scrub+'), url('+url+')'}" class="full-scrub-image"></div>
</template>

<full-scrub-image :url="url"/>

<script>
export default {
  name: "fullScrubImage", //磨砂全图
  props: {
    scrub: {
      default: function () {
        return require('@/assets/image/scrub.svg')
      }
    },
    url: {
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
  background-position: 0 0, center;
  background-attachment: scroll, fixed;
  background-size: auto, cover;
  height: 100vh;
}
</style>
