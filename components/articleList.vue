<template>
  <div>
    <article-view v-for="(content,i) in contents" :key="i" :content="content" :isSummary="true"/>
  </div>
</template>

<article-list :contents="contents"/>

<script>
import articleView from './articleView'

export default {
  name: "articleList",
  props: {
    contents: {
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
