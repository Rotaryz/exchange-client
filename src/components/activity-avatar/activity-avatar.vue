<template>
  <div>
    <div class="warp" :style="warpStyle">
      <div class="warp-item" :style="boxStyle" v-for="(item, index) in activeInfo" :key="index">
        <img mode="aspectFill" v-if="item.avatar === '' && item.customer_id === 0" class="img" :src="logUrl" alt="">
        <img mode="aspectFill" v-if="item.avatar === '' && item.customer_id !== 0" class="img" src="/static/images/boygirl@2x.png" alt="">
        <img mode="aspectFill" v-if="item.avatar !== ''" class="img" :src="item.avatar" alt="">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      activeInfo: {
        type: Object,
        default: []
      },
      boxStyle: {
        type: String,
        default: '' // 例如: 默认item的width和高，还有两者上下外边距，默认值
      },
      warpStyle: {
        type: String,
        default: '' // 例如: 默认值外层容器的背景色，圆角
      },
      nindex: {
        type: Number,
        default: 0
      },
      logUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        upList: this.coupon, // 列表
        boxStyle: this.boxStyle, // item的样式
        warpStyle: this.warpStyle, // 外层容器的样式
        showCanvas: true
      }
    },
    onload() {
      // console.log(this.upList)
    },
    methods: {
      toGroup() {
        this.$emit('showGroup')
      },
      showConditions(i) {
        this.$emit('showConditions', i)
      },
      goShop(item) {
        this.$emit('goShop', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .warp
    min-height: 75px
    background: #F7F8FC
    border-radius: 4px
    margin: 0 10px
    box-sizing: border-box
    padding: 15px 12.5px
    layout(row)
    flex-wrap: wrap
    .warp-item
      width: 35px
      height: 35px
      margin: 5px 7.5px
      border-radius: 50%
      .img
        display: block
        width: 100%
        height: 100%
        box-sizing: border-box
        border: 1.5px solid $color-white
        border-radius: 50%
</style>
