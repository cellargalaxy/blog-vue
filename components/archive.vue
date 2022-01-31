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
              <auto-color-badges :attributes="file.attributes"/>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </el-timeline-item>
    </el-timeline>

  </b-card>
</template>

<archive :archives="archives"/>

<script>
import autoColorBadges from './autoColorBadges'

export default {
  name: "archive", //归档
  props: {
    archives: {
      default() {
        return [
          {
            dateString: "2020-01",
            files: [
              {
                title: "测试文章标题-1-1", url: "#",
                attributes: [{"name": "时间", "value": "2020-01-01"}, {"name": "分类", "value": "类别-1-1", "url": "#"},]
              },
              {
                title: "测试文章标题-1-2", url: "#",
                attributes: [{"name": "时间", "value": "2020-01-02"}, {"name": "分类", "value": "类别-1-2", "url": "#"},]
              },
            ],
          },
          {
            dateString: "2020-02",
            files: [
              {
                title: "测试文章标题-2-1", url: "#",
                attributes: [{"name": "时间", "value": "2020-02-01"}, {"name": "分类", "value": "类别-2-1", "url": "#"},]
              },
            ],
          },
        ]
      }
    },
  },
  components: {
    autoColorBadges,
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
