<template>
  <div class="mine">
    <navigation-bar :showArrow="false" :translucent="true" title="我的"></navigation-bar>
    <div :style="{height: placeHeight+'px'}"></div>
    <section class="top-background" :style="{height: backgroundHeight+'px'}">
      <img class="top-background-img" mode="aspectFill" src="./bg-my.png">
    </section>
    <div class="mine-info">
      <div class="info-main-box">
        <div class="info-main-top">
          <img class="user-img" mode="aspectFill" :src="!isLogin ? userInfo.avatar : defaultImg">
          <div v-if="!isLogin" class="user-name">{{userInfo.nickname}}</div>
          <div v-else class="login-in" @click="login">登录/注册<img src="./icon-pressed@2x.png" class="way"></div>
        </div>
        <div class="info-main-bottom">
          <div class="info-list">
            <div class="info-number">{{integral}}</div>
            <div class="info-text">兑换券</div>
          </div>
          <div class="info-list">
            <div class="info-number">{{bean}}</div>
            <div class="info-text">播豆</div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-router">
      <div class="order-title-box">
        <div class="order-title">商城订单</div>
      </div>
      <div class="order-enter">
        <div class="order-enter-item" v-for="(item, index) in orderNav" :key="index" @click="navigateOrder(item)">
          <img mode="aspectFill" :src="item.icon" class="item-icon">
          <div class="item-text">{{item.text}}</div>
        </div>
      </div>
    </div>
    <div class="my-service">
      <div class="order-title-box">
        <div class="order-title">我的服务</div>
      </div>
      <div class="service-nav">
        <div class="ser-nav-item" v-for="(item, index) in serviceNav" :key="index" @click="jumpPage(item)">
          <img mode="aspectFill" :src="item.icon" class="nav-icon">
          <div class="nav-text">{{item.text}}</div>
        </div>
      </div>
    </div>
    <!--<div class="other-router">-->
    <!--<div class="other-list" v-for="(item, index) in otherNav" :key="index" @click="jumpPage(item)">-->
    <!--<div class="other-text">{{item.text}}</div>-->
    <!--<img class="other-icon" mode="aspectFill" src="./icon-pressed@2x.png">-->
    <!--</div>-->
    <!--</div>-->
    <div v-if="!isAd" class="ad">
      <img :src="ad.image_url" mode="aspectFill" class="ad-img" @click="goOutLink">
    </div>
    <div class="block"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import routes from '@utils/routes'
  import API from '@api'
  import { isEmptyObject } from '@utils/common'

  const PAGE_NAME = 'MINE'
  const ORDER_NAV = [
    { url: '', icon: require('./icon-dfk@2x.png'), text: '待付款', status: 0 },
    { url: '', icon: require('./icon-dfh@2x.png'), text: '待发货', status: 10 },
    { url: '', icon: require('./icon-dsh@2x.png'), text: '待收货', status: 20 },
    { url: '', icon: require('./icon-ywc@2x.png'), text: '已完成', status: 100 },
    { url: '', icon: require('./icon-alloeder@2x.png'), text: '全部订单', status: '' }
  ]
  const SERVICE_NAV = [
    { url: routes.personal.SERVICE_ORDER, icon: require('./icon-fworder@2x.png'), text: '服务订单', status: '' },
    { url: routes.personal.EXCHANGE_RECORD, icon: require('./icon-dhjl@2x.png'), text: '兑换记录', status: '' },
    { url: routes.personal.MY_GRANT, icon: require('./icon-zsjl@2x.png'), text: '赠送记录', status: '' },
    { url: routes.personal.PRIZE_RECORD, icon: require('./icon-jpjl@2x.png'), text: '奖品记录', status: '' },
    // { url: routes.personal.MY_BARGAIN, icon: require('./icon-kjhd@2x.png'), text: '砍价活动', status: '' },
    { url: routes.personal.MY_SHARE, icon: require('./icon-fxzq@2x.png'), text: '分享赚钱', status: '' },
    { url: routes.personal.MY_ADDRESS, icon: require('./icon-address@2x.png'), text: '我的地址', status: '' }
  ]

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        statusBarHeight: 0,
        backgroundHeight: 0,
        placeHeight: 0,
        orderNav: ORDER_NAV,
        serviceNav: SERVICE_NAV,
        userInfo: {},
        bean: 0,
        integral: 0,
        ad: {},
        defaultImg: require('./pic-head@2x.png'),
        isLogin: false
      }
    },
    computed: {
      isAd() {
        return isEmptyObject(this.ad)
      }
    },
    onLoad() {
      let res = mpvue.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.placeHeight = 44 + this.statusBarHeight
      this.backgroundHeight = 0.217 * res.screenWidth + this.placeHeight
    },
    onShow() {
      this.isLogin = !this.$storage('token')
      this.userInfo = this.$storage('userInfo')
      if (this.isLogin) return
      this._getUserInfo()
      this.adShow()
      this._getIntegralBeanCount()
    },
    // async onTabItemTap() {
    //   await this.$checkToken()
    // },
    methods: {
      login() {
        this.$storage('errorUrl', 'pages/mine')
        wx.navigateTo({ url: this.$routes.other.LOGIN })
      },
      goOutLink() {
        let url = this.ad.url + '?phone=' + this.userInfo.mobile
        console.log(url, 'url')
        wx.navigateTo({ url: `${this.$routes.main.OUT_HTML}?url=${url}` })
      },
      // 获取广告信息
      adShow() {
        API.Mine.adShow({ data: { client: 2, position: 'my_center' }, loading: false, toast: false })
          .then((res) => {
            this.ad = res.data
          })
          .catch(() => {
            this.ad = {}
          })
      },
      _getUserInfo() {
        API.Mine.getUserInfo({ data: {}, loading: false, toast: false })
          .then((res) => {
            let userInfo = this.$storage('userInfo')
            this.userInfo = Object.assing({}, userInfo, res.data)
            this.$storage('userInfo', this.userInfo)
          })
          .catch(() => {
          })
      },
      _getIntegralBeanCount() {
        API.Mine.getIntegralBeanCount({ data: {}, loading: false, toast: false })
          .then((res) => {
            this.bean = res.data.bean.available >= 10000 ? this.dealPrice(res.data.bean.available, 10000) + 'w' : res.data.bean.available
            this.integral = res.data.integral.available >= 10000 ? this.dealPrice(res.data.integral.available, 10000) + 'w' : res.data.integral.available
          })
      },
      dealPrice(num, multiple) {
        // 格式化数据
        let numFix = (num / multiple).toFixed(3)
        numFix = numFix.slice(0, -1)
        let aa = numFix.match(/\d+\.\d+/g)
        for (let index in aa) {
          numFix = numFix.replace(aa[index], parseFloat(aa[index]))
        }
        return numFix
      },
      navigateOrder(item) {
        let query = `?status=${item.status}`
        wx.navigateTo({ url: `${this.$routes.personal.ORDER_LIST}${query}` })
      },
      jumpPage(item) {
        if (!item.url) return
        wx.navigateTo({ url: item.url })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .mine
    width: 100vw
    min-height: 100vh
    box-sizing: border-box
    background: $color-white
    position: relative
    padding-bottom: 20px
    .top-background
      position: absolute
      left: 0
      right: 0
      top: 0
      .top-background-img
        width: 100%
        height: 100%
        font-size: 0
        line-height: 0
    .mine-info
      position: relative
      padding: 25px 15px 0
      margin-bottom: 10px
      .info-main-box
        background: $color-white
        border-radius: 6px
        box-shadow: 0 3px 15px 0 rgba(227, 230, 241, 0.36)
        padding: 20px 0 25px
      .info-main-top
        padding-left: 15px
        margin-bottom: 25px
        layout(row)
        align-items: center
        .user-img
          display: block
          border-radius: 50%
          width: 55px
          height: @width
          margin-right: 11px
        .user-name
          font-size: $font-size-20
          font-family: $font-family-medium
          color: $color-text-main
          flex: 1
          width: 0
          word-break: break-all
          line-height: 1.4
          no-wrap()
        .login-in
          font-size: $font-size-16
          letter-spacing: 0.8px
          font-family: $font-family-regular
          color: $color-text-main
          .way
            margin-left: 3px
            width: 10px
            height: 10px
      .info-main-bottom
        layout(row)
        .info-list
          flex: 1
          text-align: center
          position: relative
          .info-number
            font-size: $font-size-20
            font-family: $font-family-din-bold
            color: $color-text-main
            margin-bottom: 9px
            line-height: 1
          .info-text
            font-size: $font-size-12
            font-family: $font-family-regular
            color: $color-text-sub
            line-height: 1
          &:nth-of-type(1)
            &:before
              content: ''
              width: 1px
              height: 10px
              position: absolute
              background: $color-line
              transform: scaleX(.5) translateZ(0)
              right: 0
              top: 0
              bottom: 0
              margin: auto 0
    .order-router
      margin: 0 15px 10px
      overflow: hidden
      position: relative
      box-shadow: 0 6px 30px 0 rgba(227, 230, 241, 0.36)
      background: $color-white
      border-radius: 6px
      border-1px($color-background)
      .order-enter
        layout(row)
        align-items: center
        padding: 20px 0 25px
        .order-enter-item
          flex: 1
          .item-icon
            display: block
            width: 25px
            height: @width
            margin: 0 auto 9px
          .item-text
            text-align: center
            font-size: $font-size-11
            font-family: $font-family-regular
            color: $color-text-sub
    .other-router
      margin: 0 15px
      padding: 0 15px
      box-shadow: 0 6px 30px 0 rgba(227, 230, 241, 0.36)
      background: $color-white
      border-radius: 6px
      border-1px($color-background)
      .other-list
        layout(row)
        align-items: center
        justify-content: space-between
        height: 54px
        border-bottom-1px()
        &:last-child
          border-none()
        .other-text
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
        .other-icon
          display: block
          margin-left: 5px
          width: 13px
          height: @width

  .order-title-box
    height: 40px
    padding: 0 15px
    .order-title
      width: 100%
      height: 40px
      line-height: @height
      font-size: $font-size-15
      font-family: $font-family-medium
      color: #1f1f1f
      border-bottom-1px($color-line)

  .ad
    margin: 15px 15px 0
    .ad-img
      border-radius: 6px
      height: 21.33vw
      display: block
      width: 100%

  .my-service
    margin: 0 15px 10px
    padding-bottom: 5.5px
    position: relative
    border-radius: 6px
    box-shadow: 0 6px 30px 0 rgba(227, 230, 241, 0.36)
    .service-nav
      display: flex
      flex-wrap: wrap
      .ser-nav-item
        display: flex
        flex-direction: column
        align-items: center
        width: 25%
        padding: 20px 0 18.5px
      .nav-icon
        width: 23px
        height: @width
      .nav-text
        color: $color-text-main
        font-family: $font-family-regular
        margin-top: 12px
        font-size: $font-size-12
</style>
