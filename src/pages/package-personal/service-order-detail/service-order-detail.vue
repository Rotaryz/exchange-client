<template>
  <div class="service-detail">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-normal">
      <!--商品信息-->
      <div class="order-item">
        <div class="order-top">
          <div class="order-top-left">
            <img mode="aspectFill" src="/static/images/icon-house-order@2x.png" class="order-icon">
            <div class="shop-name">{{orderMsg.shop ? orderMsg.shop.name : ''}}</div>
            <!--<img src="./way@2x.png" class="way">-->
          </div>
          <!--<div class="order-top-right">代付款</div>-->
        </div>
        <div v-if="orderMsg.detail && orderMsg.detail.length" class="goods-content">
          <img :src="orderMsg.detail[0].goods_cover_image" class="goods-img" mode="aspectFill">
          <div class="goods-msg">
            <div class="goods-name">{{orderMsg.detail[0].goods_name }}</div>
            <div class="goods-money">
              <div class="goods-unit">¥</div>
              {{orderMsg.detail[0].goods_price}}
            </div>
          </div>
          <!--<img src="./way@2x.png" class="way">-->
        </div>
      </div>

      <!-- 团购信息-->
      <div class="ground-status" v-if="orderMsg.type === 1 && orderMsg.pay_status !== 0">
        <div class="ground-name">
          <div class="ground-text">拼团状态</div>
          <div class="ground-time-name">剩余时间:</div>
          <div class="ground-time green" :class="orderMsg.groupon_status !== -1 || timeEnd ? 'time-down' : ''">{{orderMsg.groupon_status === -1 ? '00:00:00' : groupEndTime}}</div>
        </div>
        <div class="progress-success" v-if="orderMsg.groupon_status !== -1">

          <div class="line-box">
            <div class="line" :class="{'line-active': groundNow > index}" v-for="(item, index) in groundStatus.length - 1" :key="index" :style="{width: (83.47 / (groundStatus.length - 1) + 'vw')}"></div>
          </div>
          <!--拼团中-->
          <img :key="item" src="./pic-progress@2x.png" class="progress-icon" v-if="orderMsg.groupon_status === 0">
          <span class="progress-item " v-if="orderMsg.groupon_status === 0"></span>
          <!--成功-->
          <span class="progress-item progress-item-active" v-if="orderMsg.groupon_status === 10"></span>
          <img :key="item" src="./pic-progress@2x.png" class="progress-icon" v-if="orderMsg.groupon_status === 10">

        </div>

        <!--拼团失败-->
        <div class="progress-success" v-if="orderMsg.groupon_status === -1">
          <div class="line-box">
            <div class="line" :class="{'line-active': groundNow - 1 > index}" v-for="(item, index) in groundStatus.length - 1" :key="index" :style="{width: (83.47 / (groundStatus.length - 1) + 'vw')}"></div>
          </div>
          <!--拼团中-->
          <img :key="item" src="./pic-progress@2x.png" class="progress-icon" v-if="orderMsg.refund_status === 0">
          <span class="progress-item " v-if="orderMsg.refund_status === 0"></span>
          <span class="progress-item " v-if="orderMsg.refund_status === 0"></span>
          <!--退款中-->
          <span class="progress-item progress-item-active" v-if="orderMsg.refund_status === 1"></span>
          <img :key="item" src="./pic-progress@2x.png" class="progress-icon" v-if="orderMsg.refund_status === 1">
          <span class="progress-item " v-if="orderMsg.refund_status === 1"></span>
          <!--退款中-->
          <span class="progress-item progress-item-active" v-if="orderMsg.refund_status === 2"></span>
          <span class="progress-item progress-item-active" v-if="orderMsg.refund_status === 2"></span>
          <img :key="item" src="./pic-progress@2x.png" class="progress-icon" v-if="orderMsg.refund_status === 2">
        </div>

        <div class="progress-title">
          <span class="progress-title-item" :class="{'progress-title-item-active':  groundNow > index }" v-for="(item, index) in groundStatus" :key="index">{{item}}</span>
        </div>
      </div>

      <!--服务券码-->
      <div class="coupon" v-if="orderMsg.coupon_list && orderMsg.coupon_list.length">
        <div class="coupon-title">服务券码</div>
        <div class="coupon-item " :class="{'coupon-item-disable': coupon.status !== 0}" v-for="(coupon, index) in orderMsg.coupon_list" :key="index">
          <div class="coupon-left">
            <img v-if="coupon.status !== 0" src="./icon-coupon_used@2x.png" mode="aspectFill" class="coupon-icon">
            <img v-if="coupon.status === 0" src="./icon-coupon@2x.png" mode="aspectFill" class="coupon-icon">
            <p class="coupon-text">券{{index + 1}}:</p>
            <p class="coupon-sn">{{coupon.code}}</p>
          </div>
          <div class="coupon-btn" :class="{'coupon-btn-disable' : coupon.status !== 0}" @click="useCoupon(coupon)">{{coupon.status === 0 ? '使用' : coupon.status === 1 ? '已使用' : '已过期'}}</div>
        </div>
      </div>

      <!--订单详情-->
      <div class="order-msg-content">
        <!--<div class="order-title">订单信息</div>-->
        <div class="order-item">订单编号 : <span class="msg-detail">{{orderMsg.order_sn}}</span></div>
        <div class="order-item">手机号码 : <span class="msg-detail">{{orderMsg.mobile || orderMsg.customer.mobile}}</span></div>
        <div class="order-item order-last">下单时间 : <span class="msg-detail">{{orderMsg.created_at}}</span></div>
        <div class="order-item order-first" v-if="orderMsg.detail && orderMsg.detail.length">购买数量 : <span class="msg-detail">{{orderMsg.detail[0].goods_num}}</span></div>
        <div class="order-item">购买总价 : <span class="msg-detail">{{orderMsg.pay_amount}}</span></div>
      </div>

      <!--按钮-->
      <div class="order-btn" v-if="(orderMsg.pay_status !== 2 && orderMsg.transaction_status !== -1) || (orderMsg.type === 1 && orderMsg.pay_status === 2)">
        <div class="btn" v-if="(orderMsg.pay_status !== 2 && orderMsg.transaction_status !== -1)" @click="orderRepay()">去支付</div>
        <div class="btn" v-if="orderMsg.type === 1 && orderMsg.pay_status === 2" @click="goGroupDetail">拼团详情</div>
        <!--<div class="btn">{{manager[orderMsg[groupon_status + '']]}}</div>-->
      </div>
    </div>
    <service-popup :showPopup.sync="showPopup" :couponMsg="couponMsg" @hidePopup="hidePopup"></service-popup>

  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ServicePopup from '@components/service-popup/service-popup'
  import createQrCode from '@utils/create-qr-code'
  import { showLoading } from '@utils/wechat'

  const PAGE_NAME = 'SERVICE_DETAIL'
  const GROUND_END = ['拼团中', '拼团失败', '退款成功']
  const GROUND_STATUS = ['拼团中', '拼团成功']
  const MANAGER = { payment: '去支付', '0': '拼团详情', '1': '拼团详情', '-1': '拼团详情' }

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ServicePopup
    },
    data() {
      return {
        showPopup: false,
        manager: MANAGER,
        id: '',
        orderMsg: {
          status: '',
          order_sn: '',
          create_at: '',
          actually_price: '',
          detail: [],
          mobile: '',
          customer: { mobile: '' },
          coupon_list: [
            {
              status: 0,
              code: ''
            }
          ]
        },
        groundStatus: GROUND_STATUS,
        groundNow: 0,
        groupEndTime: '00:00:00',
        groupDetail: -1,
        time: '',
        couponMsg: {},
        timeEnd: false
      }
    },
    onLoad(option) {
      clearTimeout(this.time)
      let options = option || this._$$initOptions()
      this.id = options.id || this.id
      this._getOrderDetail(true)
    },
    methods: {
      // 重新支付
      orderRepay() {
        API.Service.orderRepay({ data: { id: this.id } })
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
                this.$sendMsg({
                  event_no: 1010,
                  title: this.orderMsg.detail[0].goods_name,
                  total: this.orderMsg.pay_amount
                })
                showLoading()
                setTimeout(() => {
                  this._getOrderDetail(true)
                }, 2000)
              },
              fail: () => {
              }
            })
          })
          .catch(() => {
          })
      },
      hidePopup() {
        this._getOrderDetail(false)
      },
      goGroupDetail() {
        wx.navigateTo({ url: `${this.$routes.active.GROUP_DETAIL}?id=${this.orderMsg.team_id}&shopId=${this.orderMsg.shop.id}` })
      },
      useCoupon(coupon) {
        if (coupon.status !== 0) return
        let str = JSON.stringify({ 'code': coupon.code }) // todo
        let img = createQrCode.png(str) // png
        img = createQrCode.svg(str) // svg
        this.couponMsg = {
          goods_image: this.orderMsg.detail[0].goods_cover_image,
          name: this.orderMsg.detail[0].goods_name,
          time: coupon.use_end_at,
          qrcode_url: img,
          code: coupon.code
        }
        this.showPopup = true
      },
      _getOrderDetail(loading = false) {
        let data = { id: this.id }
        API.Service.orderDetail({
          data,
          loading
        })
          .then((res) => {
            this.orderMsg = res.data
            this.orderMsg.mobile = this.orderMsg.customer.mobile
            if (this.orderMsg.groupon_status !== -1 && this.orderMsg.groupon_status === 0) this.groundNow = this.orderMsg.groupon_status
            else if (this.orderMsg.groupon_status !== -1 && this.orderMsg.groupon_status === 10) this.groundNow = 1
            else if (this.orderMsg.groupon_status === -1) this.groundNow = this.orderMsg.refund_status
            this.groupDetail = this.orderMsg.close_groupon_surplus_time
            if (this.orderMsg.type !== 1) return
            if (this.orderMsg.groupon_status !== -1) this.groundStatus = GROUND_STATUS
            else this.groundStatus = GROUND_END
            this._groupTimePlay()
          })
          .catch(e => {
            this.orderMsg = {}
          })
      },
      _groupTimePlay() {
        clearInterval(this.time)
        let res = this._groupTimeCheckout(this.groupDetail, this.orderMsg.groupon_status)
        this.groupEndTime = `${res.hour}:${res.minute}:${res.second}`
        this.time = setInterval(() => {
          let res = this._groupTimeCheckout(this.groupDetail, this.orderMsg.groupon_status)
          this.groupEndTime = `${res.hour}:${res.minute}:${res.second}`
          if (this.timeEnd) {
            clearInterval(this.time)
          }
        }, 1000)
      },
      // 引入时间戳（秒）换算出时间差
      _groupTimeCheckout(time, status) {
        let nowSecond = parseInt(Date.now() / 1000)
        let differ = time * 1 - nowSecond
        let hour = Math.floor(differ / (60 * 60))
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0 && +status === 0) {
          times = {
            hour,
            minute,
            second
          }
        } else {
          times = {
            hour: '00',
            minute: '00',
            second: '00'
          }
          this.timeEnd = true
        }
        return times
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .service-detail
    box-sizing: border-box
    padding-bottom: 60px
    overflow-y: auto

  /*商品信息*/
  .order-item
    margin-buttom: 10px
    background: $color-white
    .order-top
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
      padding: 4px 0 17.5px
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
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-17
          display: flex
          align-items: flex-end
          line-height: 1
          .goods-unit
            transform: translateY(-1.5px)
            font-size: $font-size-11
    .way
      display: block
      margin: auto 0
      width: 13px
      height: 13px
      margin-left: 17px

  /*团购状态*/
  .ground-status
    height: 122.5px
    box-sizing: border-box
    margin-top: 10px
    background: $color-white
    padding: 18px 15px 20px
    .ground-name
      display: flex
      align-items: center
      line-height: 1
      .ground-text
        letter-spacing: 0.6px
        color: $color-text-main
        font-family: $font-family-medium
      .ground-time-name
        letter-spacing: 0.3px
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-main
        margin-left: 10px
      .ground-time
        margin-left: 8px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-main
        &.green
          color: $color-main !important
        .time-down
          color: $color-main
    .progress-success
      width: 88%
      display: flex
      margin-top: 30px
      margin-left: 14.5px
      position: relative
      justify-content: space-between
      align-items: center
      .progress-box
        position: relative
        z-index: 2
      .progress-item
        height: 7.5px
        width: 7.5px
        border-radius: 50%
        background: #C8CACF
        position: relative
        z-index: 2
      .progress-item-active
        background: $color-main
      .progress-icon
        position: relative
        z-index: 2
        height: 12px
        width: 12px
    .progress-title
      display: flex
      margin-top: 17px
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-12
      line-height: 1
      justify-content: space-between
      .progress-title-item-active
        color: $color-text-main
    .line-box
      col-center()
      width: 100%
      height: 1px
      transform: scale(1, 0.5)
      display: flex
      .line
        background: #C8CACF
      .line-active
        background: $color-main

  /*服务券码*/
  .coupon
    box-sizing: border-box
    padding: 18px 15px 0
    background: $color-white
    margin-top: 10px
    .coupon-title
      font-family: $font-family-medium
      margin-bottom: 12px
      font-size: $font-size-16
    .coupon-item
      height: 50px
      display: flex
      align-items: center
      justify-content: space-between
      border-bottom-1px()
      &:last-child
        border-none()
      .coupon-left
        display: flex
        align-items: center
      .coupon-icon
        margin-right: 10px
        height: 15px
        width: 17px
      .coupon-text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        line-height: 1
      .coupon-sn
        margin-left: 8px
        font-family: $font-family-din-bold
        color: $color-text-main
        line-height: 1
        font-size: $font-size-16
      .coupon-btn
        width: 57px
        height: 28px
        line-height: 28px
        color: $color-main
        text-align: center
        font-family: $font-family-regular
        border-1px($color-main, 15px)
        font-size: $font-size-12
    .coupon-item-disable
      .coupon-sn, .coupon-text
        color: $color-text-assist
      .coupon-btn-disable
        font-size: $font-size-12
        width: 57px
        height: 28px
        line-height: 28px
        color: $color-text-assist
        text-align: center
        font-family: $font-family-regular
        border-1px($color-text-assist, 15px)

  /*订单详情*/
  .order-msg-content
    padding: 24px 15px 0
    box-sizing: border-box
    margin-top: 10px
    background: $color-white
    color: $color-text-main
    .order-title
      font-family: $font-family-medium
      font-size: $font-size-16
      margin-bottom: 20px
    .order-item
      font-size: $font-size-14
      font-family: $font-family-regular
      padding-bottom: 24px
      .msg-detail
        font-family: $font-family-light
        letter-spacing: 0.3px
        margin-left: 8px
        color: #000019
    .order-last
      padding-bottom: 17px
      border-bottom-1px($color-line)
    .order-first
      padding-top: 17px

  /* 按钮*/
  .order-btn
    border-top-1px(#E8EAEE)
    background: $color-white
    position: fixed
    bottom: 0
    left: 0
    width: 100vw
    height: 50px
    display: flex
    justify-content: flex-end
    padding: 0 15px
    box-sizing: border-box
    align-items: center
    .btn
      font-size: $font-size-14
      width: 86px
      height: 30px
      line-height: 30px
      color: $color-main
      text-align: center
      font-family: $font-family-regular
      border-1px($color-main, 14.5px)
</style>
