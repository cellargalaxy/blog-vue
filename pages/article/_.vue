<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <article-comment :file="file"/>
      <br/>
    </b-container>

    <page-foot :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
import navbar from '../../components/navbar'
import pageHead from '../../components/pageHead'
import articleComment from '../../components/articleComment'
import pageFoot from '../../components/pageFoot'
import backtop from '../../components/backtop'

import config from "../../middleware/config";
import service from "../../middleware/service";

export default {
  name: "articleView",
  async asyncData({params, $content, error}) {
    const navbarConfig = config.getNavbarConfig()
    const homeConfig = config.getHomeConfig()
    const pageFootConfig = config.getPageFootConfig()
    const siteConfig = config.getSiteConfig()

    const path = service.initPath(params.pathMatch)
    const {folderPath} = service.parsePath(path)

    //          article
    let basePath = '..'
    const folderPaths = folderPath.split('/')
    for (let i = 0; i < folderPaths.length; i++) {
      basePath += '/..'
    }

    let contents = await $content(path, {deep: false}).fetch()
    let  files = service.content2Files(contents,basePath)
    if (files.length === 0) {
      error()
      return
    }

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      file: files[0],
      siteName: siteConfig.siteName,
    }
  },
  head() {
    if (this.file.slug) {
      return {
        title: this.file.slug + ' | ' + this.siteName,
      }
    }
    return {title: this.siteName}
  },
  components: {
    navbar,
    pageHead,
    articleComment,
    pageFoot,
    backtop,
  },
}
</script>

<style scoped>

</style>
