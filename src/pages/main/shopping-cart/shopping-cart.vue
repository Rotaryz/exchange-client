<template>
  <div class="shopping-cart" @click="pageClick">
    <navigation-bar title="购物车" :showArrow="false"></navigation-bar>
    <div v-if="list.length" class="goods-list">
      <li v-for="(item,i) in list" :key="i" class="goods-item">
        <div class="goods-wrap" :style="{transform:'translateX('+item.x+'px)'}">
          <div class="goods-right" :class="{disable:!item.saleable || !item.status}"
               @touchstart="handleTouchStart($event)"
               @touchmove="handleTouchmove($event,i)"
               @touchend.stop="handleTouchend($event,i)">
            <!-- 库存不足 下架商品-->
            <div v-if="item.saleable && item.status" class="check-box" @click="setCheckType(item,i)">
              <zb-checkbox :type="item.select ? 'checked':item.saleable<item.num ? 'disable':''"></zb-checkbox>
            </div>
            <div v-else class="failure">
              失效
            </div>
            <img class="good-img" mode="aspectFill" :src="item.goods_cover_image" @click="goToDetail(item,i)">
            <div class="info" @click="goToDetail(item,i)">
              <div class="top-wrap">
                <div class="name">{{item.name}}</div>
                <div class="spec">
                  <span v-for="(sp,idx) in item.goods_spec.specs_attrs" :key="idx" class="spec-item">
                    {{sp.attr_key}}:{{sp.attr_value}}{{idx ===item.goods_spec.specs_attrs.length-1 ? '' :',' }}
                  </span>
                </div>
                <div v-if="item.saleable<item.num && item.saleable && item.status" class="beyond-saleable-tip">库存仅剩{{item.saleable}}件</div>
              </div>
              <div v-if="item.saleable && item.status" class="num-wrap">
                <div class="pay-money mini common">
                  <span class="money-icon">¥</span>
                  <span class="num">{{item.goods_spec.cash_price}}</span>
                  <span class="add-icon">+</span>
                  <span class="num">{{item.goods_spec.bean_price}}</span>
                  <img src="./pic-bd@2x.png" class="icon-bean-y">
                </div>
                <zb-count-operate :value="item.num" size="small" @change="goodsNumChange($event,item)"></zb-count-operate>
              </div>
              <div v-else class="failure-text">
                该商品已下架/已售完
              </div>
            </div>
          </div>
          <div class="button-primary" @click.stop="_deleteGoods(item)">
            <div class="button-primary">删除</div>
          </div>
        </div>
      </li>
    </div>
    <div v-else class="empty-box">
      <empty :image="require('./pic-gouwuche@2x.png')"
             tip="您还没有添加任何商品哦～"
             buttonText="去看看"
      ></empty>
    </div>
    <div v-if="list.length" class="footer-wrap">
      <div class="footer">
        <div class="check-all">
          <zb-checkbox :type="isAllSelect ? 'checked':''" @click="selectAll"></zb-checkbox>
          <div class="label" @click="selectAll">全选</div>
          <div class="label label-hj">合计：</div>
          <div class="pay-money middle">
            <span class="money-icon">¥</span>
            <span class="num">{{totalCashPrice}}</span>
            <span class="add-icon">+</span>
            <span class="num">{{totalBeanPrice}}</span>
            <img src="./pic-bd@2x.png" class="icon-bean-y">
          </div>
        </div>
        <div class="button-primary submit-btn" @click="submitBtn">去结算</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ZbCheckbox from '@components/checkbox/checkbox'
  import Empty from '@components/empty/empty'
  import ZbCountOperate from '@components/count-operate/count-operate'
  import { cartMethods } from '@state/helpers'

  const PAGE_NAME = 'SHOPPING_CART'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ZbCheckbox,
      Empty,
      ZbCountOperate
    },
    // todo 暂时未做 页面滚动到底部 加载更多
    // onReachBottom() {
    //   if (this.isLoading || this.params.page === this.totalPage) {
    //     return false
    //   }
    //   this.params.page++
    //   this._getList()
    // },
    onShow() {
      // 兼容没登录过
      if (!this.$storage('token')) {
        this.list = []
        return false
      }
      this._getList()
    },
    data() {
      return {
        list: [],
        scrollHeight: 0,
        showDeleteIndex: null,
        startY: 0,
        endY: 0,
        startX: 0,
        currentX: 0,
        selectIds: {}
        // isLoading: false,
        // totalPage: 10,
        // params: {
        //   page: 1,
        //   limit: 0
        // },
      }
    },
    onLoad() {
      let res = wx.getSystemInfoSync()
      this.scrollHeight = res.windowHeight - res.statusBarHeight - 44 - 55
    },
    // async onTabItemTap() {
    //   await this.$checkToken()
    // },
    computed: {
      isAllSelect() {
        let arr = this.list.filter(item => item.saleable && item.status)
        if (!arr.length) return false
        let res = arr.find(item1 => {
          return !item1.select
        })
        return !res
      },
      totalCashPrice() {
        let res = this.list.filter(item => item.select)
        if (!res.length) return 0
        return res.map(item => Number(item.goods_spec.cash_price * item.num)).reduce((one, two) => one + two).toFixed(2)
      },
      totalBeanPrice() {
        let res = this.list.filter(item => item.select)
        if (!res.length) return 0
        return res.map(item => Number(item.goods_spec.bean_price * item.num)).reduce((one, two) => one + two).toFixed(0)
      }
    },
    methods: {
      ...cartMethods,
      // 请购物车列表设置在data里
      setData(res) {
        this.list = res.data.list.map(item => {
          item.select = this.selectIds[item.id] ? 'select' : ''
          return item
        })
        this.SET_CART_COUNT(res.data.goods_count)
      },
      _getList(other = {}) {
        API.Cart.getList({ data: { limit: 0, page: 1 }, ...other }).then(res => {
          this.setData(res)
        })
      },
      // 全选按钮点击
      selectAll() {
        let arr = this.list.filter(item => item.saleable && item.status)
        if (!arr.length) {
          wx.showToast({ title: '还没有可以选择的宝贝~', icon: 'none' })
          return false
        }
        if (this.isAllSelect) {
          this.list.forEach((item, idx) => {
            this.$set(this.list[idx], 'select', '')
            this.$set(this.selectIds, item.id, false)
          })
        } else {
          this.list.forEach((item, idx) => {
            if (item.saleable && item.status) {
              this.$set(this.list[idx], 'select', 'checked')
              this.$set(this.selectIds, item.id, true)
            }
          })
        }
      },
      // 去详情页
      goToDetail(item, i) {
        // 库存不足 下架商品
        if (!item.saleable || !item.status) return
        wx.navigateTo({ url: this.$routes.main.GOODS_DETAIL + '?id=' + item.goods_id })
      },
      // 商品数量修改
      goodsNumChange(e, item) {
        API.Cart.setGoodsNum({ data: { spec_id: item.spec_id, num: e }, loading: false }).then(res => {
          this.setData(res)
        })
      },
      //  ----- 删除部分----
      // 点击页面初始化所有删除按钮
      pageClick(e) {
        if (this.showDeleteIndex !== null) {
          this.$set(this.list[this.showDeleteIndex], 'x', 0)
        }
      },
      // 商品元素 触摸开始的一刻
      handleTouchStart(e, i) {
        this.pageClick()
        this.startX = e.clientX
        this.startY = e.clientY
        this.currentX = e.clientX
        this.endY = e.clientY
      },
      // 商品元素 触摸后移动
      handleTouchmove(e, i) {
        this.currentX = e.clientX
        this.endY = e.clientY
        let distance = this.currentX - this.startX
        if (this.endY - this.startY > 10) return
        if (distance < -10 && this.list[i].x > -60) {
          this.$set(this.list[i], 'x', (distance > -60 ? distance : -60))
        } else if (distance > 10 && this.list[i].x < 0) {
          this.$set(this.list[i], 'x', (distance < 60 ? -1 * distance : 0))
        }
      },
      // 商品元素 触摸后触摸结束
      handleTouchend(e, i) {
        if (!this.currentX) return false
        if ((this.list[i].x === 0 || this.list[i].x === -60) && this.endY - this.startY > 10) return
        let distance = this.currentX - this.startX
        if (distance < -20) {
          this.$set(this.list[i], 'x', -60)
        } else {
          this.$set(this.list[i], 'x', 0)
        }
        this.showDeleteIndex = distance < 0 ? i : null
      },
      // 商品单个选择
      setCheckType(item, i) {
        if (item.saleable < item.num) return
        if (item.select) {
          this.$set(this.list[i], 'select', '')
          this.$set(this.selectIds, item.id, 0)
        } else {
          this.$set(this.list[i], 'select', 'checked')
          this.$set(this.selectIds, item.id, 1)
        }
      },
      // 删除商品
      _deleteGoods(item) {
        API.Cart.deleteGoods({ data: { ids: [item.id] }, loading: false }).then(res => {
          this.showDeleteIndex = null
          this.setData(res)
        })
      },
      // 提交订单
      submitBtn() {
        let res = this.list.filter(item => item.select)
        if (res.length <= 0) {
          wx.showToast({ title: '请选择需要提交的商品', icon: 'none' })
          return false
        }
        let list = res.map(item => {
          return {
            name: item.name,
            id: item.id,
            image: item.goods_cover_image,
            specification: item.goods_spec.specs_attrs.map(item => {
              return {
                name: item.attr_key,
                value: item.attr_value
              }
            }),
            count: item.num,
            spec_id: item.spec_id,
            cashPrice: item.goods_spec.cash_price,
            beanPrice: item.goods_spec.bean_price
          }
        })
        this.SET_ORDER({
          list: list,
          type: 'shopping_cart'
        })
        wx.navigateTo({ url: this.$routes.main.SUBMIT_ORDER })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/bean-money.styl"

  .shopping-cart
    width: 100%
    display: flex
    flex-direction: column
    min-height: 100vh

    .empty-box
      background-color: $color-white
      flex: 1

    .goods-list
      padding: 10px
      box-sizing: border-box

      .goods-item
        border-radius: 6px
        width: 100%
        margin-bottom: 10px
        background-color: $color-white
        overflow: hidden

        .goods-wrap
          width: 100%
          display: flex
          transition: all 0.3s

          .goods-right
            width: 100%
            flex-shrink: 0
            display: flex
            align-items: center
            box-sizing: border-box
            padding: 15px 10px 15px 0px
            height: 120px

            .check-box
              display: flex
              align-items: center
              height: 100%
              flex-shrink: 0
              padding: 0px 10px

            .failure
              width: 28px
              height: 15px
              line-height: 15px
              text-align: center
              border-radius: 7px
              background-color: #BCC4CC
              margin: 0 3px 0 4px
              font-size: $font-size-10
              color: #fff

            .good-img
              flex-shrink: 0
              height: 100%
              width: 90px
              margin-right: 8px
              border-radius: 2px

            .info
              height: 100%
              flex: 1
              width: 0
              display: flex
              flex-direction: column
              justify-content: space-between

              .top-wrap

                .name
                  color: $color-text-main
                  font-size: $font-size-14
                  line-height: 14px
                  font-family: $font-family-medium
                  white-space: nowrap
                  overflow: hidden
                  text-overflow: ellipsis
                  margin-top: 3px
                  flex-shrink: 0

                .spec
                  color: $color-text-sub
                  font-size: $font-size-13
                  line-height: 13px;
                  letter-spacing: 0.6px
                  margin-top: 8px
                  margin-bottom: 2px

                  .spec-item
                    overflow: hidden

                    &:last-child .dot-text
                      display: none

                .beyond-saleable-tip
                  color: $color-money
                  font-size: $font-size-12
                  margin: 8px 0

              .count
                display flex
                justify-content: space-between

                .price
                  flex-shrink: 0
                  display: flex
                  align-items: flex-end
                  color: $color-text-main
                  font-size: $font-size-12

                  .price-num
                    font-size: $font-size-18

                  .vip-price-icon
                    width: 33px
                    height: 12px

              .failure-text
                font-size $font-size-13
                color: $color-text-tip
                letter-spacing: 0.6px
                height: 13px

            &.disable .info
              .name
              .failure-text
                color: $color-text-sub

          .button-primary
            background-color: $color-money
            color: $color-white
            width: 60px
            display: flex
            align-items: center
            justify-content: center
            border-radius: 0 6px 6px 0

  .footer-wrap
    height: 55px

  .footer
    background-color: $color-white
    position: fixed
    bottom: 0
    left: 0
    right: 0
    width: 100vw
    height: 55px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    padding-right: 10px
    z-index: 20

    &:before
      content: ""
      position: absolute
      top: -1px
      left: 0
      width: 100%
      transform: scaleY(.5)
      border-bottom: 1px solid $color-line

    &:after
      content: ""
      position: absolute
      bottom: 1px
      right: 0
      width: 100%
      transform: scaleY(.5)
      border-bottom: 1px solid $color-line

    .check-all
      flex: 1
      display: flex
      align-items: flex-end
      padding-left: 10px

      .label
        white-space: nowrap
        color: $color-text-main
        font-size: $font-size-14
        margin-left: 5px
        line-height: 14px

        &.label-hj
          margin-left: 10px

      .pay-money
        align-items: center
        line-height: 16px
        position: relative
        top: 1.5px

    .submit-btn
      height: 40px
      line-height: 40px
      text-align: center
      background-color: $color-main
      color: $color-white
      border-radius: 20px
      width: 100px
      font-size 14px

</style>
