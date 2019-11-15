<template>
  <div class="home">
    <navigation-bar title="兑换商城" :showArrow="false" titleColor="#000" :isOpacity="true" :translucent="true"></navigation-bar>
    <div v-for="(cms, cmsIdx) in cmsList" :key="cmsIdx" class="cms-content">
      <!--轮播图-->
      <div v-if="cms.code === 'banner'" class="banner-box">
        <swiper
          class="banner"
          autoplay
          interval="5000"
          display-multiple-items="1"
          previous-margin="0px"
          next-margin="0px"
          circular
          :current="bannerIndex"
          @change="handleSetBannerIndex">
          <block
            v-for="(item,index) in cms.children"
            :key="index"
          >
            <swiper-item
              class="banner-item"
            >
              <img
                v-if="item.detail"
                class="item-img"
                lazy-load
                mode="aspectFill"
                :src="item.detail.image_url"
              >
            </swiper-item>
          </block>
        </swiper>
        <div class="dot-wrapper">
          <div v-for="(item,index) in cms.children" :key="index" class="dot-item" :class="{'dot-item-active' : bannerIndex === index}"></div>
        </div>
      </div>
      <!--导航专区-->
      <div v-if="cms.code === 'navigation'" class="nav">
        <div v-for="(item, index) in cms.children" :key="index" class="nav-item" @click="jumpNav(item)">
          <img :src="item.detail.image_url" alt="" class="nav-icon">
          <p class="nav-name">{{item.detail.title}}</p>
        </div>
      </div>
      <!--大转盘-->
      <block v-if="cms.code === 'wheel'">
        <img v-if="cms.children[0]" :src="cms.children[0].detail.image_url" alt="" class="big-wheel" mode="widthFix" @click="jumpNav(cms.children[0])">
      </block>
      <!--兑换专区-->
      <div v-if="cms.code === 'exchange_area' && cms.goods_num" class="exchange-block">
        <div v-for="(ex, exIdx) in cms.children" :key="exIdx">
          <img v-if="ex.code === 'banner'" v-for="(item, index) in ex.children" :key="index" :src="item.detail.image_url" mode="aspectFill" class="exchange-banner">
          <div v-if="ex.code === 'exchange_list'" class="ex-content">
            <div class="exchange-goods">
              <div v-for="(item, index) in ex.children" v-if="index < 4" :key="index" class="ex-goods-item" @click="goExchangeDetail(item.detail)">
                <img :src="item.detail.goods_cover_image" mode="aspectFill" class="ex-goods-img">
                <p class="ex-goods-name">{{item.detail.name}}</p>
                <div class="ex-goods-dou">
                  <img src="./pic-dhqprice@2x.png" mode="aspectFill" class="ex-dou-icon">
                  <p class="price">{{item.detail.integral_price}}</p>
                </div>
              </div>
            </div>
            <div class="more" v-if="ex.children.length > 4" @click="goExchange">
              <p class="more-text">查看更多</p>
              <img class="way" src="./way@2x.png">
            </div>
          </div>
        </div>

      </div>
      <!--播豆专区-->
      <div v-if="cms.code === 'bean_area' && cms.goods_num" class="exchange-block">
        <div v-for="(ex, exIdx) in cms.children" :key="exIdx">
          <img v-if="ex.code === 'banner'" v-for="(item, index) in ex.children" :key="index" :src="item.detail.image_url" mode="aspectFill" class="exchange-banner">
          <div v-if="ex.code === 'bean_list'" class="ex-content">
            <div class="exchange-goods">
              <div v-for="(item, index) in ex.children" v-if="index < 4" :key="index" class="ex-goods-item" @click="goGoodsDetail(item.detail)">
                <img :src="item.detail.goods_cover_image" mode="aspectFill" class="ex-goods-img">
                <p class="ex-goods-name">{{item.detail.name}}</p>
                <div class="goods-price">
                  <div class="price-unit">¥</div>
                  <div class="goods-money">{{item.detail.cash_price}}</div>
                  <div class="add">+</div>
                  <div class="goods-money">{{item.detail.bean_price}}</div>
                  <img src="./pic-bd@2x.png" class="goods-dou-unit">
                </div>
                <div class="price-sale">原价：¥<span class="price-num">{{item.detail.price}}</span></div>
              </div>
            </div>
            <div class="more" v-if="ex.children.length > 4" @click="goGoodsList">
              <p class="more-text">查看更多</p>
              <img class="way" src="./way@2x.png">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="last-block"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import AppPromise from '@utils/app-promise'
  import { cartMethods, cartComputed } from '@state/helpers'

  let num = 0
  const PAGE_NAME = 'HOME'
  // const NAV = [{ name: '兑换专区', image: require('./icon-dhzq_sy@2x.png') }, { name: '播豆专区', image: require('./icon-bdzq_sy@2x.png') }, { name: '兑换券介绍', image: require('./icon-dhqjs@2x.png') }, { name: '公司主页', image: require('./icon-gszy@2x.png') }]
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        bannerIndex: 0,
        // nav: NAV,
        cmsList: [],
        shopId: '',
        shopInfo: {}
      }
    },
    computed: {
      ...cartComputed
    },
    // todo 测试使用
    // onShareAppMessage() {
    //   let shopId = this.$storage('shopId')
    //   return {
    //     title: '测试使用 分享店铺 -- 需要删除',
    //     path: `${this.$routes.main.HOME}?shopId=${shopId}`
    //   }
    // },
    onLoad() {
    },
    onShow() {
      AppPromise.getInstance().then(res => {
        if (this.shopId !== this.$storage('shopId')) {
          this.actionDataCollect()
          this.shopId = this.$storage('shopId')
        }
        let loading = num === 0
        num++
        this.getHomeDetail(loading)
        let token = this.$storage('token')
        if (!token) return
        this._getCartCount()
        this._getShopInfo()
      })
    },
    // 下拉刷新
    onPullDownRefresh() {
      this.getHomeDetail(true)
      wx.stopPullDownRefresh()
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('shopId')
      const path = `${this.$routes.main.HOME}?shopId=${shopId}`
      const title = `5G新店铺${this.shopInfo.name || ''}`
      return {
        title,
        path
      }
    },
    methods: {
      ...cartMethods,
      _getShopInfo() {
        API.Shop.getShopInfo().then(res => {
          this.shopInfo = res.data
        })
      },
      // 行为记录收集
      actionDataCollect() {
        this.$sendMsg({
          event_no: 1001
        })
      },
      goExchangeDetail(item) {
        wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL_EXCHANGE}?id=${item.id}` })
      },
      goGoodsDetail(item) {
        wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?id=${item.id}` })
      },
      jumpNav(item) {
        const url = item.detail.url
        if (this.$checkIsTabPage(url)) {
          getApp().globalData.tabParams = this.getParams(url)
          wx.switchTab({url: url.split('?')[0]})
        } else {
          wx.navigateTo({ url })
        }
      },
      getParams(url = '') {
        const params = url.split('?')[1] || ''
        const paramsList = params.split('&')
        const json = {}
        paramsList.forEach(item => {
          const tmp = item.split('=')
          json[tmp[0]] = tmp[1]
        })
        return json
      },
      goExchange() {
        wx.navigateTo({ url: this.$routes.main.GOODS_EXCHANGE })
        //  跳转兑换列表
      },
      goGoodsList() {
        wx.navigateTo({ url: this.$routes.main.GOODS_CLASSIFY })
        //  跳转商品分类列表
      },
      getHomeDetail(loading = false) {
        API.Home.homeDetail({ data: { code: 'customer_index' }, loading, toast: true })
          .then((res) => {
            this.cmsList = res.data.children
            // 提取专区的商品数量
            this.cmsList = this.cmsList.map((item) => {
              item.goods_num = 0
              if (item.code === 'exchange_area' || item.code === 'bean_area') {
                item.children.forEach((child) => {
                  if (child.code === 'exchange_list' || child.code === 'bean_list') {
                    item.goods_num = child.children.length
                  }
                })
              }
              return item
            })
          })
          .catch(() => {
          })
      },
      handleSetBannerIndex(e) {
        this.bannerIndex = e.target.current
      },
      handleBannerJump(item) {
        wx.navigateTo({ url: item.url })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .home
    min-height :100vh
    background :$color-background

  .big-wheel
    display :block
    margin :0 auto
    padding : 0 10px
    width :auto
    margin-bottom :10px

  .last-block
    height: 15px

  .banner-box
    position: relative

    .banner
      height: 59.73vw
      background: $color-white

      .item-img
        width: 100%
        height: 100%

    .dot-wrapper
      row-center()
      bottom: 9.5px
      display: flex

      .dot-item
        margin: 0 2px
        width: 11px
        height: 4px
        border-radius: 4px
        background: rgba(255, 255, 255, .5)
        transition: all 0.2s
        transform-origin: 50%

      .dot-item-active
        background: $color-white

  .nav
    padding: 0 10px
    box-sizing: border-box
    display: flex
    justify-content: space-between
    background: $color-background

    .nav-item
      padding: 13.5px 0 15px
      text-align: center

      .nav-icon
        display: block
        width: 13.867vw
        margin: 0 auto 3px
        height: @width

      .nav-name
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-12

  .exchange-block
    margin-bottom: 15px

    .exchange-banner
      width: 100vw
      display: block
      height: 29.33vw

    .ex-content
      border-1px(#F5F6FA, 6px)
      border-radius: 6px
      overflow: hidden
      box-shadow: 0 6px 30px 0 rgba(227, 230, 241, 0.36)
      background: $color-white
      margin: -27px 10px 0
      padding: 2.7vw 2.7vw 0

    .exchange-goods
      display: flex
      flex-wrap: wrap
      justify-content: space-between

      .ex-goods-item
        width: 42vw
        margin-bottom: 20px

        .ex-goods-img
          border-radius: 1px
          height: 42vw
          background: $image-color
          display: block
          width: 100%

        .ex-goods-name
          font-size: $font-size-14
          font-family: $font-family-medium
          color: $color-text-main
          margin-top: 7.2px
          line-height: 1.2
          no-wrap()

        .ex-goods-dou
          display: flex
          margin-top: 7.2px

          .ex-dou-icon
            position: relative
            z-index: 2
            height: 19px
            width: 44.5px

          .price
            border-radius: 0 2px 2px 0
            margin-left: -3px
            padding: 0 8px
            color: $color-text-main
            background: #C4F1F0
            font-family: $font-family-din-bold
            font-size: $font-size-15
            line-height: 19px

  .more
    border-top-1px($color-line)
    display: flex
    justify-content: center
    align-items: center
    height: 45px

    .more-text
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-sub
      line-height: 1
      letter-spacing: 0.6px

    .way
      width: 13px
      height: 13px

  .goods-price
    margin-top: 9px
    display: flex
    align-items: flex-end
    line-height: 1

    .price-unit
      color: $color-money
      margin-right: 1px
      font-size: $font-size-12
      font-family: $font-family-din-bold

    .goods-money
      transform: translateY(1px)
      font-family: $font-family-din-bold
      color: $color-money
      font-size: $font-size-17

    .add
      font-family: $font-family-din-bold
      line-height: 1
      color: $color-money
      margin: 0 2px
      font-size: $font-size-16

    .goods-dou-unit
      font-family: $font-family-din-bold
      color: $color-money
      height: 14px
      width: 14.5px

  .price-sale
    margin-top: 7px
    line-height: 1
    font-size $font-size-11
    color: $color-text-sub
    text-decoration-line line-through


</style>
