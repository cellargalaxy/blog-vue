<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <archive-and-page :files="files" :currentPage="currentPage" :pageSize="1" :total="total"/>
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

import config from '../../middleware/config'
import service from '../../middleware/service'
import model from '../../middleware/model'
import util from '../../middleware/util'

export default {
  name: "archive",
  async asyncData({params, $content}) {
    const navbarConfig = config.getNavbarConfig()
    const homeConfig = config.getHomeConfig()
    const pageFootConfig = config.getPageFootConfig()

    let currentPage = params.year

    const contents = await $content('', {deep: true}).fetch()
    let files = service.content2Files(contents)
    files = model.sortContentByTime(files)

    let total = '1'
    if (files.length > 0) {
      total = util.formatDate(files[files.length - 1].createAt, 'YYYY')
    }
    if (util.string2Int(currentPage) <= 0) {
      currentPage = total
    }

    let copies = []
    for (let i = 0; i < files.length; i++) {
      if (!util.startWith(files[i].createdAt, currentPage)) {
        continue
      }
      copies.push(files[i])
    }

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      buildTime: new Date(),
      currentPage: util.string2Int(currentPage),
      total: util.string2Int(total),
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
