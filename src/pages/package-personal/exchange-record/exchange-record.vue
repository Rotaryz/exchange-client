<template>
  <div class="exchange-record">
    <navigation-bar title="兑换记录"></navigation-bar>
    <div class="scroll-box" :style="{top: statusBarHeight + 'px'}">
      <scroll-view
        class="scroll-view2"
        v-if="navList.length"
        id="scrollView"
        :scroll-into-view="viewToItem"
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
          v-for="(tabItem, tabInx) in exchangeList" :key="tabInx"
          :style="{height: tabIndex * 1 === tabInx ? -1 : scrollHeight}"
          class="goods-list-box"
        >
          <div v-for="(item, index) in tabItem.arr" :key="index" class="order-item" @click="goOrderDetail(item.id)">
            <div class="order-header">
              <div class="order-time">{{item.created_at}}</div>
              <div class="order-status">{{item.status_str}}</div>
            </div>
            <div v-for="(good, goodIdx) in item.details" :key="goodIdx" class="order-msg">
              <img :src="good.goods_cover_image" class="goods-img">
              <div class="goods-msg">
                <div class="goods-title">{{good.goods_name}}</div>
                <div class="sku">
                  <div v-for="(sku, skuIdx) in good.goods_spec.specs_attrs" :key="skuIdx" class="sku-item">{{sku.attr_key}}:{{sku.attr_value}}</div>
                </div>
                <div class="goods-detail">
                  <div class="goods-price">
                    <div class="goods-money">{{good.goods_spec.integral_price}}</div>
                    <div class="goods-tag">兑换券</div>
                  </div>
                  <div class="goods-num">x{{good.goods_num}}</div>
                </div>
              </div>
            </div>
            <div v-if="item.verify_status === 0" class="order-button">
              <div class="order-btn confirm" @click.stop="showExchangeCode(item)">查看兑换码</div>
            </div>
          </div>
          <empty v-if="tabItem.isEmpty" :image="empty" :paddingTop="45.4" tip="你的兑换记录是空的"></empty>
        </div>
      </div>
    </div>
    <popup :codeImage="codeImage" :code="code" :showPopup.sync="isShowCode"></popup>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Popup from '@components/popup/popup'
  import createQrCode from '@utils/create-qr-code'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'EXCHANGE_RECORD'
  const EMPTY = require('../../../../static/images/pic-order@2x.png')
  const NAV_LIST = [
    { name: '全部', status: '' },
    { name: '待兑换', status: '10' },
    { name: '已完成', status: '100' }
  ]
  const ARR = { arr: [], classifyMore: false, isEmpty: false, lastPage: 2, page: 1, height: 145 }
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      'popup': Popup,
      Empty
    },
    data() {
      return {
        empty: EMPTY,
        navList: NAV_LIST,
        viewToItem: 'item0',
        boxTransition: 'all .3s',
        move: 0,
        tabIndex: 0,
        statusBarHeight: 64,
        exchangeList: [],
        width: NAV_LIST.length * 100,
        status: '',
        page: 1,
        winHeight: 667,
        winWidth: 375,
        isShowCode: false,
        codeImage: '',
        code: ''
      }
    },
    onLoad(option) {
      let options = option || this._$$initOptions()
      this.status = options.status || ''
      let index = this.navList.findIndex((item) => item.status === this.status)
      this.exchangeList = this.navList.map(() => {
        return ARR
      })
      this._changeTab(index)
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight ? res.statusBarHeight + 44 : 64
      this.winHeight = res.screenHeight
      this.winWidth = res.screenWidth
      this.getExchangeList(true)
    },
    // 刷新
    onPullDownRefresh() {
      if (this.exchangeList.length) {
        this.exchangeList[this.tabIndex].page = 1
      }
      this.getExchangeList(true)
      wx.stopPullDownRefresh()
    },
    // 翻页
    onReachBottom() {
      if (this.exchangeList[this.tabIndex].page >= this.exchangeList[this.tabIndex].lastPage) {
        return
      }
      this.exchangeList[this.tabIndex].page++
      this.getExchangeList()
    },
    methods: {
      goOrderDetail(id) {
        wx.navigateTo({ url: `${this.$routes.personal.EXCHANGE_DETAIL}?id=${id}` })
      },
      showExchangeCode(item) {
        let str = JSON.stringify({ 'code': item.verify[0].code }) // todo
        let img = createQrCode.png(str) // png
        img = createQrCode.svg(str) // svg
        this.codeImage = img
        this.code = item.verify[0].code
        this.isShowCode = true
      },
      _changeTab(index, id, e) {
        if (this.tabIndex === index) return
        this.move = this.winWidth * 0.336 * index
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        this.boxTransition = ''
        this.exchangeList[this.tabIndex].arr = this.exchangeList[this.tabIndex].arr.slice(0, 10)
        this._setViewToItem(index)
        this.exchangeList[this.tabIndex].page = 1
        this.getExchangeList()
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
      getExchangeList(loading = false) {
        let data = { status: this.navList[this.tabIndex].status, page: this.exchangeList[this.tabIndex].page }
        API.Exchange.exchangeList({ data, loading, toast: false })
          .then((res) => {
            this.exchangeList[this.tabIndex].lastPage = res.meta.last_page
            let arr = res.data.map((item) => {
              item.height = 145
              return item
            }) || []
            if (this.exchangeList[this.tabIndex].page === 1) {
              this.exchangeList[this.tabIndex].arr = arr
              this.exchangeList[this.tabIndex].isEmpty = !arr.length
            } else {
              this.exchangeList[this.tabIndex].arr = this.exchangeList[this.tabIndex].arr.concat(arr)
            }
            this.exchangeList = JSON.parse(JSON.stringify(this.exchangeList))
          })
          .catch(() => {
            this.exchangeList[this.tabIndex].arr = []
            this.exchangeList = JSON.parse(JSON.stringify(this.exchangeList))
            this.exchangeList[this.tabIndex].isEmpty = true
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
    z-index: 2
    .scroll-view2
      position: relative
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
        width: 11.47vw
        padding: 0 11.06vw
        .text
          line-height: 1
          padding: 10.5px 0 13.5px
          font-size: 3.733vw
          font-family: $font-family-regular
          color: $color-text-main
      .item-active
        color: $color-text-main
        position: relative
        transition: font-size 0.2s
        transform-origin: 50%
        .text
          font-size: 4.267vw
          font-family: $font-family-medium
    .line-box
      position: absolute
      width: 33.6vw
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
    padding: 0 15px
    box-sizing: border-box
    margin-bottom: 10px
    background: $color-white
    .order-header
      line-height: 40px
      height: 40px
      display: flex
      align-items: center
      justify-content: space-between
      border-bottom-1px()
      .order-time
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
      .order-status
        color: $color-main
        font-family: $font-family-regular
        font-size: $font-size-14
    .order-msg
      display: flex
      padding: 15px 0
      .goods-img
        border-radius: 2px
        width: 75px
        min-width: 75px
        height: @width
        min-height: 75px
      .goods-msg
        margin-left: 10px
        flex: 1
        width: 0
        .goods-title
          no-wrap()
          color: $color-text-main
          font-family: $font-family-medium
          font-size: $font-size-14
        .sku
          width: 100%
          display: flex
          flex-wrap: wrap
          margin-top: 7.4px
          font-size: $font-size-13
          font-family: $font-family-regular
          line-height: 1.2
          height: 15.6px
          .sku-item
            margin-right: 10px
            white-space: nowrap
            color: $color-text-sub
        .goods-detail
          margin-top: 15.4px
          display: flex
          align-items: flex-end
          justify-content: space-between
          .goods-price
            display: flex
            align-items: flex-end
            line-height: 1
            color: $color-money
            font-family: $font-family-regular
            .goods-tag
              font-size: $font-size-15
              line-height: 1
              margin-left: 1px
              color: $color-money
              font-family: $font-family-regular
            .goods-money
              transform: translateY(1px)
              font-family: $font-family-din-bold
              font-size: $font-size-19

          .goods-num
            color: $color-text-main
            font-family: $font-family-regular
            font-size: $font-size-14

    .order-button
      height: 45px
      display: flex
      justify-content: flex-end
      align-items: center
      border-top-1px()
      .order-btn
        margin-left: 10px
        line-height: 27px
        border-1px(#C8CACF, 14.5px)
        width: 75px
        text-align: center
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-text-main
      .confirm
        width: 82px
        border-1px($color-main, 14.5px)
        color: $color-main
</style>
