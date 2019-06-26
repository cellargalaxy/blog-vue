<template>
  <b-card class="text-center blue-translucent white">
    <b-container>
      <p :key="contentsIndex" v-for="(contents,contentsIndex) in config">
        <b-badge :key="contentIndex" class="transparent" style="margin-left: 1em;margin-right: 1em;"
                 v-for="(content,contentIndex) in contents">
          <a :href="content.url" class="white" target="_blank" v-text="content.text"/>
        </b-badge>
      </p>
    </b-container>
  </b-card>
</template>

<page-foot :config="config"/>

<script>

  export default {
    name: "pageFoot",
    props: {
      config: {
        default: function () {
          return null
        }
      },
    },
  }
</script>

<style scoped>
  .blue-translucent {
    background-color: rgba(83, 154, 196, 0.7);
    border-color: rgba(83, 154, 196, 0.7);
  }

  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .white {
    color: rgba(255, 255, 255, 1);
  }
</style>
