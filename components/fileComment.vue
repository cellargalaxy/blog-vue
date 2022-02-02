<template>
  <div>
    <file-view :file="file" :isSummary="false"/>
    <comment/>
  </div>
</template>

<file-comment :file="file"/>

<script>
import fileView from './fileView'
import comment from './comment'

export default {
  name: "fileComment",
  props: {
    file: {
      default() {
        return undefined
      }
    },
  },
  components: {
    fileView,
    comment,
  },
}
</script>

<style scoped>

</style>
