<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <b-carousel :interval="0" controls fade indicators v-model="slide">

    <b-carousel-slide background="rgba(255, 255, 255, 0)" v-for="(brand,i) in config.brands" :key="i">
      <template v-slot:img>
        <full-image :imageUrl="brand.imageUrl" style="max-height: 50vh;"/>
      </template>
      <b-card :title="brand.title" class="black-background-5" style="border: none" title-tag="h1" v-if="brand.title">
        <b-card-text class="white" v-for="(text,j) in brand.texts" :key="j">{{text}}</b-card-text>
      </b-card>
    </b-carousel-slide>

  </b-carousel>
</template>

<page-head :config="config"/>

<script>
  import fullImage from './fullImage'

  export default {
    name: "pageHead",
    props: {
      config: {
        default() {
          return {
            "brandInterval": 5000,
            "brands": [
              {
                "imageUrl": "https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png",
                "title": "这是大招牌-1",
                "texts": ["这是一段招牌的演示文字-1-1", "这是一段招牌的演示文字-1-2"]
              },
              {
                "imageUrl": "https://i.loli.net/2018/04/10/5accdcbcb1738.jpg",
                "title": "这是大招牌-2",
                "texts": ["这是一段招牌的演示文字-2-1", "这是一段招牌的演示文字-2-2"]
              },
              {
                "imageUrl": "https://i.loli.net/2018/08/21/5b7bbc8ec3633.jpg",
                "title": "这是大招牌-3",
                "texts": ["这是一段招牌的演示文字-3-1", "这是一段招牌的演示文字-3-2"]
              },
            ],
            "navs": [
              {"text": "twitter", "url": "https://twitter.com/"},
              {"text": "facebook", "url": "https://facebook.com/"},
              {"text": "微博", "url": "https://weibo.com/"},
              {"text": "知乎", "url": "https://www.zhihu.com/"},
            ]
          }
        }
      },
      slide: {
        default() {
          return Math.floor(Math.random() * this.config.brands.length)
        }
      },
    },
    components: {
      fullImage,
    },
  }
</script>

<style scoped>
  .black-background-5 {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
