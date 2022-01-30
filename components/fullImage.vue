<template>
  <div :style="{backgroundImage:'url('+url+')'}" class="full-image"/>
</template>

<full-image :url="url"/>

<script>
export default {
  name: "fullImage", //全图
  props: {
    url: {
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
