<template>
  <archive :archives="archives"/>
</template>

<archive-by-file :files="files"/>

<script>
import archive from './archive'
import model from "../middleware/model"

export default {
  name: "archiveByFile", //归档
  props: {
    files: {
      default() {
        return undefined
      }
    },
  },
  computed: {
    archives() {
      return model.file2Archives(this.files)
    },
  },
  components: {
    archive,
  },
}
</script>

<style scoped>

</style>
