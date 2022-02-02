<template>
  <article-view :file="file" :isSummary="isSummary"/>
</template>

<file-view :file="file" :isSummary="isSummary"/>

<script>
import articleView from './articleView'

export default {
  name: "fileView",
  props: {
    file: {
      default() {
        return undefined
      }
    },
    isSummary: {
      default() {
        return undefined
      }
    },
  },
  components: {
    articleView,
  },
}
</script>

<style scoped>

</style>
