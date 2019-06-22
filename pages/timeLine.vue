<template>
  <time-line-component :timeLineArticles="timeLineArticles"/>
</template>

<script>
  import timeLineComponent from '../components/timeLine'
  import articleService from '../assets/service/articleService'

  export default {
    name: "timeLine",
    async asyncData({}) {
      return {
        timeLineArticles: articleService.getTimeLineArticles(),
      }
    },
    components: {
      timeLineComponent,
    },
    layout: 'default',
  }
</script>

<style scoped>

</style>