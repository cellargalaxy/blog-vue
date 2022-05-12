<template>
  <div>
    <navbar :config="siteConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <archive-and-page :files="files" :startPage="startPage" :endPage="endPage" :currentPage="currentPage"/>
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
import archiveAndPage from '../../components/archiveAndPage'

import service from '../../middleware/service'
import model from '../../middleware/model'
import util from '../../middleware/util'

export default {
  name: "archive",
  async asyncData({params, $content}) {
    const siteConfig = service.getSiteConfig()
    const homeConfig = service.getHomeConfig()
    const pageFootConfig = service.getPageFootConfig()

    let currentPage = params.date

    const contents = await $content('', {deep: true}).fetch()
    let files = service.content2Files(contents)
    files = model.sortContentByTime(files)

    const dateMap = {}
    for (let i = 0; i < files.length; i++) {
      const date = util.formatDate(files[i].createAt, 'YYYY')
      dateMap[date] = date
    }
    const dates = []
    for (let date in dateMap) {
      dates.push(date)
    }
    dates.sort()

    const startPage = dates.length === 0 ? 0 : util.string2Int(dates[0])
    const endPage = dates.length === 0 ? 0 : util.string2Int(dates[dates.length - 1])
    if (util.string2Int(currentPage) <= 0) {
      currentPage = endPage
    }

    let copies = []
    for (let i = 0; i < files.length; i++) {
      const date = util.formatDate(files[i].createAt, 'YYYYMMDD')
      if (!util.startWith(date, currentPage)) {
        continue
      }
      copies.push(files[i])
    }

    return {
      siteConfig: siteConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      buildTime: new Date(),
      startPage: util.string2Int(startPage),
      endPage: util.string2Int(endPage),
      currentPage: util.string2Int(currentPage),
      files: copies,
    }
  },
  components: {
    navbar,
    pageHead,
    archiveAndPage,
    pageFoot,
    backtop,
  },
}
</script>

<style scoped>

</style>
