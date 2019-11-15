<template>
  <div class="goods-classify">
    <navigation-bar title="赞播优品"></navigation-bar>
<!--    <scroll-view-->
<!--      :style="{top:statusBarHeight + 44 + 'px'}"-->
<!--      :scroll-into-view="toView"-->
<!--      scroll-x="true"-->
<!--      scroll-with-animation="true"-->
<!--      class="zb-scroll-menu menu-box"-->
<!--    >-->
<!--      <dl class="scroll-menu">-->
<!--        <dd v-for="(item,i) in menuList"-->
<!--            :key="i"-->
<!--            :id="'item'+item.id"-->
<!--            class="menu-item name"-->
<!--            :class="{active:params.category_id===item.id}"-->
<!--            @click="changeView(item,i)"-->
<!--        >-->
<!--          {{item.name}}-->
<!--        </dd>-->
<!--        <dt :style="{transform:'translateX('+transformX+')'}" class="slider-line-wrap">-->
<!--          <div class="line-wrap"></div>-->
<!--        </dt>-->
<!--      </dl>-->
<!--    </scroll-view>-->
    <ul v-if="list.length" class="goods-ul">
      <li v-for="item in list" :key="item.id" class="goods-item" @click="goToDetail(item)">
        <div class="goods-item-wrap">
          <img v-if="item[GOODS_TPL.image]" :src="item[GOODS_TPL.image]" mode="aspectFill" class="goods-img">
          <p class="title">{{item[GOODS_TPL.name]}}</p>
          <div class="price-vip">
            <div class="unit">¥</div>
            <div class="price-num">{{item[GOODS_TPL.price1] + '+' + item[GOODS_TPL.price2]}}</div>
            <img src="/static/images/pic-bd.png" class="vip-img"></div>
          <div class="price-sale">原价：¥<span class="price-num">{{item[GOODS_TPL.price3]}}</span></div>
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

  const PAGE_NAME = 'GOODS_CLASSIFY'

  const GOODS_TPL = {
    image: 'goods_cover_image',
    icon: '商城',
    name: 'name',
    price1: 'cash_price',
    price2: 'bean_price',
    price3: 'price'
  }

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        statusBarHeight: 20,
        toView: 'item0',
        toViewValue: '',
        menuList: [],
        params: {
          // category_id: 0,
          keyword: '',
          limit: 10,
          page: 1
        },
        totalPage: 0,
        list: [],
        transformX: '',
        GOODS_TPL,
        isEmpty: false,
        tabIndex: 0,
        isFirstLoad: true
      }
    },
    onLoad(options) {
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.params.category_id = options.id || 0
      this._getCategoryList()
    },
    onReachBottom() {
      if (this.params.page + 1 > this.totalPage || this.loading) return
      this.params.page++
      this._getGoodsList()
    },
    methods: {
      // 顶部 商品分类选择切换
      changeView(item, i) {
        this.tabIndex = i
        this.toViewValue = item.id
        let newIndex = i < 3 ? 0 : i > this.menuList.length - 3 ? this.menuList.length - 1 : i - 2
        this.toView = 'item' + this.menuList[newIndex].id
        this.transformX = i * 84 + 'px'
        this.params.category_id = item.id
        this.params.page = 1
        this._getGoodsList({ loading: false })
      },
      // 获去商品分类列表
      _getCategoryList() {
        this._getGoodsList()
        // API.Goods.getCategoryList().then(res => {
        //   this.menuList = res.data
        //   if (!this.params.category_id) {
        //     this.params.category_id = this.menuList.length ? this.menuList[0].id : ''
        //   }
        //   if (this.params.category_id) {
        //     let i = this.menuList.findIndex(item => item.id === Number(this.params.category_id))
        //     if (i >= 0) {
        //       let newIndex = i < 3 ? 0 : i > this.menuList.length - 3 ? this.menuList.length - 1 : i - 2
        //       this.toView = 'item' + this.menuList[newIndex].id
        //       this.transformX = i * 84 + 'px'
        //     }
        //   }
        //   this._getGoodsList()
        // })
      },
      // 获取商品列表
      _getGoodsList(other) {
        this.loading = this.isFirstLoad
        API.Goods.getGoodsList({ data: this.params, ...other }).then(res => {
          if (this.params.page === 1) this.list = []
          this.list = this.list.concat(res.data)
          this.totalPage = res.meta.last_page
          this.loading = false
          this.isEmpty = !this.list.length
        }).catch(() => {
          this.loading = false
          this.isEmpty = true
        })
        this.isFirstLoad = false
      },
      // 去详情
      goToDetail(item) {
        wx.navigateTo({ url: this.$routes.main.GOODS_DETAIL + '?id=' + item.id })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@style/goods-card-item.styl"
  @import "~@design"

  .goods-classify
    min-height: 100vh
    background: $color-background

  .zb-scroll-menu
    background-color $color-white
    position: fixed
    left: 0
    right: 0
    z-index: 500
    &::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .scroll-menu
      display flex
      align-items center
      flex-wrap: no-wrap
      height: 45px
      position relative
      .menu-item
        font-size $font-size-14
        padding: 0 10px
        line-height: 45px
        box-sizing border-box
        flex-shrink 0
        text-align center
        white-space nowrap
        overflow-x hidden
        text-overflow ellipsis
        width: 84px
        &.active
          font-size: $font-size-16
          font-family $font-family-medium
      .slider-line-wrap
        position absolute
        bottom: 0
        padding: 0 27px
        transition all 0.3s
        z-index: 50px
        .line-wrap
          height: 3px
          width: 30px
          border-radius: 2px
          background-color: $color-main

  .goods-ul
    display flex
    flex-wrap wrap
    padding: 10px 0 17.5px 5px

  .empty-page
    flex: 1
    padding: 100px 0 0 5px

</style>
