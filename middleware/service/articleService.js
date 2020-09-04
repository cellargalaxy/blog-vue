import log from '../utils/log'
import fileIO from '../utils/fileIO'
import fileService from './fileService'

const logger = log('articleService')

const URL_PATH = 'article'
const FILE_CONFIG = fileService.getFileConfig(URL_PATH)
logger.info('文件配置: {}', JSON.stringify(FILE_CONFIG))


function getArticle(articlePath) {
  articlePath = fileIO.join(FILE_CONFIG.folderPath, articlePath)
  let file = fileService.getFile(articlePath)
  let article = createArticle(file)
  return article
}

function getPageInfoByPath(folderPath, currentPage) {
  const pageInfo = fileService.getPageInfoByPath(folderPath, currentPage)
  const files = []
  const filePage = []
  for (let i in pageInfo.files) {
    files.push(createArticle(pageInfo.files[i]))
  }
  for (let i in pageInfo.filePage) {
    filePage.push(createArticle(pageInfo.filePage[i]))
  }
  return {
    folderPath: pageInfo.folderPath,
    files: files,
    pageSize: pageInfo.pageSize,
    total: pageInfo.total,
    currentPage: pageInfo.currentPage,
    filePage: filePage
  }
}

function createArticle(file) {
  if (!file) {
    return null
  }
  if (!file.wordSum) {
    const wordSum = file.content.length
    file.wordSum = wordSum
    file.attributes.push({name: 'word', value: wordSum})
  }

  //https://www.wukong.com/question/6434284981916270849/
  if (!file.readTime && file.wordSum) {
    let readTime = Math.round(file.wordSum / 300)
    if (readTime == 0) {
      readTime = 1
    }
    file.readTime = readTime
    file.attributes.push({name: 'readtime', value: readTime + ' min'})
  }

  return file
}

export default {
  getArticle: getArticle,
  getPageInfoByPath: getPageInfoByPath,
  createArticle: createArticle,
}