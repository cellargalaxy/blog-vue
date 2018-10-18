import guestSortApi from './guestSortApi'

function listAbleSort() {
  return guestSortApi.listAbleSort()
}

export default {
  listAbleSort: listAbleSort,
}
