<template>
  <div :style="{backgroundImage:'url('+url+')'}"/>
</template>

<auto-img :url="url"/>

<script>
export default {
  name: "AutoImg",
  props: {
    url: {
      default() {
        return ''
      }
    },
  },
}
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat; /*不重复*/
  background-size: cover; /*保持纵横比缩放图片，只保证图片的短边能完全显示出来*/
  background-position: center; /*图片居中*/
  /*background-attachment: fixed; !*背景图片不会随着页面的滚动而滚动*!*/
}
</style>