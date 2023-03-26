<template>
  <fence>
    <el-row style="height: 100%">
      <el-col :xs="1" :sm="2" :md="3" :lg="4" :xl="5" style="height: 100%"/>
      <el-col :xs="22" :sm="20" :md="18" :lg="16" :xl="14" style="height: 100%">
        <el-scrollbar class="card">
          <slot/>
        </el-scrollbar>
      </el-col>
      <el-col :xs="1" :sm="2" :md="3" :lg="4" :xl="5" style="height: 100%"/>
    </el-row>
  </fence>
</template>

<fence-scrollbar></fence-scrollbar>

<script>
export default {
  name: "FenceScrollbar"
}
</script>

<style scoped>
.card {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 50%;

  text-align: center;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0 10px rgba(0, 0, 0, 1);
}
</style>