import request from '@utils/http'

export default {
  /**
   * 兑换记录列表
   * @param data
   * @param loading
   * @returns {*}
   */
  exchangeList(args) {
    const url = `/customer/integral-order/order/index`
    return request.get({ url, ...args })
  },
  /**
   * 兑换记录详情
   * @param data
   * @param loading
   * @returns {*}
   */
  exchangeDetail(args) {
    const url = `/customer/integral-order/order/show`
    return request.get({ url, ...args })
  },
  /**
   * 兑换券/播豆赠送明细
   * @param data
   * @param loading
   * @returns {*}
   */
  beanLog(args) {
    const url = `/customer/shop/integral-bean-log/index`
    return request.get({ url, ...args })
  }
}
