import request from '@utils/http'

export default {
  getDetail(args) {
    const url = `/customer/marketing/rotary-disk/show`
    return request.post({ url, ...args })
  },
  getLogList(args) {
    const url = `/customer/marketing/rotary-disk-prize-log/index`
    return request.post({ url, loading: false, data: {limit: 0} })
  },
  rotary(args) {
    const url = `/customer/marketing/rotary-disk/rotary`
    return request.post({ url, loading: false, ...args })
  },
  getLottery(args) {
    const url = `/customer/marketing/rotary-disk/get-normal-times`
    return request.get({ url, loading: false, ...args })
  }
}
