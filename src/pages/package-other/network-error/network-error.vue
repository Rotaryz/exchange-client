<template>
  <div class="error lost">
    <navigation-bar title="" :showArrow="false"></navigation-bar>
    <div class="img-box">
      <img src="./pic-wifi@2x.png" class="error-img">
      <p class="text">网络繁忙，稍候再试吧！</p>
    </div>
    <div class="btn" @click="_refresh">刷新</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import app from '@src/app.json'

  const PAGE_NAME = 'ERROR'
  const TAB_BAR = app.tabBar.list
  export default {
    name: PAGE_NAME,
    data() {
      return {
        isTab: false,
        targetPage: ''
      }
    },
    onLoad() {
      this.targetPage = wx.getStorageSync('errorUrl')
      this.isTab = TAB_BAR.findIndex((item) => this.targetPage.includes(item.pagePath))
    },
    methods: {
      _refresh() {
        if (!getApp().globalData.isConnected) {
          this.$wechat.showToast('请检查您的网络')
          return
        }
        if (this.isTab === -1) {
          wx.redirectTo({ url: '/' + this.targetPage })
          return
        }
        wx.switchTab({ url: '/' + this.targetPage })
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .error
    height: 100vh
    background: $color-white
    padding-top: 9.4vh
    box-sizing: border-box

  .img-box
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    .error-img
      display: block
      height: 180px
      width: 200px
    .text
      line-height: 1
      text-align: center
      font-size: $font-size-14
      color: $color-text-sub
      font-family: $font-family-regular
      margin-top: 15.4px

  .btn
    border-radius: 20.5px
    width: 140px
    height: 41px
    line-height: 41px
    text-align: center
    color: $color-white
    background: $color-main
    font-size: $font-size-14
    margin: 23.5px auto
</style>
