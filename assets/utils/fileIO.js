import path from 'path'
import fs from 'fs'

function join(...paths) {
  return path.join(...paths).replace(/\\/g, '/')
}

function exists(fileOrFolderPath) {
  try {
    fs.accessSync(fileOrFolderPath, fs.constants.F_OK)
    return true
  } catch (err) {
    return false
  }
}

export default {
  join: join,
  exists: exists,
}