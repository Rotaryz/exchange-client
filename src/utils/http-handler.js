import HTTP from '@utils/http'
import { showLoading, hideLoading, showToast } from '@utils/wechat'
import { baseURL, ERR_OK, TIME_OUT } from '@utils/config'
import { silentAuthorization } from './common'
import storage from '@utils/storage'
import $$routes from '@utils/routes'

const COMMON_HEADER = {
  'Authorization': storage('token'),
  'Current-Shop': storage('shopId')
}
let ErrorNum = 0

HTTP.init(http => {
  http.config.timeout = TIME_OUT
  http.config.headers = COMMON_HEADER
  http.config.baseURL = baseURL.api
})

HTTP.setCallback({
  // 请求前处理
  beforeRequest({ loading = true }) {
    if (loading) {
      showLoading()
    }
  },
  // 请求拦截
  willRequest(request) {
    return request
  },
  // 响应拦截
  willResponse(response) {
    return response
  },
  // 请求完成后的逻辑处理
  responseFulfilled(res, { url, loading = true, toast = true, doctor }) {
    // 可自定义处理loading
    if (typeof loading === 'function') {
      loading(res)
    } else if (loading) {
      hideLoading()
    }
    // 错误处理
    if (res.error_code !== ERR_OK) {
      // 1 code码处理
      errorCodeHandle(res.error_code, url)
      // 2 可自定义处理toast错误
      if (typeof toast === 'function') {
        toast(res)
      } else if (toast) {
        showToast(res.message)
      }
      // 3 错误处理
      console.error(url + ' <<<<<<接口异常>>>>> ' + JSON.stringify(res))
      if (typeof doctor === 'function') {
        doctor(res, url)
      } else {
        throw res
      }
    }
    return res
  }
})

// 错误码处理
function errorCodeHandle(code) {
  switch (code) {
    // 登录凭证失效的时候
    case 10000:
      if (ErrorNum <= 0) {
        silentAuthorization()
        ErrorNum = -1
      }
      ErrorNum++
      break
    case 2010101: // 商品不存在
    case 2020101: // 服务不存在
    case 2600101: // 活动不存在
      wx.redirectTo({ url: $$routes.main.PAGE_MISSING })
      break
    case 2010102: // 商品已下架
    case 2020102: // 服务已下架
    case 2600102: // 活动已下架、结束
    case 3500105: // 大转盘活动实效
      wx.redirectTo({ url: $$routes.main.PAGE_MISSING })
      break
    default:
      break
  }
}
