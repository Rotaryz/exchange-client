<template>
  <div class="prize-record">
    <navigation-bar title="奖品记录"></navigation-bar>
    <div class="scroll-box" :style="{top: statusBarHeight + 'px'}">
      <scroll-view
        class="scroll-view2"
        v-if="navList.length"
        id="scrollView"
        :scroll-into-view="viewToItem"
        scroll-x
        scroll-with-animation="true"
      >
        <div v-for="(item, index) in navList" :class="tabIndex === index ? 'item-active'  : ''" :key="index"
             class="item scroll-item" :id="'item'+index" @click="_changeTab(index, item.status, $event)">
          <p class="text">{{item.name}}</p>
        </div>
        <div :style="{left: move + 'px'}" class="line-box">
          <div class="line"></div>
        </div>
      </scroll-view>
    </div>
    <div class="nav-block" :style=""></div>
    <div class="big-box">
      <div class="classify-big-box"
           :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  width +'vw'}"
      >
        <div
          v-for="(tabItem, tabInx) in orderList" :key="tabInx"
          :style="{height: tabIndex * 1 === tabInx ? -1 : scrollHeight + 'px'}"
          class="goods-list-box"
        >
          <div v-for="(item, index) in tabItem.arr" :key="index" class="order-item">
            <!--头部-->
            <div class="order-top">
              <div class="order-top-left">
                <img mode="aspectFill" src="/static/images/icon-house-order@2x.png" class="order-icon">
                <div class="shop-name">{{item.shop_name}}</div>
                <!--<img src="/static/images/arrow@2x.png" class="way">-->
              </div>
              <div class="order-top-right" :class="{'order-top-use': status === '1'}">{{status === '0' ? '未使用' : status === '1' ? '已使用' : '已失效'}}</div>
            </div>
            <!--商品-->
            <div class="goods-content">
              <img :src="item.goods_cover_image" class="goods-img">
              <div class="goods-msg">
                <div class="goods-name">{{item.name}}</div>
                <div class="goods-money">
                  <div class="goods-unit">¥</div>
                  {{item.price}}
                </div>
              </div>
            </div>
            <!--底部-->
            <div class="order-footer">
              <div class="order-type"></div>
              <form action="" class="btn-box">
                <button class="btn" v-if="status === '0'" @click="showCode(item)">查看服务码</button>
                <!--<button class="btn">查看订单</button>-->
                <!--<button class="btn">去使用</button>-->
                <!--<button class="btn">退款详情</button>-->
              </form>
            </div>
          </div>
          <empty v-if="tabItem.isEmpty" :image="empty" :paddingTop="45.4" tip="你的奖品是空的"></empty>
        </div>
      </div>
    </div>
    <service-popup :showPopup.sync="showPopup" :couponMsg="couponMsg"></service-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ServicePopup from '@components/service-popup/service-popup'
  import Order from './order'
  import createQrCode from '@utils/create-qr-code'
  import Empty from '@components/empty/empty'

  const EMPTY = require('../../../../static/images/pic-order@2x.png')

  const PAGE_NAME = 'PRIZE_RECORD'
  const NAV_LIST = [
    { name: '未使用', status: '0' },
    { name: '已使用', status: '1' }
  ]
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ServicePopup,
      Empty
    },
    data() {
      return {
        empty: EMPTY,
        showPopup: false,
        navList: NAV_LIST,
        viewToItem: 'item0',
        boxTransition: 'all .3s',
        move: 0,
        tabIndex: 0,
        status: '0',
        statusBarHeight: 64,
        width: NAV_LIST.length * 100,
        page: 1,
        winHeight: 667,
        winWidth: 375,
        orderList: new Order(NAV_LIST.length),
        couponMsg: {}
      }
    },
    computed: {
      scrollHeight() {
        let height = this.winHeight - this.statusBarHeight - 55
        return height
      }
    },
    onLoad(option) {
      let options = option || this._$$initOptions()
      this.status = options.status || this.status
      let index = this.navList.findIndex((item) => item.status === this.status)
      this._changeTab(index)
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight ? res.statusBarHeight + 44 : 64
      this.winHeight = res.screenHeight
      this.winWidth = res.screenWidth
      this._getPrizeList(true)
    },
    // 翻页
    onReachBottom() {
      if (this.orderList[this.tabIndex].page >= this.orderList[this.tabIndex].lastPage) {
        return
      }
      this.orderList[this.tabIndex].page++
      this._getPrizeList()
    },
    methods: {
      showCode(item) {
        let str = JSON.stringify({ 'code': item.coupon.code }) // todo
        let img = createQrCode.png(str) // png
        img = createQrCode.svg(str) // svg
        this.couponMsg = {
          goods_image: item.goods_cover_image,
          name: item.name,
          time: item.coupon.use_end_at,
          qrcode_url: img,
          code: item.coupon.code
        }
        this.showPopup = true
      },
      // 切换tab
      _changeTab(index, status, e) {
        if (index === -1) return
        if (this.tabIndex === index) return
        this.move = this.winWidth * 0.5 * index
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        this.boxTransition = ''
        this.status = status
        this.orderList[this.tabIndex].arr = this.orderList[this.tabIndex].arr.slice(0, 10)
        this._setViewToItem(index)
        this.orderList[this.tabIndex].page = 1
        this._getPrizeList()
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      },
      // 滚动
      _setViewToItem(index = 0) {
        this.tabIndex = index
        let number = index < 3 ? 0 : index - 2
        this.viewToItem = `item${number}`
      },
      _getPrizeList(loading = false) {
        API.Prize.PrizeList({ data: { status: this.status }, loading })
          .then((res) => {
            this.orderList[this.tabIndex].lastPage = res.meta.last_page
            let arr = res.data
            if (this.orderList[this.tabIndex].page === 1) {
              this.orderList[this.tabIndex].arr = arr
              this.orderList[this.tabIndex].isEmpty = !arr.length
            } else {
              this.orderList[this.tabIndex].arr = this.orderList[this.tabIndex].arr.concat(arr)
            }
            this.orderList = JSON.parse(JSON.stringify(this.orderList))
          })
          .catch(e => {
            this.orderList[this.tabIndex].arr = []
            this.orderList = JSON.parse(JSON.stringify(this.orderList))
            this.orderList[this.tabIndex].isEmpty = true
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .nav-block
    height: 40px

  .scroll-box
    top: 64px
    position: fixed
    background: $color-white
    height: 40px
    z-index: 1
    .scroll-view2
      position: relative
      z-index: 99
      display: block
      white-space: nowrap
      box-sizing: border-box
      transition: transform 0.3s
      transform: translate3d(0, 0, 0)
      height: 100%
      width: 100vw
      ::-webkit-scrollbar
        width: 0
        height: 0
        color: transparent
      .item
        white-space: nowrap
        text-align: center
        display: inline-block
        position: relative
        height: 100%
        transform-origin: 50%
        transition: all 0.2s
        width: 50%
        .text
          line-height: 1
          padding: 10.5px 0 13.5px
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
      .item-active
        color: $color-text-main
        position: relative
        transition: font-size 0.2s
        transform-origin: 50%
        .text
          font-size: $font-size-16
          font-family: $font-family-medium
    .line-box
      position: absolute
      width: 50vw
      height: 3px
      top: 37px
      left: 0
      display: flex
      justify-content: center
      transition: all 0.2s
      .line
        background: $color-main
        width: 28px
        border-radius: 3px
        height: 3px

  .big-box
    margin-top: 10px
    width: 100vw
    overflow: hidden
    .classify-big-box
      width: 500vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
    .goods-list-box
      display: block
      width: 100vw

  .order-item
    margin-bottom: 10px
    background: $color-white
    .order-top
      border-bottom-1px($color-line)
      display: flex
      align-items: center
      justify-content: space-between
      height: 40px
      box-sizing: border-box
      margin: 0 15px
      .order-top-left
        display: flex
        align-items: center
        flex: 1
        width: 0
        .order-icon
          width: 18px
          height: @width
        .shop-name
          line-height: 1
          letter-spacing: 0.6px
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-16
          margin-left: 3px
          word-break: break-all
          max-width: 65%
          no-wrap()
        .way
          margin-left: 4.5px
          width: 13px
          height: @width
      .order-top-right
        letter-spacing: 0.3px
        font-family: $font-family-regular
        color: $color-main
        font-size: $font-size-14
      .order-top-use
        color: $color-text-assist
    .goods-content
      margin: 0 15px
      padding: 15px 0
      display: flex
      .goods-img
        margin-right: 10px
        width: 75px
        min-width: @width
        min-height: @width
        height: @width
      .goods-msg
        flex: 1
        width: 0
        .goods-name
          transform: translateY(-3px)
          line-height: 20px
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
          letter-spacing: 0.3px
          no-wrap-plus()
          height: 40px
        .goods-money
          margin-top: 15px
          font-family: $font-family-din-bold
          color: $color-money
          font-size: $font-size-17
          display: flex
          align-items: flex-end
          line-height: 1
          .goods-unit
            color: $color-money
            transform: translateY(-1.5px)
            font-size: $font-size-11
    .order-footer
      border-top-1px($color-line)
      margin: 0 15px
      height: 45px
      display: flex
      justify-content: space-between
      align-items: center
      .order-type
        letter-spacing: 0.3px
        line-height: 1
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
      .btn-box
        .btn
          width: 82px
          height: 27px
          text-align: center
          line-height: 27px
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-main
          border-1px($color-main, 14.5px)
</style>
