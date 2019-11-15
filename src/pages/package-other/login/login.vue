<template>
  <div class="login">
    <navigation-bar title="登录" :isOpacity="true" :translucent="true" :showArrow="false"></navigation-bar>
    <img src="./bg-login@2x.png" class="bg">
    <div class="login-img-box">
      <img class="login-img" src="./pic-logo@2x.png">
      <img class="login-name" src="./pic-zbyp@2x.png">
      <form class="lost" action="" report-submit @submit="getFormId">
        <button hover-class="none" class="login-btn" lang="zh_CN" @getuserinfo="_login" open-type="getUserInfo" formType="submit">
          <img src="./icon-wechat@2x.png" class="wx-logo">
          <span class="title">微信授权登录</span>
        </button>
      </form>
    </div>
    <div class="popup " :class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'">
      <div class="popup-content">
        <div class="popup-title">绑定手机</div>
        <div class="popup-tip">使用微信绑定手机号</div>
        <form class="lost" action="" report-submit @submit="getFormId">
          <button hover-class="none" class="popup-btn" @getphonenumber="getPhone" open-type="getPhoneNumber" formType="submit">确定</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import app from '@src/app.json'
  import HTTP from '@utils/http'
  import * as wechat from '@utils/wechat'

  let loginTime = 3
  // const ald = getApp()
  const PAGE_NAME = 'LOGIN'
  const TAB_BAR = app.tabBar.list
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        codeMsg: null,
        formId: 0,
        loginMsg: {},
        showPopup: false,
        mobile: ''
      }
    },
    async onLoad() {
      this.$getUrl(this.$root.$mp.appOptions.path, this.$root.$mp.appOptions.query)
      this.codeMsg = await wechat.login()
    },
    methods: {
      // 解析手机号码
      async getPhone(e) {
        this.codeMsg = await wechat.login()
        if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') return
        this.showPopup = false
        let data = {
          code: this.codeMsg.code,
          iv: e.mp.detail.iv,
          encrypted_data: e.mp.detail.encryptedData
        }
        API.Login.getWechatMobile({ data, loading: false, toast: false })
          .then(res => {
            this.mobile = res.data.mobile
            this.setMobile()
          })
          .catch(() => {
            wx.showToast('获取手机号码失败，请重试')
          })
      },
      // 绑定手机号码
      setMobile() {
        API.Login.setMobile({ data: { mobile: this.mobile }, loading: true, toast: true })
          .then((res) => {
            // 绑定手机号码
            let userInfo = this.$storage('userInfo')
            userInfo.is_register = 1
            userInfo.mobile = this.mobile
            this.$storage('userInfo', userInfo)
            this.showPopup = false
            this._goNextPage()
          })
          .catch(() => {
            // this.setMobile()
          })
      },
      _goNextPage() {
        let targetPage = wx.getStorageSync('errorUrl')
        console.log(targetPage, 1111)
        if (targetPage) {
          let isTab = TAB_BAR.findIndex((item) => targetPage.includes(item.pagePath))
          // tab页面记录参数
          isTab !== -1 ? wx.switchTab({ url: '/' + targetPage }) : wx.redirectTo({ url: '/' + targetPage })
          // wx.setStorageSync('targetPage', '')
          return
        }
        wx.switchTab({ url: '/' + TAB_BAR[0].pagePath })
      },
      async _login(e) {
        if (loginTime <= 0) {
          return
        }
        if (typeof e === 'object' && e.mp.detail.errMsg !== 'getUserInfo:ok') return
        if (typeof e !== 'number') {
          this.loginMsg = { code: this.codeMsg.code, iv: e.target.iv, encrypted_data: e.target.encryptedData }
        } else {
          this.loginMsg.code = this.codeMsg.code
        }
        let data = this.loginMsg
        let res = await API.Login.getToken({
          data,
          loading: typeof e !== 'number',
          toast: false,
          doctor: async () => {
            loginTime--
            this.codeMsg = await wechat.login()
            await this._login(1)
          }
        })
        wechat.hideLoading()
        if (res.error_code !== this.$ERR_OK) {
          wechat.showToast('登录失败，请重新登录')
        }
        this.$storage('token', res.data.access_token)
        this.$storage('userInfo', res.data.customer_info)
        HTTP.setHeaders({ Authorization: res.data.access_token })
        let form = { form_ids: [this.formId] }
        API.Form.getFormId({ data: form, loading: false, toast: false })
        this.showPopup = !res.data.customer_info.is_register
        if (!res.data.customer_info.is_register) return
        this._goNextPage()
      },
      getFormId(e) {
        this.formId = e.mp.detail.formId
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/reset.styl"
  .bg
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  .login
    height: 100vh
    background: $color-white
    width: 100%

  .login-img-box
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding-top: 18.2vh
    .login-img
      position: relative
      z-index: 10
      height: 88px
      width: @height
    .login-name
      position: relative
      z-index: 10
      width: 102.1px
      margin-top: 20.5px
      height: 20.85px
    .login-btn
      display: flex
      padding: 0
      margin: 24.4vh 0
      justify-content: center
      align-items: center
      width: 74.667vw
      height: 12vw
      border-radius: 22.5px
      transition: all 0.3s
      background: $color-main
      .wx-logo
        width: 20px
        height: 20px
        margin-right: 8px
      .title
        font-size: $font-size-16
        color: $color-white
        font-family: $font-family-regular
      &:after
        border: none

  .popup
    padding-top: 33.4vh
    box-sizing: border-box
    background: rgba(39, 39, 62, .7)
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    .popup-content
      display: flex
      flex-direction: column
      align-items: center
      border-1px(rgba(32, 32, 46, 0.10), 6px)
      border-radius: 6px
      margin: 0 auto
      width: 80vw
      background: $color-white
      .popup-title
        font-family: $font-family-medium
        color: $color-text-main
        font-size: $font-size-16
        padding: 25px 0
      .popup-tip
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-16
        padding: 10px 0
      .popup-btn
        border-radius: 20px
        line-height: 32px
        text-align: center
        width: 110px
        background: $color-main
        color: $color-white
        font-family: $font-family-regular
        font-size: $font-size-14
        margin: 34px 0 25px

  .hide-popup
    opacity: 0
    z-index: -1
    transition: all 0.2s

  .fade-modal-enter-active
    opacity: 1
    z-index: 1000
    transition: all 0.5s
</style>
