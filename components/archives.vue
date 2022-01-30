<template>
  <b-card class="white-background-8" no-body style="border: none">
    <br/>

    <el-timeline>
      <el-timeline-item v-for="(archive,i) in archives" :key="i"
                        :timestamp="archive.dateString+' ('+archive.files.length+')'" placement="top">
        <b-list-group>
          <b-list-group-item v-for="(file,j) in archive.files" :key="j" class="transparent" style="border:none;">
            <b-row>
              <b-link :href="file.url">{{ file.title }}</b-link>
            </b-row>

            <b-row>
              <auto-color-badge v-for="(attribute,i) in file.attributes" :key="i"
                                :name="attribute.name" :url="attribute.url" :value="attribute.value"
                                style="margin-left: 0.1em;margin-right: 0.1em;"/>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </el-timeline-item>
    </el-timeline>

  </b-card>
</template>

<archives :archives="archives"/>

<script>
import autoColorBadge from './autoColorBadge'

export default {
  name: "archives", //归档
  props: {
    archives: {
      default() {
        return [
          {
            "dateString": "2020-01",
            "files": [
              {
                "title": "测试文章标题-1-1",
                "url": "#",
                "dateString": "2020-01-01",
                "attributes": [{"name": "name", "value": "value", "url": "#"}]
              },
              {
                "title": "测试文章标题-1-2",
                "url": "#",
                "dateString": "2020-01-02",
                "attributes": [{"name": "name", "value": "value", "url": "#"}]
              },
              {
                "title": "测试文章标题-1-3",
                "url": "#",
                "dateString": "2020-01-03",
                "attributes": [{"name": "name", "value": "value", "url": "#"}]
              },
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
  components: {
    autoColorBadge,
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
