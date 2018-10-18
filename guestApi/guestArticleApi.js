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

function listAbleArticleBySort(pageSize, page, sort) {
  return axios.tokenAxiosMethod.get(url + '/listAbleArticleBySort', {
    pageSize: pageSize,
    page: page,
    sort: sort,
  })
}

function listAbleArticleVoBySort(pageSize, page, sort) {
  return axios.tokenAxiosMethod.get(url + '/listAbleArticleVoBySort', {
    pageSize: pageSize,
    page: page,
    sort: sort,
  })
}

function getArticleCountBySortAndStatus(sort, status) {
  return axios.tokenAxiosMethod.get(url + '/getArticleCountBySortAndStatus', {
    sort: sort,
    status: status,
  })
}

function listAllSitemap() {
  return axios.tokenAxiosMethod.get(url + '/listAllSitemap', {})
}

export default {
  viewArticle: viewArticle,
  viewArticleVo: viewArticleVo,
  listAbleArticleBySort: listAbleArticleBySort,
  listAbleArticleVoBySort: listAbleArticleVoBySort,
  getArticleCountBySortAndStatus: getArticleCountBySortAndStatus,
  listAllSitemap: listAllSitemap,
}
