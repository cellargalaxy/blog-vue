<template>
  <div>
    <navbar :config="siteConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <file-comment :file="file"/>
      <br/>
    </b-container>

    <page-foot :config="pageFootConfig" :buildTime="buildTime"/>
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
    const siteConfig = service.getSiteConfig()
    const homeConfig = service.getHomeConfig()
    const pageFootConfig = service.getPageFootConfig()

    const path = service.initPath(params.pathMatch)

    const contents = await $content(path, {deep: false}).fetch()
    let files = service.content2Files(contents)
    if (files.length === 0) {
      error()
      return
    }

    return {
      siteConfig: siteConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      buildTime: new Date(),
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
