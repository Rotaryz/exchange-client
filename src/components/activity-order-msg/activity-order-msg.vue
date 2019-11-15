<template>
  <div class="popup" @touchmove.stop="" :class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'" @click="close">
    <!--<div class="mask"  ></div>-->
    <section class="content">
      <div class="close-btn" @click.stop="close"><img class="close-img" src="./icon-close_red@2x.png"></div>
      <div class="msg-center">
        <div class="msg-top">你已下单</div>
        <div v-if="payTime!=='00:00'" class="msg-bot">请在 <span class="time">{{payTime}}</span> 内完成支付</div>
      </div>
      <div class="btn-group">
        <button class="btn order-btn" @click.stop="toOrderPage">{{btnText}}</button>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      useType: String,
      btnText: {
        type: String,
        default: '查看我的订单'
      },
      showPopup: {
        type: Boolean,
        default: false
      },
      infoTime: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        payTime: '00:00',
        timeEnd: false
      }
    },
    onUnload() {
      clearInterval(this.timer)
      this.payTime = '00:00'
      this.timeEnd = false
    },
    methods: {
      show() {
        this.$emit('update:showPopup', true)
        this.$emit('show')
        this.getActiveEndTime(this.infoTime)
      },
      close() {
        this.$emit('update:showPopup', false)
        this.$emit('cancel')
      },
      confirm() {
        this.$emit('update:showPopup', false)
        this.$emit('confirm')
      },
      toOrderPage() {
        this.$emit('toOrderPage')
      },
      _groupTimeCheckoutNoDay(differ) {
        let times = {
          hour: '00',
          minute: '00',
          second: '00'
        }
        if (differ <= 0) {
          this.timeEnd = true
          return times
        }
        // let nowSecond = parseInt(Date.now() / 1000)
        // let differ = time * 1 - nowSecond
        let hour = Math.floor(differ / (60 * 60))
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        if (differ > 0) {
          times = {
            hour,
            minute,
            second
          }
          this.timeEnd = false
        } else {
          times = {
            hour: '00',
            minute: '00',
            second: '00'
          }
          this.timeEnd = true
        }
        return times
      },
      getActiveEndTime(time) {
        if (this.timeEnd) return
        clearInterval(this.timer)
        this.end_time = time
        this.timer = setInterval(() => {
          if (this.end_time > 0) {
            this.end_time--
          }
          let endTime = this._groupTimeCheckoutNoDay(this.end_time)
          this.payTime = `${endTime.minute}:${endTime.second}`
          if (this.timeEnd) {
            clearInterval(this.timer)
            this.$emit('endPayTime')
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .popup
    padding-top: 28.1vh
    box-sizing: border-box
    background: rgba(0, 0, 0, .5)
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    display: flex
    justify-content: center
    .mask
      fill-box()
      background-color: $color-20202E
      opacity: 0.8
    .content
      position: relative
      width: 295px
      height: 292px
      background-image: linear-gradient(134deg, #FD7035 0%, #F74943 100%)
      border: 1px solid rgba(32, 32, 46, 0.10)
      border-radius: 8px
      layout()
      .msg-center
        text-align: center
        margin-top: 101.5px
        .msg-top
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #FFF8DC
          line-height: 20px
        .msg-bot
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #FFF8DC
          line-height: 20px
          .time
            font-family: $font-family-medium
      .close-btn
        position: absolute
        right: 10.3px
        top: 12.3px
        width: 30.5px
        height: 30.5px
        text-align: center
        line-height: 30.5px
        .close-img
          width: 15px
          height: 14.5px
      .btn-group
        width: 240px
        height: 44px
        margin: 0 auto
        padding: 81.5px 0 25px 0
        .order-btn
          width: 240px
          height: 44px
          background-image: linear-gradient(180deg, #FFE780 0%, #F9D442 100%)
          box-shadow: 0 1
          border-radius: 22px
          font-family: $font-family-medium
          font-size: $font-size-16
          color: #AA4600
          text-align: center
          line-height: 44px
          &:before, &:after
            content: ""
            display: block
            border: none

  .hide-popup
    opacity: 0
    z-index: -1
    transition: all 0.2s

  .fade-modal-enter-active
    opacity: 1
    z-index: 10
    transition: all 0.5s
</style>
