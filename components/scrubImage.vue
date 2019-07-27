<template>
  <div class="scrubImage transparent" :style="{backgroundImage:'url('+scrubUrl+'), url('+imageUrl+')'}"></div>
</template>

<scrub-image :scrubUrl="scrubUrl" :imageUrl="imageUrl"/>

<script>
  export default {
    name: "scrubImage",
    props: {
      scrubUrl: {
        default: function () {
          return '/images/dot.gif'
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
  .scrubImage {
    /*background-image: url("/images/dot.gif"), url("https://i.loli.net/2018/10/02/5bb391d063618.jpg");*/
    background-repeat: repeat, no-repeat;
    background-position: 0% 0%, center;
    background-attachment: scroll, fixed;
    background-size: auto, cover;
    height: 100vh;
  }

  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }
</style>
