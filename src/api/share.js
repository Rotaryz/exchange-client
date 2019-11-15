import request from '@utils/http'

export default {
  // 我的资产
  accountDetail(args) {
    const url = `/customer/settlement/account/detail`
    return request.get({url, ...args})
  },
  // 补贴记录
  settlementList(args) {
    const url = `/customer/settlement/settlement/index`
    return request.get({url, ...args})
  },
  // 分享赚钱商品列表
  shareList(args) {
    const url = `/customer/promotion/share/index`
    return request.get({url, ...args})
  },
  // 是否显示分享赚钱
  isShowShare(args) {
    const url = `/customer/promotion/share/is-show`
    return request.get({url, ...args})
  },
  // 绑定分享赚钱关系
  createShareRelation(args) {
    const url = `/customer/promotion/share-relation/create`
    return request.post({url, ...args})
  },
  // 保存分享次数
  updateShareCount(args) {
    const url = `/customer/promotion/share/update-share-count`
    return request.get({url, ...args})
  }
}
