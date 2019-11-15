<template>
  <div class="service-order">
    <navigation-bar title="服务订单"></navigation-bar>
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
          <div v-for="(item, index) in tabItem.arr" :key="index" class="order-item" @click="goUse(item.id)">
            <!--头部-->
            <div class="order-top">
              <div class="order-top-left">
                <img mode="aspectFill" src="/static/images/icon-house-order@2x.png" class="order-icon">
                <div class="shop-name">{{item.shop.name}}</div>
                <!--<img src="./way@2x.png" class="way">-->
              </div>
              <div class="order-top-right">{{item.polymeric_status_str}}</div>
            </div>
            <!--商品-->
            <div v-if="item.detail && item.detail.length" class="goods-content">
              <img :src="item.detail[0].goods_cover_image" class="goods-img" mode="aspectFill">
              <div class="goods-msg">
                <div class="goods-name">{{item.detail[0].goods_name}}</div>
                <div class="goods-money">
                  <div class="goods-unit">¥</div>
                  {{item.detail[0].goods_price}}
                </div>
              </div>
            </div>
            <!--底部-->
            <div class="order-footer" @click.stop>
              <div class="order-type">服务</div>
              <form action="" class="btn-box">
                <button v-if="item.pay_status === 0 && item.status === 0" class="btn" @click="orderRepay(item.id, index, item)">去支付</button>
                <!--<button v-if="item.status === 1" class="btn">查看订单</button>-->
                <button v-if="item.use_verify_status === 1" class="btn" @click="goUse(item.id)">去使用</button>
                <!--<button v-if="item.status === 4" class="btn">退款详情</button>-->
              </form>
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
  import Order from './order'

  const PAGE_NAME = 'SERVICE_ORDER'
  const NAV_LIST = [
    { name: '全部', status: '' },
    { name: '待付款', status: '1' },
    { name: '待成团', status: '2' },
    { name: '待使用', status: '3' },
    { name: '已退款', status: '4' }
  ]
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
        status: '',
        orderList: new Order(NAV_LIST.length),
        width: NAV_LIST.length * 100,
        page: 1,
        winHeight: 667
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
      // 去使用
      goUse(id) {
        wx.navigateTo({ url: `${this.$routes.personal.SERVICE_ORDER_DETAIL}?id=${id}` })
      },
      senAiMsg(eventNo, goodsName, payAmount) {
        this.$sendMsg({
          event_no: eventNo,
          title: goodsName,
          total: payAmount
        })
      },
      // 重新支付
      orderRepay(id, index, item) {
        console.log(item)
        API.Service.orderRepay({ data: { id: id } })
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
                let eventNo = null
                switch (item.type) {
                  case 1:
                    eventNo = 1010
                    break
                  case 2:
                    eventNo = 1015
                    break
                  case 0:
                  default:
                    eventNo = 1004
                    break
                }
                // ai事件推送
                this.senAiMsg(eventNo, item.detail[0].goods_name, item.pay_amount)
                // 全部列表的时候修改状态
                if (this.tabIndex === 0) {
                  if (item.type !== 1) {
                    this.orderList[this.tabIndex].arr[index].status = 3
                    this.orderList[this.tabIndex].arr[index].polymeric_status_str = '待使用'
                    this.orderList[this.tabIndex].arr[index].use_verify_status = 1
                    this.orderList[this.tabIndex].arr[index].pay_status = 0
                    this.orderList = JSON.parse(JSON.stringify(this.orderList))
                    return
                  } else {
                    this.orderList[this.tabIndex].arr[index].status = 2
                    this.orderList[this.tabIndex].arr[index].polymeric_status_str = '待成团'
                    this.orderList[this.tabIndex].arr[index].pay_status = 0
                    this.orderList = JSON.parse(JSON.stringify(this.orderList))
                    return
                  }
                }
                this.orderList[this.tabIndex].arr.splice(index, 1)
                this.orderList = JSON.parse(JSON.stringify(this.orderList))
              },
              fail: () => {
              }
            })
          })
          .catch(() => {
          })
      },
      // 获取订单列表
      getOrderList(loading = false) {
        let data = { polymeric_status: this.navList[this.tabIndex].status, page: this.orderList[this.tabIndex].page }
        API.Service.serviceList({ data, loading, toast: false })
          .then((res) => {
            this.orderList[this.tabIndex].lastPage = res.meta.last_page
            let arr = res.data
            // let arr = [{}, {}]
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
    .goods-content
      margin: 0 15px
      padding: 15px 0
      display: flex
      border-bottom-1px($color-line)
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
          width: 75px
          height: 27px
          text-align: center
          line-height: 27px
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-main
          border-1px($color-main, 14.5px)
</style>
