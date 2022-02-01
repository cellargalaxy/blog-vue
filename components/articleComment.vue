<template>
  <div>
    <article-view :file="file" :isSummary="false"/>
    <comment/>
  </div>
</template>

<article-comment :file="file"/>

<script>
import articleView from './articleView'
import comment from './comment'

export default {
  name: "articleComment",
  props: {
    file: {
      default() {
        return undefined
      }
    },
  },
  components: {
    articleView,
    comment,
  },
}
</script>

<style scoped>

</style>
