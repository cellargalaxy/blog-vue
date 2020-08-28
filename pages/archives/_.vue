<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <archives-and-page :archives="archives" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
    </b-container>

    <page-foot :buildTimeString="buildTimeString" :config="pageFootConfig"/>
    <backtop/>
  </div>
</template>

<script>
  import navbar from '../../components/navbar'
  import pageHead from '../../components/pageHead'
  import pageFoot from '../../components/pageFoot'
  import backtop from '../../components/backtop'
  import archivesAndPage from '../../components/archivesAndPage'

  import fileService from '../../middleware/service/fileService'
  import configService from '../../middleware/service/configService'
  import utils from "../../middleware/utils/utils"

  export default {
    name: "archivesPath",
    async asyncData({params, error}) {
      const navbarConfig = configService.getNavbarConfig()
      if (!navbarConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
      const homeConfig = configService.getHomeConfig()
      if (!homeConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
      const pageFootConfig = configService.getPageFootConfig()
      if (!pageFootConfig) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }

      let url = params.pathMatch //-> a/b/1/
      url = url.substring(0, url.length - 1) //-> a/b/1
      let index = url.lastIndexOf("/")
      let folderPath = url.substring(0, index)//-> a/b
      let page = url.substring(index + 1, url.length)//-> 1

      const pageInfo = fileService.listArchiveInfo(folderPath, page)
      if (!pageInfo || !pageInfo.filePage || pageInfo.filePage.length == 0) {
        const errorConfig = configService.getErrorPageConfig("404")
        error(errorConfig)
        return
      }
      for (let i = 0; i < pageInfo.filePage.length; i++) {
        const files = pageInfo.filePage[i].files
        for (let j = 0; j < files.length; j++) {
          pageInfo.filePage[i].files[j] = {
            url: pageInfo.filePage[i].files[j].url,
            title: pageInfo.filePage[i].files[j].title,
            dateString: pageInfo.filePage[i].files[j].dateString,
          }
        }
      }
      return {
        archives: pageInfo.filePage,
        currentPage: pageInfo.currentPage,
        pageSize: pageInfo.pageSize,
        total: pageInfo.total,
        navbarConfig: navbarConfig,
        homeConfig: homeConfig,
        pageFootConfig: pageFootConfig,
        buildTimeString: utils.formatDate(new Date(), pageFootConfig.buildTimeFormat),
      }
    },
    components: {
      navbar,
      pageHead,
      archivesAndPage,
      pageFoot,
      backtop,
    },
  }
</script>

<style scoped>

</style>