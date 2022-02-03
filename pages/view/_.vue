<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <file-comment :file="file"/>
      <br/>
    </b-container>

    <page-foot :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
import navbar from '../../components/navbar'
import pageHead from '../../components/pageHead'
import fileComment from '../../components/fileComment'
import pageFoot from '../../components/pageFoot'
import backtop from '../../components/backtop'

import config from "../../middleware/config"
import service from "../../middleware/service"

export default {
  name: "fileView",
  async asyncData({params, $content, error}) {
    const navbarConfig = config.getNavbarConfig()
    const homeConfig = config.getHomeConfig()
    const pageFootConfig = config.getPageFootConfig()
    const siteConfig = config.getSiteConfig()

    const path = service.initPath(params.pathMatch)
    const {folderPath} = service.parsePath(path)

    //          view
    let basePath = '..'
    const folderPaths = folderPath.split('/')
    for (let i = 0; i < folderPaths.length; i++) {
      basePath += '/..'
    }

    const contents = await $content(path, {deep: false}).fetch()
    let  files = service.content2Files(contents,basePath)
    if (files.length === 0) {
      error()
      return
    }

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      siteName: siteConfig.siteName,
      file: files[0],
    }
  },
  head() {
    if (this.file.title) {
      return {
        title: this.file.title + ' | ' + this.siteName,
      }
    }
    return {title: this.siteName}
  },
  components: {
    navbar,
    pageHead,
    fileComment,
    pageFoot,
    backtop,
  },
}
</script>

<style scoped>

</style>
