<template>
  <pagination :end="end" :current="current"/>
</template>

<pagination-page :total="total" :size="size" :current="current"/>

<script>
import pagination from './pagination'

export default {
  name: "paginationPage",
  props: {
    total: {
      default() {
        return 255
      }
    },
    size: {
      default() {
        return 10
      }
    },
    current: {
      default() {
        return 12
      }
    },
  },
  computed: {
    end() {
      let end = this.total / this.size
      if (this.total % this.size !== 0) {
        end++
      }
      return end
    },
  },
  components: {
    pagination,
  },
}
</script>

<style scoped>

</style>
