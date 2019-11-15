<template>
  <div class="service-popup" :class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'" @click="close">
    <div class="content" @click.stop>
      <img mode="aspectFill" src="./pic-card@2x.png" class="content-image">
      <div class="shop-msg">
        <div class="shop-header-box">
          <img :src="couponMsg.goods_image" class="shop-header" mode="aspectFill">
        </div>
        <div class="shop-content">
          <p class="shop-name">{{couponMsg.name}}</p>
          <p class="shop-time">有效期至 {{couponMsg.time}}</p>
        </div>
        <img src="/static/images/arrow@2x.png" class="way">
      </div>
      <div class="code-box">
        <img :src="couponMsg.qrcode_url" v-if="couponMsg.qrcode_url" class="code" mode="aspectFill">
      </div>
      <div class="code-num">{{couponMsg.code}}</div>
      <p class="code-tip">该券码用于线下门店核销使用</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'SERVICE_POPUP'
  // 查看服务码弹窗
  export default {
    name: COMPONENT_NAME,
    props: {
      // 是否展示弹窗，可使用.sync
      showPopup: {
        type: Boolean,
        default: false
      },
      // 点击阴影是否可以关闭弹窗
      isSituationClose: {
        type: Boolean,
        default: true
      },
      // 二维码图片链接
      codeImage: {
        type: String,
        default: ''
      },
      couponMsg: {
        type: Object,
        default: {
          goods_image: '',
          name: '国颐堂养发SPA馆瑶发堂国颐堂养发SPA馆瑶发堂国颐堂养发SPA馆瑶发堂',
          time: 'asfasfaasf',
          qrcode_url: '',
          code: 56456464
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      // 点击阴影是否可以关闭弹窗
      close() {
        if (!this.isSituationClose) return
        this.$emit('update:showPopup', false)
        this.$emit('hidePopup')
      },
      // 取消
      hidePopup() {
        this.$emit('update:showPopup', false)
        this.$emit('hidePopup')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .service-popup
    padding-top: 20.2vh
    box-sizing: border-box
    background: rgba(39, 39, 62, .7)
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0

  .hide-popup
    opacity: 0
    z-index: -1
    transition: all 0.2s

  .fade-modal-enter-active
    opacity: 1
    z-index: 1000
    transition: all 0.5s

  .content
    position: relative
    height: 110.8vw
    width: 84vw
    margin: 0 auto
    .content-image
      position: absolute
      height: 100%
      width: 100%
      z-index: 1
      top: 0
      left: 0
    .shop-msg
      position: relative
      z-index: 2
      height: 31.2vw
      padding: 25px 20px 25px 15px
      box-sizing: border-box
      display: flex
      .shop-header-box
        height: 17.87vw
        width: @height
        margin-right: 10px
      .shop-header
        background: $color-background
        height: 17.87vw
        width: @height
      .shop-content
        height: 17.87vw
        display: flex
        flex-direction: column
        justify-content: space-between
        flex: 1
        width: 0
        margin-right: 15px
        .shop-name
          transform: translateY(-4px)
          font-size: $font-size-16
          line-height: 21px
          font-family: $font-family-regular
          color: $color-1F1F1F
          no-wrap-plus(2)
        .shop-time
          font-family: $font-family-regular
          line-height: 1
          color: #979BA5
          font-size: $font-size-12
      .way
        margin :auto 0
        width: 13px
        height: 13px
    .code-box
      height: 42vw
      width: @height
      margin: 7.8vw auto
      .code
        height: 42vw
        width: @height
        z-index: 2
        position: relative
        display: block
    .code-num
      color: $color-text-main
      font-size: $font-size-20
      font-family: $font-family-medium
      position: relative
      z-index: 2
      border-radius: 13px
      background: #F5F6FA
      margin: 5.467vw auto 0
      width: 44vw
      height: 26px
      line-height: 26px
      text-align: center
    .code-tip
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist
      position: relative
      z-index: 2
      text-align: center
      margin: 3.467vw auto 0
</style>
