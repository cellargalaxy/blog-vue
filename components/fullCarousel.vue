<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <b-carousel :interval="config.interval" fade indicators>

    <b-carousel-slide v-for="(brand,i) in config.brands" :key="i" background="rgba(255, 255, 255, 1)">
      <template v-slot:img>
        <full-image :url="brand.imageUrl"/>
      </template>

      <b-container fluid>
        <b-row align-v="center" class="text-center">
          <b-col lg="2" md="1" sm="0" xl="2"/>
          <b-col lg="8" md="10" sm="12" xl="8">
            <b-card v-if="brand.title" :title="brand.title"
                    class="black-background-5" style="border: none" title-tag="h1">
              <b-card-text v-for="(text,j) in brand.texts" :key="j" class="white">{{ text }}</b-card-text>
            </b-card>
          </b-col>
          <b-col lg="2" md="1" sm="0" xl="2"/>
        </b-row>

        <b-row align-v="center" class="text-center">
          <b-col lg="2" md="1" sm="0" xl="2"/>
          <b-col lg="8" md="10" sm="12" xl="8">
            <b-badge v-for="(nav,k) in config.navs" :key="k" class="black-background-5" pill>
              <a :href="nav.url" class="white" target="_blank" v-text="nav.text"/>
            </b-badge>
          </b-col>
          <b-col lg="2" md="1" sm="0" xl="2"/>
        </b-row>
      </b-container>
    </b-carousel-slide>

  </b-carousel>
</template>

<full-carousel :config="config"/>

<script>
import fullImage from './fullScrubImage'

export default {
  name: "fullCarousel", //全图走马灯
  props: {
    config: {
      default() {
        return {
          "interval": 5000,
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
  },
  components: {
    fullImage,
  },
}
</script>

<style scoped>

</style>
