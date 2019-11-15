<template>
  <div class="my-bargain">
    <navigation-bar title="我的砍价"></navigation-bar>
    <div class="order-item" v-for="(item, index) in list" :key="index" @click="goBargain(item)">
      <div class="order-shop">
        <p class="order-name">{{item.created_at }}</p>
        <p class="order-status">倒计时:{{item.endTime ? item.endTime.day ? item.endTime.day + '天' : '' : ''}}{{item.endTime ? item.endTime.hour ? item.endTime.hour : '' : ''}}时{{item.endTime ? item.endTime.minute ? item.endTime.minute : '' : ''}}分{{item.endTime ? item.endTime.second ? item.endTime.second : '' : ''}}</p>
      </div>
      <div class="order-msg">
        <img :src="item.image_url" mode="aspectFill" class="order-pic">
        <div class="shop-content">
          <p class="shop-name">{{item.name}}</p>
          <p class="shop-price">
            <span class="price">¥</span>
            <span class="money">
            {{item.current_price}}
            </span>
          </p>
          <div class="mine-serve-avatar-box">
            <div class="mine-serve-avatarBox-item" v-for="(items, idx) in item.join_list" :key="idx" v-if="idx < 3">
              <img class="mine-serve-avatarBox-img" :src="items">
            </div>
            <div class="more" v-if="item.join_list && item.join_list.length > 3">
              <span class="more-item"></span>
              <span class="more-item"></span>
              <span class="more-item"></span>
            </div>
            <span class="shop-num">{{item.join_count}}人正在参与</span>
          </div>
        </div>
        <img class="arrow" :src="imageUrl + '/zd-image/mine/icon-pressed@2x.png'" v-if="imageUrl">
      </div>
      <div class="order-status" @click.stop>
        <div class="order-type">{{item.promotion_state === 3 || item.promotion_state === 5 ? '砍价中' :item.promotion_state === 1 ||item.promotion_state === 2 || item.promotion_state === 4 ? '砍价结束' : ''}}</div>
        <div class="border-btn" v-if="item.promotion_state === 3 || item.promotion_state === 5">
          <button open-type="share" hover-class="none" class="btn-one" :data-item="item">找人砍价</button>
          <div class="btn" @click="payBargain(item)">立即购买</div>
        </div>
      </div>
    </div>
    <h1 style="height: 15px"></h1>
    <empty v-if="isEmpty" :image="empty" :paddingTop="45.4" tip="你的砍价是空的"></empty>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const EMPTY = require('../../../../static/images/pic-order@2x.png')

  const PAGE_NAME = 'MY_BARGAIN'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        timer: null,
        empty: EMPTY,
        list: [],
        isEmpty: false,
        page: 1,
        totalPage: 1,
        loadNum: 1
      }
    },
    onShareAppMessage(res) {
      let title, path, imageUrl
      if (res.from === 'button') {
        // 来自页面内转发按钮
        let item = res.target.dataset.item
        this.$sendMsg({
          event_no: 1016,
          title: item.goods_name
        })
        title = `我正在参与${item.name}, 快来和我一起砍！`
        let shopId = wx.getStorageSync('shopId')
        imageUrl = item.share_image_url || item.image_url
        path = `${this.$routes.active.BARGAIN_GOODS_DETAIL}?shopId=${shopId}&activeId=${item.promotion_id}&goodsId=${item.goods_id}`
      }
      return {
        title,
        path,
        imageUrl
      }
    },
    onLoad() {
    },
    onShow() {
      clearInterval(this.timer)
      this._getMyBargainList(this.loadNum <= 1)
      this.loadNum++
    },
    onReachBottom() {
      if (this.page >= this.totalPage) return
      this.page++
      this._getMyBargainList()
    },
    methods: {
      payBargain(item) {
        let data = { type: 2, goods: [{ goods_id: item.goods_id, num: 1, promotion_id: item.promotion_id }] }
        API.Active.createActivity({ data })
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
                // clearInterval(this.timer)
                // this._getMyBargainList(false)
              }
            })
          })
      },
      goBargain(item) {
        wx.navigateTo({ url: `${this.$routes.active.BARGAIN_GOODS_DETAIL}?activeId=${item.promotion_id}&goodsId=${item.goods_id}` })
      },
      _getMyBargainList(loading = false) {
        API.Active.myBargainList({ data: {}, loading })
          .then((res) => {
            this.totalPage = res.meta.last_page
            if (this.page === 1) this.list = res.data
            else this.list = this.list.concat(res.data)
            this.isEmpty = !this.list.length
            !this.isEmpty && this._endTimePlay()
          })
          .catch(e => {
            this.list = []
          })
      },
      // 时间处理
      _groupTimeCheckout(time) {
        let nowSecond = parseInt(Date.now() / 1000)
        let differ = time * 1 - nowSecond
        let day = Math.floor(differ / (60 * 60 * 24))
        day = day >= 10 ? day : '0' + day
        let hour = Math.floor(differ / (60 * 60)) - (day * 24)
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (day * 24 * 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            day,
            hour,
            minute,
            second
          }
        } else {
          times = {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
        return times
      },
      // 倒计时
      _endTimePlay() {
        clearInterval(this.timer)
        this.list = this.list.map((item) => {
          item.endTime = this._groupTimeCheckout(item.end_at_timestamp)
          return item
        })
        this.timer = setInterval(() => {
          this.list = this.list.map((item) => {
            item.endTime = this._groupTimeCheckout(item.end_at_timestamp)
            return item
          })
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .my-bargain
    word-break: break-all
    height: 100vh
    background: $color-background
    box-sizing: border-box
    font-family: $font-family-regular
    padding-bottom :30px
    .order-item
      box-sizing: border-box
      padding: 0 15px
      margin: 10px 0 0
      height: 191px
      background: $color-white
      .order-shop
        display: flex
        position: relative
        height: 45px
        align-items: center
        justify-content: space-between
        color: $color-text-main
        white-space: nowrap
        font-size: $font-size-14
        border-bottom-1px($color-line)
        .order-name
          letter-spacing: 0.8px
          font-size: $font-size-15
      .order-msg
        display: flex
        padding: 15px 0
        position: relative
        border-bottom-1px($color-line)
        .order-pic
          height: 75px
          width: 75px
          margin-right: 10px
          border-radius: 2px
          background: $image-color
        .shop-content
          display: flex
          flex-direction: column
          flex: 1
          width: 0
          justify-content: space-between
        .shop-name
          margin-top: -5px
          font-size: $font-size-14
          line-height: 21px
          font-family: $font-family-medium
          color: #1F1F1F
          no-wrap()
        .shop-price
          font-size: $font-size-19
          font-family: $font-family-din-bold
          color: $color-money
          line-height: 1
          display: flex
          align-items: flex-end
          .money
            margin-left: 2px
          .price
            font-size: $font-size-13
            transform: translateY(-2px)
        .arrow
          position: absolute
          col-center()
          right: 0
          width: 7.5px
          height: 12.5px

      .order-status
        align-items: center
        justify-content: space-between
        height: 45px
        display: flex
        .order-type
          font-size: $font-size-14
          color: $color-main
        .border-btn
          display: flex
          .btn
            margin-left: 10px
            width: 75px
            font-family: $font-family-regular
            font-size: $font-size-12
            border-radius: 15px
            text-align: center
            line-height: 27px
            height: 27px
            border-1px($color-main, 15px)
            color: $color-main
          .btn-one
            reset-button()
            width: 75px
            font-family: $font-family-regular
            font-size: $font-size-12
            border-radius: 15px
            text-align: center
            line-height: 27px
            height: 27px
            border-1px(#C8CACF, 15px)
            color: $color-text-main

  .mine-serve-avatar-box
    display: flex
    margin-right: 10.5px
    align-items: center

  .shop-num
    font-family: $font-family-regular
    font-size: $font-size-12
    margin-left: 5px
    color: $color-text-main
    line-height: 1

  .mine-serve-avatarBox-item
    width: 23px
    height: 23px
    box-sizing: border-box
    border-radius: 50%
    margin-right: -5px
    .mine-serve-avatarBox-img
      box-sizing: border-box
      width: 23px
      height: 23px
      border: 1.5px solid $color-white
      border-radius: 50%
      position: relative
      background: $image-color
      .bargain-circle-box
        position: absolute
        all-center()
        display: flex
        align-items: center
        justify-content: center
        width: 100%
        .bargain-circle
          display: inline-block
          background: #B6B6B6
          border-radius: 100%
          height: 2px
          width: 2px
          margin: 0 0.7px

  .more
    margin-top: 2px
    margin-left: 10px
    display: flex
    width: 12px
    justify-content: space-between
    .more-item
      height: 3px
      width: 3px
      background: #C8CACF
      border-radius: 50%
</style>
