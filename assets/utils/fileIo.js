const fs = require('fs')
const path = require('path')

function deleteFileOrFolder(fileOrFolderPath) {
  if (!fileOrFolderPath || !fs.existsSync(fileOrFolderPath)) {
    return
  }
  const stats = fs.statSync(fileOrFolderPath)
  if (stats.isFile()) {
    fs.unlinkSync(fileOrFolderPath)
    return
  }
  const files = fs.readdirSync(fileOrFolderPath)
  for (let i = 0; i < files.length; i++) {
    deleteFileOrFolder(path.join(fileOrFolderPath, files[i]))
  }
  fs.rmdirSync(fileOrFolderPath)
}

export default {
  deleteFileOrFolder: deleteFileOrFolder,
}