import axios from '../utils/axios'

const url = '/guest/article'

function viewArticle(createDate, title) {
  return axios.tokenAxiosMethod.get(url + '/viewArticle', {
    createDate: createDate,
    title: title
  })
}

function viewArticleVo(createDate, title) {
  return axios.tokenAxiosMethod.get(url + '/viewArticleVo', {
    articleId: createDate,
    title: title
  })
}

function listArticleBySort(pageSize, page, sort) {
  return axios.tokenAxiosMethod.get(url + '/listArticleBySort', {
    pageSize: pageSize,
    page: page,
    sort: sort,
  })
}

function listArticleVoBySort(pageSize, page, sort) {
  return axios.tokenAxiosMethod.get(url + '/listArticleVoBySort', {
    pageSize: pageSize,
    page: page,
    sort: sort,
  })
}

function getArticleCountBySort(sort) {
  return axios.tokenAxiosMethod.get(url + '/getArticleCountBySort', {
    sort: sort,
  })
}

function listAllSitemap() {
  return axios.tokenAxiosMethod.get(url + '/listAllSitemap', {})
}

export default {
  viewArticle: viewArticle,
  viewArticleVo: viewArticleVo,
  listArticleBySort: listArticleBySort,
  listArticleVoBySort: listArticleVoBySort,
  getArticleCountBySort: getArticleCountBySort,
  listAllSitemap: listAllSitemap,
}
