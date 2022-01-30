<template>
  <b-list-group style="margin-bottom: 1em">
    <b-list-group-item class="white-background-8">
      <h1 v-text="article.title"></h1>

      <auto-color-badge v-for="(attribute,i) in article.attributes" :key="i"
                        :name="attribute.name" :value="attribute.value" :url="attribute.url"
                        style="margin-left: 0.1em;margin-right: 0.1em;"/>
    </b-list-group-item>

    <b-list-group-item class="white-background-8">
      <nuxt-content :document="article"/>
    </b-list-group-item>
  </b-list-group>
</template>

<article-view :content="content" :isSummary="isSummary"/>

<script>
import autoColorBadge from './autoColorBadge'
import util from '../middleware/util'

export default {
  name: "articleView",
  props: {
    content: {
      default() {
        return {
          "slug": "a_title",
          "description": "a_description",
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
          "dir": "/",
          "path": "/a_title",
          "extension": ".md"
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
      const article = {}
      article.title = this.content.slug
      article.toc = this.content.toc
      article.body = this.isSummary ? this.content.excerpt : this.content.body

      article.attributes = []
      if (this.content.attributes) {
        for (let i = 0; i < this.content.attributes.length; i++) {
          article.attributes.push(this.content.attributes[i])
        }
      }
      article.attributes.push({
        name: "createdAt",
        value: util.formatDate(new Date(this.content.createdAt), 'YYYY-MM-DD')
      })
      article.attributes.push({
        name: "updatedAt",
        value: util.formatDate(new Date(this.content.updatedAt), 'YYYY-MM-DD')
      })

      return article
    },
  },
  components: {
    autoColorBadge,
  },
}
</script>

<style scoped>
.white-background-8 {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
