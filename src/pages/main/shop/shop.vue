<template>
  <div class="shop">
    <navigation-bar title="门店" :showArrow="false" titleColor="#000" :isOpacity="false" :translucent="true"></navigation-bar>
    <div class="header-background" :style="{height: navHeight + (17.6 + 50) + 'px'}">
      <img :src="shopInfo.avatar" alt="" class="h-bg" mode="aspectFill">
      <div :style="{height: navHeight + 17.6 + 'px'}"></div>
      <div class="h-mask"></div>
    </div>
    <div class="content-wrapper">
      <div :style="{height: navHeight + 10 + 'px'}"></div>
      <header class="common-panel logo-wrapper">
        <p class="title">{{shopInfo.name}}</p>
        <figure class="middle">
          <img :src="shopInfo.avatar" alt="" class="logo" mode="aspectFill">
          <div class="m-right">
            <nav class="stars-wrapper">
              <block v-for="(star, index) in shopInfo.comment" :key="index">
                <img v-if="star===0" src="./icon-greystar@1x.png" alt="" class="star">
                <img v-else-if="star===1" src="./icon-star@1x.png" alt="" class="star">
                <img v-else src="./icon-halfstar@1x.png" alt="" class="star">
              </block>
              <p class="star-text">大众点评</p>
            </nav>
            <p class="open-hours">营业时间：{{shopInfo.opening_time_text}}</p>
          </div>
        </figure>
        <div v-if="shopInfo.province" class="bottom">
          <img src="./icon-address@1x.png" alt="" class="icon-address">
          <p class="address">{{shopAddress}}</p>
        </div>
      </header>
      <dl v-if="tabList.length" class="tab-wrapper" id="tab" ref="tab">
        <dt class="line-wrapper" :style="'transform: translate3d(' + tabIndex*66 + 'px,0,0)'"><div class="line"></div></dt>
        <dd v-for="(item, index) in tabList" :key="index" class="tab-item" :class="{active: tabIndex === index}" @click="handTabChange(item, index)">{{item.text}}</dd>
      </dl>
      <dl v-if="tabList.length" class="tab-wrapper fly" :style="{top: navHeight + 'px'}" :class="{'show-tab': showTab}">
        <dt class="line-wrapper" :style="'transform: translate3d(' + tabIndex*66 + 'px,0,0)'"><div class="line"></div></dt>
        <dd v-for="(item, index) in tabList" :key="index" class="tab-item" :class="{active: tabIndex === index}" @click="handTabChange(item, index)">{{item.text}}</dd>
      </dl>
      <block v-for="(tab, tIdx) in tabList" :key="tab.id">
        <section v-if="tab.id==='#cutModule' && tab.list.length" :id="'active-'+tIdx" class="common-panel active-wrapper">
          <div class="anchor" :style="activeWrapperStyles" id="cutModule"></div>
          <p class="title">砍价抢购</p>
          <block v-for="(item, index) in tab.list" :key="index">
            <div class="common-card border-bottom-1px" @click="handleNav(item, index, tab.getUrl)">
              <img :src="item.image_url" alt="" class="picture" mode="aspectFill" lazy-load="true">
              <article class="content-wrapper">
                <p class="title"><span class="icon cut">砍</span>{{item.name}}</p>
                <div class="c-middle">
                  <p v-if="item.stock < 100" class="icon">仅剩{{item.stock}}份</p>
                </div>
                <p class="price-wrapper"><span class="unit">¥</span><span class="number">{{item.bottom_price}}</span><span class="origin">¥{{item.goods_price}}</span></p>
                <button class="button red">我要砍价</button>
              </article>
            </div>
          </block>
        </section>
        <section v-if="tab.id==='#hotModule' && tab.list.length" :id="'active-'+tIdx" class="common-panel active-wrapper">
          <p class="title">火爆拼团</p>
          <block v-for="(item, index) in tab.list" :key="index">
            <div class="common-card border-bottom-1px" @click="handleNav(item, index, tab.getUrl)">
              <img :src="item.image_url" alt="" class="picture" mode="aspectFill" lazy-load="true">
              <article class="content-wrapper">
                <p class="title"><span class="icon group">团</span>{{item.name}}</p>
                <div class="c-middle">
                  <p v-if="item.stock < 100" class="icon">仅剩{{item.stock}}份</p>
                  <p class="icon">{{item.number}}人团</p>
                </div>
                <p class="price-wrapper"><span class="unit">¥</span><span class="number">{{item.price}}</span><span class="origin">¥{{item.goods_price}}</span></p>
                <button class="button red">去开团</button>
              </article>
            </div>
          </block>
        </section>
        <section v-if="tab.id==='#serveModule' && tab.list.length" :id="'active-'+tIdx" class="common-panel active-wrapper">
          <div class="anchor" :style="activeWrapperStyles" id="serveModule"></div>
          <p class="title">门店服务</p>
          <block v-for="(item, index) in tab.list" :key="index">
            <div class="common-card border-bottom-1px" @click="handleNav(item, index, tab.getUrl)">
              <img :src="item.goods_cover_image" alt="" class="picture" mode="aspectFill" lazy-load="true">
              <article class="content-wrapper">
                <p class="title">{{item.name}}</p>
                <div class="c-middle"></div>
                <p class="price-wrapper"><span class="unit">¥</span><span class="number">{{item.price}}</span><span class="origin">¥{{item.original_price}}</span></p>
                <button class="button green">购买</button>
              </article>
            </div>
          </block>
        </section>
      </block>
      <empty v-if="showEmpty" marginTop="50px" image="/static/images/pic-empty@2x.png" tip="暂无数据"></empty>
    </div>
    <img v-if="earnMoney.is_show" src="./pic-fxzq@2x.png" alt="" class="share-money" mode="aspectFill" @click="handleNavToShare">
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import AppPromise from '@utils/app-promise'
  import { globalComputed } from '@state/helpers'
  import $routes from '@utils/routes'
  import { objDeepCopy } from '@utils/common'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'SHOP'

  const TAB_HEIGHT = 54

  function createStars(score = 0, maxNumber = 5) {
    score += ''
    const scores = score.split('.')
    let allStar = new Array(+scores[0]).fill(1)
    let halfStar = scores[1] ? [scores[1] / 10] : []
    let emptyStar = new Array(maxNumber - +scores[0] - halfStar.length).fill(0)
    return allStar.concat(halfStar).concat(emptyStar)
  }

  // const emptyUrl = require('/static/images/pic-empty@2x.png')

  const TAB_LIST = [
    {
      text: '砍价',
      id: '#cutModule',
      list: [],
      getUrl: (item) => {
        return `${$routes.active.BARGAIN_DETAIL}?goodsId=${item.goods_id}&activeId=${item.id}`
      }
    },
    {
      text: '拼团',
      id: '#hotModule',
      list: [],
      getUrl: (item) => {
        return `${$routes.active.GROUP_GOODS_DETAIL}?goodsId=${item.goods_id}&activeId=${item.id}`
      }
    },
    {
      text: '服务',
      id: '#serveModule',
      list: [],
      getUrl(item) {
        return `${$routes.main.SERVE_DETAIL}?goodsId=${item.id}`
      }
    }
  ]

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        tabList: [],
        tabIndex: 0,
        showTab: false,
        shopInfo: {},
        earnMoney: {},
        firstLoading: true,
        timer: '',
        currentShopId: 0,
        hasMore: true,
        page: 1,
        refreshCount: 0,
        showEmpty: false
      }
    },
    computed: {
      ...globalComputed,
      navHeight() {
        return this.statusBarHeight + 44
      },
      activeWrapperStyles() {
        const height = TAB_HEIGHT + this.navHeight - 15
        return `position: absolute;height ${height}px;top: -${height}px`
      },
      shopAddress() {
        return this.shopInfo.province + this.shopInfo.city === this.shopInfo.province ? '' : this.shopInfo.city + this.shopInfo.district + this.shopInfo.address
      }
    },
    onLoad(options) {
      AppPromise.getInstance().then(() => {
        this.currentShopId = this.$storage('shopId')
        this._getShopInfo()
        this._hasShareEarn()
        this._getTabInfo()
      })
    },
    onShow() {
      AppPromise.getInstance().then(() => {
        if (this.refreshCount > 0) {
          this.tabMove()
        }
        this.refreshCount++
        if (this.currentShopId === this.$storage('shopId')) return
        this.currentShopId = this.$storage('shopId')
        wx.pageScrollTo({
          duration: 0,
          scrollTop: 0,
          complete: () => {
            this.firstLoading = true
            this.page = 1
            this.hasMore = true
            this.tabIndex = 0
            this.tabList = []
            this._getShopInfo()
            this._hasShareEarn()
            this._getTabInfo()
            this.handTabChange({}, 0)
          }
        })
      })
    },
    onPullDownRefresh() {
      this.page = 1
      this.hasMore = true
      this._getShopInfo()
      this._hasShareEarn()
      this._getTabInfo(() => {
        wx.stopPullDownRefresh()
      })
    },
    onReachBottom() {
      this.page++
      this._getServeList()
    },
    methods: {
      tabMove() {
        const target = getApp().globalData.tabParams || {}
        if (target.id) {
          const index = this.tabList.findIndex(val => val.id === target.id)
          index > -1 && this.handTabChange(this.tabList[index], index)
          getApp().globalData.tabParams = null
        }
      },
      _getShopInfo() {
        API.Shop.getShopInfo().then(res => {
          this.shopInfo = res.data
          this.shopInfo.comment = createStars(res.data.star)
        })
      },
      _hasShareEarn() {
        API.Shop.hasShareEarn().then(res => {
          this.earnMoney = res.data
        })
      },
      _getServeList() {
        if (!this.hasMore) return
        const index = this.tabList.findIndex(val => val.id === '#serveModule')
        if (index === -1) return
        const data = { page: this.page }
        API.Shop.getServeList({ data }).then(res => {
          if (this.page === 1) {
            this.tabList[index].list = res.data
          } else {
            this.tabList[index].list = this.tabList[index].list.concat(res.data)
          }
          this.hasMore = res.meta.current_page < res.meta.last_page
        })
      },
      async _getTabInfo(cb) {
        if (this.firstLoading) {
          this.firstLoading = false
          this.$wechat.showLoading()
        }
        Promise.all([API.Shop.getActiveList(4), API.Shop.getActiveList(1), API.Shop.getServeList()])
          .then(result => {
            let arr = objDeepCopy(TAB_LIST)
            for (let index in result) {
              arr[index].list = result[index].data || []
            }
            this.tabList = arr.filter(item => item.list.length)
            this.tabMonitor(() => {
              this.tabMove()
            })
          })
          .catch((e) => {
            console.error(e)
            this.tabList = []
          })
          .finally(() => {
            this.$wechat.hideLoading()
            this.showEmpty = !this.tabList.length
            cb && cb()
          })
      },
      handleNavToShare() {
        wx.navigateTo({ url: `${this.$routes.active.SHARE_LIST}?id=${this.earnMoney.id}` })
      },
      handTabChange(item, index) {
        this._scrolling = true
        this.tabIndex = index
        wx.pageScrollTo({ selector: item.id })
        setTimeout(() => {
          this._scrolling = false
        }, 1500)
      },
      handleNav(item, index, getUrl) {
        const url = getUrl(item)
        wx.navigateTo({ url })
      },
      tabMonitor(cb) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          wx.createIntersectionObserver()
            .relativeToViewport({ top: -this.navHeight - TAB_HEIGHT - 8 })
            .observe('#tab', res => {
              this.showTab = res.intersectionRatio === 0
            })
          wx.createIntersectionObserver(undefined, { observeAll: true })
            .relativeTo('.fly')
            .observe('.active-wrapper', res => {
              if (this._scrolling) return
              if (res.intersectionRatio > 0) {
                this.tabIndex = +res.id.split('-')[1]
              }
              if (res.intersectionRatio === 0) {
                const number = res.boundingClientRect.top > 0 ? -1 : 1
                let index = +res.id.split('-')[1] + number
                index = Math.max(0, index)
                index = Math.min(index, this.tabList.length - 1)
                this.tabIndex = index
              }
            })
          cb && cb()
        }, 500)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/base.styl"

  .share-money
    position: fixed
    right: 10px
    bottom: 8vh
    width: 64px
    height: 60px
    z-index: 100

  .shop
    min-height: 100vh
    box-sizing: box-sizing
    padding-bottom: 20px
    position: relative
    background :$color-background

  .header-background
    position: absolute
    left: 0
    right: 0
    .h-bg
      position: absolute
      display: block
      left: -2px
      right: @left
      width: 100%
      height: 100%
      background: #ccc
      filter: blur(3.5px)
      font-size: 0
    .h-mask
      position: relative
      height: 60px
      background-image: linear-gradient(-180deg, rgba(255,255,255,0.00) 0%, $color-background 100%)

  .content-wrapper
    position: relative

  .common-panel
    margin: 0 10px
    background: #FFFFFF
    box-shadow: 0 6px 30px 0 rgba(227, 230, 241, 0.36)
    border-radius: 6px
    font-family: $font-family-regular
    line-height: 1
    border-1px(#F5F6FA, 6px)

  .logo-wrapper
    padding :18px 15px 27px
    margin-bottom :10px
    .title
      font-family: $font-family-medium
      font-size: 22px
      color: #2B2F37
    .bottom
      layout(row, block, nowrap)
      padding-top: 20px
      .icon-address
        width: 14.5px
        height: 17px
        margin-right: 6.5px
      .address
        width: 100px
        flex: 1
        overflow: hidden
        font-family: $font-family-regular
        font-size: 14px
        color: #2B2F37
        letter-spacing: 0.6px
        line-height: 1.2

    .middle
      padding-top: 18px
      layout(row, block, nowrap)
      .logo
        width: 70px
        height: @width
        border-radius: 3px
        background-image: url("./pic-mrtx@1x.png")
        background-size: 100% 100%
        background-repeat: no-repeat
        background-position: center center
        margin-right: 10px
      .m-right
        flex: 1
        width: 100px
        .open-hours
          padding-top: 11px
          font-size: 14px
          color: #2B2F37
          letter-spacing: 0.6px
        .stars-wrapper
          height: 15px
          layout(row, block, nowrap)
          align-items: center
          .star
            width: 15px
            height: @width
            background: #ccc
            margin-right: 3.5px
          .star-text
            padding-left: (11 -3.5) px
            font-size: 12px
            color: #979BA5
            letter-spacing: 0.28px
            line-height: 13px

  .active-wrapper
    padding: 16px 15px 0
    position: relative
    .title
      font-family: $font-family-medium
      font-size: 16px
      color: #2F2F2F

  .common-card
    padding: 15px 0
    layout(row, block, nowrap)
    margin-bottom: 10px
    &:last-child
      &:after
        display: none
    .picture
      width: 90px
      height: @width
      border-radius: 2px
      background: #ccc
      margin-right: 10px
    .content-wrapper
      flex: 1
      overflow: hidden
      width: 100px
      position: relative
      .button
        position: absolute
        right: 0
        bottom: 9px
        width: 85px
        height: 30px
        border-radius: 32.5px
        font-family: $font-family-medium
        font-size: 15px
        color: #FFFFFF;
        text-align: center
        line-height: @height
        &.red
          background: #FE7062
        &.green
          background: #19B6B4
        &.yellow
          background: #FFAD07
      .price-wrapper
        padding-top: 21px
        line-height: 1
        color: #FE7062
        .unit
          font-family: $font-family-medium
          font-size: 12px
          line-height: 12px
          margin-right: 2px
          position: relative
          bottom: 1px
        .number
          font-family: $font-family-din-bold
          font-size: 20px
          line-height: 20px
        .origin
          padding-left: 6px
          font-family: $font-family-regular
          font-size: 14px
          line-height: 14px
          color: #979BA5
          text-decoration: line-through
      .c-middle
        padding-top: 9px
        height: 18px
        layout(row, block, nowrap)
        .icon
          height: 18px
          padding: 0 5px
          line-height: @height
          box-sizing: border-box
          border-radius: 2px
          font-family: $font-family-regular
          font-size: 12px
          color: #FE7062
          border-1px(#FE7062, 2px)
          margin-right: 5px
      .title
        padding-top: 3px
        height: 16px
        font-size: @height
        color: #2B2F37
        line-height: @height
        no-wrap()
        .icon
          position: relative
          bottom: 2px
          font-size: 10px
          display: inline-block
          width: 15px
          height: @width
          border-radius: 2px
          color: #fff
          line-height: @height
          text-align: center
          margin-right: 3px
          &.group
            background: #FFAD07
          &.cut
            background: #FE7062

  .tab-wrapper
    padding : 15px 10px 10px
    font-family: $font-family-medium
    font-size: 18px
    color: #2F2F2F
    line-height: 1
    layout(row)
    position relative
    &.fly
      left: 0
      right: 0
      position: fixed
      background: #fff
      opacity: 0
      z-index: -10
    &.show-tab
      transition : opacity 0s
      z-index :999
      opacity : 1
    .line-wrapper
      position: absolute
      height 3px
      width: 66px
      bottom: 10px
      transform: translate3d(0, 0, 0)
      transition: transform 0.3s
      .line
        margin: 0 auto
        height: 100%
        width: 30px
        background: #19B6B4
        border-radius: 3px
    .tab-item
      text-align :center
      width: 66px
      height: 29px
      font-family: $font-family-medium
      &.active
        color: #19B6B4

</style>
