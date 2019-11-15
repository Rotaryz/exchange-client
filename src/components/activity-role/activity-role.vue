<template>
  <div class="activity-role" :class="{'active' : showCover}" @click.stop="closeCover">
    <div class="role-container" :class="{'active' : showCover}" @click.stop="">
      <div class="role-head border-bottom-1px">玩法详情</div>
      <div class="role-content">
        <img src="./pic-rule_group@2x.png" v-if="roleType === 'group'" class="group-rule">
        <div class="bargain-rule" v-if="roleType === 'bargain'">
          <view class="ro-rule-title ro-rule-title-one">1.活动流程是怎样的？</view>
          <img src="./pic-wfxq@2x.png" class="ro-rule-pic" mode="widthFix">
          <view class="ro-rule-title">2.砍掉后的价格是否对所有用户有效？</view>
          <view class="ro-rule-text">是的。所有用户可对同一个商品进行砍价，并享有砍掉后的商品价格，如商品A现价100元，当某用户砍掉2元后，所有人看到的现价更新为98元，并可在98元的基础上再进行砍价，直到砍到底价为止。</view>
          <view class="ro-rule-title">3.一个用户对一个商品能砍几次？</view>
          <view class="ro-rule-text">在活动有效期内，同一个用户对一个商品只能砍一次，若想要更低的价格，可邀请好友帮忙砍价。</view>
          <view class="ro-rule-title">4.一次能购买几件商品？</view>
          <view class="ro-rule-text">同一个用户一次下单只能购买一件商品。</view>
        </div>
      </div>
      <div class="close-box" @click.stop="closeCover">
        <img src="./icon-del@2x.png" class="close-icon">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        imageUrl: this.$imageUrl,
        showCover: false,
        roleAnimation: '',
        coverAnimation: '',
        roleType: 'group'
      }
    },
    onUnload() {
      this.roleAnimation = ''
      this.coverAnimation = ''
      this.showCover = false
    },
    methods: {
      closeCover() {
        // let roleAnimation = wx.createAnimation({
        //   duration: 500,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // let coverAnimation = wx.createAnimation({
        //   duration: 500,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // coverAnimation.opacity(0).step()
        // roleAnimation.scale(0.3).step()
        // this.roleAnimation = roleAnimation.export()
        // this.coverAnimation = coverAnimation.export()
        // setTimeout(() => {
        //   coverAnimation.opacity(1).step()
        //   roleAnimation.scale(1).step()
        //   this.roleAnimation = roleAnimation.export()
        //   this.coverAnimation = coverAnimation.export()
        //   this.showCover = false
        // }, 500)
        this.showCover = false
      },
      showModel(type) {
        this.roleType = type || 'group'
        this.showCover = true
        // let roleAnimation = wx.createAnimation({
        //   duration: 300,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // let coverAnimation = wx.createAnimation({
        //   duration: 300,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // coverAnimation.opacity(0).step()
        // roleAnimation.scale(0.3).step()
        // this.roleAnimation = roleAnimation.export()
        // this.coverAnimation = coverAnimation.export()
        // this.showCover = true
        // setTimeout(() => {
        //   coverAnimation.opacity(1).step()
        //   roleAnimation.scale(1).step()
        //   this.roleAnimation = roleAnimation.export()
        //   this.coverAnimation = coverAnimation.export()
        // }, 300)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .activity-role
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    z-index: -1
    background: rgba(31,31,31,0.8)
    display: flex
    align-items: center
    justify-content: center
    opacity: 0
    transition: all 0.3s
    &.active
      opacity: 1
      z-index: 10
    .role-container
      width: 270px
      height: 300px
      padding: 0 15px
      background: $color-white
      border-radius: 6px
      border: 1px solid rgba(32,32,46,0.10)
      overflow: hidden
      position: relative
      opacity: 0
      transition: all 0.3s
      &.active
        opacity: 1
      .role-head
        height: 50px
        text-align: center
        line-height: 50px
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
        letter-spacing: 0.8px
      .close-box
        width: 30px
        height: 30px
        position: absolute
        right: 10px
        top: 10px
        .close-icon
          width: 12px
          height: 12px
          all-center()
      .role-content
        width: 100%
        padding: 15px 0
        height: 220px
        overflow-y: auto
        -webkit-overflow-scrolling: touch
        .group-rule
          width: 226.5px
          height: 208px
          margin-left: 21px
        .bargain-rule
          .ro-rule-title
            font-size: $font-size-14
            color: $color-text-main
            margin-top: 20px
          .ro-rule-pic
            height: 70px
            width: 95%
            margin-top: 15px
          .ro-rule-title-one
            margin-top: 0
          .ro-rule-text
            line-height: 18px
            color: $color-text-sub
            font-size: $font-size-12
            margin-top: 10px

</style>
