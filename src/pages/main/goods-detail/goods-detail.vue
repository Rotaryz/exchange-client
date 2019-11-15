<template>
  <div class="goods-detail">
    <navigation-bar ref="navigationBar" :translucent="false" :title="detail.name || '商品详情'"></navigation-bar>
    <!--头部轮播图-->
    <div class="banner-wrap">
      <swiper class="banner" @change="bannerChange">
        <block v-for="(item,i) in detail.goods_banner_images" :key="i">
          <swiper-item class="banner-item">
            <img :src="item.image_url + '?imageView2/3/w/100/h/100/q/30'" class="item-img item-img-one" mode="aspectFill">
            <img :src="item.image_url" class="item-img item-img-two" mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <div class="banner-number-box"><span class="current-index">{{bannerIndex}}</span>/<span>{{ detail.goods_banner_images.length}}</span></div>
    </div>
    <!-- 商品基本信息-->
    <div class="base-info-wrap">
      <div class="title"><span class="detail-goods-mask">商城</span><span class="name">{{detail.name}}</span></div>
      <div class="num-wrap">
        <div class="pay-money">
          <span class="money-icon">¥</span>
          <span class="num">{{detail.cash_price}}</span>
          <span class="add-icon">+</span>
          <span class="num">{{detail.bean_price}}</span>
          <img src="./pic-bd@2x.png" class="icon-bean-y">
        </div>
      </div>
      <div class="num-wrap">
        <div class="saleable price-num">原价: <span class="price-num">¥{{detail.price}}</span></div>
        <div class="saleable">库存 <span class="saleable-num">{{totalSaleable}}</span></div>
      </div>
    </div>
    <!-- 规格显示 -->
    <div v-if="selectSpec.length" class="operate-item" @click="operateButtonClick(0)">
      <div class="label">规格</div>
      <div class="item-value hide-last-child">
        <span v-for="(sp,key) in selectAttr" :key="key">
          <span v-if="sp.value">{{sp.name}}:{{sp.value}}</span>
          <span v-if="sp.value" class="dot-text">，</span>
        </span>
      </div>
      <div class="arrow-right"></div>
    </div>
    <!-- 运费显示-->
    <!--<div class="operate-item freight-amount-item">-->
    <!--<div v-if="selectSpec.length" class="line-top"></div>-->
    <!--<div class="label">运费</div>-->
    <!--<div class="item-value freight-amount">-->
    <!--¥{{detail.freight_amount || 0}}-->
    <!--</div>-->
    <!--</div>-->
    <!-- 详情图片-->
    <div class="detail-mask">
      <div class="line"></div>
      <div class="title">商品详情</div>
      <div class="line"></div>
    </div>
    <img v-for="item in detail.goods_detail_images" :key="item.id" :src="item.image_url" mode="widthFix" class="detail-img">
    <!-- 底部操作按钮-->
    <div class="page-footer-wrap" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
      <!-- 播豆 -->
      <div class="page-footer" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
        <div class="navigate-wrap">
          <div class="navigate-btn" @click="goToHome">
            <img src="./icon-home@2x.png" class="navigate-icon">
            <div class="name">首页</div>
          </div>
          <div class="navigate-btn" @click="goToShoppingCart">
            <div v-if="count" class="count">{{count<100?count:'99+'}}</div>
            <img src="./icon-buycar@2x.png" class="navigate-icon">
            <div class="name">购物车</div>
          </div>
        </div>
        <div v-if="totalSaleable" class="button-group">
          <div class="button-primary add-shopping-cart" @click="operateButtonClick(1)"> 加入购物车</div>
          <div class="button-primary right-now-buy" @click="operateButtonClick(2)">立即购买</div>
        </div>
        <div v-else class="saleable-none">
          已售罄
        </div>
      </div>
    </div>
    <!-- 弹窗-->
    <div class="modal-wrap" :style="{transform: 'scale('+(visible? 1 :0)+')'}" @click="visible=false" @touchmove.stop>
      <div class="modal" :style="{height: (visible? modalHeight :0)+'px'}">
        <div class="close-btn-wrap">
          <div class="close-btn"></div>
        </div>
        <div class="modal-cont" @click.stop>
          <div class="vertical-center goods-info">
            <img v-if="detail.goods_banner_images[0]" :src="detail.goods_banner_images[0].image_url" mode="aspectFill" class="goods-img">
            <div class="goods-base-info">
              <div class="name">{{detail.name}}</div>
              <div class="num-wrap  modal-saleable-wrap">
                <div class="pay-money middle">
                  <span class="money-icon">¥</span>
                  <span class="num">{{detail.cash_price}}</span>
                  <span class="add-icon">+</span>
                  <span class="num">{{detail.bean_price}}</span>
                  <img src="./pic-bd@2x.png" class="icon-bean-y">
                </div>
                <div class="saleable">库存 <span class="saleable-num">{{detail.saleable}}</span></div>
              </div>
            </div>
          </div>
          <scroll-view scroll-y="true" :style="{height:modalScrollHeight+'px'}" class="scroll-wrap">
            <div v-for="(item,idx) in detail.specs_attrs" :key="idx" class="spec-module">
              <div class="name">{{item.name}}</div>
              <div class="vertical-center spec-value">
                <div v-for="(value,i) in item.values" :key="i" :class="['value-item',{active:selectSpec[idx]=== item.attr_key_id+'_'+value.attr_value_id}]"
                     @click="selectModuleValue(item,idx,value,i)"
                >
                  {{value.text}}
                </div>
              </div>
            </div>
            <div class="spec-module vertical-center buyer-count">
              <div class="name">购买数量</div>
              <count-operate v-model="edit.count" :maxNumber="detail.saleable" @change="changeCount" @over="countOver"></count-operate>
            </div>
          </scroll-view>
        </div>
        <div class="page-footer" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}" @click.stop>
          <div v-if="detail.saleable" class="button-group">
            <div v-if="showType === 1" class="button-primary right-now-buy button-one" @click.stop="operateButtonClick(1)">
              加入购物车
            </div>
            <div v-else-if="showType === 2" class="button-primary right-now-buy button-one" @click.stop="operateButtonClick(2)">
              立即购买
            </div>
            <div v-if="showType === 0" class="button-primary add-shopping-cart" @click.stop="addToShoppingCart">
              加入购物车
            </div>
            <div v-if="showType === 0" class="button-primary right-now-buy" @click.stop="goToSubmitOrder">
              立即购买
            </div>
          </div>
          <div v-else class="saleable-none">
            已售罄
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CountOperate from '@components/count-operate/count-operate'
  import AppPromise from '@utils/app-promise'
  import { resolveQueryScene } from '@utils/common'
  import { cartMethods, cartComputed } from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'GOODS_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CountOperate
    },
    data() {
      return {
        id: 0,
        // 商品banner 当前显示图片idx
        bannerIndex: 1,
        // 商品详情
        detail: {
          specification_type: 0,
          id: 0,
          cash_price: 0,
          bean_price: 0,
          sale_count: 0,
          saleable: 0,
          specs_attrs: [],
          goods_banner_images: [],
          goods_detail_images: []
        },
        // 选择商品每个规格 保存的 (属性id_属性值_id) 组成array数组
        selectSpec: [],
        // 选择商品规格 保存的 (属性id:{属性值_id,属性名})  map对象
        selectAttr: {},
        // 页面操做后的值
        edit: {
          count: 1,
          spec_id: 0
        },
        visible: false,
        // 总库存数
        totalSaleable: 0,
        // 弹框显示的按钮类型
        showType: 0,
        // 弹框高度
        modalHeight: 0,
        // 弹框滚动高度
        modalScrollHeight: 0,
        enterNum: 0
      }
    },
    onLoad(options) {
      let res = wx.getSystemInfoSync()
      this.modalHeight = res.windowHeight * 0.71
      this.modalScrollHeight = this.modalHeight - 170
      AppPromise.getInstance().then(res => {
        if (options) {
          if (options.scene) {
            // 小程序扫码进来
            console.log(options.scene, 'options.scene')
            let query = resolveQueryScene(options.query.scene)
            this.id = query.goodsId
          } else {
            // 普通参数进来
            this.id = options.id
          }
        }
        this._getDetail().then(res => {
          this.getCurrentSpecInfo(this.selectSpec)
          // 获取购物车数
          if (!this.$storage('token')) return
          this._getCartCount()
        })
      })
    },
    onShow() {
      if (this.enterNum) {
        // 商品详情
        this._getDetail().then(res => {
          this.getCurrentSpecInfo(this.selectSpec)
          // 获取购物车数
          if (!this.$storage('token')) return
          this._getCartCount()
        })
      }
      this.enterNum = 1
    },
    computed: {
      ...cartComputed
    },
    methods: {
      ...cartMethods,
      getCurrentSpecInfo(arr) {
        if (arr.length && arr.filter(item => !item).length > 0) return
        let obj = this.detail.goods_specs.find(item => {
          return item.attr_array.filter(v => arr.includes(v)).length === item.attr_array.length
        })
        if (obj) {
          this.edit.spec_id = obj.spec_id
          this.detail.bean_price = obj.bean_price
          this.detail.cash_price = obj.cash_price
          this.detail.price = obj.price
          this.detail.saleable = obj.saleable
          if (this.detail.saleable < this.edit.count) {
            this.edit.count = this.detail.saleable || 1
          }
        }
      },
      // 商品详情
      _getDetail() {
        return API.Goods.getGoodsDetail({
          data: {
            id: this.id
          }
        }).then(res => {
          this.detail = res.data
          this.totalSaleable = res.data.saleable
          if (!this.detail.specification_type) {
            this.edit.spec_id = res.data.goods_specs[0].spec_id
          } else {
            res.data.specs_attrs.forEach((item, i) => {
              if (!this.selectSpec[i]) {
                this.selectSpec[i] = ''
              }
            })
          }
          return res
        })
      },
      // --------弹框--------
      // 商品数量点击
      changeCount(val) {
      },
      // 当商品超过库存
      countOver() {
        wx.showToast({ title: '数量超出库存范围', icon: 'none' })
      },
      // 商品规格 选择改变
      selectModuleValue(spec, i, value, idx) {
        let arr = this.selectSpec[i].split('_')
        let obj = null
        if ((spec.attr_key_id + '' === arr[0]) && (value.text + '' === arr[1])) {
          obj = {}
          this.$set(this.selectSpec, i, '')
        } else {
          obj = { [spec.attr_key_id]: { attr_value_id: value.attr_value_id, name: spec.name, value: value.text } }
          this.$set(this.selectSpec, i, spec.attr_key_id + '_' + value.attr_value_id)
        }
        obj = Object.assign({}, this.selectAttr, obj)
        this.selectAttr = JSON.parse(JSON.stringify(obj))
        this.getCurrentSpecInfo(this.selectSpec)
      },
      // 弹出弹框 type ： 0 两个按钮全部显示，1 显示 加入购物车 2 显示 立即购买
      showModal(type) {
        this.showType = type
        this.visible = true
      },
      // 是否要弹商品提示
      isCan() {
        if (this.selectSpec.length > 0 && this.selectSpec.findIndex(item => !item) > -1) {
          wx.showToast({ title: '请选择商品规格', icon: 'none' })
          return false
        }
        return true
      },
      // 底部按钮
      operateButtonClick(type) {
        if (!this.visible && this.detail.specification_type) this.showModal(type)
        else if (this.isCan()) {
          switch (type) {
            case 1:
              this.addToShoppingCart()
              break
            case 2:
              this.goToSubmitOrder()
              break
          }
        }
      },
      // 加入购物车按钮
      async addToShoppingCart() {
        if (!await this.$checkToken()) return false
        this._addToCart({ data: { spec_id: this.edit.spec_id, num: this.edit.count }, loading: false }).then(res => {
          this.visible = false
        })
      },
      // 立即购买
      async goToSubmitOrder() {
        if (!await this.$checkToken()) return false
        this.SET_ORDER({
          list: [{
            name: this.detail.name,
            id: this.detail.id,
            image: this.detail.goods_banner_images[0].image_url,
            specification: this.selectAttr,
            count: this.edit.count,
            spec_id: this.edit.spec_id,
            cashPrice: this.detail.cash_price,
            beanPrice: this.detail.bean_price
          }],
          type: 'goods_detail'
        })
        wx.navigateTo({ url: this.$routes.main.SUBMIT_ORDER })
      },
      // 顶部商品轮播图
      bannerChange(current) {
        this.bannerIndex = current.target.current + 1
      },
      // 去购物车
      async goToShoppingCart() {
        if (!await this.$checkToken()) return false
        wx.switchTab({ url: this.$routes.main.SHOPPING_CART })
      },
      // 去首页
      goToHome() {
        wx.switchTab({ url: this.$routes.main.HOME })
      }
    },
    // 页面销毁时初始化头部
    onUnload() {
      this.$refs.navigationBar && this.$refs.navigationBar._initHeadStyle()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/base.styl"
  @import "~@style/bean-money.styl"
  .goods-detail
    height: 100vh

    .banner-wrap
      position: relative

      .banner
        height: 100vw
        position: relative

        .banner-item
          .item-img
            width: 100%
            height: 100%

            &.item-img-two
              position: absolute
              top: 0
              left: 0
              right: 0
              bottom: 0

      .banner-number-box
        display: inline-block
        position: absolute
        bottom: px-change-vw(10)
        right: 20px
        background: rgba(63, 69, 75, .4)
        color: #fff
        height: 20px
        line-height: 20px
        border-radius: 20px
        opacity: .75
        transition: all .3s
        font-size: $font-size-12
        padding: 0 10px

        .current-index
          font-size $font-size-15

    .base-info-wrap
      background-color: $color-white
      padding: 15px 15px 16px
      margin-bottom: 12px

      .title
        margin-bottom: 11px

        .detail-goods-mask
          background: rgba(25, 182, 180, 0.06)
          display: inline-block
          height: 16px
          line-height: 16px
          color: $color-main
          padding: 0 6px
          border-radius: 8px
          border-1px($color-main, 8px)
          font-size: $font-size-12
          margin-right: 3px
          vertical-align: middle

        .name
          font-size: $font-size-16
          color: $color-text-main
          font-family: $font-family-medium
          letter-spacing: 0.6px
          line-height: 24px
          vertical-align: middle

      .pay-money
        margin-bottom: 12px

      .price-num
        text-decoration line-through

    .operate-item
      background-color: $color-white
      display: flex
      justify-content: space-between
      align-items: center
      height: 50px
      padding: 0 15px

      .label
        color: $color-text-sub
        font-size: $font-size-14
        margin-right: 20px

      .item-value
        color: $color-text-main
        font-size: $font-size-14
        font-family: $font-family-medium
        flex: 1
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden

        &.hide-last-child :last-child .dot-text
          display: none

      .arrow-right
        width: 13px
        height: 13px
        background-image: url("/static/images/arrow@2x.png")
        background-size: 100%

    /* .freight-amount-item
       position relative

       .line-top
         border-top-1px()
         position absolute
         top: 0
         left: 15px
         right: 15px
         height: 1px
     */

    .detail-mask
      height: 50px
      display:flex
      justify-content: center
      align-items: center
      background-color: $color-white
      margin-top: 10px

      .line
        width: 27px
        border-bottom-1px()

      .title
        font-size: $font-size-15
        line-height: 30px
        letter-spacing: 0.75px
        margin: 0 10px

    .detail-img
      width: 100%
      display: block

    /*  弹框  */

    .modal-wrap
      position fixed
      top: 0
      left: 0
      width: 100vw
      height: 100vh
      background: rgba(39, 39, 62, 0.7)

      .modal
        position fixed
        left: 0
        right: 0
        bottom: 0
        border-radius: 6px 6px 0 0
        background: $color-white
        width: 100vw
        transition: all 0.3s
        z-index: 100

        .close-btn-wrap
          padding: 10px
          position: absolute
          right: 0
          top: 0
          z-index: 50

          .close-btn
            width: 22px
            height: 22px
            background-size: 100%
            background-image url("./icon-delete@2x.png")

        .modal-cont
          padding: 10px 15px

          .goods-info
            .goods-img
              width: 100px
              height: @width
              margin-right: 10px
              border-radius 2px

            .goods-base-info
              height: 100px
              display: flex
              flex-direction: column
              justify-content: space-between
              flex: 1

              .modal-saleable-wrap
                align-items: flex-start
                flex-direction: column

                .saleable
                  margin-top: 6px

              .name
                font-family: $font-family-medium
                font-size: $font-size-16
                letter-spacing: 0.6px
                line-height: 24px
                margin-top: 2px
                padding-right: 42px
                max-height: 72px
                overflow hidden

          .scroll-wrap
            padding: 10px 0
            box-sizing: border-box

            &::-webkit-scrollbar
              width: 0
              height: 0
              color: transparent

            .spec-module
              padding-top: 10px
              padding-bottom: 15px

              .name
                color: $color-text-sub
                font-size: $font-size-14
                letter-spacing: 0.6px

              .spec-value
                flex-wrap: wrap

                .value-item
                  height: 28px
                  line-height: 28px
                  min-width: 70px
                  text-align: center
                  padding: 0 15px
                  margin: 15px 10px 0 0
                  border-radius 14px
                  letter-spacing: 0.6px
                  box-sizing: border-box
                  font-size: $font-size-12
                  background-color: $color-background
                  border-1px($color-background, 14px)

                  &.active
                    background: rgba(25, 182, 180, 0.10)
                    color: $color-main
                    border-1px($color-main, 14px)

              .residue-num
                font-family: $font-family-medium
                font-size: $font-size-18

            .buyer-count
              padding-top: 25px
              justify-content: space-between

      .button-group
        margin: 0 15px

  /*底部按钮*/
  .page-footer-wrap
    height: 55px

  .page-footer
    border-top-1px()
    position: fixed
    bottom: 0
    width: 100vw
    display: flex
    height: 55px
    z-index: 10px
    background-color: $color-white
    align-items: center

    .saleable-none
      flex: 1
      height: 40px
      line-height: 40px
      text-align: center
      background-color: #D2D2D2
      color: $color-white
      border-radius: 20px
      margin-right: 15px

    .navigate-wrap
      background-color: $color-white
      display: flex
      justify-content: space-around
      align-items: center
      width: 118px

    .navigate-btn
      text-align center
      position: relative

      .count
        position: absolute
        color: #fff
        background-color: $color-money
        font-size: 11px
        height: 16px
        line-height: 16px
        border-radius: 8px
        top: -6px
        right: -6px
        min-width: 16px
        text-align: center
        padding: 0 2px
        box-sizing: border-box

      .name
        font-size: $font-size-10
        coplor: $color-text-main

      .navigate-icon
        width: 21px
        height: 21px
        margin-bottom: 4px

    .exchange-navigation
      padding: 10px 22px 0

    .button-group
      flex: 1
      display: flex
      border-radius: 20px
      align-items: center
      justify-content: space-between
      overflow: hidden
      margin-right: 15px
      border: 1px solid $color-main

      .add-shopping-cart
      .right-now-buy
        flex: 1
        height: 40px
        line-height: 40px
        font-size: $font-size-14
        text-align: center

      .add-shopping-cart
        background-color: $color-white
        color: $color-main

  /*价格 /兑换券部分*/
  .saleable
    color: $color-text-sub
    font-size: $font-size-13

    .price-num
      font-size: $font-size-13

    .saleable-num
      font-size: $font-size-13
      margin-left 2px
</style>
