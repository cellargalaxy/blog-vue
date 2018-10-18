import axios from '../utils/axios'

const url = '/guest/sort'

function listAbleSort() {
  return axios.tokenAxiosMethod.get(url + '/listAbleSort', {
  })
}

export default {
  listAbleSort: listAbleSort,
}
