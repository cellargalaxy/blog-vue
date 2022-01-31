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
import util from '../../middleware/util'
import model from '../../middleware/model'

export default {
  name: "page",
  async asyncData({params, $content}) {
    const navbarConfig = config.getNavbarConfig()
    const homeConfig = config.getHomeConfig()
    const pageFootConfig = config.getPageFootConfig()


    let url = params.pathMatch //-> a/b/1/
    if (util.endWith(url, '/')) {
      url = url.substring(0, url.length - 1) //-> a/b/1
    }
    let index = url.lastIndexOf("/")
    let folderPath = url.substring(0, index)//-> a/b
    let page = url.substring(index + 1, url.length)//-> 1

    let contents = await $content(folderPath, {deep: true}).fetch()
    if (!contents instanceof Array) {
      contents = [contents]
    }
    let copies = []
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].path === '/config' && contents[i].extension === '.json') {
        continue
      }
      copies.push(contents[i])
    }

    let basePath = '../..'
    const folderPaths = folderPath.split('/')
    for (let i = 0; i < folderPaths.length; i++) {
      basePath += '/..'
    }
    basePath += '/article'
    copies = model.setBasePaths(copies, basePath)

    const PAGE_SIZE = 10
    const skipNum = (page - 1) * PAGE_SIZE
    const contentPage = (skipNum + PAGE_SIZE >= copies.length) ? copies.slice(skipNum, copies.length) : copies.slice(skipNum, skipNum + PAGE_SIZE)

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      contents: contentPage,
      currentPage: page,
      pageSize: PAGE_SIZE,
      total: copies.length,
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

<style scoped>

</style>
