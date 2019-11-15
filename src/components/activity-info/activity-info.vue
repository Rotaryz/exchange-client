<template>
  <div>
    <div class="goods-info">
      <div class="goods-info-top">
        <div class="top">
          <div class="shop-info">
            <img class="img-way" v-if="activeInfo.avatar !== ''" :src="activeInfo.avatar" alt="">
            <img class="img-way" v-if="activeInfo.avatar === ''" :src="activeInfo.avatar" alt="">
            <div class="text">{{activeInfo.nickname}}</div>
          </div>
          <div class="activity-rules" @click.stop="showRule">
            <div class="text">活动规则</div>
            <!--icon-help@2x.png-->
            <img class="list-way" mode="aspectFill" src="./icon-help@2x.png">
          </div>
        </div>
        <div class="goods-bot">
          <div class="goods-img-box">
            <img class="goods-img" mode="aspectFill" :src="activeInfo.activity_cover_image" alt="">
          </div>
          <div class="info">
            <div class="top1">{{activeInfo.goods_title}}</div>
            <div class="bot" v-if="activeInfo.goods_price" :style="{color: colorText}">¥{{activeInfo.goods_price}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      activeInfo: {
        type: Object,
        default: {}
      },
      nindex: {
        type: Number,
        default: 0
      },
      colorText: {
        type: String,
        default: '#2c2c2c'
      }
    },
    data() {
      return {
        showCanvas: true
      }
    },
    onload() {
      // console.log(this.upList)
    },
    methods: {
      showRule() {
        this.$emit('showRule')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .goods-info-top
    width :100%
    .top
      height: 45px
      layout(row)
      align-items: center
      justify-content: space-between
      .shop-info
        layout(row)
        align-items: center
        flex: 1
        overflow: hidden
        .text
          font-family: $font-family-regular
          font-size: $font-size-13
          color: $color-text-main
          flex: 1
          overflow: hidden
          no-wrap()
        .img-way
          width: 30px
          height: 30px
          border-radius: 50%
          margin: 0 7px 0 10px
      .activity-rules
        layout(row)
        align-items: center
        .list-way
          width: 15px
          height: 15px
          margin: 0 10px 0 3px
          border-radius: 50%
        .text
          font-family: $font-family-regular
          font-size: $font-size-13
          color: #979BA5
    .goods-bot
      height: 120px
      background: #F7F8FC
      margin: 0 10px
      border-radius: 4px
      layout(row)
      .goods-img-box
        width: 100px
        height: 100px
        margin: 10px
        .goods-img
          width: 100px
          height: 100px
      .info
        font-family: $font-family-regular
        width: 192px
        layout()
        justify-content: space-between
        align-items: flex-start
        margin-top: 15px
        margin-bottom: 20px
        flex: 1
        overflow: hidden
        .top1
          font-size: $font-size-14
          color: $color-text-main
          height: 40px
          line-height: 20px
          no-wrap-plus()
        .bot
          font-size: $font-size-16
          color: $color-text-sub
          font-family: $font-family-regular
          line-height: 16px

</style>
