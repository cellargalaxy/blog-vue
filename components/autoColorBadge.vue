<template>
  <b-badge :variant="variant">{{ name + ': ' }}<a v-text="value" :href="url" class="white"/></b-badge>
</template>

<auto-color-badge :name="name" :value="value" :url="url"/>

<script>
import util from '../middleware/util'

export default {
  name: "autoColorBadge", //随机轮换颜色的badge
  props: {
    name: {
      default() {
        return util.randomString(4)
      }
    },
    value: {
      default() {
        return util.randomString(4)
      }
    },
    url: {
      default() {
        return undefined
      }
    },
  },
  data() {
    return {
      variants: ['secondary', 'primary', 'info', 'dark',],
    }
  },
  computed: {
    variant() {
      const hash = util.hashString(this.name) + util.hashString(this.value)
      return this.variants[hash % this.variants.length]
    },
  },
}
</script>

<style scoped>
.white {
  color: rgba(255, 255, 255, 1);
}
</style>
