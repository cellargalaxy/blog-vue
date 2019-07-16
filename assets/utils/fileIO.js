import path from 'path'

function join(...paths) {
  return path.join(...paths).replace(/\\/g, '/')
}

export default {
  join: join,
}