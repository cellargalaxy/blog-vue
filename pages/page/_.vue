<template>
  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <br/>
      <page-head :config="homeConfig"/>
      <br/>
      <article-list-and-page :articles="articles" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
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

  import articleService from '../../middleware/service/articleService'
  import configService from '../../middleware/service/configService'

  export default {
    name: "articlePath",
    async asyncData({params, error}) {
      let url = params.pathMatch //-> a/b/1/
      url = url.substring(0, url.length - 1) //-> a/b/1
      let index = url.lastIndexOf("/")
      let folderUrlPath = url.substring(0, index)//-> a/b
      let page = url.substring(index + 1, url.length)//-> 1

      const pageInfo = articleService.listArticlePageByPath(folderUrlPath, page)
      if (pageInfo && pageInfo.articlePage && pageInfo.articlePage.length > 0) {
        return {
          articles: pageInfo.articlePage,
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize,
          total: pageInfo.articles.length,
          navbarConfig: configService.getNavbarConfig(),
          homeConfig: configService.getHomeConfig(),
          pageFootConfig: configService.getPageFootConfig(),
        }
      }

      const errorConfig = configService.getErrorPageConfig("404")
      error(errorConfig)
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