import request from '@utils/http'

export default {
  // ----砍价详情---- goods_id、 promotion_id
  getBargainDetail(args) {
    const url = `/customer/promotion/bargain/show`
    return request.get({ url, ...args })
  },
  // --------砍一刀-------- goods_id、 promotion_id
  cutBargain(args) {
    const url = `/customer/promotion/bargain/cut-money`
    return request.post({ url, ...args })
  },
  // ----拼团商品详情---- goods_id、 promotion_id
  getGroupGoodsDetail(args) {
    const url = `/customer/promotion/groupon/show`
    return request.get({ url, ...args })
  },
  // ----团购详情---- team_id
  getAnyGroupDetail(args) {
    const url = `/customer/promotion/groupon/groupon-show`
    return request.get({ url, ...args })
  },
  // ----检查是否可以开团---- goods_id、 promotion_id
  checkGroupOpen(args) {
    const url = `/customer/promotion/groupon/check-can-open`
    return request.get({ url, ...args })
  },
  // ----检查是否可以开团---- goods_id、 promotion_id、 team_id
  checkGroupJoin(args) {
    const url = `/customer/promotion/groupon/check-can-join`
    return request.get({ url, ...args })
  },
  // ----分享砍价---- goods_id、 promotion_id
  setBargainShare(args) {
    const url = `/customer/promotion/bargain/add-share-count`
    return request.get({ url, ...args })
  },
  // ----分享拼团---- goods_id、 promotion_id
  setGroupShare(args) {
    const url = `/customer/promotion/groupon/add-share-count`
    return request.get({ url, ...args })
  },
  /**
   * 我的砍价
   * @param args
   * @returns {*}
   */
  myBargainList(args) {
    const url = `/customer/promotion/bargain/my-bargain-list`
    return request.get({ url, ...args })
  },
  /**
   * 活动下单, 砍价，拼团
   * @param args
   * @returns {*}
   */
  createActivity(args) {
    const url = `/customer/service-order/order/create`
    return request.post({ url, ...args })
  },
  /**
   * 砍价帮列表
   * @param args
   * @returns {*}
   */
  bargainTeamList(args) {
    const url = `/customer/promotion/team-bargain/bargain-team-list`
    return request.get({ url, ...args })
  },
  /**
   * 排行榜列表
   * @param args
   * @returns {*}
   */
  bargainRankingList(args) {
    const url = `/customer/promotion/team-bargain/bargain-ranking-list`
    return request.get({ url, ...args })
  },
  /**
   *  团队砍价详情
   * @param args
   * @returns {*}
   */
  BargainDetail(args) {
    const url = `/customer/promotion/team-bargain/show`
    return request.get({ url, ...args })
  },
  /**
   *  神秘人砍
   * @param args
   * @returns {*}
   */
  menCut(args) {
    const url = `/customer/promotion/team-bargain/mystery-men-cut`
    return request.get({ url, ...args })
  }

}
