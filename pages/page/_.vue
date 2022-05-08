<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <file-list-and-page :files="files" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
    </b-container>

    <page-foot :config="pageFootConfig" :buildTime="buildTime"/>
    <backtop/>
  </div>
</template>

<script>
import navbar from '../../components/navbar'
import pageHead from '../../components/pageHead'
import pageFoot from '../../components/pageFoot'
import backtop from '../../components/backtop'
import fileListAndPage from '../../components/fileListAndPage'

import service from '../../middleware/service'
import model from '../../middleware/model'

export default {
  name: "page",
  async asyncData({params, $content}) {
    const navbarConfig = service.getNavbarConfig()
    const homeConfig = service.getHomeConfig()
    const pageFootConfig = service.getPageFootConfig()
    const siteConfig = service.getSiteConfig()

    const {folderPath, currentPage} = service.parsePath(params.pathMatch)

    const contents = await $content(folderPath, {deep: true}).fetch()
    let files = service.content2Files(contents)
    files = model.sortContentByLevel(files)
    files.reverse()

    const filePage = service.page(files, currentPage, siteConfig.pageSize)

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      buildTime: new Date(),
      pageSize: siteConfig.pageSize,
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
