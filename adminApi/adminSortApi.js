import axios from '../utils/axios'

const url = '/admin/sort'

function addSort(sort) {
  return axios.instance.post(url + '/addSort', {
    sort: sort,
  })
}

function removeSort(sortId) {
  return axios.instance.post(url + '/removeSort', {
    sortId: sortId,
  })
}

function changeSort(sortId, sort) {
  return axios.instance.post(url + '/changeSort', {
    sortId: sortId,
    sort: sort,
  })
}

function listAllSort() {
  return axios.instance.get(url + '/listAllSort', {
    params: {}
  })
}

export default {
  addSort: addSort,
  removeSort: removeSort,
  changeSort: changeSort,
  listAllSort: listAllSort,
}
