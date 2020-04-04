import log from '../utils/log'
import fileDao from '../dao/fileDao'
import configService from './configService'
import moment from "moment"
import path from "path"
import utils from "../utils/utils"
import fileIO from "../utils/fileIO"

const logger = log('fileService')

const PATH_DATE_REGULAR = configService.getFileConfig().pathDateRegular
logger.info('路径日期正则: {}', PATH_DATE_REGULAR)
const PATH_DATE_REGULAR_OBJECT = new RegExp(PATH_DATE_REGULAR)
const PATH_DATE_FORMAT = configService.getFileConfig().pathDateFormat
logger.info('路径日期格式: {}', PATH_DATE_FORMAT)
const PAGE_SIZE = configService.getFileConfig().pageSize
logger.info('文件列表页大小: {}', PAGE_SIZE)
const SUMMARY_ROW = configService.getFileConfig().summaryRow
logger.info('摘要行数: {}', SUMMARY_ROW)
const DATE_STRING_FORMAT = configService.getFileConfig().dateStringFormat
logger.info('时间字符串格式化: {}', DATE_STRING_FORMAT)
const FILE_CONFIGS = configService.getFileConfig().fileConfigs

function getFile(filePath) {
  try {
    const fileConfig = getFileConfig(filePath)
    if (!fileConfig || !fileConfig.extension) {
      logger.error('未配置该文件所在目录配置,filePath: {}', filePath)
      return null
    }
    const extension = fileConfig.extension

    if (utils.endsWith(filePath, '/')) { //-> a/b/c/
      filePath = filePath.substring(0, filePath.length - 1) //-> a/b/c
    }
    filePath = filePath + extension //-> a/b/c.md
    logger.info('重整filePath: {}', filePath)
    const content = fileDao.getFileContent(filePath)
    if (content == null) {
      return null
    }
    const file = createFile(filePath, content)
    return file
  } catch (e) {
    logger.error('读取文件失败: {}', e)
    return null
  }
}

function listFileByPath(folderPath) {
  try {
    const fileConfig = getFileConfig(folderPath)
    if (!fileConfig || !fileConfig.extension) {
      logger.error('未配置所在文件夹配置,folderPath: {}', folderPath)
      return []
    }
    const extension = fileConfig.extension

    const folderContent = fileDao.getFolderContent(folderPath, extension)
    const files = []
    for (const filePath in folderContent) {
      const file = createFile(filePath, folderContent[filePath])
      if (file != null) {
        files.push(file)
      }
    }
    files.sort(sortFiles)
    return files
  } catch (e) {
    logger.error('读取文件夹文件失败: {}', e)
    return []
  }
}

function getPageInfoByPath(folderPath, currentPage) {
  const files = listFileByPath(folderPath)
  const skipNum = (currentPage - 1) * PAGE_SIZE
  const filePage = (skipNum + PAGE_SIZE >= files.length) ? files.slice(skipNum, files.length) : files.slice(skipNum, skipNum + PAGE_SIZE)
  return {folderPath: folderPath, files: files, currentPage: currentPage, filePage: filePage}
}

/**
 * [{"date":"date","dateString":"dateString","files":[{"file_key":"file_value"}]}]
 */
function getTimeLines() {
  const files = listFileByPath('')

  //用于保存数据的临时对象
  //{'dateString': [{'file_key': 'file_value'}]}
  let timeLines = {}
  //{'sort': [{'file_key': 'file_value'}]}
  let otherTimeLines = {}
  for (let i in files) {
    const file = files[i]
    if (file.date) {
      //有时间的文件
      const dateString = utils.formatDate(file.date, 'yyyy-MM')
      let timeLine = timeLines[dateString]
      if (!timeLine) {
        timeLine = []
      }
      timeLine.push(file)
      timeLines[dateString] = timeLine
    } else {
      //没时间的文件用分类代替
      let sort = file.sort
      let timeLine = otherTimeLines[sort]
      if (!timeLine) {
        timeLine = []
      }
      timeLine.push(file)
      otherTimeLines[sort] = timeLine
    }
  }

  //转换timeLine的数据结构
  let tmp = timeLines
  timeLines = []
  for (let dateString in tmp) {
    //某个月的文件
    const files = tmp[dateString]
    //对那个月的文件进行排序
    files.sort(sortFiles)
    timeLines.push({date: new Date(dateString), dateString: dateString, files: files})
  }
  //对时间线的全部月份进行排序
  timeLines.sort((timeline1, timeline2) => {
    return timeline2.date.getTime() - timeline1.date.getTime()
  })

  tmp = otherTimeLines
  otherTimeLines = []
  for (let sort in tmp) {
    const files = tmp[sort]
    otherTimeLines.push({dateString: sort, files: files})
  }
  otherTimeLines.sort((timeline1, timeline2) => {
    return timeline1.dateString.localeCompare(timeline2.dateString)
  })

  //将没有时间的文件放到timeLine里
  for (let i = 0; i < otherTimeLines.length; i++) {
    timeLines.push(otherTimeLines[i])
  }

  return timeLines
}

function listRoutes() {
  const files = listFileByPath('')
  if (files == null) {
    return []
  }
  const routes = []
  const sorts = {}
  for (let i in files) {
    const file = files[i]
    routes.push(file.url)

    let sum = sorts[file.sort]
    if (!sum) {
      sum = 0
    }
    sum++
    sorts[file.sort] = sum
  }
  sorts['/'] = files.length
  for (let sort in sorts) {
    let sum = sorts[sort] / PAGE_SIZE
    if (sorts[sort] % PAGE_SIZE > 0) {
      sum++
    }
    for (let page = 1; page <= sum; page++) {
      routes.push(fileIO.join('/page', sort, page.toString(), '/'))
    }
  }
  return routes
}

/**
 * 会初始化path、markdown、summary、title、url、sort、sortUrl、(date、dateString)属性
 * @param filePath
 * @param markdown
 * @returns {{}}
 */
function createFile(filePath, content) {
  const fileConfig = getFileConfig(filePath)
  if (!fileConfig || fileConfig.extension == undefined || fileConfig.urlPath == undefined || fileConfig.folderPath == undefined) {
    logger.error('未配置该文件所在目录配置')
    return null
  }
  const extension = fileConfig.extension
  const urlPath = fileConfig.urlPath
  const folderPath = fileConfig.folderPath

  const file = {}
  file.path = filePath
  file.content = content
  file.title = path.basename(filePath).replace(extension, '')
  file.url = fileIO.join('/', urlPath, filePath.replace(folderPath, '').replace(extension, ''), '/')

  let summary = ''
  const contents = file.content.split('\n')
  let count = 0
  for (let i = 0; i < contents.length && count < SUMMARY_ROW; i++) {
    if (contents[i] && (contents[i] = contents[i].trim()).length > 0) {
      summary = summary + contents[i] + '\n'
      count = count + 1
    }
  }
  file.summary = summary

  const attributes = []

  let dateExec = PATH_DATE_REGULAR_OBJECT.exec(filePath)
  if (dateExec) {
    let dateString = dateExec.toString()
    const date = new Date(moment(dateString, PATH_DATE_FORMAT))
    file.date = date
  }
  if (file.date) {
    const dateString = utils.formatDate(file.date, DATE_STRING_FORMAT)
    file.dateString = dateString
    attributes.push({"name": "date", "value": dateString})
  }

  let sort = filePath.split(file.title)[0]
  if (dateExec) {
    let dateString = dateExec.toString()
    sort = sort.split(dateString)[0]
  }
  if (sort == null || sort == '') {
    sort = '/'
  }
  const sortUrl = fileIO.join('/page', sort, '1/')
  file.sort = sort
  file.sortUrl = sortUrl
  attributes.push({"name": "sort", "value": sort, "url": sortUrl})

  file.attributes = attributes
  return file
}

function getFileConfig(filePath) {
  if (!FILE_CONFIGS) {
    logger.error('没有配置任何的文件配置')
    return null
  }
  for (let i in FILE_CONFIGS) {
    if (FILE_CONFIGS[i].folderPath != undefined && utils.startsWith(filePath, FILE_CONFIGS[i].folderPath)) {
      return FILE_CONFIGS[i]
    }
  }
  return null
}

function sortFiles(file1, file2) {
  if (!file1.date && !file2.date) {
    return file1.title.localeCompare(file2.title)
  }
  //没有时间的排在最后
  if (!file1.date) {
    return 1
  }
  if (!file2.date) {
    return -1
  }
  return file2.date.getTime() - file1.date.getTime()
}

export default {
  getFile: getFile,
  listFileByPath: listFileByPath,
  getPageInfoByPath: getPageInfoByPath,
  listRoutes: listRoutes,
  getTimeLines: getTimeLines,
  getFileConfig: getFileConfig,
}