<template>
  <div class="pay-success">
    <navigation-bar :title="pageInfo.title"></navigation-bar>
    <div class="page-container">
      <img class="pay-success-icon" src="./icon-payok@2x.png" alt="">
      <div class="tip">{{pageInfo.tip}}</div>
      <div class="button-group">
        <div class="button-item" @click="goToHome">{{pageInfo.firstButtonText}}</div>
        <div class="button-item look-order-btn" @click="goToSecond">{{pageInfo.secondButtonText}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'PAY_SUCCESS'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    onLoad(options) {
      this.id = options.id
      this.type = options.type || 'bean'
    },
    data() {
      this.beanOrderDetail = this.$routes.personal.ORDER_DETAIL
      this.serveOrderDetail = this.$routes.personal.SERVICE_ORDER_DETAIL
      return {
        id: 0,
        pageInfo: {
          title: '支付成功',
          tip: '支付成功',
          firstButtonText: '返回首页',
          secondButtonText: '查看订单',
          type: 'bean' // 订单类型 bean 播豆订单 serve 服务订单
        }
      }
    },
    methods: {
      goToSecond() {
        let url = this[this.type + 'OrderDetail']
        wx.redirectTo({ url: url + '?id=' + this.id })
      },
      goToHome() {
        wx.switchTab({ url: this.$routes.main.HOME })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .pay-success
    height: 100vh
    display:flex
    flex-direction: column
    background-color: $color-white

    .page-container
      flex: 1
      background-color: $color-white
      display: flex
      flex-direction: column
      align-items: center

    .pay-success-icon
      width: 70px
      height: 70px
      margin-top: 90px

    .tip
      margin-top: 24px
      color: $color-text-sub
      font-size: $font-size-18
      margin-bottom: 45px


    .button-group
      display: flex

      .button-item
        height: 32px
        line-height: 32px
        width: 110px
        text-align: center
        margin-right: 15px
        font-size: $ont-size-14
        border-1px($color-text-assist, 16px)

        &:last-child
          margin-right: 0
          color: $color-main
          border-1px($color-main, 16px)
</style>
