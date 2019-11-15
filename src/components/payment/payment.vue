<template>
  <div class="payment">
    <div class="payment-cover" v-show="orderShow" @click.stop="hideOrder" @touchmove.parent=""></div>
    <div class="payment-content" :class="orderShow ? 'show' : ''" @click.stop="" @touchmove="">
      <div class="close-icon" @click="hideOrder">
        <img class="close-img" src="./icon-delete@2x.png" alt="" @click="hideOrder">
      </div>
      <div class="payment-msg-container">
        <div class="payment-top">
          <div class="payment-img-box">
            <img :src="paymentMsg.image" class="payment-img" mode="aspectFill">
          </div>
          <div class="payment-top-right">
            <div class="payment-title">{{paymentMsg.title}}</div>
            <div class="payment-money">
              <span class="price-left"><span class="price-icon">¥</span><span class="big-money">{{paymentMsg.price}}</span></span>
              <span class="del-money">¥{{paymentMsg.originPrice}}</span>
            </div>
          </div>
        </div>
        <div class="payment-detail">
          <div class="detail-item">
            <div class="detail-title">数量</div>
            <count-operate v-model="orderNum" :maxNumber="paymentMsg.stock" @change="changeCount" @over="countOver"></count-operate>
          </div>
          <div class="detail-item">
            <div class="detail-title">商品总额</div>
            <div class="payment-money"><span class="money-icon">¥</span>{{total}}</div>
          </div>
        </div>
        <div class="phone-auth">
          <div class="detail-title">手机号码</div>
          <div class="phone-right">
            <div class="phone-num">{{paymentMsg.phoneNum}}</div>
          </div>
        </div>
      </div>
      <div class="buy-btn-box border-top-1px">
        <div class="buy-btn" :class="{'goods-buy-btn' : type === 'default'}" @click.stop="submitOrder">立即购买</div>
      </div>
      <div class="ios-box" v-if="statusBarHeight > 20"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CountOperate from '@components/count-operate/count-operate'
  import API from '@api'

  const ORDER_TYPE = {
    default: 0,
    group: 1,
    bargain: 2
  }
  export default {
    components: {
      CountOperate
    },
    data() {
      return {
        imageUrl: this.$imageUrl,
        orderShow: false,
        orderNum: 1,
        total: '',
        paymentMsg: {}, // 支付信息
        type: ''
      }
    },
    created() {
    },
    onUnload() {
      this.orderShow = false
      this.orderNum = 1
      this.paymentMsg = {}
      this.type = ''
    },
    methods: {
      async showOrder(msg, type = 'default') {
        this.type = type
        this.paymentMsg = msg
        this.code = msg.code
        this.orderShow = true
        this.orderNum = 1
        this.total = (this.orderNum * this.paymentMsg.price).toFixed(2)
      },
      hideOrder() {
        this.orderShow = false
      },
      // 商品数量点击
      changeCount(val) {
        this.total = (val * this.paymentMsg.price).toFixed(2)
      },
      // 当商品超过库存
      countOver() {
        wx.showToast({ title: '数量超出最大限制', icon: 'none' })
      },
      submitOrder() {
        let data
        let goods = [{
          goods_id: this.paymentMsg.goods_id,
          num: this.orderNum,
          promotion_id: this.paymentMsg.promotion_id || 0,
          team_id: this.paymentMsg.groupJoinId || 0
        }]
        data = {
          goods,
          type: ORDER_TYPE[this.type]
        }
        API.Serve.createServeOrder({data}).then((res) => {
          let payRes = res.data.pay_config
          let orderId = res.data.id
          let groupId = res.data.team_id || 0
          let that = this
          let url
          const { timestamp, nonceStr, signType, paySign } = payRes
          wx.requestPayment({
            timeStamp: timestamp,
            nonceStr,
            package: payRes.package,
            signType,
            paySign,
            success: () => {
              if (that.type === 'default') {
                this.$sendMsg({
                  event_no: 1004,
                  title: this.paymentMsg.title,
                  total: this.total
                })
                this.$emit('servePaySuccess')
                url = `${that.$routes.main.PAY_SUCCESS}?id=${orderId}&type=serve`
              } else if (that.type === 'bargain') {
                this.$sendMsg({
                  event_no: 1015,
                  title: this.paymentMsg.title,
                  total: this.total
                })
                this.$emit('bargainPaySuccess')
                url = `${that.$routes.main.PAY_SUCCESS}?id=${orderId}&type=serve`
              } else if (that.type === 'group') {
                this.$sendMsg({
                  event_no: 1010,
                  title: this.paymentMsg.title,
                  total: this.total
                })
                this.$emit('groupPaySuccess')
                if (that.paymentMsg.noJump) return
                this.$wechat.showLoading()
                setTimeout(() => {
                  this.$wechat.hideLoading()
                  url = `${that.$routes.active.GROUP_DETAIL}?id=${groupId}`
                  this.orderShow = false
                  wx.navigateTo({ url })
                }, 2000)
                return
              }
              this.orderShow = false
              wx.navigateTo({ url })
            },
            fail: () => {
              url = `${that.$routes.personal.SERVICE_ORDER_DETAIL}?id=${orderId}`
              this.orderShow = false
              wx.navigateTo({ url })
            }
          })
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/private.styl"

  .payment
    .ios-box
      height: 20px
    .payment-cover
      position: fixed
      left: 0
      top: 0
      bottom: 0
      right: 0
      z-index: 100
      background: rgba(31, 31, 31, 0.8)
    .payment-content
      position: fixed
      z-index: 150
      left: 0
      bottom: -130%
      width: 100%
      background: $color-white
      border-radius: 6px 6px 0 0
      box-shadow: 0 2px 16px 3px rgba(26,24,29,0.06)
      transition: all .3s
      .close-icon
        position: absolute
        right: 0
        top: 0
        width: 20px
        height: 20px
        padding: 10px
        z-index: 151
        .close-img
          width: 20px
          height: 20px
      .payment-msg-container
        width: 100%
        padding: 0 15px
        box-sizing: border-box
      .payment-top
        position: relative
        height: 100px
        display: flex
        padding-top: 10px
        .payment-img-box
          width: 100px
          height: 100px
          border-radius: 2px
          background: $color-white
          overflow: hidden
          .payment-img
            width: 100%
            height: 100%
        .payment-top-right
          margin-left: 10px
          flex: 1
          overflow: hidden
          padding-top: 15px
          .payment-title
            font-family: $font-family-medium
            font-size: $font-size-16
            height: 32px
            line-height: 16px
            color: $color-text-main
            letter-spacing: 0.6px
            margin-bottom: 17px
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
          .payment-money
            display: flex
            align-items: flex-end
            .price-left
              margin-right: 8px
              .price-icon
                font-family: $font-family-din-bold
                font-size: $font-size-12
                color: $color-money
                margin-right: 1px
              .big-money
                font-family: $font-family-din-bold
                font-size: $font-size-20
                color: $color-money
            .del-money
              position: relative
              bottom: 1px
              text-decoration: line-through
              font-family: $font-family-regular
              color: $color-text-sub
              font-size: $font-size-13
      .payment-detail
        height: 120px
        padding-top: 20px
        .detail-item
          display: flex
          align-items: center
          justify-content: space-between
          height: 60px
          .detail-title
            font-family: $font-family-regular
            color: $color-text-sub
            font-size: $font-size-14
          .payment-money
            font-size: $font-size-16
            font-family: $font-family-regular
            color: $color-text-main
            .money-icon
              font-family: $font-family-regular
              font-size: $font-size-12
              margin-right: 1px
      .phone-auth
        height: 60px
        display: flex
        align-items: center
        justify-content: space-between
        .detail-title
          font-family: $font-family-regular
          color: $color-text-sub
          font-size: $font-size-14
        .phone-right
          .phone-get-btn
            reset-button()
            height: 30px
            padding-left: 10px
            display: flex
            align-items: center
            font-size: 0
            .get-btn-txt
              font-family: $font-family-regular
              color: $color-6E6E6E
              font-size: $font-size-16
              margin-right: 5px
            .get-btn-icon
              width: 7.5px
              height: 12.5px
          .phone-num
            font-family: $font-family-regular
            color: $color-text-main
            font-size: $font-size-16
      .buy-btn-box
        margin-top: 80px
        padding: 0 15px
        height: 55px
        display: flex
        align-items: center
        .buy-btn
          flex: 1
          height: 40px
          line-height: 40px
          font-size: $font-size-14
          font-family: $font-family-medium
          color: $color-white
          button-style(normal, 22.5px)
        .buy-btn.un-click
          button-style(un-click, 22.5px)
        .buy-btn.goods-buy-btn
          button-style(normal, 22.5px, goods)
        .buy-btn.goods-buy-btn.un-click
          button-style(un-click, 22.5px, goods)
    .show.payment-content
      bottom: 0

</style>
