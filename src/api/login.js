import request from '@utils/http'

export default {
  /**
   * 登录
   * @param data
   * @param loading
   * @returns {*}
   */
  getToken(args) {
    const url = `/customer/customer/auth/post-login`
    return request.post({ url, ...args })
  },
  /**
   * 解析手机号码
   * @param data
   * @param loading
   * @returns {*}
   */
  getWechatMobile(args) {
    const url = `/customer/customer/customer/get-mobile`
    return request.post({ url, ...args })
  },
  /**
   * 解析手机号码
   * @param data
   * @param loading
   * @returns {*}
   */
  setMobile(args) {
    const url = `/customer/customer/customer/set-mobile`
    return request.get({ url, ...args })
  },
  /**
   * 获取默认店铺ID
   * @param data
   * @param loading
   * @returns {*}
   */
  getDefaultShop(args) {
    const url = `/common/system/system/get-default-shop-id`
    return request.get({ url, ...args })
  }
}
