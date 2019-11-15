<template>
  <div class="my-share">
    <navigation-bar title="分享赚钱"></navigation-bar>
    <div class="share-money-box">
      <div class="bank-money">
        <div class="bank-money-top">
          <div class="bank-top-left">
            <div class="top-left-text">钱包余额(元)</div>
            <div class="top-left-number">{{moneyDetail.remaining || 0}}</div>
          </div>
          <div class="bank-top-right" @click="goWithdraw">去提现</div>
        </div>
        <div class="bank-money-bottom">
          <div class="money-bottom-box width-six">
            <div class="money-bottom-title">分享总收益(元)</div>
            <div class="money-bottom-number">{{moneyDetail.total_remaining || 0}}</div>
          </div>
          <div class="money-bottom-box width-flex">
            <div class="money-bottom-title">
              <span>佣金在路上(元)</span>
              <div class="open-icon" @click="showPopup=true">
                <img src="./icon-help@2x.png" class="open-icon-img" alt="">
              </div>
            </div>
            <div class="money-bottom-number">{{moneyDetail.wait_remaining || 0}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="commission-list" v-if="shareList.length &&  totalPage >= 1">
      <div class="item-list" v-for="item in shareList" :key="item.id">
        <img :src="item.avatar" class="item-img" alt="" mode="aspectFill">
        <div class="item-flex">
          <div class="order-top-box">
            <div class="order-top-title order-width">订单编号: {{item.order_sn}}</div>
            <div class="order-top-title" :class="{'order-money' : item.status * 1 === 1}"><span v-if="item.status * 1 === 1">+</span>{{item.money}}</div>
          </div>
          <div class="order-bottom-box">
            <div class="order-bottom-title order-width">{{item.settlement_at || item.created_at || ''}}</div>
            <div class="order-bottom-title">{{item.status_text}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-page" v-else>
      <empty :image="require('./pic-empty@2x.png')" tip="你的页面是空的"></empty>
    </div>
    <!-- 弹窗-->
    <div class="modal-wrap" :class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'" @click="showPopup=false">
      <div class="modal-main" @click.stop>
        <div class="modal-main-title">
          <div class="modal-text">佣金规则</div>
          <img src="./icon-del@2x.png" class="modal-close-img" @click="showPopup=false">
        </div>
        <img src="./pic-yjrule@2x.png" class="modal-rule">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'MY_SHARE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        showPopup: false,
        moneyDetail: {},
        params: {
          type: 4,
          limit: 10,
          page: 1
        },
        loading: false,
        totalPage: 0,
        shareList: []
      }
    },
    onShow() {
      this.getAccountDetail()
      this.params.page = 1
      this.getSettlementList()
    },
    // 下拉加载
    onReachBottom() {
      if (this.params.page + 1 > this.totalPage || this.loading) return
      this.params.page++
      this.getSettlementList()
    },
    methods: {
      // 获取余额详情
      getAccountDetail() {
        API.Share.accountDetail({data: {}, loading: false}).then((res) => {
          this.moneyDetail = res.data
          console.log(res.data)
        })
      },
      // 补贴记录
      getSettlementList() {
        this.loading = true
        API.Share.settlementList({data: this.params, loading: false}).then((res) => {
          if (this.params.page === 1) this.shareList = []
          this.shareList = [...this.shareList, ...res.data]
          this.totalPage = res.meta.last_page
          this.loading = false
        })
      },
      // 去提现
      goWithdraw() {
        if (this.moneyDetail.remaining < 100) {
          wx.showToast({ title: '余额满100元可提现', icon: 'none' })
        } else {
          wx.showToast({ title: '现提现较多人,请稍后再试', icon: 'none' })
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .my-share
    width: 100%
    min-height: 100vh
    background: $color-white
  .share-money-box
    padding: 10px 12px
    box-sizing: border-box
    .bank-money
      border-radius: 8px
      padding: 0 15px 0
      background-image: linear-gradient(134deg, #30CFB3 0%, #19B6B4 100%)
      .bank-money-top
        padding: 26.5px 0 31px
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom-1px(rgba(232,234,238,.3))
        .top-left-text
          font-family: $font-family-regular
          color: $color-white
          font-size: $font-size-13
          margin-bottom: 10px
        .top-left-number
          font-family: $font-family-din-bold
          color: $color-white
          font-size: $font-size-25
        .bank-top-right
          width: 59px
          height: 25px
          text-align: center
          line-height: 25px
          border: 1px solid $color-white
          border-radius: 25px
          font-family: $font-family-regular
          color: $color-white
          font-size: $font-size-12
      .bank-money-bottom
        layout(row)
        padding: 15px 0 22.5px
        .width-six
          width: 60%
        .width-flex
          flex: 1
        .money-bottom-title
          font-family: $font-family-regular
          color: $color-white
          font-size: $font-size-13
          display: flex
          align-items: center
          margin-bottom: 9px
          .open-icon
            width: 13px
            height: @width
            margin-left: 5px
            display: block
            extend-click()
            .open-icon-img
              width: 13px
              height: @width
              display: block
        .money-bottom-number
          font-family: $font-family-din-bold
          color: $color-white
          font-size: $font-size-18
  .commission-list
    padding: 0 15px
    box-sizing: border-box
    .item-list
      padding: 15px 0
      border-bottom-1px(#E8EAEE)
      layout(row)
      .item-img
        width: 40px
        height: @width
        display: block
        border-radius :100%
        margin-right: 10px
      .item-flex
        flex: 1
        .order-top-box
          layout(row)
          align-items: center
          justify-content: space-between
          margin-bottom: 10px
          .order-top-title
            font-family: $font-family-regular
            color: $color-text-main
            font-size: $font-size-14
          .order-width
            width: 80%
          .order-money
            color: $color-money
        .order-bottom-box
          layout(row)
          align-items: center
          justify-content: space-between
          .order-bottom-title
            font-family: $font-family-regular
            color: $color-text-sub
            font-size: $font-size-12
          .order-width
            width: 70%
  /*  弹框  */
  .modal-wrap
    position fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    background: rgba(39, 39, 62, 0.7)
    .modal-main
      position: absolute
      width: 300px
      height: @width
      background: $color-white
      border-radius: 6px
      left: 0
      top: 0
      right: 0
      bottom: 0
      margin: auto
      padding: 0 15px
      .modal-main-title
        width: 100%
        height: 50px
        position: relative
        text-align: center
        font-family: $font-family-medium
        color: $color-text-main
        font-size: $font-size-16
        display: flex
        align-items: center
        justify-content: center
        margin-bottom: 20px
        border-bottom-1px(#E8EAEE)
        .modal-close-img
          extend-click()
          position: absolute
          top: 0
          bottom: 0
          right: 0
          margin: auto 0
          width: 12px
          height: @width
          display: block
    .modal-rule
      display: block
      width: 216px
      height: 190px
      margin: 0 auto
  .hide-popup
    opacity: 0
    z-index: -1
    transition: all 0.2s

  .fade-modal-enter-active
    opacity: 1
    z-index: 1000
    transition: all 0.5s
  .my-share
    width: 100%
  .empty-page
    flex: 1
    padding: 0 0 0 5px
</style>
