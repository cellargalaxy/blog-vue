<template>
  <div>
    <file-view v-for="(file,i) in files" :key="i" :file="file" :isSummary="true"/>
  </div>
</template>

<file-list :files="files"/>

<script>
import fileView from './fileView'

export default {
  name: "fileList",
  props: {
    files: {
      default() {
        return [undefined, undefined, undefined, undefined, undefined, undefined]
      }
    },
  },
  components: {
    fileView,
  },
}
</script>
