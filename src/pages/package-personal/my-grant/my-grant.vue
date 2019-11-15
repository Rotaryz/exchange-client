<template>
  <div class="my-grant">
    <navigation-bar title="赠送记录"></navigation-bar>
    <div class="line-border"></div>
    <div class="grant-list">
      <div class="grant-item" v-for="(item, index) in grantList" :key="index">
        <div class="grant-left">
          <div class="grant-left-name">{{item.type_str}}</div>
          <div class="grant-left-time">{{item.created_at}}</div>
        </div>
        <div class="grant-right">{{item.total}}</div>
      </div>
    </div>
    <Empty v-if="isEmpty" :image="empty" :paddingTop="45.4" tip="你的赠送记录是空的"></Empty>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'MY_GRANT'
  const EMPTY = require('../../../../static/images/pic-order@2x.png')

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        empty: EMPTY,
        grantList: [],
        page: 1,
        totalPage: 1,
        isEmpty: false
      }
    },
    onLoad() {
      this._getList()
    },
    // 翻页
    onReachBottom() {
      if (this.page >= this.totalPage) {
        return
      }
      this.page++
      this._getList()
    },
    methods: {
      _getList(loading = false) {
        API.Exchange.beanLog({ data: { page: this.page }, loading, toast: false })
          .then((res) => {
            this.totalPage = res.meta.last_page
            if (this.page === 1) {
              this.grantList = res.data
              this.isEmpty = !this.grantList.length
            } else {
              this.grantList = this.grantList.concat(res.data)
            }
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .my-grant
    width: 100%
    min-height: 100vh
    background: $color-white
    .line-border
      height: 10px
      background: $color-background
      width: 100%
    .grant-list
      padding-left: 15px
      .grant-item
        layout(row)
        align-items: center
        justify-content: space-between
        padding: 15px 15px 14px 0
        border-bottom-1px()
        .grant-left-name
          font-size: $font-size-16
          color: $color-text-main
          font-family: $font-family-regular
          margin-bottom: 8px
        .grant-left-time
          font-size: $font-size-12
          color: $color-text-sub
          font-family: $font-family-regular
        .grant-right
          font-size: $font-size-18
          color: $color-main
          font-family: $font-family-medium
</style>
