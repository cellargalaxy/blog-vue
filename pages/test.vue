<template>
  <com></com>
</template>

<script>
  import com from '../components/timeLine'

  export default {
    name: "test",
    data() {
      return {
        article:  {
          "title": "测试",
          "url": "#",
          "attributes": [{"name": "时间", "value": "2019-01-01"}],
          "summaryHtml": "summaryHtml",
          "html": "html",
        },
      }
    },
    components: {
      com,
    },
    layout: 'test',
  }
</script>

