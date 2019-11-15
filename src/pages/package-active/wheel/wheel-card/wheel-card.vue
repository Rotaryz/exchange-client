<template>
  <div class="wheel-card">
    <div class="wrapper">
      <div class="avatar-wrapper">
        <img class="icon-img" mode="aspectFill" v-if="item.avatar" :src="item.avatar" alt="">
      </div>
      <p class="info">{{item.text}}</p>
      <p class="date">{{item.created_at}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      item: {
        type: Object,
        default: {}
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .icon-img
    width: 100%
    height: 100%

  .wheel-card
    height: 0
    padding-top: 9.846153846153847%
    position: relative
    background: rgba(0, 0, 0, 0.2)
    border-radius: 32px;
    .wrapper
      fill-box(absolute)
      layout(row, block, nowrap)
      align-items: center
      .avatar-wrapper
        width: 6.4vw
        height @width
        border-radius: 50%
        overflow: hidden
        margin: 0 8.5px 0 6px
      .date
        font-family: PingFangSC-Light;
        font-size: 3.2vw
        color: #FFFFFF;
        margin: 0 13.5px 0 6px
      .info
        flex: 1
        overflow: hidden
        font-family: PingFangSC-Regular;
        font-size: 3.2vw
        color: #FFFFFF;
        no-wrap()
</style>
