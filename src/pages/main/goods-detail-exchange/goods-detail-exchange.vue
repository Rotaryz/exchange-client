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
      <div class="title"><span class="detail-goods-mask">兑换</span>{{detail.name}}</div>
      <div class="num-wrap">
        <div class="exchange-wrap">
          <div class="exchange-num">{{detail.integral_price}}</div>
          <div class="exchange-mark">兑换券</div>
        </div>
        <!-- 总库存-->
        <div class="saleable">库存 <span class="saleable-num">{{totalSaleable}}</span></div>
      </div>
    </div>
    <!-- 规格显示 -->
    <div v-if="selectSpec.length" class="operate-item" @click="showModal">
      <div class="label">规格</div>
      <div class="item-value hide-last-child">
        <span v-for="(sp,key) in selectAttr" :key="key">
          <span v-if="sp.value">{{sp.name}}:{{sp.value}}</span>
          <span v-if="sp.value" class="dot-text">，</span>
        </span>
      </div>
      <div class="arrow-right"></div>
    </div>
    <!-- 详情图片-->
    <div class="detail-mask">
      <div class="line"></div>
      <div class="title">商品详情</div>
      <div class="line"></div>
    </div>
    <img v-for="item in detail.goods_detail_images" :key="item.id" :src="item.image_url" mode="widthFix" class="detail-img">
    <!-- 底部操作按钮-->
    <div class="page-footer-wrap" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
      <div class="page-footer" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
        <div class="navigate-btn exchange-navigation" @click="goToHome">
          <img src="./icon-home@2x.png" class="navigate-icon">
          <div class="name">首页</div>
        </div>
        <div v-if="totalSaleable" class="button-group  one-button">
          <div v-if="!isToken || integralCount>=detail.integral_price" class="right-now-exchange fill" @click="operateButtonClick(3)"> 立即兑换</div>
          <div v-else class="right-now-exchange fill disable">立即兑换</div>
        </div>
        <div v-else class="saleable-none">
          已售罄
        </div>
      </div>
    </div>
    <!-- 弹窗-->
    <div class="modal-wrap" :style="{transform: 'scale('+(visible? 1 :0)+')'}" @click="visible=false">
      <div class="modal" :style="{height: (visible? modalHeight :0)+'px'}">
        <div class="close-btn-wrap">
          <div class="close-btn"></div>
        </div>
        <div class="modal-cont" @click.stop>
          <div class="vertical-center goods-info">
            <img v-if="detail.goods_banner_images[0]" :src="detail.goods_banner_images[0].image_url" mode="aspectFill" class="goods-img">
            <div class="goods-base-info">
              <div class="name">{{detail.name}}</div>
              <div class="num-wrap">
                <div class="exchange-wrap">
                  <div class="exchange-num">{{detail.integral_price}}</div>
                  <div class="exchange-mark">兑换券</div>
                </div>
                <!-- 当前规格库存-->
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
              <div class="name">兑换数量</div>
              <count-operate v-model="edit.count" :maxNumber="detail.saleable" @change="changeCount" @over="countOver"></count-operate>
            </div>
            <div class="spec-module vertical-center buyer-count">
              <div class="name">剩余兑换劵</div>
              <div class="residue-num">{{integralCount}}</div>
            </div>
          </scroll-view>
        </div>
        <div class="page-footer" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}" @click.stop>
          <div class="exchange-wrap">
            <div class="label">合计:</div>
            <div class="exchange-num">{{totalIntegralPrice}}</div>
            <div class="exchange-mark">兑换券</div>
          </div>
          <div v-if="detail.saleable">
            <div v-if="!isToken ||  integralCount>=detail.integral_price" class="right-now-exchange small" @click.stop="operateButtonClick">立即兑换</div>
            <div v-else class="right-now-exchange small disable">立即兑换</div>
          </div>
          <div v-else class="saleable-none small">
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
          integral_price: 0,
          price: 0,
          id: 0,
          weight: 0,
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
        // 弹框高度
        modalHeight: 0,
        // 弹框滚动高度
        modalScrollHeight: 0,
        //   用户播豆数
        integralCount: 0,
        enterNum: 0
      }
    },
    onLoad(options) {
      console.log(this.statusBarHeight, 'statusBarHeight')
      let res = wx.getSystemInfoSync()
      this.modalHeight = res.windowHeight * 0.7
      this.modalScrollHeight = this.modalHeight - 170
      AppPromise.getInstance().then(res => {
        if (options.scene) {
          // 小程序扫码进来
          let query = resolveQueryScene(options.query.scene)
          this.id = query.goodsId
        } else {
          // 普通参数进来
          this.id = options.id
        }
        this._getDetail()
        if (this.isToken) {
          this._getMyIntegral()
        }
      })
    },
    onShow() {
      if (this.enterNum) {
        this._getDetail()
        if (this.isToken) {
          this._getMyIntegral()
        }
      }
      // 商品详情
      this.enterNum = 1
    },
    watch: {
      // 监听商品规格选择
      selectSpec(val) {
        if (!this.detail.specification_type) return []
        if (val.filter(item => !item).length <= 0) {
          let obj = this.detail.goods_specs.find(item => {
            return item.attr_array.filter(v => val.includes(v)).length === item.attr_array.length
          })
          if (obj) {
            this.edit.spec_id = obj.spec_id
            this.detail.integral_price = obj.integral_price
            this.detail.price = obj.price
            this.detail.saleable = obj.saleable
            if (this.detail.saleable < this.edit.count) {
              this.edit.count = this.detail.saleable || 1
            }
          }
        }
      }
    },
    computed: {
      totalIntegralPrice() {
        return this.detail.integral_price * this.edit.count
      },
      isToken() {
        return this.$storage('token')
      }
    },
    methods: {
      // 获取用户兑换券
      _getMyIntegral() {
        if (!this.isToken) return
        return API.Mine.getIntegralBeanCount({ loading: false }).then(res => {
          this.integralCount = (res.data && res.data.integral && res.data.integral.available) || 0
        })
      },
      // 商品详情
      _getDetail() {
        return API.Goodsexchange.getGoodsDetail({
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
      // 当商品超过库存
      countOver() {
        wx.showToast({ title: '数量超出库存范围', icon: 'none' })
      },
      // 商品规格 选择改变
      selectModuleValue(spec, i, value, idx) {
        let arr = this.selectSpec[i].split('_')
        if ((spec.attr_key_id + '' === arr[0]) && (value.attr_value_id + '' === arr[1])) {
          this.$set(this.selectAttr, [spec.attr_key_id], {})
          this.$set(this.selectSpec, [i], '')
        } else {
          this.$set(this.selectAttr, [spec.attr_key_id], { attr_value_id: value.attr_value_id, name: spec.name, value: value.text })
          this.$set(this.selectSpec, [i], spec.attr_key_id + '_' + value.attr_value_id)
        }
      },
      // 是否要弹商品提示
      isCan() {
        if (this.selectSpec.length > 0 && this.selectSpec.findIndex(item => !item) > -1) {
          wx.showToast({ title: '请选择商品规格', icon: 'none' })
          return false
        }
        return true
      },
      // 展示弹框
      showModal() {
        this.visible = true
        this._getMyIntegral()
      },
      // 底部按钮
      operateButtonClick() {
        if (!this.visible && this.detail.specification_type) {
          this.showModal()
        } else if (this.isCan()) this.goToExchange()
      },
      // 顶部商品轮播图
      bannerChange(current, source) {
        this.bannerIndex = current.target.current + 1
      },
      // 去首页
      goToHome() {
        wx.switchTab({ url: this.$routes.main.HOME })
      },
      // 立即兑换
      async goToExchange() {
        if (!await this.$checkToken()) return false
        let data = {
          goods: [{
            goods_id: this.detail.id,
            goods_spec_id: this.edit.spec_id,
            num: this.edit.count
          }]
        }
        // data.goods = JSON.stringify(data.goods)
        API.Goodsexchange.exchange({ data }).then(res => {
          wx.navigateTo({ url: this.$routes.other.EXCHANGE_SUCCESS + '?id=' + res.data.id })
        })
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
          font-size: $font-size-15

    .base-info-wrap
      background-color: $color-white
      padding: 15px 15px 20px
      margin-bottom: 10px

      .title
        font-size: $font-size-16
        color: $color-text-main
        font-family: $font-family-medium
        letter-spacing: 0.6px
        line-height: 24px
        margin-bottom: 15px

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

    .operate-item
      background-color: $color-white
      display: flex
      justify-content: space-between
      align-items: center
      height: 50px
      padding: 0 15px
      margin-bottom: 10px

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
        text-overflow:ellipsis
        overflow: hidden

        &.hide-last-child :last-child .dot-text
          display: none

      .pay-money
        color: $color-money

      .arrow-right
        width: 13px
        height: 13px
        background-image: url("./icon-arrow-right@2x.png")
        background-size: 100%

    .detail-mask
      height: 50px
      display: flex
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

    .modal-wrap
      position: fixed
      top: 0
      left: 0
      width: 100vw
      height: 100vh
      background: rgba(39, 39, 62, 0.7)

      .modal
        position: fixed
        left: 0
        right: 0
        bottom: 0
        border-radius: 6px 6px 0 0
        background $color-white
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
            background-image: url("./icon-delete@2x.png")

        .modal-cont
          padding: 10px 15px

          .goods-info
            .goods-img
              width: 100px
              height: @width
              margin-right: 10px
              border-radius: 2px

            .goods-base-info
              height: 100px
              display: flex
              flex-direction: column
              justify-content: space-between
              flex: 1

              .name
                font-family: $font-family-medium
                font-size: $font-size-16
                letter-spacing: 0.6px
                line-height: 24px
                margin-top: 2px
                padding-right: 10px

              .exchange-wrap
                font-size: $font-size-13

                .exchange-mark
                  font-size: $font-size-15

                .exchange-num
                  font-size: 19px

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
                  border-radius: 14px
                  letter-spacing: 0.6px
                  box-sizing: border-box
                  font-size: $font-size-12
                  background-color: $color-background
                  border-1px($color-background, 14px)

                  &.active
                    background: rgba(25, 182, 180, 0.10)
                    border-1px($color-main, 14px)
                    color: $color-main

              .residue-num
                font-family: $font-family-medium
                font-size: $font-size-18

            .buyer-count
              padding-top: 25px
              justify-content: space-between

        .page-footer
          padding: 7px 0px

  /*底部按鈕*/
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
    padding-right: 15px
    /*box-sizing border-box*/
    background-color: $color-white
    align-items: center
    justify-content: space-between

    .saleable-none
      flex: 1
      height: 40px
      line-height: 40px
      text-align: center
      background-color: #D2D2D2
      color: $color-white
      border-radius: 20px
      margin-right: 15px

      &.small
        flex-shrink: 0
        width: 120px

    .navigate-wrap
      background-color: $color-white
      display: flex
      justify-content: space-around
      align-items: center
      width: 118px

    .navigate-btn
      text-align: center
      position: relative

      .count
        position: absolute
        color: #fff
        background-color: #d83f35
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
        margin-bottom 4px

    .exchange-navigation
      padding: 10px 22px 0

    .button-group
      display: flex
      border-radius: 20px
      align-items: center
      justify-content: space-between

      &.one-button
        flex: 1

    .right-now-exchange
      height: 40px
      line-height: 40px
      background-color: $color-main
      font-size: $font-size-14
      text-align: center
      border-radius: 20px
      color: $color-white
      margin-right: 15px

      &.fill
        flex: 1

      &.small
        width: 120px

      &.disable
        background-color $color-text-assist

  /*价格 /兑换券部分*/
  .num-wrap
    flex-shrink: 0
    width: 100%
    display: flex
    justify-content: space-between
    align-items: flex-end

  .exchange-wrap
    display: flex
    align-items: flex-end
    justify-content: space-between

    .label
      line-height: 14px
      font-size: $font-size-14
      letter-spacing: 0.6px
      white-space: nowrap
      margin-left: 20px

    .exchange-mark
      color: $color-money
      font-size $font-size-18
      margin-left: 1px
      white-space: nowrap
      line-height: 18px

    .exchange-num
      font-size: 23px
      line-height: 18px
      color: $color-money
      font-family: $font-family-din-bold

  .saleable
    color: $color-text-sub
    font-size: $font-size-13
    line-height: 18px

    .saleable-num
      margin-left: 2px

</style>
