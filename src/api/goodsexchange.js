import request from '@utils/http'

export default {
  // ---- 商品列表 ---- keyword category_id limit page
  getGoodsList(args) {
    const url = `/customer/shop-goods/goods/index`
    return request.get({ url, ...args })
  },
  // 商品详情
  getGoodsDetail(args) {
    const url = `/customer/shop-goods/goods/show`
    return request.get({ url, ...args })
  },
  //  立即兑换
  exchange(args) {
    const url = `/customer/integral-order/order/create`
    return request.post({ url, ...args })
  }
}
