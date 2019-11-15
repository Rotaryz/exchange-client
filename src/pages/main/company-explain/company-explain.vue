<template>
  <div class="company-explain">
    <navigation-bar title="企业说明"></navigation-bar>
    <img :src="msg.cover_image" mode="widthFix" class="top-img">
    <div class="explain-info">
      <div class="explain-item">
        <div class="item-title">商家名称</div>
        <div class="item-text">{{msg.name}}</div>
      </div>
      <div class="explain-item">
        <div class="item-title">商家地址</div>
        <div class="item-text">{{msg.province}} {{msg.city}} {{msg.district}} {{msg.address}}</div>
      </div>
      <div class="explain-item">
        <div class="item-title">主营行业</div>
        <div class="item-text">{{msg.industry_name}}</div>
      </div>
      <div class="explain-item">
        <div class="item-title">营业时间</div>
        <div class="item-text">{{msg.opening_time_text}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'COMPANY_EXPLAIN'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        msg: {}
      }
    },
    onLoad() {
      this._getcompanyDetail()
    },
    methods: {
      _getcompanyDetail() {
        API.Home.companyDetail()
          .then((res) => {
            this.msg = res.data
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .company-explain
    width: 100%
    min-height: 100vh
    background: $color-white
    .top-img
      width: 100%
    .explain-info
      padding-left: 15px
      border-bottom-1px()
      .explain-item
        height: 50px
        layout(row)
        align-items: center
        border-bottom-1px()
        .item-title
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          margin-right: 20px
        .item-text
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-14
          flex: 1
          no-wrap()
          padding-right: 20px
        &:last-child
          border-none()
</style>
