<template>
  <div>
    <navbar :config="siteConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>

      <b-input-group size="lg">
        <b-form-input placeholder="Search" class="white-background-8" v-model="key" @keyup.enter.native="search"/>
        <b-input-group-append>
          <b-button variant="outline-secondary" class="white-background-8" @click="search">Search</b-button>
        </b-input-group-append>
      </b-input-group>
      <br/>

      <div v-if="files.length===0">
        <b-card class="white-background-8 text-center">Nothing</b-card>
        <br/>
      </div>
      <div v-else>
        <file-list :files="files"/>
      </div>
    </b-container>

    <page-foot :config="pageFootConfig" :buildTime="buildTime"/>
    <backtop/>
  </div>
</template>

<script>
import navbar from '../components/navbar'
import pageHead from '../components/pageHead'
import pageFoot from '../components/pageFoot'
import backtop from '../components/backtop'
import fileListAndPage from '../components/fileListAndPage'

import service from '../middleware/service'
import model from '../middleware/model'
import path from 'path'

export default {
  name: "search",
  async asyncData({query, $content}) {
    const siteConfig = service.getSiteConfig()
    const homeConfig = service.getHomeConfig()
    const pageFootConfig = service.getPageFootConfig()

    let key = query.key
    console.log('query',query)
    console.log('key',key)
    if (key === undefined || key == null || key === '') {
      return {
        siteConfig: siteConfig,
        homeConfig: homeConfig,
        pageFootConfig: pageFootConfig,
        buildTime: new Date(),
        files: [],
      }
    }

    const contents = await $content('', {deep: true}).search(key).fetch()
    let files = service.content2Files(contents)
    files = model.sortContentByLevel(files)
    files.reverse()

    return {
      siteConfig: siteConfig,
      homeConfig: homeConfig,
      pageFootConfig: pageFootConfig,
      buildTime: new Date(),
      key: key,
      basePath: siteConfig.basePath,
      files: files,
    }
  },
  methods: {
    search() {
      if (this.key === undefined || this.key == null || this.key === '') {
        return
      }
      window.location.href = path.join(this.basePath, '/search/?key=' + this.key)
    },
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
