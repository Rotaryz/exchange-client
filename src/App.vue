<script>
  import AppPromise from '@utils/app-promise'
  import API from '@api'
  import HTTP from '@utils/http'
  import { entryAppType, resolveQueryScene } from '@utils/common'
  import { globalMethods } from '@state/helpers'

  export default {
    data() {
      return {}
    },
    created() {
      // 调用API从本地缓存中获取数据
      /*
       * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
       * 微信：mpvue === wx, mpvuePlatform === 'wx'
       * 头条：mpvue === tt, mpvuePlatform === 'tt'
       * 百度：mpvue === swan, mpvuePlatform === 'swan'
       * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
       */
    },
    async onLaunch() {
      this.initPageConfig()
    },
    onShow(options) {
      this.setScene(options)
      let shopId = this.$storage('shopId') || ''
      if (options.query.scene) {
        // 小程序扫码进来
        let query = resolveQueryScene(options.query.scene)
        shopId = query.shopId
      } else {
        // 普通参数进来
        shopId = options.query.shopId || shopId
      }
      this.$storage('shopId', +shopId)
      HTTP.setHeaders({ 'Current-Shop': shopId })
      AppPromise.getInstance(async resolve => {
        console.warn('页面全局处理shopId(当有分享的页面需要使用AppPromise.getInstance().then,设置好id之后再进行页面的操作，可参考home.vue)')
        if (!shopId) {
          API.Login.getDefaultShop({ data: {}, loading: false, toast: false })
            .then(async (res) => {
              this.$storage('shopId', res.data.shop_id)
              HTTP.setHeaders({ 'Current-Shop': res.data.shop_id })
              await this.silenceLogin()
              resolve(true)
            })
          return
        }
        await this.silenceLogin()
        resolve(true)
      })
    },
    methods: {
      ...globalMethods,
      initPageConfig() {
        const res = wx.getSystemInfoSync()
        const $vw = res.screenWidth / 375
        const $systemInfo = res
        const statusBarHeight = res.statusBarHeight || 20
        this['SET_NAVIGATION_CONFIG']({ statusBarHeight })
        this['SET_VW']($vw)
        this['SET_SYSTEM_INFO']($systemInfo)
      },
      // 静默
      async silenceLogin() {
        // 初始化获取静默授权
        this.codeMsg = await this.$wechat.login()
        if (!this.$storage('token')) {
          let res = await API.Login.getToken({
            data: { code: this.codeMsg.code },
            loading: false,
            toast: false,
            doctor() {
            }
          })
          if (res.error_code !== this.$ERR_OK) return
          this.$storage('token', res.data.access_token)
          this.$storage('userInfo', res.data.customer_info)
          HTTP.setHeaders({ Authorization: res.data.access_token })
        }
      },
      // 设置场景值
      setScene(options) {
        const type = entryAppType(options)
        wx.setStorageSync('entryAppType', type)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  page
    background: $color-background
</style>

