<template>
  <b-list-group style="margin-bottom: 1em">
    <b-list-group-item class="translucent">
      <b-card v-if="article.title" no-body class="transparent">
        <h2>
          <b-link :href="article.url" v-text="article.title" target="_blank"/>
        </h2>
      </b-card>

      <b-row>
        <b-col align-self="start">
          <b-badge v-for="(attribute,attributeIndex) in article.attributes" :key="attributeIndex"
                   v-text="attribute.name+': '+attribute.value" style="margin-left: 0.1em;margin-right: 0.1em;"/>
        </b-col>
      </b-row>
    </b-list-group-item>

    <b-list-group-item class="translucent" v-html="isSummary?article.summaryHtml:article.html"/>
  </b-list-group>
</template>

<article-view :article="article" :isSummary="isSummary"/>

<script>

  export default {
    name: "articleView",
    head() {
      if (this.isSummary) {
        return {}
      }
      if (this.article.title) {
        return {
          title: this.article.title + ' | cellargalaxyの博客',
          meta: [
            {hid: 'article_description', name: 'description', content: this.article.title}
          ]
        }
      }
      return {
        title: 'cellargalaxyの博客',
      }
    },
    props: {
      article: {
        default: function () {
          return {
            "title": "测试",
            "url": "#",
            "attributes": [{"name": "时间", "value": "2019-01-01"}],
            "summaryHtml": "summaryHtml",
            "html": "html",
          }
        }
      },
      isSummary: {
        default: function () {
          return false
        }
      },
    },
  }
</script>

<style scoped>
  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.9);
  }
</style>
