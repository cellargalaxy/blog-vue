import log from '../utils/log'
import {Base64} from 'js-base64'
import crypto from 'crypto-js'

const logger = log('textService')


function enBase64(text) {
  if (text === undefined || text == null) {
    return null
  }
  return Base64.encode(text)
}

function deBase64(text) {
  if (text === undefined || text == null) {
    return null
  }
  return Base64.decode(text)
}

function encryptText(text, secret) {
  try {
    const encrypt = crypto.AES.encrypt(text, secret)
    return encrypt !== undefined && encrypt != null ? encrypt.toString() : null
  } catch (e) {
    logger.error('encrypt fail: {}', e)
    return null
  }
}

function decryptText(text, secret) {
  try {
    const encrypt = crypto.AES.decrypt(text, secret)
    return encrypt !== undefined && encrypt != null ? encrypt.toString(crypto.enc.Utf8) : null
  } catch (e) {
    logger.error('decrypt fail: {}', e)
    return null
  }
}

export default {
  enBase64: enBase64,
  deBase64: deBase64,
  encryptText: encryptText,
  decryptText: decryptText,
}