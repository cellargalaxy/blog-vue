<template>
  <div>
    <auto-color-badge v-for="(attribute,i) in attributes" :key="i"
                      :name="attribute.name" :value="attribute.value" :url="attribute.url"
                      style="margin-left: 0.1em;margin-right: 0.1em;"/>
  </div>
</template>

<auto-color-badges :attributes="attributes"/>

<script>
import autoColorBadge from "./autoColorBadge"

export default {
  name: "autoColorBadges", //随机轮换颜色的badge
  props: {
    attributes: {
      default() {
        return [undefined, undefined, undefined]
      }
    },
  },
  components: {
    autoColorBadge,
  },
}
</script>

<style scoped>

</style>
