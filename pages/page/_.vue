<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <article-list-and-page :contents="contents" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
    </b-container>

    <page-foot :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
import navbar from '../../components/navbar'
import pageHead from '../../components/pageHead'
import pageFoot from '../../components/pageFoot'
import backtop from '../../components/backtop'
import articleListAndPage from '../../components/articleListAndPage'

import config from '../../middleware/config'
import service from '../../middleware/service'
import model from '../../middleware/model'

export default {
  name: "page",
  async asyncData({params, $content}) {
    const navbarConfig = config.getNavbarConfig()
    const homeConfig = config.getHomeConfig()
    const pageFootConfig = config.getPageFootConfig()
    const pageSize = config.getPageSize()

    const {folderPath, currentPage} = service.parsePath(params.pathMatch)

    //             page/1
    let basePath = '../..'
    const folderPaths = folderPath.split('/')
    for (let i = 0; i < folderPaths.length; i++) {
      basePath += '/..'
    }

    let contents = await $content(folderPath, {deep: true}).fetch()
    contents = service.initContents(contents, basePath)
    contents = model.sortContent(contents)
    contents.reverse()

    const contentPage = service.page(contents, currentPage, pageSize)

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      pageSize: pageSize,
      total: contents.length,
      currentPage: currentPage,
      contents: contentPage,
    }
  },
  components: {
    navbar,
    pageHead,
    articleListAndPage,
    pageFoot,
    backtop,
  },
}
</script>

<style>
body {
  background-color: burlywood;
}
</style>
