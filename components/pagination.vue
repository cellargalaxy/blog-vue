<template>
  <b-pagination-nav :limit="9" :pages="pages" v-model="currentPage" @change="change" :hide-ellipsis="true"
                    class="white-background-8" align="center"
                    pills use-router first-number last-number></b-pagination-nav>
</template>

<pagination :start="start" :end="end" :current="current" :step="step"/>

<script>

export default {
  name: "pagination", //分页
  data() {
    return {
      currentPage: this.current - this.start + 1 //不能直接用current，因为翻页的时候会修改current的值。但是current是从父组件里传下来的，这样会报错，说可能会修改调父组件的current
    }
  },
  props: {
    start: {
      default() {
        return 1
      }
    },
    end: {
      default() {
        return 25
      }
    },
    current: {
      default() {
        return 15
      }
    },
    step: {
      default() {
        return 1
      }
    },
  },
  computed: {
    pages() {
      const pages = []
      for (let i = this.start; i <= this.end; i++) {
        pages.push({'text': i})
      }
      return pages
    },
  },
  methods: {
    change(page) {
      page = page + this.start - 1
      const path = window.location.pathname
      const paths = path.split('/')
      for (let i = paths.length - 1; i >= 0; i--) {
        if (paths[i] === '') {
          continue
        }
        paths[i] = page
        window.location.href = paths.join('/')
        return
      }
      window.location.href = '/'
    },
  },
}
</script>

<style scoped>

</style>
