<template>
  <el-carousel :autoplay="false" :interval="3000" :initial-index="0" :pause-on-hover="false"
               indicator-position="none" arrow="never" height="100vh">
    <el-carousel-item>
      <auto-img :url="'https://img.imoeq.com/i/2023/01/07/image_3.png'"/>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "Carousel"
}
</script>

<style scoped>

</style>