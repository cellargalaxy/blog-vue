<template>
  <b-badge :variant="variant">{{ name + ': ' }}<a :href="url" class="white" v-text="value"/></b-badge>
</template>

<auto-color-badge :name="name" :url="url" :value="value"/>

<script>
  import utils from '../middleware/utils/utils'

  export default {
    name: "autoColorBadge",
    props: {
      name: {
        default() {
          return ''
        }
      },
      value: {
        default() {
          return ''
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
        const hash = utils.hashString(this.name) + utils.hashString(this.value)
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