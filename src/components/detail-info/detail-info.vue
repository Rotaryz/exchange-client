<template>
  <div class="goods-box">
    <div class="address-box" @click.stop="toAddressPage" v-if="showAddress">
      <div class="gray-txt">配送至:</div>
      <div class="address-txt" :class="{'address-txt-disable': !getAddress.receiver_district}">{{getAddress.receiver_district || getAddress.receiver_address ? getAddress.receiver_district + getAddress.receiver_address : '你还没填写地址喔～'}}</div>
      <img src="/static/images/arrow@2x.png" class="address-icon">
    </div>
    <div class="f8-line" v-if="showAddress"></div>
    <div class="shop-detail-box">
      <img class="shop-header" :src="getGoodsDetail.shop_image_url"/>
      <div class="ro-shop-msg">
        <div class="shop-name">{{getGoodsDetail.shop_name}}</div>
        <div class="shop-sign">{{getGoodsDetail.address}}</div>
      </div>
      <div class="come-shop-btn" @click.stop="_goShop">进店逛逛</div>
    </div>
    <div class="f8-line"></div>
    <div class="detail-box">
      <div class="detail-title">商品详情</div>
      <image :src="item.image_url" class="detail-img" mode="widthFix" v-for="(item, index) in getGoodsDetail.goods_detail_images" :key="index"></image>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      getAddress: {
        type: Object,
        default: {}
      },
      getGoodsDetail: {
        type: Object,
        default: {}
      },
      showAddress: {
        type: Boolean,
        default: false
      }
    },
    name: 'detail-info',
    data() {
      return {
      }
    },
    methods: {
      toAddressPage() {
        this.$emit('toAddressPage')
      },
      _goShop() {
        wx.switchTab({url: this.$routes.main.HOME})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .address-box
    padding: 0 15px
    height: 50px
    display: flex
    align-items: center
    justify-content: space-between
    .gray-txt
      font-family: PingFangSC-Regular
      font-size: $font-size-14
      color: $color-text-main
      letter-spacing: 0.3px
    .address-txt
      flex: 1
      no-wrap()
      font-family: PingFangSC-Medium
      font-size: $font-size-14
      letter-spacing: 0.3px
      margin: 0 10px
      color: $color-text-main
    .address-txt-disable
      color: $color-text-assist
    .address-icon
      width: 6px
      height: 12px
  .f8-line
    width: 100%
    height: 10px
    background: #F5F6FA
  .shop-detail-box
    height: 90px
    display: flex
    padding: 0 10px
    box-sizing: border-box
    position: relative
    .shop-header
      margin-top: 20px
      width: 50px
      height: 50px
      min-height: 50px
      min-width: 50px
      border-radius 50%
    .ro-shop-msg
      margin-top: 26px
      margin-left: 10px
    .shop-name
      no-wrap()
      font-size: $font-size-16
      color: $color-text-main
      line-height: 1.3
      font-family: $font-family-medium
    .shop-sign
      margin-top: 10px
      font-family: $font-family-regular
      color: $color-text-sub
      font-size: $font-size-12
      no-wrap()
      line-height: 1.3
    .ro-shop-msg
      width: 48vw
    .come-shop-btn
      border-1px(#FE7062, 29px)
      width: 70.5px
      height: 28px
      color: #FE7062
      font-size: 13px
      font-family: $font-family-regular
      text-align: center
      line-height: 28px
      col-center()
      right: 10px
  .detail-box
    .detail-title
      line-height: 52px
      padding: 0 15px
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-text-main
      letter-spacing: 0.8px
    .detail-img
      display: block
      margin: 0
      padding: 0
      width: 100%
      height: auto
</style>
