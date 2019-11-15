const env = process.env
const version = process.versions

const LOCAL = {
  api: 'http://exchange-platform-api.com/exchange-platform' + version,
  image: 'http://img.com/defaults',
  upload: 'http://exchange-platform-api.com/exchange-platform' + version,
  outLink: 'wss://fresh-h5.jkweixin.net', // 外部h5链接
  websocket: 'wss://wss.com/',
  webview: 'https://fresh-h5.jkweixin.net'
}

const DEV = {
  api: 'https://exchange-platform-api.jerryf.cn/exchange-platform' + version,
  // image: 'https://img.jerryf.cn/defaults',
  image: 'https://img.jkweixin.net/defaults',
  upload: 'https://exchange-platform-api.jerryf.cn/exchange-platform' + version,
  outLink: 'wss://fresh-h5.jkweixin.net', // 外部h5链接
  websocket: 'wss://wss.jerryf.cn/',
  webview: 'https://fresh-h5.jkweixin.net'
}

const TEST = {
  api: 'https://exchange-platform-api.jkweixin.net/exchange-platform' + version,
  image: 'https://img.jkweixin.net/defaults',
  upload: 'https://exchange-platform-api.jkweixin.net/exchange-platform' + version,
  outLink: 'https://fresh-h5.jkweixin.net',
  websocket: 'wss://wss.jkweixin.net',
  webview: 'https://fresh-h5.jkweixin.net'
}

const PROD = {
  api: 'https://exchange-platform-api.jkweixin.com/exchange-platform' + version,
  image: 'https://img.jkweixin.com/defaults',
  upload: 'https://exchange-platform-api.jkweixin.com/exchange-platform' + version,
  outLink: 'https://fresh-h5.jkweixin.com',
  websocket: 'wss://wss.jkweixin.com',
  webview: 'https://fresh-h5.jkweixin.com'
}

// 环境配置请求的api
let baseUrl = ''
switch (env) {
  case 'local':
    baseUrl = LOCAL
    break
  case 'dev':
    baseUrl = DEV
    break
  case 'test':
    baseUrl = TEST
    break
  case 'production':
  default:
    baseUrl = PROD
    break
}
export const baseURL = baseUrl

export const ERR_OK = 0
export const TIME_OUT = 10000
export const ERR_NO = -404
export const TOKEN_OUT = 10000 // token 失效
