<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <article-comment :content="content"/>
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

    const {folderPath} = service.parsePath(params.pathMatch)

    let contents = await $content(folderPath, {deep: false}).fetch()
    contents = service.initContents(contents)
    if (contents.length === 0) {
      error()
      return
    }

    //          article/1
    let basePath = '../..'
    const folderPaths = folderPath.split('/')
    for (let i = 0; i < folderPaths.length; i++) {
      basePath += '/..'
    }
    contents = service.setBasePaths(contents, basePath)

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      content: contents[0],
      siteName: siteConfig.siteName,
    }
  },
  head() {
    if (this.content.slug) {
      return {
        title: this.content.slug + ' | ' + this.siteName,
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
