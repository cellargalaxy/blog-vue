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

<archive :contents="contents"/>

<script>
import autoColorBadge from './autoColorBadge'
import service from "../middleware/service";

export default {
  name: "archive", //归档
  props: {
    contents: {
      default() {
        return [
          {
            "slug": "a_title",
            "createdAt": "2022-01-01T00:00:00.000Z",
            "updatedAt": "2022-01-02T00:00:00.000Z",
            "path": "/a_title",
          },
          {
            "slug": "b_title",
            "createdAt": "2022-01-03T00:00:00.000Z",
            "updatedAt": "2022-01-04T00:00:00.000Z",
            "path": "/b_title",
          },
          {
            "slug": "c_title",
            "createdAt": "2022-02-01T00:00:00.000Z",
            "updatedAt": "2022-02-02T00:00:00.000Z",
            "path": "/c_title",
          },
        ]
      }
    },
  },
  computed: {
    archives() {
      return service.content2Archives(this.contents)
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
