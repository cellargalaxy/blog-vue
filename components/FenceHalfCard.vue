<template>
  <div>
    <fence-half>

    </fence-half>

    <el-scrollbar
        style="position:relative;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 50vw;background-color: chocolate"
        max-height="30vh">
      <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>
    </el-scrollbar>

  </div>
</template>

<fence-half-card/>

<script>
export default {
  name: "FenceHalfCard"
}
</script>

<style scoped>

</style>