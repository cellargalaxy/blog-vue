import axios from '../utils/axios'

const url = '/guest/sort'

function listAllSort() {
  return axios.tokenAxiosMethod.get(url + '/listAllSort', {
  })
}

export default {
  listAllSort: listAllSort,
}
