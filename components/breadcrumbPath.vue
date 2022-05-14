<template>
  <b-breadcrumb class="white-background-8">
    <b-breadcrumb-item :href="this.rootPath">
      <b-icon icon="house-fill"/>
    </b-breadcrumb-item>
    <b-breadcrumb-item v-for="(crumb,i) in crumbs" :key="i" :href="crumb.url">{{ crumb.text }}</b-breadcrumb-item>
  </b-breadcrumb>
</template>

<breadcrumb-path :rootPath="rootPath" :crumbs="crumbs"/>

<script>
export default {
  name: "breadcrumbPath",
  props: {
    rootPath: {
      default() {
        return '#'
      }
    },
    crumbs: {
      default() {
        return []
      }
    },
  },
}
</script>

<style scoped>

</style>
