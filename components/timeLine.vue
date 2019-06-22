<template>
  <div>
    <b-card v-for="(timeLineArticle,timeLineArticleIndex) in timeLineArticles" :key="timeLineArticleIndex"
            :header="timeLineArticle.dateString+'('+timeLineArticle.articles.length+')'" class="translucent"
            style="border-left-color: gray;border-left-width: 0.3em;border-radius: 0">
      <b-list-group>
        <b-list-group-item v-for="(article,articlesIndex) in timeLineArticle.articles" :key="articlesIndex"
                           :href="article.url" target="_blank" class="transparent">
          <li>
            {{article.title}}<sub v-if="article.dateString||article.wordSum">
            {{(article.dateString?('('+article.dateString+')'):'')+(article.wordSum?('('+article.wordSum+' word)'):'')}}
          </sub>
          </li>
        </b-list-group-item>
      </b-list-group>
    </b-card>

    <br/>
  </div>
</template>

<time-line :timeLineArticles="timeLineArticles"/>

<script>
  export default {
    name: "timeLine",
    props: {
      timeLineArticles: {
        default: function () {
          return [
            {
              "dateString": "2019-01",
              "articles": [
                {
                  "title": "测试11",
                  "url": "/",
                  "dateString": "2019-01-01",
                },
                {
                  "title": "测试12",
                  "url": "#",
                  "dateString": "2019-01-02",
                },
                {
                  "title": "测试13",
                  "url": "#",
                  "dateString": "2019-01-03",
                },
              ],
            },
            {
              "dateString": "2019-02",
              "articles": [
                {
                  "title": "测试24",
                  "url": "#",
                  "dateString": "2019-02-04",
                },
                {
                  "title": "测试25",
                  "url": "#",
                  "dateString": "2019-02-05",
                },
                {
                  "title": "测试26",
                  "url": "#",
                  "dateString": "2019-02-06",
                },
              ],
            },
            {
              "dateString": "其他",
              "articles": [
                {
                  "title": "测试31",
                  "url": "#",
                },
                {
                  "title": "测试32",
                  "url": "#",
                },
                {
                  "title": "测试33",
                  "url": "#",
                },
              ],
            },
          ]
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
    border-color: rgba(255, 255, 255, 0);
  }
</style>