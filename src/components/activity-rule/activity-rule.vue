<template>
  <div class="popup " @touchmove.stop="" :class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'" @click="close">
    <!--<div class="mask"  ></div>-->
    <section class="content">
      <div class="activity-wrap">
        <div class="title">活动规则</div>
        <div class="close-btn" @click.stop="close"><img class="close-img" src="./icon-close4@2x.png"></div>
        <div class="praise-tip" v-if="ruleTip !== ''">{{ruleTip}}</div>
        <div class="activity-flow" v-for="(item, index) in ruleInfo" :key="index" v-if="ruleInfo.length">
          <div class="name">{{item}}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      ruleInfo: {
        type: Object,
        default: []
      },
      ruleTip: {
        type: String,
        default: ''
      },
      showPopup: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false,
        maskAnimation: '',
        modalAnimation: ''
      }
    },
    methods: {
      show() {
        this.$emit('update:showPopup', true)
        this.$emit('show')
      },
      close() {
        this.$emit('update:showPopup', false)
        this.$emit('cancel')
      },
      confirm() {
        this.$emit('update:showPopup', false)
        this.$emit('confirm')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .popup
    padding-top: 18.7vh
    box-sizing: border-box
    background: rgba(0, 0, 0, .5)
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0

  .mask
    fill-box()
    background-color: $color-text-main
    opacity: 0.8

  .content
    width: 295px
    min-height: 295px
    max-height: 326px
    background: $color-white
    border: 1px solid rgba(32, 32, 46, 0.10)
    border-radius: 4px
    padding: 0 25px
    box-sizing: border-box
    layout()
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    margin: auto
    .activity-wrap
      .title
        padding: 22.5px 0 25px
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
        text-align: center
      .close-btn
        position: absolute
        left: 50%
        bottom: -49px
        margin-left: -17px
        width: 34px
        height: 34px
        text-align: center
        line-height: 30.5px
        .close-img
          width: 100%
          height: 100%
      .praise-tip
        box-sizing: border-box
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-main
        line-height: 21px
        padding-bottom: 12px
      .activity-flow
        padding-bottom: 9px
        &:last-child
          padding-bottom: 30px
        .name
          text-align: left
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-text-main
          layout(row)
          align-items: flex-start
          line-height: 21px
          .num
            margin-right: 6.5px
            line-height: 18px
          .txt
            width: 252px
            line-height: 18px
        .flow-box
          width: 234px
          height: 58px
          margin: 0 auto 12px
          .flow-img
            width: 234px
            height: 58px
            img
              width: 100%
              height: 100%
          .text
            layout(row)
            justify-content: space-between
            align-items: center
            font-family: $font-family-medium
            font-size: $font-size-14
            color: #6E2900
            line-height: 18px

  .hide-popup
    opacity: 0
    z-index: -1
    transition: all 0.2s

  .fade-modal-enter-active
    opacity: 1
    z-index: 10
    transition: all 0.5s
</style>
