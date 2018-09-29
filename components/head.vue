<template>
  <b-card title="cellargalaxyの博客" class="text-center translucent">
    <p v-text="sort"/>
  </b-card>
</template>

<!--<head :sort="sort"/>-->

<script>
  export default {
    name: "head",
    props: {
      sort: {
        default: function () {
          return "学习"
        }
      },
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>
