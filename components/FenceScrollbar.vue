<template>
  <fence>
    <el-row style="height: 100%">
      <el-col :xs="0" :sm="0" :md="5" :lg="6" :xl="7" style="height: 100%"/>
      <el-col :xs="24" :sm="24" :md="14" :lg="12" :xl="10" style="height: 100%;">
        <el-scrollbar class="card">
          <slot/>
        </el-scrollbar>
      </el-col>
      <el-col :xs="0" :sm="0" :md="5" :lg="6" :xl="7" style="height: 100%"/>
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
  padding: 1%;

  text-align: center;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0 10px rgba(0, 0, 0, 1);
}
</style>