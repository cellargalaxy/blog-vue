<template>
  <div>
    <article-view :article="article" :isSummary="false"/>
    <comment/>
  </div>
</template>

<article-comment :article="article"/>

<script>
import articleView from './articleView'
import comment from './comment'

export default {
  name: "articleComment",
  props: {
    article: {
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
