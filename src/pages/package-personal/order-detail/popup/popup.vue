<template>
  <!--:class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'" @click="close"-->
  <div class="popup " :class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'" @click="close">
    <div class="popup-content">
      <img src="./bg-codecard@2x.png" class="pop-bg">
      <div class="pop-title">展示兑换码领取商品</div>
      <img src="" alt="" class="qr-code">
      <div class="code-num">823 567</div>
      <div class="pop-tip">到店核销领取商品</div>
    </div>
  </div>
</template>

<script>
  const PAGE_NAME = 'popup'

  export default {
    name: PAGE_NAME,
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
      }
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
  .popup
    padding-top: 17.5vh
    box-sizing: border-box
    background: rgba(39, 39, 62, .7)
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0

  .popup-content
    position: relative
    width: 84vw
    height: 124.67vw
    margin: 0 auto
    .pop-bg
      top: 0
      left: 0
      width: 100%
      height: 100%
      position: absolute

  .pop-title
    position: relative
    z-index: 1
    line-height: 1
    text-align: center
    padding: 8vw 0 19.067vw
    font-family: $font-family-medium
    font-size: $font-size-18
    color: $color-text-main

  .qr-code
    position: relative
    z-index: 1
    width: 48vw
    height: @width
    background: $image-color
    display: block
    margin: 0 auto

  .code-num
    background: #F5F6FA
    width: 205px
    text-align: center
    font-size: $font-size-22
    font-family: $font-family-medium
    color: $color-text-main
    line-height: 33px
    border-radius: 16.5px
    margin: 15.33vw auto 0
    position: relative
    z-index: 1

  .pop-tip
    position: relative
    z-index: 1
    color $color-text-sub
    font-size: $font-size-14
    font-family: $font-family-regular
    margin-top: 9px
    text-align: center

  .hide-popup
    opacity: 0
    z-index: -1
    transition: all 0.2s

  .fade-modal-enter-active
    opacity: 1
    z-index: 1000
    transition: all 0.5s
</style>
