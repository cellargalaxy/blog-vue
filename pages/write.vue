<template>
  <navbar :config="navbarConfig"/>
</template>

<script>
  import navbar from '../components/navbar'
  import configService from "../middleware/service/configService"

  export default {
    name: "write",
    head() {
      return {
        script: [{src: 'https://unpkg.com/stackedit-js@1.0.7/docs/lib/stackedit.min.js'}]
      }
    },
    async asyncData({}) {
      const navbarConfig = configService.getNavbarConfig()
      if (!navbarConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
      return {
        navbarConfig: navbarConfig,
      }
    },
    data: () => {
      return {
        content: ''
      };
    },
    mounted() {
      window.onbeforeunload = () => {
        this.writeClipboard(this.content)
        return "确认离开当前页面"
      }
      const stackedit = new Stackedit()
      stackedit.openFile()
      stackedit.on('fileChange', (file) => {
        this.content = file.content.text
      })
      stackedit.on('close', () => {
        this.writeClipboard(this.content)
      })
    },
    methods: {
      writeClipboard: (text) => {
        const textarea = document.createElement('textarea')
        textarea.style.opacity = 0
        textarea.style.position = 'absolute'
        textarea.style.left = '-100000px'
        document.body.appendChild(textarea)

        textarea.value = text
        textarea.select()
        textarea.setSelectionRange(0, text.length)
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    },
    components: {
      navbar,
    },
  }
</script>

<style scoped>

</style>