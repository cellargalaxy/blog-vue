<template>
  <div>
    <article-view v-for="(file,i) in files" :key="i" :file="file" :isSummary="true"/>
  </div>
</template>

<article-list :files="files"/>

<script>
import articleView from './articleView'

export default {
  name: "articleList",
  props: {
    files: {
      default() {
        return [undefined, undefined, undefined, undefined, undefined, undefined]
      }
    },
  },
  components: {
    articleView,
  },
}
</script>
