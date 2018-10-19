import guestSortApi from './guestSortApi'

function listShowSort() {
  return guestSortApi.listShowSort()
}

export default {
  listShowSort: listShowSort,
}
