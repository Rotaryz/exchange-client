<template>
  <div class="serve-detail">
    <navigation-bar ref="navigationBar" :title="title"></navigation-bar>
    <div class="banner-box">
      <swiper class="banner" @change="bannerChange">
        <block v-for="(item, index) in bannerImgs" :key="index">
          <swiper-item class="banner-item">
            <img :src="item.image_url" class="item-img" mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <span class="page-box"><text class="currentNum">{{currentNum}}</text>/{{bannerImgs.length}}</span>
    </div>
    <div class="goods-msg">
      <div class="goods-msg-left">
        <div class="goods-title">{{goodsDetail.name}}</div>
        <div class="goods-money-box">
          <span class="big-money-box"><span class="red-money-icon">¥</span><span class="red-big-money">{{goodsDetail.price}}</span></span>
          <span class="del-money">¥{{goodsDetail.original_price}}</span>
        </div>
      </div>
      <div class="goods-msg-right">
        <div class="right-box-container" @click="showShareModel">
          <form report-submit class="right-form-box" @submit="$getFormId">
            <button open-type="share" hover-class="none" class="right-box-share" @click="serveShare">
              <img src="/static/images/icon-share_xq@2x.png" class="msg-right-icon">
            </button>
          </form>
          <span class="msg-right-txt">{{goodsDetail.share_count}}人分享</span>
        </div>
      </div>
    </div>
    <detail-content :goodsDetail="goodsDetail"></detail-content>
    <div class="pay-order-bottom border-top-1px" :style="{'padding-bottom': statusBarHeight > 20 ? '20px' : '0'}">
      <div class="left-box">
        <form report-submit class="left-item" @submit="$getFormId">
          <button hover-class="none" formType="submit" class="left-item" @click="toShop">
            <img src="/static/images/icon-home@2x.png" class="item-icon">
            <div class="item-txt">店铺</div>
          </button>
        </form>
      </div>
      <form class="right-box outSide" report-submit @submit="$getFormId" v-if="goodsDetail.saleable">
        <button hover-class="none" formType="submit" class="right-box" @click="payOrderMsg" v-if="goodsDetail.saleable">立即购买</button>
      </form>
      <div class="right-box un-click" v-if="goodsDetail.saleable == 0">已抢光</div>
    </div>
    <payment ref="payment" @servePaySuccess="paySuccess"></payment>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable */
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import DetailContent from '@components/detail-content/detail-content'
  import Payment from '@components/payment/payment'
  import ServeHandle from '@mixins/serve-detail'
  import AppPromise from '@utils/app-promise'
  import { resolveQueryScene } from '@utils/common'
  import { SCENE_SHARE, SCENE_DEFAULT, SCENE_QR_CODE } from '@utils/contants'

  const PAGE_NAME = 'BARGAIN_GOODS_DETAIL'

  const EVENT_NO_CONFIG = {
    [SCENE_QR_CODE]: 1002,
    [SCENE_SHARE]: 1002,
    [SCENE_DEFAULT]: 1003
  }

  export default {
    name: PAGE_NAME,
    mixins: [ServeHandle],
    components: {
      NavigationBar,
      DetailContent,
      Payment
    },
    data() {
      return {
        reqGoodsId: '', // 商品id
        shareAuthor: '', // 分享人id
        shareActive: '', // 分享活动id
        shareType: '', // 分享类型
        eventConfig: EVENT_NO_CONFIG // 事件号配置
      }
    },
    onPullDownRefresh() {
      this.$refs.payment && this.$refs.payment.hideOrder()
      this._getServeDetail(res => {
        this._setTitle(res.data.name)
        wx.stopPullDownRefresh()
      })
    },
    onShareAppMessage(res) {
      let title = this.goodsDetail.name ? this.goodsDetail.name : ''
      let shopId = wx.getStorageSync('shopId')
      let path = `${this.$routes.main.SERVE_DETAIL}?shopId=${shopId}&goodsId=${this.reqGoodsId}`
      this.$sendMsg({
        event_no: 1005,
        title: this.goodsDetail.name
      })
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title: title,
        path,
        imageUrl: this.goodsDetail.goods_cover_image
      }
    },
    onLoad(options) {
      if (options) {
        if (options.scene) {
          // 小程序扫码进来
          let query = resolveQueryScene(options.query.scene)
          this.reqGoodsId = query.goodsId || ''
          this.shareAuthor = query.shareAuthor || ''
          this.shareActive = query.shareActive || ''
        } else {
          // 普通参数进来
          this.reqGoodsId = options.goodsId || ''
          this.shareAuthor = options.shareAuthor || ''
          this.shareActive = options.shareActive || ''
        }
      }
      AppPromise.getInstance().then(() => {
        this._getServeDetail(res => {
          this._setTitle(res.data.name)
          this._setEventNo()
          this.$sendMsg({
            event_no: this.eventNo,
            title: res.data.name
          })
        })
      })
    },
    onShow() {
      if (!this.refresh) return
      this.refresh = false
      this._getServeDetail(res => {
        this._setTitle(res.data.name)
      })
    },
    methods: {
      // 获取服务详情
      _getServeDetail(callback) {
        API.Serve.getServeDetail({
          data: {
            id: this.reqGoodsId
          },
          loading: this.firstLoading
        }).then((res) => {
          if (this.firstLoading) {
            this.firstLoading = false
          }
          this.bannerImgs = res.data.goods_banner_images
          this.goodsDetail = res.data
          if (typeof callback === 'function') {
            callback(res)
          }
        })
      },
      async payOrderMsg() {
        let tokenCheck = await this.$checkToken()
        if (!tokenCheck) return
        if (this.shareAuthor.length) {
          this.createShare()
        }
        let userInfo = wx.getStorageSync('userInfo')
        let paymentMsg = {
          price: this.goodsDetail.price,
          originPrice: this.goodsDetail.original_price,
          image: this.goodsDetail.goods_cover_image,
          title: this.goodsDetail.name,
          stock: this.goodsDetail.saleable,
          goods_id: this.goodsDetail.id,
          phoneNum: userInfo.mobile
        }
        this.$refs.payment.showOrder(paymentMsg)
      },
      // 点击分享
      serveShare() {
        this.refresh = true
        API.Serve.setServeShare({
          data: {
            goods_id: this.reqGoodsId
          },
          loading: false,
          toast: false
        })
      },
      paySuccess() {
        this._getServeDetail(res => {
          this._setTitle(res.data.name)
        })
        this.$refs.payment && this.$refs.payment.hideOrder()
      },
      // 绑定关系
      createShare() {
        let id = wx.getStorageSync('userInfo').id
        let data = {from_user_id: this.shareAuthor, to_user_id: id, target_id: this.shareActive, type: 1}
        API.Share.createShareRelation({data, loading: false}).then((res) => {
          console.log(res)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/private.styl"

  .serve-detail
    width: 100%
    background: $color-white
    padding-bottom: 50px
    .f4-line
      width: 100%
      height: 10px
      background: $color-background
    .banner-box
      width: 100vw
      height: 100vw
      position: relative
      .banner
        width: 100vw
        height: 100vw
        .banner-item
          width: 100%
          height: 100%
          .item-img
            width: 100%
            height: 100%
      .page-box
        position: absolute
        right: 15px
        bottom: 15px
        padding: 2px 7px
        border-radius: 10px
        background: rgba(69,90,100,0.3)
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-white
        vertical-align: text-bottom
        .currentNum
          font-family: $font-family-regular
          font-size: $font-size-16
          color: $color-white
    .goods-msg
      padding: 0 15px
      background: $color-white
      display: flex
      min-height: 84px
      justify-content: space-between
      align-items: center
      .goods-msg-left
        flex: 1
        padding: 10px 0
        overflow: hidden
        .goods-title
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-16
          line-height: 21px
          letter-spacing: 0.6px
          overflow: hidden
          width: 100%
          white-space: normal
          word-break: break-all
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
          margin-bottom: 10px
        .goods-money-box
          display: flex
          align-items: flex-end
          .big-money-box
            margin-right: 5px
            .red-money-icon
              font-family: $font-family-din-bold
              font-size: $font-size-16
              color: $color-money
              margin-right: 1px
              margin-bottom: 2px
            .red-big-money
              font-family: $font-family-din-bold
              font-size: 23px
              color: $color-money
          .del-money
            text-decoration: line-through
            font-family: $font-family-regular
            color: $color-text-sub
            font-size: $font-size-13
            margin-bottom: 2px
      .goods-msg-right
        height: 100%
        .right-box-container
          height: 100%
          display: flex
          flex-direction: column
          align-items: center
          justify-content: center
          font-size: 0
          .right-form-box
            width: 53px
            height: 53px
            .right-box-share
              reset-button()
              width: 53px
              height: 53px
              .msg-right-icon
                width: 53px
                height: 53px
          .msg-right-txt
            font-family: $font-family-regular
            color: $color-text-sub
            font-size: $font-size-13

    .pay-order-bottom
      width: 100vw
      height: 55px
      position: fixed
      left: 0
      bottom: 0
      z-index: 8
      background: $color-white
      display: flex
      align-items: center
      .left-box
        width: 45px
        padding: 0 10px
        display: flex
        align-items: center
        .left-item
          reset-button()
          flex: 1
          display: flex
          font-size: 0
          height: 100%
          flex-direction: column
          align-items: center
          justify-content: center
          .item-icon
            width: 22px
            height: 22px
            margin-bottom: 6px
          .item-txt
            font-size: $font-size-10
            font-family: $font-family-regular
            color: $color-text-main
      .right-box
        reset-button()
        flex: 1
        overflow: hidden
        height: 40px
        line-height: 40px
        font-size: $font-size-14
        font-family: $font-family-medium
        color: $color-white
        button-style(normal, 22.5px, goods)
      .outSide.right-box
        margin-right: 10px
      .un-click.right-box
        margin-right: 10px
        button-style(un-click, 22.5px, goods)
</style>
