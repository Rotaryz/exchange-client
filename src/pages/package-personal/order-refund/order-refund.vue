<template>
  <div class="order-refund">
    <navigation-bar title="退款详情"></navigation-bar>
    <div class="refund-msg">
      <div class="refund-text">
        <p class="refund-title">退款状态</p>
        <p class="refund-status">{{refundDetail.refund_str}}</p>
      </div>
      <div class="refund-item">
        <p class="refund-name">退款金额：<span class="refund-content">¥{{refundDetail.money}}</span></p>
      </div>
      <div class="refund-item">
        <p class="refund-name">退回账户：<span class="refund-content">{{refundDetail.pay_method_id}}</span></p>
      </div>
    </div>
    <div class="refund-progress">
      <div class="refund-progress-red">
        <div class="line-box">
          <div class="line" :class="{'line-active': refundStatus >= 1}"></div>
          <div class="line" :class="{'line-active': refundStatus === 2}"></div>
        </div>
        <span class="refund-progress-circular" :class="{'refund-progress-circular-active': refundStatus >= 0}"></span>
        <span class="refund-progress-circular" :class="{'refund-progress-circular-active': refundStatus >= 1}"></span>
        <span class="refund-progress-circular" :class="{'refund-progress-circular-active': refundStatus >= 2}"></span>
      </div>
      <div class="refund-progress-text">
        <div class="refund-progress-item">
          <div class="refund-progress-title" :class="{'refund-progress-title-active': refundStatus === 0}">退款申请已提交</div>
          <div class="refund-progress-reason">您的退款申请已经提交</div>
          <div class="refund-progress-reason">{{refundDetail.created_at}}</div>
        </div>
        <div class="refund-progress-item">
          <div class="refund-progress-title" :class="{'refund-progress-title-active': refundStatus === 1}">系统处理中</div>
          <div class="refund-progress-reason">您的退款申请已受理，审核时间预计需要1-2天</div>
        </div>
        <div class="refund-progress-item">
          <div class="refund-progress-title" :class="{'refund-progress-title-active': refundStatus === 2}">退款成功</div>
          <div class="refund-progress-reason">微信支付处理完成后，退款会在3-5天内退回您的微信支付账户</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'ORDER_REFUND'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        id: '',
        refundStatus: 1,
        refundDetail: {
          refund_str: '退款成功',
          money: 10,
          pay_method_id: '微信支付',
          created_at: '2017-12-10  11:00'
        }
      }
    },
    onLoad(option) {
      this.id = option.id || 0
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  /*退款样式*/
  .order-refund
    .refund-msg
      height: 129px
      box-sizing: border-box
      background: $color-white
      padding: 0 15px
      .refund-text
        display: flex
        justify-content: space-between
        align-items: center
        height: 53.5px
        margin-bottom: 5px
        border-bottom-1px(rgba(153, 160, 170, 0.3))
        .refund-title
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-text-main
        .refund-status
          font-size: $font-size-14
          color: $color-main
          font-family: $font-family-regular
      .refund-item
        font-size: $font-size-14
        margin-top: 12px
        color: $color-text-main
        .refund-name
          font-family: $font-family-regular
        .refund-content
          font-family: $font-family-light
          margin-left: 6.5px
    .refund-progress
      padding: 23.5px 15px 24px
      height: 269.5px
      box-sizing: border-box
      margin-top: 10px
      background: $color-FFFFFF
      display: flex
      .refund-progress-red
        height: 173px
        flex-direction: column
        justify-content: space-between
        display: flex
        position: relative
        margin-top: 3.5px
        .refund-progress-circular
          position: relative
          z-index: 2
          background: $color-main
          border-radius: 7.5px
          width: 7.5px
          height: 7.5px
          min-height: 7.5px
          min-width: 7.5px
        .refund-progress-circular-active
          background: $color-main
        .line-box
          row-center()
          height: 100%
          width: 1px
          display: flex
          flex-direction: column
          justify-content :center
          align-items :center
          .line
            height: 83px
            width: 100%
            transform: scaleX(0.5)
            background: $color-main
          .line-active
            background: $color-main

      .refund-progress-text
        margin-left: 17.5px
        transform: translateY(-3.5px)
        height: 222px
        font-size: $font-size-14
        font-family: $font-family-regular
        line-height: 1
        .refund-progress-item
          margin-bottom: 40px
          .refund-progress-title
            margin-bottom: 10px
          .refund-progress-title-active
            color: $color-main
            font-family: $font-family-regular
          .refund-progress-reason
            margin-bottom: 3.5px
            line-height: 1
            font-size: $font-size-12
            color: $color-text-main
            font-family: $font-family-light
          &:nth-child(2)
            margin-bottom: 46px
            margin-top: -6px
</style>
