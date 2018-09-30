import axios from '../utils/axios'

const url = '/guest/sort'

function listAllSort() {
  return axios.instance.get(url + '/listAllSort', {
    params: {}
  })
}

export default {
  listAllSort: listAllSort,
}
