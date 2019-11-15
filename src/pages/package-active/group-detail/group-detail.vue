<template>
  <div class="group-detail">
    <navigation-bar :title="title"></navigation-bar>
    <div class="group-goods">
      <div class="shop-msg">
        <div class="left">
          <img src="/static/images/icon-house-order@2x.png" class="shop-icon" />
          <div class="shop-name">{{groupDetail.shop_data ? groupDetail.shop_data.name : ''}}</div>
<!--          <img src="/static/images/arrow@2x.png" class="arrow-icon" />-->
        </div>
      </div>
      <div class="goods-msg" @click="toDetail">
        <img :src="groupDetail.image_url ? groupDetail.image_url : groupDetail.goods ? groupDetail.goods.goods_cover_image : ''" class="left-img" mode="aspectFill">
        <div class="right">
          <div class="center-msg">
            <div class="msg-title">{{groupDetail.name}}</div>
            <div class="msg-down"><span class="money-txt"><span class="money-icon">¥</span>{{groupDetail.price}}</span></div>
          </div>
          <img src="/static/images/arrow@2x.png" class="right-arrow" />
        </div>
      </div>
    </div>
    <div class="f4-line"></div>
    <div class="group-status-box">
      <div class="group-status">
        <img :src="'/static/images/' + (statusList[statusNum] ? statusList[statusNum].icon : '')" v-if="imageUrl && statusList[statusNum]" class="status-icon">
        <div class="status-txt">{{statusList[statusNum] ? statusList[statusNum].txt : ''}}</div>
      </div>
      <div class="avatar-list">
        <div class="avatar-box" v-for="(item, index) in groupAvatarList" :key="index">
          <img class="avatar-img" :src="item.avatar" v-if="item.avatar" />
          <img class="avatar-icon" src="./pic-_@2x.png" v-if="!item.avatar" />
        </div>
      </div>
      <button open-type="share" hover-class="none" class="group-btn" v-if="statusNum === 1" @click="sharePeople">邀请好友参团</button>
      <div class="group-btn" v-if="statusNum === 2" @click="toOrderDetail">查看订单详情</div>
      <div class="group-btn" v-if="statusNum === 3 || statusNum === 5" @click="toShop">查看更多精彩</div>
      <div class="group-btn" v-if="statusNum === 4" @click="joinGroup">我要参团</div>
    </div>
    <payment ref="payment" @groupPaySuccess="paySuccess"></payment>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable */
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Payment from '@components/payment/payment'
  import AppPromise from '@utils/app-promise'
  import { SCENE_SHARE, SCENE_DEFAULT, SCENE_QR_CODE } from '@utils/contants'

  const PAGE_NAME = 'GROUP_DETAIL'
  const STATUSOBJ = {
    1: {icon: 'icon-group_ing@2x.png', txt: '拼团中'},
    2: {icon: 'icon-group_success@2x.png', txt: '拼团成功'},
    3: {icon: 'icon-group_fail@2x.png', txt: '拼团失败'},
    4: {icon: 'icon-group_ing@2x.png', txt: '拼团中'},
    5: {icon: 'icon-group_over@2x.png', txt: '拼团结束'}
  }
  const EVENT_NO_CONFIG = {
    [SCENE_QR_CODE]: 1006,
    [SCENE_SHARE]: 1006,
    [SCENE_DEFAULT]: 1007
  }

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Payment
    },
    computed: {
      statusNum() {
        let status = false
        if (this.groupDetail.in_group) {
          switch (this.groupDetail.status * 1) {
            case 0:
              status = 1
              break
            case 1:
              status = 2
              break
            case 2:
              status = 3
              break
          }
        } else {
          switch (this.groupDetail.status * 1) {
            case 1:
            case 2:
              status = 5
              break
            case 0:
              status = 4
              break
          }
        }
        return status
      }
    },
    data() {
      return {
        imageUrl: this.$imageUrl,
        statusList: STATUSOBJ,
        groupAvatarList: [],
        id: '',
        groupDetail: {},
        title: '拼团详情',
        eventConfig: EVENT_NO_CONFIG, // 事件号配置
        eventNo: '' // 雷达事件号
      }
    },
    onPullDownRefresh() {
      this.$refs.payment && this.$refs.payment.hideOrder()
      this._getGroupDetail()
    },
    onShareAppMessage (res) {
      let nickName = wx.getStorageSync('userInfo').nickname
      let title = `【${nickName || ''}@我】超划算，快来和我一起拼团吧↓↓↓`
      let shopId = wx.getStorageSync('shopId')
      let path = `${this.$routes.active.GROUP_DETAIL}?shopId=${shopId}&id=${this.id}`
      this.$sendMsg({
        event_no: 1011,
        title: this.groupDetail.name
      })
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title,
        path,
        imageUrl:  (this.groupDetail.share_image_url || this.groupDetail.activity_image_url) || this.goodsDetail.goods.goods_cover_image
      }
    },
    onLoad(options) {
      if (options) {
        this.id = options.id
      }
      AppPromise.getInstance().then(res => {
        this._getGroupDetail(res => {
          this._setEventNo()
          this.$sendMsg({
            event_no: this.eventNo,
            title: res.data.name
          })
        })
      })
    },
    methods: {
      // 获取拼团详情
      _getGroupDetail(callback) {
        API.Active.getAnyGroupDetail({
          data: {
            team_id: this.id
          }
        }).then(res => {
          this.groupDetail = res.data
          this.groupAvatarList = []
          for (let i = 0; i < this.groupDetail.number; i++) {
            if (this.groupDetail.groupon_members[i]) {
              this.groupAvatarList.push(this.groupDetail.groupon_members[i])
            } else {
              this.groupAvatarList.push({})
            }
          }
          if (typeof callback === 'function') {
            callback(res)
          }
        })
      },
      // 跳转拼团商品详情
      toDetail() {
        let url = `${this.$routes.active.GROUP_GOODS_DETAIL}?&goodsId=${this.groupDetail.goods_id}&activeId=${this.groupDetail.promotion_id}`
        wx.navigateTo({ url })
      },
      // 拼团分享
      sharePeople() {
      },
      // 跳转订单详情
      toOrderDetail() {
        let url = `${this.$routes.personal.SERVICE_ORDER_DETAIL}?id=${this.groupDetail.order_id}`
        wx.navigateTo({ url })
      },
      toShop() {
        let url = `${this.$routes.main.SHOP}`
        wx.switchTab({ url })
      },
      async joinGroup() {
        let tokenCheck = await this.$checkToken()
        if (!tokenCheck) return
        API.Active.checkGroupJoin({
          data: {
            goods_id: this.groupDetail.goods_id,
            promotion_id: this.groupDetail.promotion_id,
            team_id: this.groupDetail.id
          },
          loading: false
        }).then(res => {
          this.$sendMsg({
            event_no: 1008,
            title: this.groupDetail.name
          })
          this.payOrderMsg()
        })
      },
      payOrderMsg() {
        let userInfo = wx.getStorageSync('userInfo')
        let paymentMsg = {
          price: this.groupDetail.price,
          originPrice: this.groupDetail.goods.price,
          image: this.groupDetail.image_url || this.groupDetail.goods.goods_cover_image,
          title: this.groupDetail.name,
          stock: this.groupDetail.stock,
          goods_id: this.groupDetail.goods_id,
          promotion_id: this.groupDetail.promotion_id,
          phoneNum: userInfo.mobile,
          groupType: 'join',
          groupJoinId: this.id,
          noJump: true // 是否跳转页面
        }
        this.$refs.payment.showOrder(paymentMsg, 'group')
      },
      paySuccess() {
        this.$wechat.showLoading()
        setTimeout(() => {
          this._getGroupDetail()
          this.$wechat.hideLoading()
          this.$refs.payment && this.$refs.payment.hideOrder()
        }, 2000)
      },
      // 设置AI雷达事件号
      _setEventNo() {
        let entryAppType = wx.getStorageSync('entryAppType')
        this.eventNo = this.eventConfig[entryAppType]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/private.styl"

  .group-detail
    width: 100vw
    min-height: 100vh
    background: $color-white
    .f4-line
      width: 100%
      height: 10px
      background: $color-background
    .group-goods
      padding: 0 15px
      .shop-msg
        display: flex
        align-items: center
        padding-top: 15px
        height: 24px
        .left
          display: flex
          align-items: center
          height: 24px
        .shop-icon
          width: 18px
          height: 18px
        .shop-name
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-16
          letter-spacing: 0.6px
          line-height: 24px
          margin: 0 5px 0 6px
        .arrow-icon
          width: 13px
          height: 13px
      .goods-msg
        display: flex
        font-size: 0
        height: 110px
        align-items: center
        .left-img
          width: 75px
          height: 75px
          margin-right: 10px
        .right
          height: 75px
          flex: 1
          overflow: hidden
          display: flex
          align-items: center
          .center-msg
            flex: 1
            height: 70px
            display: flex
            flex-direction: column
            justify-content: space-between
            overflow: hidden
            .msg-title
              font-family: $font-family-regular
              font-size: $font-size-14
              line-height: 21px
              max-height: 42px
              color: $color-text-main
              letter-spacing: 0.3px
              white-space: normal
              word-break: break-all
              overflow : hidden
              text-overflow: ellipsis
              display: -webkit-box
              -webkit-line-clamp: 2
              -webkit-box-orient: vertical
            .msg-down
              font-family: $font-family-regular
              font-size: $font-size-14
              color: $color-text-main
              .money-txt
                font-family: $font-family-medium
                font-size: $font-size-16
                color: $color-text-main
                .money-icon
                  font-size: $font-size-11
                  color: $color-text-main
                  margin-right: 1px
          .right-arrow
            width: 13px
            height: 13px
            margin-left: 20px

    .group-status-box
      display: flex
      flex-direction: column
      align-items: center
      .group-status
        width: 100%
        display: flex
        flex-direction: column
        align-items: center
        font-size: 0
        .status-icon
          width: 60px
          height: 50px
          padding-top: 42px
        .status-txt
          font-size: $font-size-16
          font-family: $font-family-regular
          color: $color-text-main
          margin-top: 6px
      .avatar-list
        padding: 25px 0 40px
        display: flex
        justify-content: center
        .avatar-box
          width: 12vw
          height: 12vw
          box-sizing: border-box
          border: 0.5px solid #E8EAEE
          border-radius: 50%
          overflow: hidden
          margin-right: 8vw
          position: relative
          font-size: 0
          &:last-child
            margin-right: 0
          .avatar-img
            width: 100%
            height: 100%
          .avatar-icon
            width: 9px
            height: 13.5px
            all-center()
      .group-btn
        reset-button()
        width: 140px
        height: 42px
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 42px
        color: $color-white
        button-style(normal, 21px)

</style>
