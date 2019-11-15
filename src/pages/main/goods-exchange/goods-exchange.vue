<template>
  <div class="goods-exchange">
    <navigation-bar title="兑换商城"></navigation-bar>
    <ul v-if="list.length" class="goods-ul">
      <li v-for="item in list" :key="item.id" class="goods-item" @click="goToDetail(item)">
        <div class="goods-item-wrap">
          <img :src="item[GOODS_TPL.image]" mode="aspectFill" class="goods-img">
          <div class="title">{{item[GOODS_TPL.name]}}</div>
          <div class="ex-goods-dou">
            <img src="./pic-dhqprice@2x.png" mode="aspectFill" class="ex-dou-icon">
            <p class="price">{{item[GOODS_TPL.price1]}}</p>
          </div>
          <!--<div class="exchange-wrapper"><img src="/static/images/pic-dhqprice.png" alt="" class="exc-icon">-->
          <!--<div class="number">{{item[GOODS_TPL.price1]}}</div>-->
          <!--</div>-->
        </div>
      </li>
    </ul>
    <div class="empty-page" v-else-if="isEmpty">
      <empty image="/static/images/pic-empty@2x.png" tip="你的页面是空的"></empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'
  import wx from 'wx'

  const PAGE_NAME = 'GOODS_EXCHANGE'

  const GOODS_TPL = {
    image: 'goods_cover_image',
    icon: '兑换',
    name: 'name',
    price1: 'integral_price'
  }

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        GOODS_TPL,
        list: [],
        isEmpty: false,
        totalPage: 0,
        params: {
          limit: 10,
          page: 1
        }
      }
    },
    onLoad() {
      const res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this._getGoodsList()
      // this.isEmpty = true
    },
    onReachBottom() {
      if (this.params.page + 1 > this.totalPage || this.loading) return
      this.params.page++
      this._getGoodsList()
    },
    onPullDownRefresh() {
      this.params.page = 1
      this._getGoodsList({ loading: false })
      wx.stopPullDownRefresh()
    },
    methods: {
      // 获取商品列表
      _getGoodsList(other) {
        this.loading = true
        API.Goods.getExchangeGoodsList({ data: this.params, ...other }).then(res => {
          if (this.params.page === 1) this.list = []
          this.list = this.list.concat(res.data)
          this.totalPage = res.meta.last_page
          this.loading = false
          this.isEmpty = !this.list.length
        }).catch(() => {
          this.loading = false
        })
      },
      // 去详情
      goToDetail(item) {
        wx.navigateTo({ url: this.$routes.main.GOODS_DETAIL_EXCHANGE + '?id=' + item.id })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@style/goods-card-item.styl"
  @import "~@design"

  .goods-exchange
    min-height: 100vh
    background: $color-background

  .goods-ul
    display flex
    flex-wrap wrap
    padding: 5px 0 17.5px 5px

  .empty-page
    flex: 1
    padding: 50px 0 0 5px

  .ex-goods-dou
    display: flex
    margin 0 10px
    padding-bottom: 20px
    .ex-dou-icon
      position: relative
      z-index: 2
      height: 19px
      width: 44.5px
    .price
      border-radius: 0 2px 2px 0
      margin-left: -3px
      padding: 0 8px
      color: $color-text-main
      background: #C4F1F0
      font-family: $font-family-din-bold
      font-size: $font-size-15
      height: 19px
      overflow: hidden
      line-height: 20px
</style>
