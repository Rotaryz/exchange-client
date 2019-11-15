<template>
  <div class="order-list">
    <navigation-bar title="订单管理"></navigation-bar>
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
          <div v-for="(item, index) in tabItem.arr" :key="index" class="order-item" @click="goOrderDetail(item.id)">
            <div class="order-header">
              <div class="order-time">{{item.created_at}}</div>
              <div class="order-status">{{item.status_str}}</div>
            </div>
            <div v-for="(good, goodIdx) in item.details" :key="goodIdx" class="order-msg">
              <img :src="good.goods_cover_image" class="goods-img" mode="aspectFill">
              <div class="goods-msg">
                <div class="goods-title">{{good.goods_name}}</div>
                <div class="sku">
                  <div v-for="(sku, skuIdx) in good.goods_spec.specs_attrs" :key="skuIdx" class="sku-item">{{sku.attr_key}}:{{sku.attr_value}}</div>
                </div>
                <div class="goods-detail">
                  <div class="goods-price">
                    <div class="price-unit">¥</div>
                    <div class="goods-money">{{good.goods_spec.cash_price}}</div>
                    <div class="add">+</div>
                    <div class="goods-money">{{good.goods_spec.bean_price}}</div>
                    <img src="./pic-bd@2x.png" class="goods-dou-unit">
                  </div>
                  <div class="goods-num">x{{good.goods_num}}</div>
                </div>
              </div>
            </div>
            <div v-if="item.status === 0" class="order-button">
              <div v-if="item.status === 0" class="order-btn cancel" @click.stop="cancelOrder(item.id, index)">取消</div>
              <div v-if="item.status === 0" class="order-btn confirm" @click.stop="orderRepay(item.id, index)">立即支付</div>
              <!--<div v-if="item.status === 20" class="order-btn confirm">查看物流</div>-->
            </div>
          </div>
          <empty v-if="tabItem.isEmpty" :image="empty" :paddingTop="45.4" tip="你的订单是空的"></empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'ORDER_LIST'
  const NAV_LIST = [
    { name: '全部', status: '' },
    { name: '待付款', status: '0' },
    { name: '待发货', status: '10' },
    { name: '待收货', status: '20' },
    { name: '已完成', status: '100' }
  ]
  const ARR = { arr: [], classifyMore: false, isEmpty: false, lastPage: 2, page: 1, height: 145 }
  const EMPTY = require('../../../../static/images/pic-order@2x.png')

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
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
        orderList: [],
        width: NAV_LIST.length * 100,
        status: '',
        page: 1,
        winHeight: 667
      }
    },
    computed: {
      scrollHeight() {
        let height = this.winHeight - this.statusBarHeight - 45
        return height
      }
    },
    onLoad(option) {
      let options = option || this._$$initOptions()
      this.status = options.status || this.status
      let index = this.navList.findIndex((item) => item.status === this.status)
      this.orderList = this.navList.map(() => {
        return ARR
      })
      this._changeTab(index)
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight ? res.statusBarHeight + 44 : 64
      this.winHeight = res.screenHeight
      this.getOrderList(true)
    },
    // 刷新
    onPullDownRefresh() {
      if (this.orderList.length) {
        this.orderList[this.tabIndex].page = 1
      }
      this.getOrderList(true)
    },
    // 翻页
    onReachBottom() {
      if (this.orderList[this.tabIndex].page >= this.orderList[this.tabIndex].lastPage) {
        return
      }
      this.orderList[this.tabIndex].page++
      this.getOrderList()
    },
    methods: {
      goOrderDetail(id) {
        wx.navigateTo({ url: `${this.$routes.personal.ORDER_DETAIL}?id=${id}` })
      },
      // 取消订单
      cancelOrder(id, index) {
        API.Order.cancelOrder({ data: { id: id } })
          .then((res) => {
            if (this.tabIndex === 0) {
              // 全部列表的时候修改状态
              this.orderList[this.tabIndex].status = -1
              this.orderList[this.tabIndex].status_str = '已关闭'
              return
            }
            this.orderList[this.tabIndex].arr.splice(index, 1)
          })
          .catch(() => {

          })
      },
      // 重新支付
      orderRepay(id, index) {
        API.Order.orderRepay({ data: { order_id: id } })
          .then((res) => {
            let payRes = res.data.pay_config
            const { timestamp, nonceStr, signType, paySign } = payRes
            wx.requestPayment({
              timeStamp: timestamp,
              nonceStr,
              package: payRes.package,
              signType,
              paySign,
              success: () => {
                if (this.tabIndex === 0) {
                  // 全部列表的时候修改状态
                  this.orderList[this.tabIndex].status = 10
                  this.orderList[this.tabIndex].status_str = '待收货'
                  return
                }
                this.orderList[this.tabIndex].arr.splice(index, 1)
              }
            })
          })
          .catch(() => {

          })
      },
      // 切换tab
      _changeTab(index, id, e) {
        if (this.tabIndex === index) return
        this.move = 79 * index
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        this.boxTransition = ''
        this.orderList[this.tabIndex].arr = this.orderList[this.tabIndex].arr.slice(0, 10)
        this._setViewToItem(index)
        this.orderList[this.tabIndex].page = 1
        this.getOrderList()
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
      getOrderList(loading = false) {
        let data = { status: this.navList[this.tabIndex].status, page: this.orderList[this.tabIndex].page }
        API.Order.getOrderList({ data, loading, toast: false })
          .then((res) => {
            this.orderList[this.tabIndex].lastPage = res.meta.last_page
            let arr = res.data.map((item) => {
              item.height = 145
              return item
            }) || []
            if (this.orderList[this.tabIndex].page === 1) {
              this.orderList[this.tabIndex].arr = arr
              this.orderList[this.tabIndex].isEmpty = !arr.length
            } else {
              this.orderList[this.tabIndex].arr = this.orderList[this.tabIndex].arr.concat(arr)
            }
            this.orderList = JSON.parse(JSON.stringify(this.orderList))
          })
          .catch(() => {
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
    z-index: 999
    .scroll-view2
      position: relative
      padding-left: 10px
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
        width: 43px
        padding: 0 18px
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
      width: 79px
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
      min-height: 40px
      align-items: center
      display: flex
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
      border-bottom-1px($color-line)
      &:last-of-type
        border-none()
      .goods-img
        border-radius: 2px
        width: 75px
        min-width: 75px
        height: @width
        min-height: 75px
      .goods-msg
        flex: 1
        width: 0
        margin-left: 10px
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
          height: 13px
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
            .price-unit
              margin-right: 1px
              font-size: $font-size-11
              font-family: $font-family-din-bold
            .goods-money
              transform: translateY(1px)
              font-family: $font-family-din-bold
              font-size: $font-size-15
            .add
              margin: 0 2px
              font-family: $font-family-din-bold
              font-size: $font-size-16
            .goods-dou-unit
              width: 13.2px
              height: 12.75px
              margin-left: 1px
          .goods-num
            color: $color-text-main
            font-family: $font-family-regular
            font-size: $font-size-14

    .order-button
      height: 45px
      display: flex
      justify-content: flex-end
      align-items: center
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
        border-1px($color-main, 14.5px)
        color: $color-main
</style>
