import request from '@utils/http'

export default {
  /**
   * 我的奖品记录[v1.5.2]
   * @param data
   * @param loading
   * @returns {*}
   */
  PrizeList(args) {
    const url = `/customer/service-coupon/coupon/customer-market-prize`
    return request.get({ url, ...args })
  }
}
