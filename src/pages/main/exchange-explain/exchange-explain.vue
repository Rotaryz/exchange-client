<template>
  <div class="exchange-explain">
    <navigation-bar title="兑换说明"></navigation-bar>
    <div class="explain-box">
      <div class="explain-title">1.什么是兑换券？</div>
      <div class="explain-text">兑换券是店铺用户在消费过程中产生的兑换积分。</div>
      <div class="explain-title">2.怎么获取？</div>
      <div class="explain-text">消费获取：到企业消费获取，消费越多获取越多。<br/>储值获取：到企业购买储值套餐，储值越多，送的越多。</div>
      <div class="explain-title">3.兑换券有效期多长？</div>
      <div class="explain-text">交易/奖励积分永久有效，活动奖励积分有效期以具体活动说明为主。</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'EXCHANGE_EXPLAIN'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .exchange-explain
    background: $color-white
    min-height: 100vh
    .explain-box
      border-top-1px()
      padding: 25px 15px
      .explain-title
        font-size: $font-size-16
        font-family: $font-family-regular
        color: $color-text-main
        margin-bottom: 10px
      .explain-text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-sub
        line-height: $font-size-21
        margin-bottom: 25px
</style>
