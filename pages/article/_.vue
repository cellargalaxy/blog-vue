<template>
  <article>
    <nuxt-content :document="article"/>
  </article>
</template>

<script>
export default {
  name: "article.vue",
  async asyncData({params, $content}) {
    console.log('params', params)
    const article = await $content('',params.pathMatch).fetch()
    console.log('article', JSON.stringify(article))

    return {article}
  }
}
</script>

<style scoped>

</style>
