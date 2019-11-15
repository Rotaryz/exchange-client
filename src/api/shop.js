import request from '@utils/http'

export default {
  // 企业介绍[PM_1.3]
  getShopInfo(args) {
    const url = `/customer/shop/shop-manager/show`
    return request.get({ url, loading: false, ...args })
  },
  // 活动列表
  getActiveList(type) {
    const url = `/customer/promotion/promotion/index`
    return request.get({ url, loading: false, data: {type, page_path: 'shop'} })
  },
  // 商品列表[v1.5.2]
  getServeList(args) {
    const url = `/customer/service-goods/goods/index`
    return request.get({ url, loading: false, ...args })
  },
  // 是否显示分享赚钱
  hasShareEarn(args) {
    const url = `/customer/promotion/share/is-show`
    return request.get({ url, loading: false, ...args })
  }
}
