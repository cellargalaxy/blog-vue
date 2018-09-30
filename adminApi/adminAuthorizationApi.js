import axios from '../utils/axios'

const url = '/admin/authorization'

function addAuthorization(userId, permission) {
  return axios.instance.post(url + '/addAuthorization', {
    userId: userId,
    permission: permission,
  })
}

function removeAuthorization(authorizationId) {
  return axios.instance.post(url + '/removeAuthorization', {
    authorizationId: authorizationId,
  })
}

export default {
  addAuthorization: addAuthorization,
  removeAuthorization: removeAuthorization,
}
