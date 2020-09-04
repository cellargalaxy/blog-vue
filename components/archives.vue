<template>
  <b-card class="white-background-8" no-body style="border: none">
    <br/>
    <el-timeline>
      <el-timeline-item :key="i" :timestamp="archive.dateString+' ('+archive.files.length+')'"
                        placement="top" v-for="(archive,i) in archives">
        <b-card :key="j" class="transparent" no-body style="border:none;" v-for="(file,j) in archive.files">
          <b-link :href="file.url">{{file.title}}</b-link>
          <b-row>
            <b-badge :key="i" style="margin-left: 0.1em;margin-right: 0.1em;" v-for="(attribute,i) in file.attributes">
              {{ attribute.name + ': ' }}<a :href="attribute.url" class="white" v-text="attribute.value"/>
            </b-badge>
          </b-row>
          <br/>
        </b-card>
      </el-timeline-item>
    </el-timeline>
  </b-card>
</template>

<archives :archives="archives"/>

<script>
  export default {
    name: "archives",
    props: {
      archives: {
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

  .white {
    color: rgba(255, 255, 255, 1);
  }
</style>