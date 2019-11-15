<template>
  <div class="bargain-detail">
    <navigation-bar ref="nav"></navigation-bar>
    <div class="goods-img">
      <img class="goods-img-banner" mode="aspectFill" src="./pic-kj_topbg@2x.png" alt="">
    </div>
    <div class="goods-content">
      <div class="goods-info">
        <div class="info-box">
          <activity-info :activeInfo="infoDetail" @showRule="showRule"></activity-info>
          <div class="info-progress">
            <div class="info-current">
              <div class="current-text">当前价</div>
              <div class="current-price">¥{{goodsDetail.my_bargain && goodsDetail.new_team.current_price ? goodsDetail.new_team.current_price : goodsDetail.origin_price}}</div>
            </div>
            <div class="process">
              <div class="process-active" :style="{'width': progressBar + '%'}"></div>
            </div>
            <!--<progress :percent="progressBar" border-radius="6" backgroundColor="#E8EAEE" stroke-width="11" color="#FF8B00" active></progress>-->
            <div class="grogress-price">
              <div class="letf-price">
                <div class="price-text">原价:</div>
                <div class="price-number">¥ {{goodsDetail.origin_price}}</div>
              </div>
              <div class="right-price">
                <div class="price-text">底价:</div>
                <div class="price-number">¥{{goodsDetail.bottom_price}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buys-box">
        <div class="goods-btn-box">
          <div class="goods-buys-btn">
            <div class="current-buys" v-if="showBtn === 0" @click.stop="currentBuy">当前价购买</div>
            <form action="" class="share-btn btn-animation" report-submit @submit="$getFormId" v-if="showBtn === 0">
              <button class="share-btn" open-type="share" hover-class="none" formType="submit">{{shareText}}</button>
            </form>
            <form action="" class="share-btn btn-animation" report-submit @submit="$getFormId" v-if="showBtn === 1" @click.stop="currentBuy">
              <button class="share-btn" formType="submit"><span class="share-price">底价￥{{goodsDetail.bottom_price}}</span><span>立即购买</span></button>
            </form>
            <div class="share-btn activity-end" v-if="showBtn === 2">已购买</div>
            <div class="share-btn activity-end" v-if="showBtn === 3">{{endText}}</div>
          </div>
          <div class="run-time">
            <div class="run-time-text">倒计时：</div>
            <div class="run-time-number">{{activityTime}}</div>
          </div>
        </div>
        <div class="f8-line"></div>
        <div class="bargain-tab">
          <div class="tab-box">
            <!--:class="{'tab-text-active': tabIdx === index}"-->
            <div class="tab-text" v-for="(item, index) in tabList" @click="selectTab(index)" :key="index">{{item.text}}</div>
          </div>
          <div class="line-teb-box">
            <div class="line-main-box">
              <div class="active-line" :style="'transform: translate(' + tabIdx*100 + '%,0)'">
                <div class="line"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="log-list" v-if="tabIdx * 1 === 0">
          <activity-avatar :activeInfo="logList" :logUrl="logUrl"></activity-avatar>
        </div>
        <div class="rank-list" v-if="tabIdx * 1 === 1">
          <scroll-view class="rank-scroll" scroll-y @scrolltolower="bargainRankingListMore">
            <div class="rank-item-list">
              <div class="item-list" v-for="(item, index) in rankList" :key="index">
                <div class="item-left">
                  <div class="icon">
                    <img v-if="index === 0" src="./icon-no1@2x.png" alt="" class="icon-img">
                    <img v-if="index === 1" src="./icon-no2@2x.png" alt="" class="icon-img">
                    <img v-if="index === 2" src="./icon-no3@2x.png" alt="" class="icon-img">
                    <div v-if="index >= 3" class="icon-text">{{index + 1}}</div>
                  </div>
                  <img class="portrait" v-if="item.avatar === ''" src="/static/images/boygirl@2x.png">
                  <img class="portrait" v-if="item.avatar !== ''" :src="item.avatar">
                  <div class="name">{{item.nickname}}</div>
                </div>
                <div class="item-right"><span class="item-right-text">已砍到</span><span class="item-right-text text-b">{{item.current_price}}</span><span class="item-right-text">元</span></div>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
      <div class="goods-detail">
        <detail-info :getGoodsDetail.sync="goodsInfo"></detail-info>
      </div>
    </div>
    <activity-rule :showPopup.sync="isShowRule" :ruleInfo="ruleInfo"></activity-rule>
    <activity-order-msg ref="activityOrder" @endPayTime="endPayTime" :showPopup.sync="showOrder" :time="payTime" @toOrderPage="toOrderPage"></activity-order-msg>
    <activity-msg
      :showPopup.sync="showBargain"
      :activeInfo="activeInfo"
      :isShowAnimate="true"
      :avatarUrl="avatarUrl"
      :bargainPrice="bargainPrice"
      :myBargainPrice="myBargainPrice"
    ></activity-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ActivityInfo from '@components/activity-info/activity-info'
  import ActivityAvatar from '@components/activity-avatar/activity-avatar'
  import DetailInfo from '@components/detail-info/detail-info'
  import ActivityRule from '@components/activity-rule/activity-rule'
  import ActivityOrderMsg from '@components/activity-order-msg/activity-order-msg'
  import ActivityMsg from '@components/activity-msg/activity-msg'
  import { baseURL } from '@utils/config'
  import AppPromise from '@utils/app-promise'

  const PAGE_NAME = 'BARGAIN_DETAIL'
  const TABLIST = [{ text: '砍价帮' }, { text: '排行榜' }]
  const LOGURL = require('./pic-bargain@2x.png')
  const RULETEXT = ['1、同一个砍价，只能帮好友砍价一次；', '2、你每天最多可以帮助3个好友砍价；', '3、同一个砍价，每24小时只能购买一个；', '4、砍价完成后需在倒计时结束前下单购买，逾期失效。']
  const GIFURL = baseURL.image + '/ws-image/ws-saas/active/kanjia.gif'
  const FIRSTURL = baseURL.image + '/ws-image/ws-saas/active/kanjia.png'
  const SOMEPEOPLE = baseURL.image + '/ws-image/ws-saas/active/pic-bargain@2x.png'

  function createProcess(origin, bottom, current) {
    let den = Math.abs(origin - bottom)
    let mol = Math.abs(origin - current)
    return mol / den * 100
  }

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ActivityInfo,
      ActivityAvatar,
      DetailInfo,
      ActivityRule,
      ActivityOrderMsg,
      ActivityMsg
    },
    data() {
      return {
        showBargain: false,
        showOrder: false,
        ruleInfo: RULETEXT,
        isShowRule: false,
        logUrl: LOGURL,
        logList: [],
        tabIdx: 0,
        tabList: TABLIST,
        infoDetail: {},
        activityTime: '00:00:00',
        progressBar: 0,
        goodsDetail: {},
        goodsInfo: {},
        rankList: [],
        activeInfo: {
          avatar_image_url: '',
          activity_txt: '',
          show_tip: '',
          tip_msg: ['神秘人帮你又砍掉', '人多力量大，拉朋友一起砍吧'],
          share_text: '喊好友砍一刀'
        },
        myBargainPrice: 0,
        bargainPrice: 0,
        avatarUrl: FIRSTURL,
        teamId: 0,
        isLoading: 1,
        page: 1,
        totalPage: 1,
        activityId: '',
        goodsId: '',
        showBtn: 0,
        userInfo: {},
        endText: '',
        timer: null,
        endTime: 0,
        timeEnd: false,
        shareText: '喊好友砍一刀',
        payTime: 0,
        isSharing: false
      }
    },
    onShareAppMessage: function(res) {
      this.isSharing = true
      this.showBargain = false
      this.showOrder = false
      this.isShowRule = false
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      let shopId = this.$storage('shopId') || ''
      let userInfo = this.$storage('userInfo')
      let title = +this.goodsDetail.share_status === 0 ? `砍砍砍，大牌好货一起拿!` : `【${userInfo.nickname}@我】就差你一刀，帮我砍一下↓↓↓`
      let path = `${this.$routes.active.BARGAIN_DETAIL}?activeId=${this.activityId}&goodsId=${this.goodsId}&teamId=${this.goodsDetail.new_team.id}&shopId=${shopId}`
      console.info('path===>', path)
      console.info('shareImg===>', this.goodsDetail.share_image_url)
      console.warn('shareData===>', this.goodsDetail)
      return {
        title: title,
        imageUrl: this.goodsDetail.share_image_url,
        path
      }
    },
    onLoad(option) {
      this.userInfo = this.$storage('userInfo')
      if (option) {
        this.goodsId = +option.goodsId || this.goodsId
        this.activityId = +option.activeId || this.activityId
        this.teamId = +option.teamId || this.teamId
        console.warn('cut===> ', option)
      }
      AppPromise.getInstance().then(res => {
        this.isLoading === 1 && Promise.all([this._getBargainDetail(this.isLoading === 1)])
      })
    },
    async onShow() {
      this.showBargain = false
      this.showOrder = false
      this.isShowRule = false
      if (this.isSharing) {
        this.isSharing = false
        if (this.goodsDetail.share_status === 0) {
          await this._menCut()
        }
      }
      this.page = 1
      clearInterval(this.timer)
      AppPromise.getInstance().then(res => {
        this.isLoading > 1 && Promise.all([this._getBargainDetail(this.isLoading === 1)])
        this.isLoading++
      })
    },
    methods: {
      // 查看订单的锁定时间结束，刷新页面数据
      endPayTime() {
        this.showOrder = false
        this._getBargainDetail()
      },
      toOrderPage() {
        let url = `${this.$routes.personal.SERVICE_ORDER_DETAIL}?id=${this.goodsDetail.new_team.order_id}`
        this.showOrder = false
        wx.navigateTo({ url })
      },
      // 当前价格购买
      currentBuy() {
        if (this.goodsDetail.cut_status === 1) {
          let url = `${this.$routes.personal.SERVICE_ORDER_DETAIL}?id=${this.goodsDetail.new_team.order_id}`
          wx.navigateTo({ url })
          return
        }
        let data = { type: 4, goods: [{ goods_id: this.goodsId, num: 1, promotion_id: this.activityId, team_id: this.goodsDetail.new_team.id }] }
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
              },
              fail: () => {
                this.page = 1
                clearInterval(this.timer)
                this.isLoading > 1 && Promise.all([this._getBargainDetail(this.isLoading === 1)])
                this.isLoading++
              }
            })
          })
      },
      // 神秘人砍价
      async _menCut() {
        // API.Active.menCut({ data: { promotion_id: this.activityId, team_id: this.goodsDetail.new_team.id }, loading: false, toast: false })
        //   .then((res) => {
        //     if (res.data.status === 4) {
        //       this.showBargain = true
        //       this.activeInfo = {
        //         avatar_image_url: '',
        //         activity_txt: '',
        //         show_tip: '',
        //         tip_msg: ['神秘人帮你又砍掉', '人多力量大，拉朋友一起砍吧'],
        //         share_text: '喊好友砍一刀'
        //       }
        //       this.bargainPrice = 0
        //       this.avatarUrl = SOMEPEOPLE
        //       this.myBargainPrice = res.data.cut_money
        //     }
        //     console.log(res)
        //   })
        const data = { promotion_id: this.activityId, team_id: this.goodsDetail.new_team.id }
        try {
          const res = await API.Active.menCut({ data, loading: false, toast: false })
          if (res.data.status === 4) {
            this.showBargain = true
            this.activeInfo = {
              avatar_image_url: '',
              activity_txt: '',
              show_tip: '',
              tip_msg: ['神秘人帮你又砍掉', '人多力量大，拉朋友一起砍吧'],
              share_text: '喊好友砍一刀'
            }
            this.bargainPrice = 0
            this.avatarUrl = SOMEPEOPLE
            this.myBargainPrice = res.data.cut_money
          }
        } catch (e) {
        }
      },
      // 砍价详情
      _getBargainDetail(loading = false) {
        API.Active.BargainDetail({ data: { promotion_id: this.activityId, goods_id: this.goodsId, team_id: this.teamId }, loading })
          .then((res) => {
            this.goodsDetail = res.data
            console.warn('cut-detail===>', res.data)
            this.$refs.nav && this.$refs.nav.setNavigationBarTitle(this.goodsDetail.name || '')
            if (this.goodsDetail.run_result.error_code === 3 && this.goodsDetail.run_result.message) {
              this.$wechat.showToast(this.goodsDetail.run_result.message)
            }
            // this.goodsDetail.run_result.message && this.$wechat.showToast(this.goodsDetail.run_result.message)
            this._bargainTeamList()
            this._bargainRankingList()
            let infoData = {
              avatar: this.goodsDetail.my_bargain.avatar ? this.goodsDetail.my_bargain.avatar : this.userInfo.avatar,
              nickname: this.goodsDetail.my_bargain.nickname ? this.goodsDetail.my_bargain.nickname : this.userInfo.nickname,
              goods_title: this.goodsDetail.goods.name,
              goods_price: this.goodsDetail.origin_price,
              activity_cover_image: this.goodsDetail.image_url
            }
            this.goodsInfo = {
              shop_image_url: this.goodsDetail.shop_data.avatar,
              shop_name: this.goodsDetail.shop_data.name,
              goods_detail_images: this.goodsDetail.goods.goods_detail_images,
              address: `${this.goodsDetail.shop_data.province} ${this.goodsDetail.shop_data.city} ${this.goodsDetail.shop_data.district} ${this.goodsDetail.shop_data.address}`
            }
            this.infoDetail = infoData
            this.progressBar = createProcess(this.goodsDetail.origin_price, this.goodsDetail.bottom_price, this.goodsDetail.new_team.current_price)
            this.getActiveEndTime(this.goodsDetail)
            // 判断是个人
            switch (this.goodsDetail.show_status) {
              case 0:
                this.endText = '活动已失效'
                this.showBtn = 3
                break
              case 6:
              case 2:
                this.endText = '已售罄'
                this.showBtn = 3
                break
              case 1:
                // 正常情况
                this.checkActivityTarget()
                break
              case 4:
                // 已支付
                if (this.goodsDetail.other_bargain.status === 4) {
                  this.activeInfo = {
                    avatar_image_url: this.goodsDetail.other_bargain.avatar,
                    activity_txt: '谢谢你帮我砍了',
                    avatar_type: 1,
                    show_tip: '你也在参与该活动',
                    tip_msg: [],
                    share_text: '查看我的活动',
                    btnType: 1
                  }
                  this.avatarUrl = ''
                  this.bargainPrice = this.goodsDetail.other_bargain.cut_money
                  this.myBargainPrice = 0
                  this.showBargain = true
                }
                this.showBtn = 2
                break
              case 5:
                // 到底价
                this.showBtn = 1
                break
              default:
                break
            }
            if (this.goodsDetail.cut_status === 1 && this.goodsDetail.new_team.pay_last_time) {
              this.showOrder = true
              this.payTime = this.goodsDetail.new_team.pay_last_time
              this.$refs.activityOrder.getActiveEndTime(this.payTime)
            }
            // this.showBtn = this.goodsDetail.cut_status === 0 ? this.showBtn : 2
            this.shareText = +this.goodsDetail.share_status === 1 ? '喊好友砍一刀' : '分享到群，再砍一刀'
          })
      },
      // 判断活动的发起者
      checkActivityTarget() {
        let detail = this.goodsDetail['my_bargain'] || {}
        switch (detail.status) {
          // 进入分享连接，自己已存在砍价活动
          case 1:
          case 5:
            // 进入分享连接能成功帮好友进行砍价的弹窗展示
            if (this.goodsDetail.other_bargain.status === 4) {
              if (this.goodsDetail.share_status === 0 && this.goodsDetail.cut_status === 0) {
                this.activeInfo = {
                  avatar_image_url: this.goodsDetail.other_bargain.avatar,
                  activity_txt: '谢谢你帮我砍了',
                  show_tip: '你也在参与该活动',
                  avatar_type: 1,
                  tip_msg: [],
                  share_text: '分享到群，再砍一刀'
                }
              } else if (this.goodsDetail.share_status === 1) {
                // 首次分享回来
                this.activeInfo = {
                  avatar_image_url: this.goodsDetail.other_bargain.avatar,
                  activity_txt: '谢谢你帮我砍了',
                  show_tip: '你也在参与该活动',
                  avatar_type: 1,
                  tip_msg: [],
                  share_text: '查看我的活动',
                  btnType: 1
                }
              }
              this.bargainPrice = this.goodsDetail.other_bargain.cut_money // 别人砍价
              this.showBargain = true
            }
            break
          // 进入分享连接，自己能成功的发起砍价的情况
          case 4:
            setTimeout(() => {
              this.avatarUrl = GIFURL
            }, 500)
            setTimeout(() => {
              this.avatarUrl = SOMEPEOPLE
            }, 2100)
            this.showBtn = 0
            this.showBargain = true
            // 通过分享连接进来看到的弹窗
            if (this.teamId && this.goodsDetail.other_bargain.status === 4) {
              // if (detail.team_id) {
              this.activeInfo = {
                avatar_type: 1,
                activity_txt: '谢谢你帮我砍了', // 标题
                avatar_image_url: this.goodsDetail.other_bargain.avatar || '', // other用户头像
                tip_msg: ['你帮自己砍掉', '偶遇神秘人,分享后他会帮你再砍一刀'],
                show_tip: '',
                share_text: '分享到群，再砍一刀'
              }
              this.bargainPrice = this.goodsDetail.other_bargain.cut_money // 别人砍价
              this.myBargainPrice = this.goodsDetail.my_bargain.cut_money // 自己砍价
            } else {
              this.activeInfo = {
                avatar_type: 1,
                // activity_txt: '谢谢你帮我砍了', // 标题
                activity_txt: '你帮自己砍掉', // 标题
                avatar_image_url: this.goodsDetail.my_bargain.avatar || '', // mine用户头像
                tip_msg: ['偶遇神秘人', '分享后他会帮你再砍一刀'],
                show_tip: '',
                share_text: '分享到群，再砍一刀'
              }
              this.bargainPrice = this.goodsDetail.my_bargain.cut_money
              this.myBargainPrice = 0
            }
            break
          default:
            break
        }
      },
      // 倒计时
      getActiveEndTime(time) {
        if (this.timer) {
          clearInterval(this.timer)
        }
        // this.endTime = time.end_at_timestamp
        this.endTime = time.new_team.last_time
        this.timer = setInterval(() => {
          if (this.endTime > 0) {
            this.endTime--
          }
          let endTime = this._runDiffTime(this.endTime)
          this.activityTime = `${endTime.hour}:${endTime.minute}:${endTime.second}`
          if (this.timeEnd) {
            clearInterval(this.timer)
          }
        }, 1000)
      },
      // 计算两个值的差值
      _runDiffTime(differ) {
        // let differ = end * 1 - start * 1
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
          this.timeEnd = false
        } else {
          times = {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
          }
          this.timeEnd = true
        }
        return times
      },
      selectTab(index) {
        if (this.tabIdx === index) return
        this.tabIdx = index
        if (this.tabIdx === 0) this._bargainTeamList()
      },
      showRule() {
        this.isShowRule = true
      },
      _bargainTeamList(loading = false) {
        API.Active.bargainTeamList({ data: { team_id: this.goodsDetail.new_team.id || 0 }, loading })
          .then((res) => {
            this.logList = res.data
          })
      },
      _bargainRankingList(loading = false) {
        API.Active.bargainRankingList({ data: { promotion_id: this.activityId, page: this.page }, loading })
          .then((res) => {
            this.totalPage = res.meta.last_page
            if (this.page === 1) this.rankList = res.data
            else this.rankList = this.rankList.concat(res.data)
          })
      },
      // 排行榜加载更多
      bargainRankingListMore() {
        if (this.page >= this.totalPage) return
        this.page++
        this._bargainRankingList()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .bargain-detail
    background-image: linear-gradient(-178deg, #FFB417 0%, #FF9400 92%)
    position: relative
    min-height: 100vh

  .goods-img
    height: 56vw
    width: 100%
    background: #FFB417
    .goods-img-banner
      height: 100%
      width: 100%

  .goods-content
    margin-top: -29.33vw
    padding: 0 15px 15px
    position: relative
    z-index: 1

  .goods-info
    width: 100%
    box-sizing: border-box
    .info-box
      box-shadow: 0 4px 12px 0 rgba(143, 0, 0, 0.21)
      background: $color-white
      border-radius: 10px
      width: 100%
      .info-progress
        padding: 20px 20px 15px
        box-sizing: border-box
      .info-current
        layout(row)
        align-items: center
        justify-content: center
        margin-bottom: 15px
        .current-text
          font-size: $font-size-12
          color: $color-text-main
          font-family: $font-family-medium
        .current-price
          font-size: $font-size-16
          color: #fe7062
          font-family: $font-family-medium
    .grogress-price
      layout(row)
      align-items: center
      justify-content: space-between
      margin-top: 7px
      .letf-price
        layout(row)
        align-items: center
        height: 16px
        .price-text
          font-size: $font-size-12
          color: #979BA5
          font-family: $font-family-regular
        .price-number
          font-size: $font-size-12
          color: #979BA5
          font-family: $font-family-regular
          text-decoration: line-through
      .right-price
        layout(row)
        align-items: center
        .price-text
          font-size: $font-size-12
          color: #979BA5
          font-family: $font-family-regular
        .price-number
          color: #FE7062
          font-size: $font-size-14
          font-family: $font-family-medium

  .buys-box
    background: $color-white
    border-radius: 10px
    margin-top: 10px
    box-shadow: 0 4px 12px 0 rgba(143, 0, 0, 0.21)
    overflow: hidden
    .goods-btn-box
      padding: 25px 15px 20px
    .goods-buys-btn
      height: 44px
      layout(row)
      .current-buys
        width: 105px
        height: 44px
        line-height: 44px
        border-radius: 22px
        color: #6E2900
        font-size: $font-size-16
        font-family: $font-family-medium
        text-align: center
        background-image: linear-gradient(-180deg, #FFDA15 0%, #FDBA00 100%)
        margin-right: 10px
      .share-btn
        display: flex
        flex: 1
        height: 44px
        line-height: 44px
        border-radius: 22px
        color: $color-white
        font-size: $font-size-16
        font-family: $font-family-medium
        justify-content: center
        background-image: linear-gradient(-180deg, #FF7034 0%, #F22600 100%)
        &:after
          border: none
      .activity-end
        background-image: linear-gradient(-180deg, $color-CCCCCC 0%, $color-CCCCCC 100%)
        opacity: 0.5
      .share-price
        margin-right: 20px

    .run-time
      font-size: $font-size-14
      color: $color-text-assist
      font-family: $font-family-regular
      margin-top: 15px
      height: $font-size-14
      width: 100%
      layout(row)
      align-items: center
      justify-content: center
      .run-time-number
        width: 55px
        font-size: $font-size-14
        color: $color-text-assist
        font-family: $font-family-regular
      .run-time-text
        font-size: $font-size-14
        color: $color-text-assist
        font-family: $font-family-regular

  .f8-line
    height: 10px
    background: #F5F6FA

  .bargain-tab
    padding: 0 15.25px 0
    position: relative
    .tab-box
      width: 100%
      layout(row)
      .tab-text
        padding: 20px 0
        display: flex
        position: relative
        z-index: 10
        flex: 1
        justify-content: center
        font-size: $font-size-16
        color: $color-text-main
        font-family: $font-family-regular
      .tab-text-active
        font-family: $font-family-medium
    .line-teb-box
      margin-top: -6px
      height: 3px
      width: 100%
      position: absolute
      padding: 0 15.25px 0
      box-sizing: border-box
      left: 0
      bottom: 10 px-v-6f096feb
      .line-main-box
        width: 100%
      .active-line
        width: 50%
        transform: translate(0, 0)
        transition: all 0.3s
        .line
          height: 3px
          width: 45px
          background: #ffcb00
          margin: 0 auto
          border-radius: 2px

  .log-list
    padding: 0 0 15px

  .rank-list
    padding: 0 10px 15px
    .rank-scroll
      background: #F7F8FC
      max-height: 295px
      box-sizing: border-box
      min-height: 75px
      overflow-y: auto
      border-radius: 4px
      -webkit-overflow-scrolling: touch
    .rank-item-list
      padding: 20px 14px 0 12px
      .item-list
        layout(row)
        justify-content: space-between
        align-items: center
        margin-bottom: 20px
        line-height: 1.4
      .item-left
        layout(row, block, nowrap)
        align-items: center
        flex: 1
        overflow: hidden
        .icon
          width: 20px
          height: 20px
          display: block
          margin-right: 12px
          text-align: center
          line-height: 20px
          .icon-img
            display: block
            width: 100%
            height: 100%
          .icon-text
            font-size: $font-size-14
            color: $color-98989F
            height: 20px
            line-height: 25px
            font-family: $font-family-medium
        .portrait
          width: 35px
          height: 35px
          min-height: 35px
          min-width: 35px
          display: block
          margin-right: 10px
          border-radius: 50%
        .name
          font-size: $font-size-14
          color: $color-text-main
          font-family: $font-family-regular
          width: 100px
          no-wrap()
      .item-right-text
        font-size: $font-size-14
        color: $color-text-main
        font-family: $font-family-regular
        line-height: 1
        margin: 0 1.5px
      .text-b
        color: #FE7062
        font-family: $font-family-medium

  .goods-detail
    box-shadow: 0 4px 12px 0 rgba(143, 0, 0, 0.21)
    margin-top: 12px
    border-radius: 10px
    overflow: hidden
    background: $color-white

  .process
    width: 100%
    height: 11px
    background: #E8EAEE
    border-radius: 6px
    overflow: hidden
    .process-active
      border-radius: 6px
      transition: width 0.5s
      transition-delay: 0.2s
      background-image: linear-gradient(90deg, #FFE400 0%, #FFB400 100%)
      height: 100%
      width: 0
</style>
