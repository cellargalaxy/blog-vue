<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <archive-and-page :contents="contents" :currentPage="currentPage" :pageSize="1" :total="total"/>
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

    const currentPage = util.string2Int(params.year)

    //         archive/2022
    let basePath = '../..'

    let contents = await $content('', {deep: true}).fetch()
    contents = service.initContents(contents,basePath)

    // const yearMap={}
    // for (let i = 0; i < contents.length; i++) {
    //   const year=contents[i].
    // }

    let copies = []
    for (let i = 0; i < contents.length; i++) {
      if (!util.startWith(contents[i].createdAt, currentPage)) {
        continue
      }
      copies.push(contents[i])
    }

    copies = model.sortContent(copies)

    return {
      navbarConfig: navbarConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      currentPage: currentPage,
      total: parseInt(util.formatDate(new Date(), 'YYYY')),
      contents: copies,
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
