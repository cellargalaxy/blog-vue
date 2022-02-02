<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <file-list-and-page :files="files" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
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
import fileListAndPage from '../../components/fileListAndPage'

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

    const contents = await $content(folderPath, {deep: true}).fetch()
    let files = service.content2Files(contents, basePath)
    files = model.sortContent(files)
    files.reverse()

    const filePage = service.page(files, currentPage, pageSize)

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      pageSize: pageSize,
      total: files.length,
      currentPage: currentPage,
      files: filePage,
    }
  },
  components: {
    navbar,
    pageHead,
    fileListAndPage,
    pageFoot,
    backtop,
  },
}
</script>

<style scoped>

</style>
