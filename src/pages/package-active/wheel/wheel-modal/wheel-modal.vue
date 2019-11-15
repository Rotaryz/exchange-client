<template>
  <div class="base-modal" v-if="isShow" :animation="maskAnimation" @click="cancel">
    <article class="modal-content" :animation="modalAnimation" @click.stop>
      <dl class="wrapper">
        <dt class="del" @click="cancel">
          <img class="icon-img" v-if="imageUrl" :src="imageUrl + '/zd-image/wheel/icon-close@2x.png'" alt="">
        </dt>
        <dd class="rule-wrapper" v-if="showType === 'rule'">
          <p class="title"><span>活动规则</span></p>
          <div class="list">
            <dl class="list-item-wrapper" v-if="ruleList.length" v-for="(item, index) in ruleList" :key="index">
              <dt class="item-title">{{item.title}}</dt>
              <dd class="item-content" v-for="(it, idx) in item.contentList" :key="idx">
                <text>{{it}}</text>
              </dd>
            </dl>
          </div>
        </dd>
        <dd class="prize-wrapper" v-if="showType === 'prize' && index < 1">
          <img class="icon-img pos-a" v-if="imageUrl" :src="imageUrl + '/zd-image/wheel/pic-popup_other@2x.png'" alt="">
          <ul class="prize-container">
            <li class="p-type">{{constantText.title.noWin}}</li>
            <li class="p-content">{{constantText.tips.noWin}}</li>
            <li class="p-title">你还有 <span class="number">{{usable_times}}</span> 次机会</li>
            <li class="p-btn-group">
              <div class="btn" @click="btnHandle(index, usable_times)">{{constantText.btn.noWin[usable_times?1:0]}}</div>
            </li>
          </ul>
        </dd>
        <dd class="prize-wrapper" v-else-if="showType === 'prize'">
          <img class="icon-img pos-a" v-if="imageUrl" :src="imageUrl + '/zd-image/wheel/pic-popup_thing@2x.png'" alt="">
          <ul class="prize-container">
            <li class="p-type">{{constantText.title[winType]}}</li>
            <li class="p-prize-title">{{prizeInfo.name || ''}}</li>
            <li class="p-prize-img">
              <img class="icon-img" mode="aspectFill" v-if="prizeInfo" :src="prizeInfo.image_url" alt="">
            </li>
            <li class="p-prize-tips">
              <text class="text-tips">{{constantText.tips[winType]}}</text>
            </li>
            <li class="p-btn-group">
              <div class="btn use" @click="useBtnHandle">{{constantText.btn[winType][0]}}</div>
              <!--<div class="btn" @click="shareBtnHandle">{{constantText.btn[winType][1]}}</div>-->
              <button class="btn" open-type="share">{{constantText.btn[winType][1]}}</button>
            </li>
          </ul>
        </dd>
      </dl>
    </article>
  </div>
</template>

<script>
  import wx from 'wx'
  import AnimationModal from '@mixins/animation-modal'
  // import $routes from '@utils/routes'
  // prize_type 1 服务 2 播豆 3 兑换券
  const pageRouter = [
    '',
    '/package-personal/prize-record',
    '/pages/mine',
    '/pages/mine'
  ]
  const TYPE_KEY = {
    0: 'noWin',
    1: 'red',
    2: 'coin',
    3: 'goods'
  }
  export default {
    mixins: [AnimationModal],
    props: {
      prizeInfo: {
        type: Object,
        default: () => {}
      },
      ruleList: {
        type: Array,
        default: () => []
      },
      employeeInfo: {
        type: Object,
        default: () => {}
      },
      usable_times: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        isShow: false,
        showType: '',
        index: 0,
        constantText: {
          title: {
            noWin: '差点就中了',
            red: '恭喜中奖啦',
            coin: '恭喜中奖啦',
            goods: '恭喜中奖啦'
          },
          tips: {
            noWin: '谢谢参与',
            red: '奖品已经存放入您的账户\n' +
              '可进入个人中心-奖品记录查看',
            coin: '奖品已经存放入您的账户\n' +
              '可进入我的页面查看',
            goods: '奖品已经存放入您的账户\n' +
              '可进入我的页面查看'
          },
          btn: {
            noWin: ['随便逛逛', '再试一次'],
            red: ['查看服务', '炫耀一下'],
            coin: ['查看播豆', '炫耀一下'],
            goods: ['查看兑换券', '炫耀一下']
          }
        }
      }
    },
    onUnload() {
      this.cancel()
    },
    onLoad() {
    },
    computed: {
      winType() {
        return TYPE_KEY[this.prizeInfo.type || 0]
      }
    },
    methods: {
      _routerType(type) {
        this.showType = type
      },
      useBtnHandle() {
        const url = pageRouter[this.prizeInfo.type]
        if (this.$checkIsTabPage(url)) {
          wx.switchTab({url})
        } else {
          wx.navigateTo({ url })
        }
      },
      btnHandle(index, number) {
        if (number) {
          this.submit()
        } else {
          this.submit()
          wx.switchTab({url: '/pages/home'})
        }
      },
      show(type, index) {
        this.index = index // 0 未中奖
        if (this.isShow) return
        this.isShow = true
        this.showAnimation(() => {
          this._routerType(type)
        })
      },
      cancel() {
        if (!this.isShow) return
        this.hideAnimation(() => {
          this.isShow = false
          this.$emit('cancel')
        })
      },
      submit() {
        this.cancel()
        this.$emit('submit')
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

  .base-modal
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 9999
    display: flex
    align-items: center
    justify-content: center
    background-color: rgba(32, 32, 46, 0.8)

  .wrapper
    text-align: right
    .del
      display: inline-block
      width: 28px
      height: @width
      margin-bottom: 18.5px
    .prize-wrapper
      height: 84vw
      width: 78.26666666666667vw
      position: relative
      .prize-container
        height: 100%
        width: 100%
        box-sizing: border-box
        padding-top: 22.563492063492063%
        position: relative
        .p-type
          font-family: PingFangSC-Medium
          font-size: 4.8vw
          color: #F1F3C1
          text-align: center
        .p-content
          font-family: PingFangSC-Medium
          font-size: 6.4vw
          color: #CE5900
          text-align: center
          margin-top: 19%
        .p-title
          margin-top: 21%
          font-family: PingFangSC-Regular
          font-size: 3.733333333333334vw
          color: #FFE6C2
          text-align: center
          padding-bottom: 4%
          .number
            font-family: PingFang-SC-Bold
            font-size: 6.4vw
            color: #F8E71C
        .p-prize-title
          max-width: 70%
          margin 3% auto 2%
          font-family: PingFangSC-Medium
          font-size: 3.733333333333334vw
          color: #FFFFFF
          text-align: center
          no-wrap()
        .p-prize-img
          width: 20vw
          height: @width
          margin: 0 auto
          border-radius: 2px
          overflow: hidden
        .p-prize-tips
          font-size: 3.2vw
          margin 12% auto 3%
          text-align: center
          .text-tips
            font-family: PingFangSC-Regular
            color: #FFE6C2
            line-height: 1.5
        .p-btn-group
          layout(row, block, nowrap)
          justify-content: center
          align-items: center
          .btn
            box-sizing: border-box
            width: 29.3vw
            height: 8.799999999999999vw
            background-image: linear-gradient(-180deg, #F9FAE2 0%, #F1F3C1 100%)
            border-radius: 8.799999999999999vw
            font-family: PingFangSC-Medium
            font-size: 3.733333333333334vw
            color: #CE5900
            margin: 0 2.5px
            layout()
            justify-content: center
            align-items: center
            &.use
              border: 1px solid #F1F2BF
              background: transparent
              color: #FCE4BF
    .rule-wrapper
      height: 90.13333333333333vw
      width: 80vw
      background: #FFFFFF
      border-radius: 6px
      layout()
      .title
        height: 16.3%
        font-family: PingFangSC-Medium
        font-size: 18px
        color: #F1F3C1
        text-align: center
        background: #B14ADB
        layout()
        justify-content: center
        align-items: center
      .list
        flex: 1
        position: relative
        box-sizing: border-box
        padding: 20px 20px 22px
        text-align: left
        overflow: scroll
        .list-item-wrapper
          margin-bottom: 15px
          .item-title
            font-family: PingFangSC-Medium
            font-size: 18px
            color: #4A4A4A
            margin-bottom: 6px
          .item-content
            font-family: PingFangSC-Regular
            font-size: 14px
            line-height: 1.6
            color: #4A4A4A
            text-align: justify
            word-break: break-all
</style>
