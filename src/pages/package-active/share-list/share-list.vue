<template>
  <div class="share-list">
    <navigation-bar title="分享赚钱"></navigation-bar>
    <div class="share-box" v-if="shareList.length &&  totalPage >= 1">
      <div class="list-box" v-for="item in shareList" :key="item.id">
        <div class="content-top" @click="jumpDetails(item)">
          <img :src="item.goods.goods_cover_image" alt="" class="content-left" mode="aspectFill">
          <div class="content-data">
            <div class="content-data-title">{{item.goods.name}}</div>
            <div class="content-price-box">
              <div class="price-icon">¥</div>
              <div class="price-number">{{item.goods.price}}</div>
              <div class="line-price-number">¥ {{item.goods.original_price}}</div>
            </div>
          </div>
        </div>
        <div class="content-btn-box">
          <div class="content-btn">
            <div class="btn-text" @click="shareModal(item)">
              <div class="btn-text-pra">分享赚</div>
              <div class="btn-text-icon">¥</div>
              <div class="btn-text-number">{{item.commission_amount}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-page" v-else>
      <empty :image="require('./pic-empty@2x.png')" tip="你的页面是空的"></empty>
    </div>
    <!-- 弹窗-->
    <div class="modal-wrap" :style="{transform: 'scale('+(visible? 1 :0)+')'}" @click="visible=false" @touchmove.stop>
      <div class="modal-main" :style="{bottom: (visible? 0 : '-100%')}" @click.stop>
        <div class="main-money-box">
          <div class="money-text">赚</div>
          <div class="money-number">¥{{shareItem.commission_amount}}</div>
        </div>
        <div class="hint-box">任何人通过此链接成功购买商品，您都能赚钱<br/>(收益仅自己可见)</div>
        <button open-type="share" class="container-item-wrapper" @click="shareFriend">
          <img src="./pic-wechat@2x.png" class="item-icon">
          <p class="share-button-text">分享好友</p>
        </button>
        <div class="share-close border-top-1px" @click="visible=false">取消</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'SHARE_LIST'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        visible: false,
        params: {
          limit: 10,
          page: 1
        },
        loading: false,
        totalPage: 0,
        shareList: [],
        shareItem: {}
      }
    },
    onLoad() {
      this.params.page = 1
      this.getShareList()
    },
    // 下拉加载
    onReachBottom() {
      if (this.params.page + 1 > this.totalPage || this.loading) return
      this.params.page++
      this.getShareList()
    },
    onShareAppMessage (res) {
      let title = this.shareItem.goods.name ? this.shareItem.goods.name : ''
      let price = this.shareItem.goods.price ? this.shareItem.goods.price : ''
      let id = wx.getStorageSync('userInfo').id
      let shopId = wx.getStorageSync('shopId')
      let path = `${this.$routes.main.SERVE_DETAIL}?shopId=${shopId}&goodsId=${this.shareItem.goods.id}&shareAuthor=${id}&shareActive=${this.shareItem.goods.id}`
      console.info(path)
      this.visible = false
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title: `【仅需${price}】${title}`,
        path,
        imageUrl: this.shareItem.goods.goods_cover_image
      }
    },
    methods: {
      // 显示弹框
      async shareModal(item) {
        if (!await this.$checkToken()) return false
        this.shareItem = item
        this.visible = true
      },
      // 获取分享列表
      getShareList() {
        this.loading = true
        API.Share.shareList({data: this.params, loading: false}).then((res) => {
          this.moneyDetail = res.data
          if (this.params.page === 1) this.shareList = []
          this.shareList = [...this.shareList, ...res.data]
          this.totalPage = res.meta.last_page
          this.loading = false
        })
      },
      // 分享好友
      shareFriend() {
        API.Share.updateShareCount({data: {goods_id: this.shareItem.goods.id}, loading: false})
      },
      // 跳转服务
      jumpDetails(item) {
        this.shareItem = item
        wx.navigateTo({ url: `${this.$routes.main.SERVE_DETAIL}?goodsId=${this.shareItem.goods.id}` })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .share-list
    width: 100%
    min-height: 100vh
  .share-box
    padding: 15px 10px
    box-sizing: border-box
    .list-box
      background: #fff
      padding: 10px 15px 15px 10px
      border-radius: 6px
      margin-bottom: 10px
      .content-top
        layout(row)
        align-items: center
        .content-left
          width: 85px
          height: @width
          display: block
          border-radius: 2px
          margin-right: 10px
        .content-data
          min-height: 80px
          flex: 1
          overflow: hidden
          layout()
          justify-content: space-between
          .content-data-title
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-text-main
            line-height: 20px
            no-wrap-plus()
          .content-price-box
            display: flex
            align-items: flex-end
            .price-icon
              font-family: $font-family-din-bold
              font-size: $font-size-14
              color: $color-money
              margin-right: 2px
            .price-number
              font-family: $font-family-din-bold
              font-size: $font-size-20
              color: $color-money
              margin-right: 3px
            .line-price-number
              font-family: $font-family-regular
              font-size: $font-size-12
              color: $color-text-sub
              text-decoration: line-through
      .content-btn-box
        margin-top: 3px
        display: flex
        justify-content: flex-end
        .content-btn
          background: $color-money
          border-radius: 29px
          width: 115px
          height: 28px
          layout(row)
          align-items: center
          justify-content: center
          .btn-text
            display: flex
            align-items: flex-end
            position: relative
            bottom: 2px
            .btn-text-pra
              font-family: $font-family-regular
              font-size: $font-size-12
              color: $color-white
              margin-right: 4px
            .btn-text-icon
              font-family: $font-family-regular
              font-size: $font-size-12
              color: $color-white
              margin-right: 2px
            .btn-text-number
              font-family: $font-family-regular
              font-size: 15px
              line-height: 1
              position: relative
              bottom: -1px
              font-weight: bold
              color: $color-white
  /*  弹框  */
  .modal-wrap
    position fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    background: rgba(39, 39, 62, 0.7)
    .modal-main
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background: $color-white
      border-top-left-radius: 6px
      border-top-right-radius: 6px
      transition: all 0.3s
      padding-top: 30px
      .main-money-box
        display: flex
        justify-content: center
        align-items: flex-end
        margin-bottom: 10px
        .money-text
          font-family: $font-family-regular
          font-size: $font-size-16
          color: $color-text-main
          margin-right: 8px
        .money-number
          font-family: $font-family-medium
          font-size: $font-size-18
          color: $color-money
      .hint-box
        font-family: $font-family-regular
        font-size: $font-size-13
        color: $color-text-main
        margin-bottom: 30px
        text-align: center
        line-height: 20px
    .container-item-wrapper
      margin-bottom: 25px
      text-align: center
      .item-icon
        width: 45px
        height: @width
        display: block
        margin: 0 auto 10px
      .share-button-text
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-sub
    .share-close
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-text-main
      height: 50px
      line-height: 50px
      width: 100%
      text-align: center
  .empty-page
    flex: 1
    padding: 100px 0 0 5px
</style>
