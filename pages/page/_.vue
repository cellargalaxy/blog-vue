<template>
  <div>
    <navbar :config="navbarConfig"/>
    <page-head :config="pageHeadConfig"/>

    <b-container>
      <article-list-and-page :articles="articles" :currentPage="currentPage" :pageSize="pageSize" :total="total"/>
    </b-container>

    <page-foot :config="pageFootConfig"/>
    <goto :config="gotoConfig"/>
  </div>
</template>

<script>
  import navbar from '../../components/navbar'
  import pageHead from '../../components/pageHead'
  import pageFoot from '../../components/pageFoot'
  import goto from '../../components/goto'
  import articleListAndPage from '../../components/articleListAndPage'

  import articleService from '../../middleware/service/articleService'
  import configService from '../../middleware/service/configService'

  export default {
    name: "articlePath",
    async asyncData({params, error}) {
      let url = params.pathMatch //-> a/b/1/
      url = url.substring(0, url.length - 1) //-> a/b/1
      let index = url.lastIndexOf("/")
      let folderPath = url.substring(0, index)//-> a/b
      let page = url.substring(index + 1, url.length)//-> 1

      const pageInfo = articleService.listArticlePageByPath(folderPath, page)
      if (pageInfo && pageInfo.articlePage && pageInfo.articlePage.length > 0) {
        return {
          isArticle: false,
          pageSize: pageInfo.pageSize,
          currentPage: pageInfo.currentPage,
          total: pageInfo.articles.length,
          articles: pageInfo.articlePage,
          navbarConfig: configService.getNavbarConfig(),
          pageHeadConfig: configService.getPageHeadConfig(),
          pageFootConfig: configService.getPageFootConfig(),
          gotoConfig: configService.getGotoConfig(),
        }
      }

      const errorConfig = configService.getErrorPageConfig("404")
      error(errorConfig)
    },
    components: {
      articleListAndPage,
      navbar,
      pageHead,
      pageFoot,
      goto,
    },
  }
</script>

<style scoped>

</style>