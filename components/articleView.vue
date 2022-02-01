<template>
  <b-list-group class="nuxt-content" style="margin-bottom: 1em">
    <b-list-group-item class="white-background-8">
      <h1>
        <b-link v-text="article.title" :href="article.url" target="_blank"/>
      </h1>
      <auto-color-badges :attributes="article.attributes"/>
    </b-list-group-item>

    <b-list-group-item class="white-background-8">
      <nuxt-content :document="article"/>
    </b-list-group-item>
  </b-list-group>
</template>

<article-view :content="content" :isSummary="isSummary"/>

<script>
import autoColorBadges from './autoColorBadges'
import service from '../middleware/model'

export default {
  name: "articleView",
  props: {
    content: {
      default() {
        return {
          "slug": "a_title",
          "createdAt": "2022-01-01T00:00:00.000Z",
          "updatedAt": "2022-02-02T00:00:00.000Z",
          "toc": [
            {
              "id": "a_context",
              "depth": 2,
              "text": "a_context"
            },
            {
              "id": "b_context",
              "depth": 3,
              "text": "b_context"
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
                    "value": "a_description"
                  }
                ]
              },
              {
                "type": "element",
                "tag": "h2",
                "props": {
                  "id": "a_context"
                },
                "children": [
                  {
                    "type": "element",
                    "tag": "a",
                    "props": {
                      "ariaHidden": "true",
                      "href": "#a_context",
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
                    "value": "a_context"
                  }
                ]
              },
              {
                "type": "element",
                "tag": "h3",
                "props": {
                  "id": "b_context"
                },
                "children": [
                  {
                    "type": "element",
                    "tag": "a",
                    "props": {
                      "ariaHidden": "true",
                      "href": "#b_context",
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
                    "value": "b_context"
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
                    "value": "a_description"
                  }
                ]
              }
            ]
          },
          "path": "/a_title",
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
      return service.content2Article(this.content, this.isSummary)
    },
  },
  components: {
    autoColorBadges,
  },
}
</script>

<style scoped>

</style>
