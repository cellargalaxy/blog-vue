<template>
  <b-card class="white-background-8" no-body style="border: none">

    <div v-if="archives.length===0">
      <b-card-text  class="text-center">Nothing</b-card-text>
    </div>
    <div v-else>
      <br/>
      <el-timeline>
        <el-timeline-item v-for="(archive,i) in archives" :key="i"
                          :timestamp="archive.month+' ('+archive.files.length+')'" placement="top">
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
    </div>

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
            month: "2020-01",
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
            month: "2020-02",
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

</style>
