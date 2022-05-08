<template>
  <b-breadcrumb class="white-background-8">
    <b-breadcrumb-item :href="this.basePath+'/1/'">
      <b-icon icon="house-fill"/>
    </b-breadcrumb-item>
    <b-breadcrumb-item v-for="(item,i) in items" :key="i" :href="item.url">{{ item.text }}</b-breadcrumb-item>
  </b-breadcrumb>
</template>

<breadcrumb-path :basePath="basePath" :folderPath="folderPath"/>

<script>
import path from 'path'

export default {
  name: "breadcrumbPath",
  props: {
    basePath: {
      default() {
        return '/'
      }
    },
    folderPath: {
      default() {
        return 'a/b/c'
      }
    },
  },
  computed: {
    items() {
      const items = []
      const paths = this.folderPath.split('/')
      let url = this.basePath
      for (let i = 0; i < paths.length; i++) {
        url = path.join(url, paths[i])
        items.push({text: paths[i], url: url + '/1/'})
      }
      return items
    },
  },
}
</script>

<style scoped>

</style>
