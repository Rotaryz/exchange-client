<template>
  <div class="bargain-goods-detail">
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
      <div class="time-box">
        <div class="left"></div>
        <div class="right">
          <span>距离活动{{startTime ? '开始' : '结束'}}还剩: </span>
          <text class="time-txt">{{activityTime.day}}</text>
          <span>天</span>
          <text class="time-txt">{{activityTime.hour}}</text>
          <span>时</span>
          <text class="time-txt">{{activityTime.minute}}</text>
          <span>分</span>
          <text class="time-txt">{{activityTime.second}}</text>
          <span>秒</span>
        </div>
      </div>
    </div>
    <div class="goods-msg">
      <div class="goods-msg-left">
        <div class="goods-title">{{activeDetail.name}}</div>
        <div class="goods-money-box">
          <span class="big-money-box"><span class="red-money-icon">¥</span><span class="red-big-money">{{activeDetail.current_price}}</span></span>
          <span class="del-money">¥{{goodsDetail.price}}</span>
        </div>
      </div>
      <div class="goods-msg-right">
        <div class="right-box-container" @click="showShareModel">
          <form report-submit class="right-form-box" @submit="$getFormId">
            <button open-type="share" hover-class="none" class="right-box-share" @click="serveShare">
              <img src="/static/images/icon-share_xq@2x.png" class="msg-right-icon">
            </button>
          </form>
          <span class="msg-right-txt">{{activeDetail.share_count}}人分享</span>
        </div>
      </div>
    </div>
    <div class="f4-line"></div>
    <div class="bargain-box">
      <div class="list-head border-bottom-1px">参与砍价{{activeDetail.join_count ? ' (' + activeDetail.join_count + '人)' : ''}}</div>
      <div class="avatar-list" v-if="bargainList.length">
        <img :src="item" class="avatar-item" v-for="(item, index) in bargainList" :key="index">
      </div>
      <div class="list-content" v-if="!bargainList.length">
        <div class="nothing">暂无砍价信息~</div>
      </div>
      <div class="list-foot border-top-1px" @click="showRule('bargain')">
        <div class="left">玩法详情</div>
        <img src="/static/images/arrow@2x.png" class="right">
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
      <div class="right-box un-click" v-if="startTime">活动未开始</div>
      <form class="right-box outSide" report-submit @submit="$getFormId" v-if="bargainStatus1">
        <button hover-class="none" formType="submit" class="right-box" @click="cutBargain" v-if="bargainStatus1">去砍价</button>
      </form>
      <form class="right-box outSide" report-submit @submit="$getFormId" v-if="bargainStatus2">
        <button hover-class="none" formType="submit" class="right-box" @click="payOrderMsg" v-if="bargainStatus2">底价 ¥ {{activeDetail.bottom_price}}立即购买</button>
      </form>
      <div class="right-box un-click" v-if="!startTime && activeDetail.stock == 0">已抢光</div>
      <div class="two-right-box" v-if="bargainStatus3">
        <div class="right-btn black" @click="payOrderMsg">
          <span class="btn-top"><span class="money-icon">¥</span>{{activeDetail.current_price}}</span>
          <span class="btn-down">立即购买</span>
        </div>
        <button open-type="share" hover-class="none" class="right-btn red" @click="kanShare">拉朋友砍</button>
      </div>
    </div>
    <div class="bargain-model-cover" :class="{'show' : bargainModelShow}" @click.stop="hideBargain">
      <div class="bargain-model-container" :class="{'show' : bargainModelShow}">
        <img src="./pic-bargaining_succeess@2x.png" class="bg-img">
        <div class="bargain-msg-content">
          <p class="red-title">砍价成功</p>
          <p class="msg-txt">恭喜你成功帮自己砍掉<span class="red-money"><span class="big-money">{{cutMoney}}</span>元</span></p>
          <p class="msg-txt">人多力量大，拉朋友一起砍吧</p>
        </div>
        <img src="/static/images/icon-del@2x.png" v-if="imageUrl" class="close-btn" @click.stop="hideBargain">
      </div>
    </div>
    <payment ref="payment" @bargainPaySuccess="paySuccess"></payment>
    <activity-role ref="role"></activity-role>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable */
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import DetailContent from '@components/detail-content/detail-content'
  import ActivityRole from '@components/activity-role/activity-role'
  import Payment from '@components/payment/payment'
  import ServeHandle from '@mixins/serve-detail'
  import AppPromise from '@utils/app-promise'
  import { resolveQueryScene } from '@utils/common'
  import { SCENE_SHARE, SCENE_DEFAULT, SCENE_QR_CODE } from '@utils/contants'

  const PAGE_NAME = 'BARGAIN_GOODS_DETAIL'
  const EVENT_NO_CONFIG = {
    [SCENE_QR_CODE]: 1012,
    [SCENE_SHARE]: 1012,
    [SCENE_DEFAULT]: 1013
  }

  export default {
    name: PAGE_NAME,
    mixins: [ServeHandle],
    components: {
      NavigationBar,
      DetailContent,
      ActivityRole,
      Payment
    },
    computed: {
      // 按钮 去砍价 ---  活动已开始且未结束、库存不为0、未参与砍价、还有剩余砍价刀数
      bargainStatus1() {
        if (!this.activeDetail.stock || this.activeDetail.is_cuted || !this.activeDetail.left_cut_num) {
          return false
        }
        return !this.startTime && !this.timeEnd && this.activeDetail.stock && !this.activeDetail.is_cuted && this.activeDetail.left_cut_num
      },
      // 按钮 底价购买 --- 活动已开始且未结束、库存不为0、没有剩余刀数、已到底价
      bargainStatus2() {
        if (!this.activeDetail.stock || this.activeDetail.left_cut_num || !this.activeDetail.bottom_price || !this.activeDetail.current_price) {
          return false
        }
        return !this.startTime && !this.timeEnd && this.activeDetail.stock && !this.activeDetail.left_cut_num && (+this.activeDetail.bottom_price === +this.activeDetail.current_price)
      },
      // 按钮 购买 + 拉朋友砍价 --- 活动已开始且未结束、库存不为0、已参与砍价、还有剩余砍价刀数、未到底价
      bargainStatus3() {
        if (!this.activeDetail.stock || !this.activeDetail.is_cuted || !this.activeDetail.left_cut_num || !this.activeDetail.bottom_price || !this.activeDetail.current_price) {
          return false
        }
        return !this.startTime && !this.timeEnd && this.activeDetail.stock && this.activeDetail.is_cuted && this.activeDetail.left_cut_num && (+this.activeDetail.bottom_price !== +this.activeDetail.current_price)
      }
    },
    data() {
      return {
        reqGoodsId: '', // 商品id
        reqActiveId: '', // 活动id
        bargainList: [], // 砍价客户列表
        activeDetail: {}, // 活动详情
        activityTime: {
          day: '00',
          hour: '00',
          minute: '00',
          second: '00'
        },
        startTime: '', // 活动开始时间戳
        currentTime: '', // 活动当前时间戳
        endTime: '', // 活动结束时间戳
        timeEnd: false, // 倒计时是否结束
        bargainModelShow: false, // 砍价结果弹窗是否显示
        cutMoney: '', // 砍一刀金额
        eventConfig: EVENT_NO_CONFIG // 事件号配置
      }
    },
    onPullDownRefresh() {
      this.$refs.payment && this.$refs.payment.hideOrder()
      this.$refs.role && this.$refs.role.closeCover()
      this._getActiveDetail()
      wx.stopPullDownRefresh()
    },
    onShareAppMessage(res) {
      let nickName = wx.getStorageSync('userInfo').nickname
      let title = `【${nickName || ''}@我】就差你一刀，帮我砍一下↓↓↓`
      let shopId = wx.getStorageSync('shopId')
      let path = `${this.$routes.active.BARGAIN_GOODS_DETAIL}?shopId=${shopId}&goodsId=${this.reqGoodsId}&activeId=${this.reqActiveId}`
      this.$sendMsg({
        event_no: 1016,
        title: this.activeDetail.name
      })
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title: title,
        path,
        imageUrl: (this.activeDetail.share_image_url || this.activeDetail.image_url) || this.goodsDetail.goods_cover_image
      }
    },
    onLoad(options) {
      if (options) {
        if (options.scene) {
          // 小程序扫码进来
          let query = resolveQueryScene(options.query.scene)
          this.reqGoodsId = query.goodsId || ''
          this.reqActiveId = query.activeId || ''
        } else {
          // 普通参数进来
          this.reqGoodsId = options.goodsId || ''
          this.reqActiveId = options.activeId || ''
        }
      }
      AppPromise.getInstance().then(res => {
        this._getActiveDetail(res => {
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
      this._getActiveDetail()
    },
    methods: {
      // 获取砍价活动详情
      _getActiveDetail(callback) {
        API.Active.getBargainDetail({
          data: {
            promotion_id: this.reqActiveId,
            goods_id: this.reqGoodsId
          },
          loading: this.firstLoading
        }).then(res => {
          if (this.firstLoading) {
            this.firstLoading = false
          }
          this.activeDetail = res.data
          this.goodsDetail = res.data.goods
          this.bargainList = res.data.join_list
          this.startTime = res.data.start_at_timestamp || ''
          this.endTime = res.data.end_at_timestamp
          this.currentTime = res.data.current_timestamp
          this._setTitle(res.data.name)
          if (this.startTime) {
            this._runTimerBefore()
          } else {
            this._runTimer()
          }
          if (res.data.image_url) {
            this.bannerImgs = [{image_url: res.data.image_url}, ...this.goodsDetail.goods_banner_images]
          }
          if (typeof callback === 'function') {
            callback(res)
          }
        })
      },
      // 砍一刀
      async cutBargain() {
        let tokenCheck = await this.$checkToken()
        if (!tokenCheck) return
        API.Active.cutBargain({
          data: {
            promotion_id: this.reqActiveId,
            goods_id: this.reqGoodsId
          }
        }).then(res => {
          this.$sendMsg({
            event_no: 1014,
            title: this.activeDetail.name,
            total: res.data.cut_money
          })
          this.cutMoney = res.data.cut_money
          this.bargainModelShow = true
          this._getActiveDetail()
        })
      },
      // 定时器开始执行
      _runTimer() {
        clearInterval(this.timer)
        this.activityTime = this._runDiffTime(this.currentTime, this.endTime)
        this.timer = setInterval(() => {
          this.currentTime++
          this.activityTime = this._runDiffTime(this.currentTime, this.endTime)
          if (this.timeEnd) {
            this._getActiveDetail()
            clearInterval(this.timer)
          }
        }, 1000)
      },
      // 定时器开始执行 活动未开始
      _runTimerBefore() {
        clearInterval(this.timer)
        this.activityTime = this._runDiffTime(this.currentTime, this.startTime)
        this.timer = setInterval(() => {
          this.currentTime++
          this.activityTime = this._runDiffTime(this.currentTime, this.startTime)
          if (this.timeEnd) {
            this._getActiveDetail()
            clearInterval(this.timer)
          }
        }, 1000)
      },
      // 计算两个值的差值
      _runDiffTime(start, end) {
        let differ = end * 1 - start * 1
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
          this.timeEnd = true
          this.startTime = 0
          this.currentTime = 0
        }
        return times
      },
      // 活动规则
      showRule(type) {
        this.$refs.role && this.$refs.role.showModel(type)
      },
      // 关闭砍价弹窗
      hideBargain() {
        this.bargainModelShow = false
      },
      // 点击分享
      serveShare() {
        this.refresh = true
        API.Active.setBargainShare({
          data: {
            goods_id: this.reqGoodsId,
            promotion_id: this.reqActiveId
          },
          loading: false,
          toast: false
        })
      },
      async payOrderMsg() {
        let tokenCheck = await this.$checkToken()
        if (!tokenCheck) return
        let userInfo = wx.getStorageSync('userInfo')
        let paymentMsg = {
          price: this.activeDetail.current_price,
          originPrice: this.goodsDetail.price,
          image: this.activeDetail.image_url || this.goodsDetail.goods_cover_image,
          title: this.activeDetail.name,
          stock: 1,
          goods_id: this.reqGoodsId,
          promotion_id: this.reqActiveId,
          phoneNum: userInfo.mobile
        }
        this.$refs.payment.showOrder(paymentMsg, 'bargain')
      },
      paySuccess() {
        this._getActiveDetail()
        this.$refs.payment && this.$refs.payment.hideOrder()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/private.styl"

  .bargain-goods-detail
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
        bottom: 50px
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
      .time-box
        width: 100vw
        height: 40px
        background: rgba(254,112,98,0.8)
        position: absolute
        left: 0
        bottom: 0
        display: flex
        justify-content: space-between
        align-items: center
        .left
          margin-left: 15px
          .group-box
            width: 46px
            height: 20px
            text-align: center
            line-height: 18px
            box-sizing: border-box
            border: 1px solid $color-white
            border-radius: 10px
            font-size: $font-size-12
            font-family: $font-family-regular
            color: $color-white
        .right
          color: $color-white
          font-family: $font-family-regular
          font-size: $font-size-14
          margin-right: 15px
          .time-txt
            font-family: DINAlternate-Bold
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

    .bargain-box
      padding-left: 15px
      .list-head
        line-height: 52px
        font-family: PingFangSC-Medium
        font-size: $font-size-16
        color: $color-text-main
        letter-spacing: 0.8px
      .list-content
        padding-right: 15px
        .nothing
          text-align: center
          line-height: 60px
          font-family: $font-family-regular
          font-size: $font-size-16
      .avatar-list
        font-size: 0
        padding: 5px 0 15px
        .avatar-item
          width: 9.07vw
          height: 9.07vw
          border-radius: 50%
          margin-top: 10px
          background: $color-background
          box-sizing: border-box
          &:not(:nth-child(8n))
            margin-right: 2.67vw
      .list-foot
        height: 45px
        padding-right: 15px
        display: flex
        align-items: center
        justify-content: flex-end
        .left
          font-family: PingFangSC-Regular
          font-size: $font-size-14
          color: $color-text-sub
          margin-right: 8px
        .right
          width: 13px
          height: 13px
          margin-top: 2px

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
        button-style(normal, 22.5px)
      .outSide.right-box
        margin-right: 10px
      .un-click.right-box
        margin-right: 10px
        button-style(un-click, 22.5px)
      .two-right-box
        flex: 1
        overflow: hidden
        display: flex
        align-items: center
        border-radius: 22.5px
        box-sizing: border-box
        border: 1px solid $color-money
        margin-right: 15px
        height: 40px
        .right-btn
          reset-button()
          height: 40px
          display: flex
          flex-direction: column
          align-items: center
          justify-content: center
          background: $color-money
        .black.right-btn
          flex: 1
          background: $color-white
          color: $color-money
          .btn-top
            font-family: $font-family-regular
            font-size: $font-size-16
            margin-bottom: 2px
            .money-icon
              margin-right: 2px
          .btn-down
            font-family: $font-family-regular
            font-size: $font-size-12
        .red.right-btn
          flex: 1
          color: $color-white
          font-size: $font-size-14
          font-family: $font-family-regular
    .bargain-model-cover
      position: fixed
      left: 0
      top: 0
      bottom: 0
      right: 0
      z-index: -1
      opacity: 0
      background: rgba(31,31,31,0.8)
      display: flex
      justify-content: center
      align-items: center
      transition: all 0.3s
      &.show
        z-index: 10
        opacity: 1
      .bargain-model-container
        width: 300px
        height: 205px
        overflow: hidden
        position: relative
        opacity: 0
        transition: all 0.3s
        &.show
          opacity: 1
        .bg-img
          width: 100%
          height: 100%
          position: absolute
          left: 0
          top: 0
        .bargain-msg-content
          width: 100%
          height: 100%
          position: absolute
          left: 0
          top: 0
          >p
            text-align: center
          .red-title
            padding-top: 100px
            font-family: $font-family-medium
            font-size: $font-size-16
            color: $color-money
            letter-spacing: 0.8px
            margin-bottom: 15px
          .msg-txt
            font-family: $font-family-regular
            line-height: 21px
            color: $color-text-main
            font-size: $font-size-14
            .red-money
              color: $color-money
              margin-left: 3px
              .big-money
                font-family: $font-family-medium
                font-size: $font-size-18
          .coupon-content
            width: 270px
            height: 78px
            position: absolute
            bottom: 12px
            left: 15px
            display: flex
            align-items: center
            .left
              width: 195px
              height: 50px
              display: flex
              align-items: center
              .left-img
                width: 50px
                height: 50px
                margin-left: 15px
                margin-right: 9px
              .left-msg
                flex: 1
                height: 46px
                overflow: hidden
                display: flex
                flex-direction: column
                justify-content: space-between
                .left-msg-title
                  font-family: $font-family-medium
                  font-size: $font-size-14
                  width: 100%
                  overflow: hidden
                  text-overflow: ellipsis
                  white-space: nowrap
                  color: $color-white
                .left-msg-time
                  font-family: $font-family-regular
                  font-size: $font-size-12
                  width: 100%
                  overflow: hidden
                  text-overflow: ellipsis
                  white-space: nowrap
                  color: $color-white
            .right
              width: 75px
              height: 100%
              display: flex
              align-items: center
              justify-content: center
              .right-button
                width: 60px
                height: 24px
                border-radius: 12px
                line-height: 24px
                text-align: center
                font-family: $font-family-regular
                font-size: $font-size-12
              .right-button.gold
                background: $color-FFEEC3
                color: #935A1d
              .right-button.white
                background: $color-white
                color: $color-ED2C2B
              .right-button.ccc
                background: rgba(255, 255, 255, 0.6)
                color: $color-D2D2D2
        .close-btn
          width: 12px
          height: 12px
          padding: 10px
          position: absolute
          right: 5px
          top: 30px

</style>
