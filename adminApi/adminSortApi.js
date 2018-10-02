import axios from '../utils/axios'

const url = '/admin/sort'

function addSort(sort) {
  return axios.tokenAxiosMethod.post(url + '/addSort', {
    sort: sort,
  })
}

function removeSort(sortId) {
  return axios.tokenAxiosMethod.post(url + '/removeSort', {
    sortId: sortId,
  })
}

function changeSort(sortId, sort) {
  return axios.tokenAxiosMethod.post(url + '/changeSort', {
    sortId: sortId,
    sort: sort,
  })
}

function listAllSort() {
  return axios.tokenAxiosMethod.get(url + '/listAllSort', {
  })
}

export default {
  addSort: addSort,
  removeSort: removeSort,
  changeSort: changeSort,
  listAllSort: listAllSort,
}
