import API from '@api'
import * as wechat from '@utils/wechat'
import { globalComputed } from '@state/helpers'
import appJson from '../app.json'
import DefaultMsg from './default-msg'
import { isEmptyObject } from '@utils/common'

export default {
  computed: {
    ...globalComputed
  },
  onLoad(options) {
    this._saveCurrentPage()
    if (!isEmptyObject(options)) {
      this._options = options || {}
    }
  },
  methods: {
    // 初始化页面参数
    _$$initOptions() {
      let options = {}
      if (!isEmptyObject(this._options)) {
        options = this._options
      } else if (!isEmptyObject(this.$mp.query)) {
        options = this.$mp.query
      } else if (!isEmptyObject(this.$mp.appOptions.query)) {
        options = this.$mp.appOptions.query
      }
      return options
    },
    // 行为记录采集
    $sendMsg(obj) {
      let data = DefaultMsg.create().set(obj)
      API.Ai.actionDataCollect({ data, loading: false, toast: false })
        .then(res => {
          console.warn('发送事件。。。', data)
        })
        .catch(e => {
          console.error(e)
        })
    },
    // 获取缓存
    $storage(key, val) {
      if (val) wx.setStorageSync(key, val)
      else return wx.getStorageSync(key)
    },
    // button收集手机formId
    async $getFormId(e) {
      const token = this.$storage('token')
      if (!token) {
        return
      }
      let formId = e.mp.detail.formId
      API.Form.getFormId({ data: { form_ids: [formId] }, loading: false, toast: false })
    },
    // 记录页面路径
    _saveCurrentPage() {
      if (!this.$mp) return
      let url = this.$getUrl()
      // 记录页面栈
      if (!url || url.includes('lost') || url.includes('network-error') || url.includes('login')) {
        return
      }
      this.$storage('errorUrl', url)
    },
    $checkIsTabPage(path) {
      // const TAB_REG = /(pages\/home)|(pages\/shopping-cart)|(pages\/mine)/
      // return TAB_REG.test(path)
      return appJson.tabBar.list.some(val => path.includes(val.pagePath))
    },
    // 获取当前页面的完整路径
    $getUrl(path = '', query = '') {
      let url = path || (this.$root.$mp.page && this.$root.$mp.page.route)
      let status = this.$checkIsTabPage(url)
      query = query || this.$root.$mp.query
      if (!status) {
        let string = ''
        for (let value in query) {
          string += `&${value}=${query[value]}`
        }
        url = string ? `${url}?${string.slice(1)}` : url
      }
      return url
    },
    // 判断是否需要跳转登录页面
    async $checkToken() {
      let that = this
      let url = this.$getUrl()
      /* eslint-disable no-undef */
      let token = this.$storage('token')
      if (!token) {
        let codeMsg = await wechat.login()
        let tokenJson = await API.Login.getToken({
          data: { code: codeMsg.code },
          loading: false,
          toast: false,
          doctor() {
            wx.reLaunch({ url: that.$routes.other.LOGIN })
            this.$storage('targetPage', url)
            return false
          }
        })
        if (!tokenJson.data.customer_info.is_register) {
          wx.reLaunch({ url: this.$routes.other.LOGIN })
          return false
        }
        wx.setStorageSync('token', tokenJson.data.access_token)
        wx.setStorageSync('userInfo', tokenJson.data.customer_info)
        HTTP.setHeaders({ Authorization: tokenJson.data.access_token })
        /* eslint-disable no-undef */
        let page = getCurrentPages()[getCurrentPages().length - 1]
        page.onLoad(page.options)
        page.onShow()
        return true
      }
      let userInfo = this.$storage('userInfo')
      if (!userInfo.is_register) {
        wx.reLaunch({ url: this.$routes.other.LOGIN })
        return false
      }
      return true
    }
  }
}
