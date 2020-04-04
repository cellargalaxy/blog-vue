<template>
  <b-list-group style="margin-bottom: 1em">
    <b-list-group-item class="white-background-8">
      <h1 style="font-size: 2em;">
        <b-link :href="article.url" v-text="article.title" target="_blank"/>
      </h1>

      <b-badge v-for="(attribute,i) in article.attributes" :key="i" style="margin-left: 0.1em;margin-right: 0.1em;">
        {{attribute.name+': '}}<a :href="attribute.url" class="white" v-text="attribute.value"/>
      </b-badge>
    </b-list-group-item>

    <b-list-group-item class="white-background-8" v-html="$md.render(isSummary?article.summary:article.content)"/>
  </b-list-group>
</template>

<article-view :article="article" :isSummary="isSummary"/>

<script>
  export default {
    name: "articleView",
    props: {
      article: {
        default() {
          return {
            "title": "测试文章标题-1-1", "url": "#", "content": "content", "summary": "summary",
            "attributes": [
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
              {"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别1", "url": "#"},
            ],
          }
        }
      },
      isSummary: {
        default() {
          return false
        }
      },
    },
  }
</script>

<style scoped>
  .white-background-8 {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .white {
    color: rgba(255, 255, 255, 1);
  }
</style>
