<template>
  <div class="group-goods-detail">
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
        <div class="left">
          <div class="group-box">{{activeDetail.number}}人团</div>
        </div>
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
        <div class="goods-title" @click="test">{{activeDetail.name}}</div>
        <div class="goods-money-box">
          <span class="big-money-box"><span class="red-money-icon">¥</span><span class="red-big-money">{{activeDetail.price}}</span></span>
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
    <div class="group-list-box">
      <div class="list-head border-bottom-1px">小伙伴们在开团，可直接参与</div>
      <swiper v-if="groupOrderList[0] && groupOrderList[0].length > 1" class="list-content" autoplay circular :vertical="true" interval="4000">
        <block v-for="(item, index) in groupOrderList" :key="index">
          <swiper-item class="group-list-swiper">
            <view class="group-swiper-item" v-for="(item1, index1) in item" :key="index1">
              <view class="group-swiper-item-left">
                <view class="group-swiper-item-avatar-box">
                  <img class="group-swiper-item-avatar" :src="item1.avatar">
                </view>
                <view class="group-swiper-item-name">{{item1.nickname}}</view>
              </view>
              <view class="group-swiper-item-right">
                <view class="group-swiper-time">
                  <view class="group-swiper-txt">
                    <text>还差</text>
                    <text class="red-num">{{item1.remaining_number}}人</text>
                    <text>拼成</text>
                  </view>
                  <view class="group-swiper-time-txt">剩余{{item1.endTime}}</view>
                </view>
                <view class="group-swiper-item-btn" @click="joinGroup(item1.id)">去参团</view>
              </view>
            </view>
          </swiper-item>
        </block>
      </swiper>
      <section v-if="groupOrderList[0] && groupOrderList[0].length === 1" class="list-content h-66">
        <block v-for="(item, index) in groupOrderList" :key="index">
          <div class="group-list-swiper">
            <view v-if="index1===0" class="group-swiper-item" v-for="(item1, index1) in item" :key="index1">
              <view class="group-swiper-item-left">
                <view class="group-swiper-item-avatar-box">
                  <img class="group-swiper-item-avatar" :src="item1.avatar">
                </view>
                <view class="group-swiper-item-name">{{item1.nickname}}</view>
              </view>
              <view class="group-swiper-item-right">
                <view class="group-swiper-time">
                  <view class="group-swiper-txt">
                    <text>还差</text>
                    <text class="red-num">{{item1.remaining_number}}人</text>
                    <text>拼成</text>
                  </view>
                  <view class="group-swiper-time-txt">剩余{{item1.endTime}}</view>
                </view>
                <view class="group-swiper-item-btn" @click="joinGroup(item1.id)">去参团</view>
              </view>
            </view>
          </div>
        </block>
      </section>
      <div class="list-content" v-if="!groupOrderList.length">
        <div class="nothing">暂无参团信息~</div>
      </div>
      <div class="list-foot border-top-1px" @click="showRule('group')">
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
      <form class="right-box outSide" report-submit @submit="$getFormId" v-if="!startTime && activeDetail.stock">
        <button hover-class="none" formType="submit" class="right-box" @click="openGroup" v-if="!startTime && activeDetail.stock">¥ {{activeDetail.price}} 开团</button>
      </form>
      <div class="right-box un-click" v-if="!startTime && activeDetail.stock == 0">已抢光</div>
    </div>
    <payment ref="payment" @groupPaySuccess="paySuccess"></payment>
    <activity-role ref="role"></activity-role>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable */
  // import * as Helpers from './helpers'
  import HTTP from '@utils/http'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import DetailContent from '@components/detail-content/detail-content'
  import ActivityRole from '@components/activity-role/activity-role'
  import Payment from '@components/payment/payment'
  import ServeHandle from '@mixins/serve-detail'
  import AppPromise from '@utils/app-promise'
  import { resolveQueryScene } from '@utils/common'
  import { SCENE_SHARE, SCENE_DEFAULT, SCENE_QR_CODE } from '@utils/contants'

  const PAGE_NAME = 'GROUP_GOODS_DETAIL'
  const EVENT_NO_CONFIG = {
    [SCENE_QR_CODE]: 1006,
    [SCENE_SHARE]: 1006,
    [SCENE_DEFAULT]: 1007
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
    data() {
      return {
        reqGoodsId: '', // 商品id
        reqActiveId: '', // 活动id
        groupOrderList: [], // 开团轮播列表
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
      let title = `【${nickName || ''}@我】超划算，快来和我一起拼团吧↓↓↓`
      let shopId = wx.getStorageSync('shopId')
      let path = `${this.$routes.active.GROUP_GOODS_DETAIL}?shopId=${shopId}&goodsId=${this.reqGoodsId}&activeId=${this.reqActiveId}`
      this.$sendMsg({
        event_no: 1011,
        title: this.activeDetail.name
      })
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title,
        path,
        imageUrl:  (this.activeDetail.share_image_url || this.activeDetail.image_url) || this.goodsDetail.goods_cover_image
      }
    },
    onShow() {
      if (!this.refresh) return
      this.refresh = false
      AppPromise.getInstance().then(res => {
        this._getActiveDetail()
      })
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
    methods: {
      test() {
        HTTP.setHeaders({ Authorization: '' })
        wx.setStorageSync('token', '')
        wx.setStorageSync('userInfo', '')
      },
      // 获取拼团活动详情
      _getActiveDetail(callback) {
        API.Active.getGroupGoodsDetail({
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
          let groupList = res.data.open_groupon_list
          let first = groupList.slice(0, 2)
          let second = groupList.slice(2, 4)
          let third = groupList.slice(4, 6)
          let four = groupList.slice(6, 8)
          this.groupOrderList = [first, second, third, four].filter((item) => {
            return item.length > 0
          })
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
      // 活动规则
      showRule(type) {
        this.$refs.role && this.$refs.role.showModel(type)
      },
      // 定时器开始执行
      _runTimer() {
        clearInterval(this.timer)
        this.activityTime = this._runDiffTime(this.currentTime, this.endTime)
        this.groupOrderList = this.groupOrderList.map((item) => {
          item.map((item) => {
            let endTime = this._runDiffTimeNoDay(this.currentTime, item.remaining_time_timestamp)
            item.endTime = `${endTime.hour}:${endTime.minute}:${endTime.second}`
            return item
          })
          return item
        })
        this.timer = setInterval(() => {
          this.currentTime++
          this.activityTime = this._runDiffTime(this.currentTime, this.endTime)
          this.groupOrderList = this.groupOrderList.map((item) => {
            item.map((item) => {
              let endTime = this._runDiffTimeNoDay(this.currentTime, item.remaining_time_timestamp)
              item.endTime = `${endTime.hour}:${endTime.minute}:${endTime.second}`
              return item
            })
            return item
          })
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
      // 计算两个值的差值 没有天
      _runDiffTimeNoDay(start, end) {
        let differ = end * 1 - start * 1
        let hour = Math.floor(differ / (60 * 60))
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
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
        }
        return times
      },
      // 开团
      async openGroup() {
        let tokenCheck = await this.$checkToken()
        if (!tokenCheck) return
        API.Active.checkGroupOpen({
          data: {
            goods_id: this.reqGoodsId,
            promotion_id: this.reqActiveId
          },
          loading: false
        }).then(res => {
          this.$sendMsg({
            event_no: 1009,
            title: this.activeDetail.name
          })
          this.payOrderMsg('open')
        })
      },
      // 参团
      async joinGroup(groupJoinId) {
        let tokenCheck = await this.$checkToken()
        if (!tokenCheck) return
        API.Active.checkGroupJoin({
          data: {
            goods_id: this.reqGoodsId,
            promotion_id: this.reqActiveId,
            team_id: groupJoinId
          },
          loading: false
        }).then(res => {
          this.$sendMsg({
            event_no: 1008,
            title: this.activeDetail.name
          })
          this.payOrderMsg('join', groupJoinId)
        })
      },
      // 点击分享
      serveShare() {
        API.Active.setGroupShare({
          data: {
            goods_id: this.reqGoodsId,
            promotion_id: this.reqActiveId
          },
          loading: false,
          toast: false
        })
      },
      payOrderMsg(groupType = 'open', groupJoinId) {
        let userInfo = wx.getStorageSync('userInfo')
        let paymentMsg = {
          price: this.activeDetail.price,
          originPrice: this.goodsDetail.price,
          image: this.activeDetail.image_url || this.goodsDetail.goods_cover_image,
          title: this.activeDetail.name,
          stock: this.activeDetail.stock,
          goods_id: this.reqGoodsId,
          promotion_id: this.reqActiveId,
          phoneNum: userInfo.mobile,
          groupType,
          groupJoinId: groupJoinId || ''
        }
        this.$refs.payment.showOrder(paymentMsg, 'group')
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

  .group-goods-detail
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

    .group-list-box
      padding-left: 15px
      background: $color-white
      .list-head
        line-height: 52px
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
        letter-spacing: 0.8px
      .list-content
        height: 132px
        padding-right: 15px
        &.h-66
          height: 66px
        .nothing
          text-align: center
          padding-top: 50px
          font-family: $font-family-regular
          font-size: $font-size-16
        .group-list-swiper
          width: 100%
          height: 100%
          .group-swiper-item
            height: 66px
            display: flex
            align-items: center
            justify-content: space-between
            .group-swiper-item-left
              flex: 1
              overflow: hidden
              display: flex
              height: 66px
              align-items: center
              .group-swiper-item-avatar-box
                width: 39px
                height: 39px
                box-sizing: border-box
                border: 1px solid $color-white
                border-radius: 50%
                overflow: hidden
                margin-right: 10px
                .group-swiper-item-avatar
                  width: 100%
                  height: 100%
              .group-swiper-item-name
                flex: 1
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                font-size: $font-size-14
                font-family: $font-family-medium
                letter-spacing: 0.3px
            .group-swiper-item-right
              display: flex
              height: 66px
              align-items: center
              .group-swiper-time
                width: 76px
                .group-swiper-txt
                  font-size: $font-size-12
                  margin-bottom: 4px
                  .red-num
                    margin: 0 2px
                    color: $color-money
                .group-swiper-time-txt
                  font-size: $font-size-12
              .group-swiper-item-btn
                margin-left: 10px
                width: 80px
                height: 32px
                border-radius: 16px
                line-height: 32px
                text-align: center
                font-family: $font-family-regular
                font-size: $font-size-14
                color: $color-white
                button-style(normal, 16px)

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
          margin-right: 3px
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
        font-size: $font-size-16
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
        .right-btn
          reset-button()
          display: flex
          flex-direction: column
          align-items: center
          justify-content: center
          border-radius: 22.5px
          height: 40px
          color: $color-white
        .black.right-btn
          flex: 6
          background: $color-455A64
          margin-right: 15px
          &:active
            background: #374850
          .btn-top
            font-family: $font-family-medium
            font-size: $font-size-16
            margin-bottom: 2px
          .btn-down
            font-family: $font-family-regular
            font-size: $font-size-12
        .red.right-btn
          flex: 4
          button-style(normal, 22.5px)
          margin-right: 15px
          font-size: $font-size-14
          font-family: $font-family-medium
</style>
