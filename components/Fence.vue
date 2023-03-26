<template>
  <div class="fence">
    <slot/>
  </div>
</template>

<fence></fence>

<script>
export default {
  name: "Fence"
}
</script>

<style scoped>
.fence {
  width: 100%;
  height: 100%;
  background-repeat: repeat; /*重复*/
  background-size: auto; /*自动大小*/
  background-position: 0 0; /*对齐*/
  background-image: url('@/assets/img/fence.svg');
}
</style>