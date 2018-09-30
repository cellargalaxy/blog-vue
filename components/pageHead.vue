<template>
  <b-card class="text-center transparent">
    <h2>
      <b class="white">
        cellargalaxyの博客
      </b>
    </h2>

    <p>
      <b>
        <b-link :href="'/'+sort+'/1'" v-text="sort" class="white"/>
      </b>
    </p>
  </b-card>
</template>

<!--<page-head :sort="sort"/>-->

<script>
  export default {
    name: "pageHead",
    props: {
      sort: {
        default: function () {
          return "学习"
        }
      },
    },
    methods: {},
  }
</script>

<style scoped>
  .transparent {
    background-color: rgba(255, 255, 255, 0);
  }

  .white {
    color: rgba(255, 255, 255, 1);
  }
</style>
