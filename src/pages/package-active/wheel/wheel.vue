<template>
  <div class="wheel" :style="pageStyle">
    <navigation-bar title="幸运大转盘"></navigation-bar>
    <div class="page-wrapper" :style="{top: statusBarHeight + 44 + 'px'}">
      <img class="wheel-bg" style="width: 100%" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/zd-image/wheel/pic-turntable_bg@2x.png'" alt="">
      <article class="container">
        <wheel-header :ruleInfo="ruleInfo" @showRule="showRule"></wheel-header>
        <section class="content-wrapper">
          <article class="wheel-wrapper">
            <img class="icon-img pos-a" v-if="imageUrl" :src="imageUrl + '/zd-image/wheel/pic-wheel-bg@2x.png'" alt="">
            <figure class="wheel-outer" :style="outerWheelAction">
              <img class="icon-img" v-if="imageUrl" :src="imageUrl + '/zd-image/wheel/pic-rose@2x.png'" alt="">
              <ul class="light-dot" :style="lightStyle" v-for="(item, index) in '1234567'" :key="index" :class="'light-'+index">
                <li class="dot" v-if="imageUrl" v-for="(it, idx) in '12'" :key="idx">
                </li>
              </ul>
            </figure>
            <figure class="wheel-inner" :style="innerWheelAction">
              <img class="icon-img" v-if="imageUrl" :src="imageUrl + '/zd-image/wheel/pic-thrntable@2x.png'" alt="">
              <div class="prize-item" v-for="(item, index) in wheelList" :key="index" :class="'prize-'+index">
                <p class="name">{{item.name || ''}}</p>
                <div class="img-wrapper">
                  <img class="pic" mode="aspectFit" :src="item.image_url" alt="">
                </div>
              </div>
            </figure>
            <figure class="wheel-pointer">
              <div class="pointer" @click.stop="_drawWheel">
                <img class="icon-img" v-if="imageUrl" :src="imageUrl + '/zd-image/wheel/pic-turntable_go@2x.png'" alt="">
              </div>
            </figure>
          </article>
          <section class="footer">
            <div class="footer-mask"></div>
            <div class="title">你还有 <span class="number">{{usable_times}}</span> 次机会</div>
            <swiper
              class="cards-wrapper"
              :style="cardsWrapperStyle"
              :duration="runCardSeconds"
              :interval="runCardSeconds"
              :display-multiple-items="cardsNumber"
              circular
              autoplay
              vertical
            >
              <block v-for="item in receive_customer" :key="item.name + item.image_url">
                <swiper-item>
                  <div class="card-item-wrapper">
                    <wheel-card :item="item"></wheel-card>
                  </div>
                </swiper-item>
              </block>
            </swiper>
          </section>
        </section>
        <wheel-modal ref="modal" :prizeInfo="prizeInfo" :usable_times="usable_times" :ruleList="ruleList" :employeeInfo="employeeInfo"></wheel-modal>
      </article>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import WheelHeader from './wheel-header/wheel-header'
  import WheelCard from './wheel-card/wheel-card'
  import {globalComputed} from '@state/helpers'
  import WheelModal from './wheel-modal/wheel-modal'
  import wx from 'wx'
  import AppPromise from '@utils/app-promise'

  const PAGE_NAME = 'WHEEL'

  const system = wx.getSystemInfoSync()
  const ios = /ios/i.test(system.system)

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      WheelHeader,
      WheelCard,
      WheelModal
    },
    data() {
      return {
        title: '幸运大转盘',
        running: false,
        randomDeg: 0,
        activeStep: 0,
        lastStep: 0,
        wheelSeconds: 6000,
        wheelCvs: `cubic-bezier(.71,0,.58,1)`,
        wheelList: [
          {
            name: '谢谢参与',
            image_url: `${this.$imageUrl}/zd-image/wheel/pic-face@2x.png`
          }
        ],
        usable_times: 0,
        receive_customer: [],
        prizeInfo: {},
        ruleInfo: {},
        ruleList: [],
        shopInfo: {},
        runCardSeconds: 3000,
        refreshCount: 0,
        currentShopId: 0
      }
    },
    computed: {
      ...globalComputed,
      pageStyle() {
        return ''
      },
      lightStyle() {
        return ios ? 'padding: 7% 0' : 'padding:6% 0'
      },
      wheelActionStyle() {
        return this.active ? 'active' : ''
      },
      innerWheelAction() {
        return `transform :rotate(${360 * this.activeStep}deg); transition : transform ${this.wheelSeconds}ms ${this.wheelCvs}`
      },
      outerWheelAction() {
        return `transform :rotate(${-360 * this.activeStep}deg); transition : transform ${this.wheelSeconds}ms ${this.wheelCvs}`
      },
      employeeInfo() {
        let name = ''
        let avatar = ''
        if (this.shopInfo.employee) {
          name = this.shopInfo.employee.name || this.shopInfo.employee.nickname
          avatar = this.shopInfo.employee.avatar
        }
        return { name, avatar }
      },
      cardsWrapperStyle() {
        return `height:${9.866666666666667 * this.cardsNumber}vw;`
      },
      cardsNumber() {
        let height = system.screenHeight
        let arr = [2, 5]
        let length = this.receive_customer.length
        let carNum = length > 1 ? arr[height > 736 ? 1 : 0] : 1
        return Math.min(carNum, length)
      },
      cardsStyle() {
        return `transition :transform ${this.runCardSeconds}ms ease-in-out;transform :translate3d(0, ${-this.runCardStep * 9.866666666666667}vw, 0)`
      }
    },
    onLoad(options) {
      AppPromise.getInstance().then(() => {
        if (!wx.getStorageSync('token')) {
          wx.navigateTo({url: this.$routes.other.LOGIN})
          return
        }
        this.currentShopId = this.$storage('shopId')
        this._getWheelInfo()
      })
    },
    onShow() {
      AppPromise.getInstance().then(() => {
        if (this.currentShopId === this.$storage('shopId')) return
        this.currentShopId = this.$storage('shopId')
        this._getWheelInfo()
      })
    },
    onShareAppMessage() {
      const name = (wx.getStorageSync('userInfo') || {}).nickname || ''
      const shopId = wx.getStorageSync('shopId') || 0
      const path = `${this.$routes.active.WHEEL}?shopId=${shopId}`
      console.info(path)
      this.$sendMsg({
        event_no: 1020
      })
      return {
        title: `${name}邀请你大转盘抽奖`,
        path,
        imageUrl: `${this.imageUrl}/zd-image/wheel/pic-share_qun@2x.png`,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    methods: {
      showRule() {
        this.$refs.modal && this.$refs.modal.show('rule')
      },
      _getWheelInfo() {
        this.$sendMsg({
          event_no: 1017
        })
        API.Wheel.getDetail().then((res) => {
          this.wheelList = this.wheelList.concat(res.data.prizes)
          this.formatRuleInfo(res.data)
        })
        this._getLottery()
        this._getLogList()
        setTimeout(() => {
        }, this.runCardSeconds + 200)
      },
      formatRuleInfo(data = {}) {
        let arr = []
        if (data.prizes) {
          arr = arr.concat({
            title: '活动奖品',
            contentList: data.prizes.map(item => item.name)
          })
        }
        if (data.note) {
          arr = [{
            title: '活动说明',
            contentList: [data.note]
          }].concat(arr)
        }
        this.ruleList = arr
      },
      _getLottery() {
        API.Wheel.getLottery().then((res) => {
          this.usable_times = res.data.normal_times
        })
      },
      _getLogList() {
        API.Wheel.getLogList().then((res) => {
          // this.receive_customer = res.data || []
          let arr = []
          res.data.forEach(item => {
            let flag = this.receive_customer.some(d => d.id === item.id)
            if (!flag) {
              arr.push(item)
            }
          })
          this.receive_customer = this.receive_customer.concat(arr)
        })
      },
      _drawWheel() {
        // 判断是否有中奖的次数
        if (this.usable_times < 1) {
          this.$wechat.showToast('您的抽奖次数已用完！')
          this.running = false
          return
        }
        this.$sendMsg({
          event_no: 1018
        })
        // 判断是否正在转
        if (this.running) return
        this.running = true
        wx.vibrateShort() // 震动
        API.Wheel.rotary().then(res => {
          this._getLottery()
          let index = res.data.map ? -1 : res.data.position + 1
          index !== -1 && (this.prizeInfo = res.data)
          this._action(index === -1 ? 0 : index, () => {
            if (index !== -1) {
              this.$sendMsg({
                event_no: 1019,
                title: this.prizeInfo.name || ''
              })
            }
            this._getLogList()
            this._showTips(index)
            this.running = false
          })
        })
      },
      _action(index, callback) {
        this.timer = setTimeout(() => {
          callback && callback()
        }, this.wheelSeconds + 50)
        // 随机数
        let range = 20
        this.randomDeg = Math.random() * range * 2 - range
        // 转的位置
        this.activeStep += (this.lastStep + ~~Math.random() * 3 + 6 - (index * 60 - this.randomDeg) / 360)
        this.lastStep = (index * 60 - this.randomDeg) / 360
      },
      _showTips(index) {
        // index = ~~(Math.random() * 3) // todo
        index && wx.vibrateShort() // 震动
        this.$refs.modal && this.$refs.modal.show('prize', index)
        // this.receive_customer.push({name: 'jtr', prize_title: `中将￥${~~(Math.random() * 1000)}`, date: '2019.09.23'})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .icon-img
    width: 100%
    height: 100%

  .pos-a
    position: absolute
    top: 0
    left: 0

  .master-style
    position: absolute
    left: 6.666666666666667vw
    right: 6.666666666666667vw
    height: 3.5vw
    background: hsla(0, 0%, 100%, .9)

  .wheel
    position: relative
    height: 100vh
    transform: translate3d(0, 0, 0)
    overflow hidden
    .page-wrapper
      position: fixed
      left: 0
      right: 0
      bottom: 0
      .container
        fill-box(absolute)
        .content-wrapper
          position: absolute
          right: 0
          left: 0
          top: 34.8vw
          .footer
            position: relative
            .footer-mask
              fill-box(absolute)
              z-index: 20
            .title
              font-family: PingFangSC-Regular
              font-size: 3.733333333333334vw
              color: #FFE6C2
              text-align: center
              padding-bottom: 5vw
              .number
                font-family: PingFang-SC-Bold
                font-size: 6.4vw
                color: #F8E71C
            .cards-wrapper
              position: relative
              overflow: hidden
              min-height :9.866666666666667vw
              .card-item-wrapper
                margin 0 6.666666666666667vw 1.3333333333333335vw
          .wheel-wrapper
            z-index: 3
            margin: 0 auto
            width: 89.86666666666666vw
            height: 91.2vw
            position: relative
            .wheel-outer
              position: absolute
              top: -1.6%
              left: 0%
              height: 89.86666666666666vw
              width: @height
              padding: 7.418397626112759%
              box-sizing: border-box
              .light-dot
                position: absolute
                top: 0
                left: 48.5%
                width: 3%
                height: 100%
                box-sizing: border-box
                layout()
                justify-content: space-between
                align-items: center
                for $i in 0 1 2 3 4 5 6
                  &.light-{$i}
                    z-index: (-($i) + 8)
                    transform: rotateZ($i * 25.714285714285715deg)
                .dot
                  width: 3.2vw
                  height: @width
                  background-repeat: no-repeat
                  background-size: 100% 100%
                  border-radius 50%
                  background-image url("./pic-light-dot@3x.png")
            .wheel-inner
              position: absolute
              top: -1.6%
              left: 0%
              height: 89.86666666666666vw
              width: @height
              padding: 10.385756676557865%
              box-sizing: border-box
              .prize-item
                position: absolute
                top: 0
                left: 27.7%
                width: 45%
                height: 100%
                box-sizing: border-box
                text-align: center
                for $i in 0 1 2 3 4 5
                  &.prize-{$i}
                    z-index: (-($i) + 6)
                    transform: rotate($i * 60deg)
                .name
                  font-family: DINAlternate-Bold
                  line-height: 1.2
                  margin: 28% auto 3%
                  max-width: 37%
                  font-size: 2.67vw
                  color: #6d54ca
                  no-wrap()
                .img-wrapper
                  width: 37.04%
                  height: 13.11%
                  margin: 0 auto
                  box-sizing: border-box
                  .pic
                    width: 100%
                    height: 100%
            .wheel-pointer
              position: absolute
              top: -1.6%
              left: 0%
              height: 89.86666666666666vw
              width: @height
              layout()
              justify-content: center
              align-items: center
              .pointer
                margin-top: -5%
                width: 22.7vw
                height: 27.3vw
</style>
