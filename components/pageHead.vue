<template>
  <b-card class="text-center transparent">
    <h2>
      <b class="white">
        <b-link :href="'/'" v-text="'cellargalaxyの博客'" class="white"/>
      </b>
    </h2>

    <p>
      <b>
        <b-link :href="path" v-text="name" class="white"/>
      </b>
    </p>
  </b-card>
</template>

<page-head :name="name" :path="path"/>

<script>
  export default {
    name: "pageHead",
    props: {
      name: {
        default: function () {
          return "一个分类"
        }
      },
      path: {
        default: function () {
          return "/一个分类"
        }
      },
    },
  }
</script>

<style scoped>
  .white {
    color: rgba(255, 255, 255, 1);
  }

  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
