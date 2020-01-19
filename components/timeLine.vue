<template>
  <b-card no-body class="white-background-8" style="border: none">
    <br/>
    <el-timeline>
      <el-timeline-item placement="top" v-for="(timeLineArticle,i) in timeLineArticles" :key="i"
                        :timestamp="timeLineArticle.dateString+' ('+timeLineArticle.articles.length+')'">
        <b-card no-body class="transparent" style="border:none;"
                v-for="(article,j) in timeLineArticle.articles" :key="j">
          <b-link :href="article.url">{{article.title}}</b-link>
          <p>({{article.dateString}}) ({{article.wordSum}} word)</p>
        </b-card>
      </el-timeline-item>
    </el-timeline>
  </b-card>
</template>

<time-line :timeLineArticles="timeLineArticles"/>

<script>
  export default {
    name: "timeLine",
    props: {
      timeLineArticles: {
        default() {
          return [
            {
              "dateString": "2020-01",
              "articles": [
                {"title": "测试文章标题-1-1", "url": "#", "dateString": "2020-01-01", "wordSum": 110},
                {"title": "测试文章标题-1-2", "url": "#", "dateString": "2020-01-02", "wordSum": 120},
                {"title": "测试文章标题-1-3", "url": "#", "dateString": "2020-01-03", "wordSum": 130},
              ],
            },
            {
              "dateString": "2020-02",
              "articles": [
                {"title": "测试文章标题-2-1", "url": "#", "dateString": "2020-02-01", "wordSum": 210},
                {"title": "测试文章标题-2-2", "url": "#", "dateString": "2020-02-02", "wordSum": 220},
                {"title": "测试文章标题-2-3", "url": "#", "dateString": "2020-02-03", "wordSum": 230},
              ],
            },
            {
              "dateString": "2020-03",
              "articles": [
                {"title": "测试文章标题-3-1", "url": "#", "dateString": "2020-03-01", "wordSum": 310},
                {"title": "测试文章标题-3-2", "url": "#", "dateString": "2020-03-02", "wordSum": 320},
                {"title": "测试文章标题-3-3", "url": "#", "dateString": "2020-03-03", "wordSum": 330},
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
  }

  .white-background-8 {
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>