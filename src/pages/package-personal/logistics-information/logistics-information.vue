<template>
  <div class="logistics-information">
    <navigation-bar title="物流信息"></navigation-bar>
    <div class="info-header">
      <img src="./pic-bg_order@2x.png" class="info-img">
      <div class="logistics-name">快递公司：{{logisticsMsg.shipping_name}}</div>
      <div class="logistics-num">运单编号：{{logisticsMsg.logistics_sn}}</div>
      <div class="btn-copy" @click="copyLogisticsNum">复制</div>
    </div>
    <div v-if="logisticsMsg.message_list" class="progress">
      <div v-for="(item, index) in logisticsMsg.message_list" :key="item" :class="{'progress-item-active': index === 0}" class="progress-item">
        <div class="circle-box">
          <div class="circle-big">
            <div class="progress-circle"></div>
          </div>
        </div>
        <div class="progress-msg">
          <div class="progress-text">{{item.context}}</div>
          <!--<div class="progress-text">手机： <p class="phone" @click="phoneCall('534156156656')">534156156656</p></div>-->
          <div class="progress-time">{{item.time}}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'LOGISTICS_INFOMATION'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        logisticsName: '顺丰快递',
        logisticsNum: '71653604071380',
        id: '',
        logisticsMsg: {}
      }
    },
    onLoad(option) {
      let options = option || this._$$initOptions()
      this.id = options.id || this.id
      this.getLogistics()
    },
    methods: {
      getLogistics() {
        API.Order.logistics({ data: { id: this.id } })
          .then((res) => {
            this.logisticsMsg = res.data
          })
          .catch(() => {

          })
      },
      copyLogisticsNum() {
        wx.setClipboardData({
          data: this.logisticsMsg.logistics_sn
        })
      },
      phoneCall(phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .logistics-information
    min-height: 100vh
    background: $color-white

  .info-header
    height: 25.867vw
    position: relative
    padding: 20px
    box-sizing: border-box
    .info-img
      width: 100%
      height: 100%
      position: absolute
      top: 0
      left: 0

  .logistics-name
    font-size: $font-size-18
    font-family: $font-family-medium
    color: $color-white
    position: relative
    margin-top: 5px
    line-height: 1
    z-index: 1

  .logistics-num
    line-height: 1
    font-size: $font-size-15
    font-family: $font-family-regular
    color: $color-white
    position: relative
    margin-top: 14px
    z-index: 1

  .btn-copy
    border-1px($color-white, 10px)
    position: absolute
    right: 15px
    box-sizing: border-box
    bottom: 22.5px
    color: $color-white
    width: 54px
    height: 20px
    line-height: 20px
    text-align: center
    font-size: $font-size-12
    font-family: $font-family-regular
    z-index: 1

  .progress
    padding: 27.5px 13px 0
    .progress-item
      display: flex
      align-items: flex-start
      position: relative
      padding-bottom: 32px
      &:after
        content: ''
        position: absolute
        height: 100%
        width: 1px
        transform: scaleX(0.5)
        background: #C8CACF
        left: 10.57px
        top: 3px
        z-index: 0
      &:last-child
        &:after
          display: none
      .circle-box
        margin-top: 3px
        position: relative
        z-index: 3
        background: $color-white
        border: 3px solid $color-white
        border-radius: 100%
      .circle-big
        margin-left: 5.5px
        display: flex
        align-items: center
        justify-content: center
        background: rgba(0, 0, 0, 0)
        border-radius: 100%
        .progress-circle
          border-radius: 100%
          background: #C8CACF
          width: 5px
          height: @width
      .progress-msg
        margin-left: 11px
        .progress-text
          line-height: 19px
          font-size: $font-size-13
          color: $color-text-sub
          font-family: $font-family-regular
          display: flex
          align-items: center
          .phone
            color: #5B93E1
        .progress-time
          margin-top: 9px
          color: $color-text-sub
          font-family: $font-family-regular
          font-size: $font-size-12

    .progress-item-active
      .circle-box
        margin-top: 0
      .circle-big
        width: 16px
        margin-left: 0
        height: @width
        background: rgba(25, 182, 180, .2)
        .progress-circle
          background: #19B6B4
          width: 8px
          position: relative
          height: @width
      .progress-msg
        .progress-text
          font-size: $font-size-14
          color: $color-main
</style>
