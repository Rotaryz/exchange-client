import request from '@utils/http'

export default {
  /**
   * 订单列表[v1.5.2]
   * @param data
   * @param loading
   * @returns {*}
   */
  serviceList(args) {
    const url = `/customer/service-order/order/index`
    return request.post({ url, ...args })
  },
  /**
   * 重新支付[v1.5.2]
   * @param data
   * @param loading
   * @returns {*}
   */
  orderRepay(args) {
    const url = `/customer/service-order/order/repay`
    return request.post({ url, ...args })
  },
  /**
   * 订单详情[v1.5.2]
   * @param data
   * @param loading
   * @returns {*}
   */
  orderDetail(args) {
    const url = `/customer/service-order/order/show`
    return request.get({ url, ...args })
  }
}
