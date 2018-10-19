import axios from '../utils/axios'

const url = '/guest/sort'

function listShowSort() {
  return axios.tokenAxiosMethod.get(url + '/listShowSort', {
  })
}

export default {
  listShowSort: listShowSort,
}
