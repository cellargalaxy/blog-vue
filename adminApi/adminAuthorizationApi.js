import axios from '../utils/axios'

const url = '/admin/authorization'

function addAuthorization(userId, permission) {
  return axios.tokenAxiosMethod.post(url + '/addAuthorization', {
    userId: userId,
    permission: permission,
  })
}

function removeAuthorization(authorizationId) {
  return axios.tokenAxiosMethod.post(url + '/removeAuthorization', {
    authorizationId: authorizationId,
  })
}

export default {
  addAuthorization: addAuthorization,
  removeAuthorization: removeAuthorization,
}
