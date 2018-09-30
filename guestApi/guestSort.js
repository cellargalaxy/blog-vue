import guestSortApi from './guestSortApi'

function listAllSort() {
  return guestSortApi.listAllSort()
}

export default {
  listAllSort: listAllSort,
}
