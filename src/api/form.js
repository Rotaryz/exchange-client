import request from '@utils/http'

export default {
  /**
   * 收集formId
   * @param data
   * @param loading
   * @returns {*}
   */
  getFormId(args) {
    const url = `/customer/customer/customer/collect-formid`
    return request.post({ url, ...args })
  }
}
