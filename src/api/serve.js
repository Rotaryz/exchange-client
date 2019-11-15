import request from '@utils/http'

export default {
  // ----服务详情---- id
  getServeDetail(args) {
    const url = `/customer/service-goods/goods/show`
    return request.get({ url, ...args })
  },
  // ----分享服务---- goods_id
  setServeShare(args) {
    const url = `/customer/service-goods/goods/add-share-count`
    return request.get({ url, ...args })
  },
  // ----创建服务订单---- goods_id、num
  createServeOrder(args) {
    const url = `/customer/service-order/order/create`
    return request.post({ url, ...args })
  }
}
