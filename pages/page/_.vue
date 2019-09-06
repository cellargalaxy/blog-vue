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

  import utils from '../../assets/utils/utils'
  import articleService from '../../assets/service/articleService'
  import configService from '../../assets/service/configService'

  const urlRegularObject = new RegExp('\\d+/$')

  export default {
    name: "articlePath",
    async asyncData({req, params, redirect, error}) {
      /**
       ----page    num    not num
       sort
       num        /1/2    /1/   /1/a
       not num    /a/2    ''    /a/    /a/b

       ----page   num    not num
       sort
       num        +'/'    ok    +'/1/'
       not num    +'/'   +'1/'  +'1/'   +'1/'
       */

        //-> a/b/1/
      let url = params.pathMatch
      if (url.endsWith("/")) {
        //-> a/b/1
        url = url.substring(0, url.length - 1)
      }

      let urls = url.split("/")
      let page = urls.length > 0 ? urls[urls.length - 1] : ''
      let index = url.lastIndexOf(page)
      //-> a/b/
      let articlePath = url.substring(0, index)
      if (!articlePath.startsWith("/")) {
        articlePath = "/" + articlePath
      }
      if (articlePath.endsWith("/")) {
        //-> a/b
        articlePath = articlePath.substring(0, url.length - 1)
      }

      //-> a/b/c, page=c
      if (!utils.isNum(page)) {
        if (req.url.endsWith("/")) {
          redirect(req.url + '1/')
        } else {
          redirect(req.url + '/1/')
        }
        return
      }
      //-> a/b/1
      let urlExec = urlRegularObject.exec(params.pathMatch)
      if (!urlExec) {
        redirect(req.url + '/')
        return
      }

      let articles = articleService.listArticleByPath(articlePath)
      const total = articles.length
      const pageSize = configService.getArticleConfig().pageSize
      const currentPage = page
      articles = articleService.listArticlePageByArticles(articles, pageSize, currentPage)
      if (articles && articles.length > 0) {
        return {
          isArticle: false,
          pageSize: pageSize,
          currentPage: currentPage,
          total: total,
          articles: articles,
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