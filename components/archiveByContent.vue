<template>
  <archive :archives="archives"/>
</template>

<archive-by-content :contents="contents"/>

<script>
import archive from './archive'
import service from "../middleware/model"

export default {
  name: "archiveByContent", //归档
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
    archive,
  },
}
</script>

<style scoped>

</style>
