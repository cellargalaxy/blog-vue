<template>
  <b-list-group class="nuxt-content" style="margin-bottom: 1em">
    <b-list-group-item class="white-background-8">
      <h1>
        <b-link v-text="article.title" :href="article.url" :target="isSummary?'_blank':''"/>
      </h1>
      <auto-color-badges :attributes="article.attributes"/>
    </b-list-group-item>

    <b-list-group-item class="white-background-8">
      <nuxt-content :document="article"/>
    </b-list-group-item>
  </b-list-group>
</template>

<article-view :file="file" :isSummary="isSummary"/>

<script>
import autoColorBadges from './autoColorBadges'
import model from '../middleware/model'
import prism from "../plugins/prism"

export default {
  name: "articleView",
  mounted() {
    prism.highlightAll();
  },
  props: {
    file: {
      default() {
        return {
          title: "title_t",
          url: "#",
          "toc": [
            {
              "id": "h2_t",
              "depth": 2,
              "text": "h2_t"
            },
            {
              "id": "h3_t",
              "depth": 3,
              "text": "h3_t"
            }
          ],
          "body": {
            "type": "root",
            "children": [
              {
                "type": "element",
                "tag": "p",
                "props": {},
                "children": [
                  {
                    "type": "text",
                    "value": "description_t"
                  }
                ]
              },
              {
                "type": "element",
                "tag": "h2",
                "props": {
                  "id": "h2_t"
                },
                "children": [
                  {
                    "type": "element",
                    "tag": "a",
                    "props": {
                      "ariaHidden": "true",
                      "href": "#h2_t",
                      "tabIndex": -1
                    },
                    "children": [
                      {
                        "type": "element",
                        "tag": "span",
                        "props": {
                          "className": [
                            "icon",
                            "icon-link"
                          ]
                        },
                        "children": []
                      }
                    ]
                  },
                  {
                    "type": "text",
                    "value": "h2_t"
                  }
                ]
              },
              {
                "type": "element",
                "tag": "h3",
                "props": {
                  "id": "h3_t"
                },
                "children": [
                  {
                    "type": "element",
                    "tag": "a",
                    "props": {
                      "ariaHidden": "true",
                      "href": "#h3_t",
                      "tabIndex": -1
                    },
                    "children": [
                      {
                        "type": "element",
                        "tag": "span",
                        "props": {
                          "className": [
                            "icon",
                            "icon-link"
                          ]
                        },
                        "children": []
                      }
                    ]
                  },
                  {
                    "type": "text",
                    "value": "h3_t"
                  }
                ]
              }
            ]
          },
          "excerpt": {
            "type": "root",
            "children": [
              {
                "type": "element",
                "tag": "p",
                "props": {},
                "children": [
                  {
                    "type": "text",
                    "value": "description_t"
                  }
                ]
              }
            ]
          },
          attributes: [
            {name: 'createAt', value: 'YYYY-MM-DD',},
            {name: 'updateAt', value: 'YYYY-MM-DD',},
            {name: 'sort', value: 'sort', url: '#'},
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
  computed: {
    article() {
      return model.file2Article(this.file, this.isSummary)
    },
  },
  components: {
    autoColorBadges,
  },
}
</script>

<style scoped>

</style>
