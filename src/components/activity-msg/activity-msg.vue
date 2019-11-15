<template>
  <div class="popup " @touchmove.stop="" :class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'" @click="close">
    <!--<div class="mask"  ></div>-->
    <section class="content">
      <div class="close-btn" @click.stop="close"><img class="close-img" src="./icon-close_red@2x.png" alt=""></div>
      <div class="msg-top">
        <div class="img" v-if="activeInfo.avatar_type === 1 && activeInfo.avatar_image_url === ''"><img class="msg-top-img" src="/static/images/boygirl@2x.png" alt=""></div>
        <div class="img" v-if="activeInfo.avatar_type === 1 && activeInfo.avatar_image_url !== ''"><img class="msg-top-img" :src="activeInfo.avatar_image_url" alt=""></div>
        <div class="txt" v-if="activeInfo.activity_txt !== ''">{{activeInfo.activity_txt}}<span class="price" v-if="bargainPrice > 0"><span class="num">{{bargainPrice}}</span>元</span></div>
      </div>
      <div class="msg-center" v-if="activeInfo.tip_msg.length > 0">
        <div class="bg-img">
          <img :class="{'move': isShowAnimate}" :src="bgUrl" alt="">
        </div>
        <div class="img"><img :src="avatarUrl" alt=""></div>
        <div class="all-title">
          <div class="tit" v-for="(item,index) in activeInfo.tip_msg" :key="index">{{item}}<span class="price" v-if="myBargainPrice > 0 && index < 1"><span class="num">{{myBargainPrice}}</span>元</span></div>
        </div>
      </div>
      <div class="msg-show-txt" v-if="activeInfo.show_tip !== ''">{{activeInfo.show_tip}}</div>
      <div class="btn-group">
        <form class="btn-box" report-submit @submit="$getFormId">
          <button class="btn sharp-btn" v-if="activeInfo.btnType === 1" @click.stop="close" formType="submit">{{activeInfo.share_text}}</button>
          <button class="btn sharp-btn" open-type="share" v-else formType="submit">{{activeInfo.share_text}}</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      useType: String,
      activeInfo: {},
      bargainPrice: {
        type: Number,
        default: 0 // 顶部砍价金额
      },
      myBargainPrice: {
        type: Number,
        default: 0 // 底部砍价金额
      },
      sureString: {
        type: String,
        default: '删除'
      },
      bgUrl: {
        type: String,
        default: require('./bg-chang.png')
      },
      isShowAnimate: {
        type: Boolean,
        default: false
      },
      avatarUrl: {
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
        isShow: false
      }
    },
    methods: {
      show() {
        this.$emit('update:showPopup', true)
        this.$emit('show')
      },
      close() {
        this.$emit('update:showPopup', false)
        this.$emit('close')
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
    padding-top: 24.4vh
    box-sizing: border-box
    background: rgba(0, 0, 0, .5)
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    display: flex
    justify-content: center
    .content
      position: relative
      width: 295px
      min-height: 292px
      max-height: 368px
      background-image: linear-gradient(134deg, #FD7035 0%, #F74943 100%)
      border-radius: 8px
      layout()
      left: 0
      top: 0
      bottom: 0
      right: 0
      .msg-show-txt
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #FFF8DC
        text-align: center
        margin-top: 98px
        margin-bottom: 69px
        line-height: 1
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
      .msg-top
        height: 20px
        margin-top: 20px
        layout(row)
        justify-content: center
        align-items: center
        .img
          width: 20px
          margin-right: 6px
          height: 20px
          border-radius: 50%
          border: 1.5px solid #fff
          .msg-top-img
            width: 20px
            height: 20px
            border-radius: 50%
        .txt
          font-size: $font-size-13
          color: #FFE67E
          line-height: 1
          .price
            .num
              font-size: $font-size-13
              color: $color-white
      .msg-center
        text-align: center
        position: relative
        margin-top: 40px
        .bg-img
          position: absolute
          left: 42px
          top: -51.5px
          width: 213px
          height: 213px
          z-index: 1
          img
            position: absolute
            display: block
            width: 100%
            height: 100%
            transform: rotate(30deg)
            &:nth-child(1)
              transform: rotate(0deg)
          .move
            animation: Tada 4s linear infinite
        .img
          position: absolute
          z-index: 5
          margin: 0 auto 17.5px
          left: 42px
          top: -51.5px
          width: 213px
          height: 213px
          img
            position: absolute
            display: block
            width: 100%
            height: 100%
        .all-title
          padding-top: 139.5px
          .tit
            position: relative
            z-index: 5
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #FFF8DC
            text-align: center
            line-height: 21px
            .price
              .num
                font-family: $font-family-medium
                font-size: $font-size-20
      .btn-group
        width: 240px
        height: 44px
        margin: 0 auto
        padding: 30px 0 25px 0
        .sharp-btn
          width: 240px
          height: 44px
          background-image: linear-gradient(-180deg, #FFDA15 0%, #FDBA00 100%)
          border-radius: 22px
          font-family: $font-family-medium
          font-size: $font-size-16
          color: #6E2900
          text-align: center
          line-height: 44px
          &:before, &:after
            content: ""
            display: block
            border: none
    @-webkit-keyframes Tada
      0%
        transform: rotate(0deg)
      50%
        transform: rotate(180deg)
      100%
        transform: rotate(360deg)

  .hide-popup
    opacity: 0
    z-index: -1
    transition: all 0.2s

  .fade-modal-enter-active
    opacity: 1
    z-index: 10
    transition: all 0.5s
</style>
