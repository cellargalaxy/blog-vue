<template>
  <div>
    <article-view :content="content" :isSummary="false"/>
    <comment/>
  </div>
</template>

<article-comment :content="content"/>

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
