<template>
  <b-card no-body class="white-background-8" style="border: none">
    <br/>
    <el-timeline>
      <el-timeline-item :key="i" :timestamp="timeLine.dateString+' ('+timeLine.files.length+')'" placement="top"
                        v-for="(timeLine,i) in timeLines">
        <b-card :key="j" class="transparent" no-body style="border:none;" v-for="(file,j) in timeLine.files">
          <b-link :href="file.url">{{file.title}}</b-link>
          <p v-if="file.dateString">({{file.dateString}})</p>
        </b-card>
      </el-timeline-item>
    </el-timeline>
  </b-card>
</template>

<time-line :timeLines="timeLines"/>

<script>
  export default {
    name: "timeLine",
    props: {
      timeLines: {
        default() {
          return [
            {
              "dateString": "2020-01",
              "files": [
                {"title": "测试文章标题-1-1", "url": "#", "dateString": "2020-01-01"},
                {"title": "测试文章标题-1-2", "url": "#", "dateString": "2020-01-02"},
                {"title": "测试文章标题-1-3", "url": "#", "dateString": "2020-01-03"},
              ],
            },
            {
              "dateString": "2020-02",
              "files": [
                {"title": "测试文章标题-2-1", "url": "#", "dateString": "2020-02-01"},
                {"title": "测试文章标题-2-2", "url": "#", "dateString": "2020-02-02"},
                {"title": "测试文章标题-2-3", "url": "#", "dateString": "2020-02-03"},
              ],
            },
            {
              "dateString": "2020-03",
              "files": [
                {"title": "测试文章标题-3-1", "url": "#", "dateString": "2020-03-01"},
                {"title": "测试文章标题-3-2", "url": "#", "dateString": "2020-03-02"},
                {"title": "测试文章标题-3-3", "url": "#", "dateString": "2020-03-03"},
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