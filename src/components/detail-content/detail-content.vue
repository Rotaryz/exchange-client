<template>
  <div class="detail-container">
    <div class="f4-line"></div>
    <div class="store-container">
      <div class="detail-title border-bottom-1px">{{'服务详情'}}</div>
      <div class="service-detail">
        <div class="img-content">
          <img :src="item.image_url" class="img-item" mode="widthFix" v-for="(item, index) in goodsDetail.goods_detail_images" :key="index">
        </div>
      </div>
    </div>
    <div class="f4-line"></div>
    <div class="store-container">
      <div class="detail-title border-bottom-1px">购买须知</div>
      <div class="know-detail">
        <div class="know-item">
          <div class="know-title">有效期</div>
          <div class="know-down">{{goodsDetail.use_start_at + ' 至 ' + goodsDetail.use_end_at}}</div>
        </div>
        <div class="know-item" v-if="goodsDetail.config && goodsDetail.config.message">
          <div class="know-title">预约信息</div>
          <div class="know-down">{{goodsDetail.config ? (goodsDetail.config.message || '') : ''}}</div>
        </div>
        <div class="know-item" v-if="goodsDetail.note && goodsDetail.note.is_show">
          <div class="know-title">温馨提示</div>
          <div class="know-down">{{goodsDetail.note ? (goodsDetail.note.message || '') : ''}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      goodsDetail: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        imageUrl: this.$imageUrl,
        msgCode: {
          1: 40022,
          2: 40014
        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .detail-container
    width: 100vw
    background: $color-white
    .f4-line
      width: 100%
      height: 10px
      background: $color-background
    .detail-title
      line-height: 50px
      font-size: $font-size-16
      color: $color-text-main
      font-family: $font-family-medium
      letter-spacing: 0.8px
    .store-container
      padding-left: 15px
      .service-detail
        padding-right: 15px
        .img-content
          padding: 10px 0
          font-size: 0
          .img-item
            width: 100%
      .know-detail
        padding: 20px 15px 20px 0
        .know-item
          margin-bottom: 15px
          .know-title
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-text-sub
            letter-spacing: 0.6px
            margin-bottom: 10px
          .know-down
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-text-main
            display: flex
            align-items: center
            word-break: break-all
            line-height: 18px
            &:before
              content: ''
              display: block
              width: 2px
              height: 2px
              border-radius: 50%
              background: $color-text-main
              margin-right: 8px
              margin-left: 2px


</style>
