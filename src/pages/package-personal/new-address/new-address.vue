<template>
  <div class="new-address">
    <navigation-bar :title="(id ? '编辑':'新建')+'地址'"></navigation-bar>
    <div class="input-content">
      <div class="form-item">
        <div class="label-text">收货人</div>
        <input v-model="edit.name" placeholder-style="color:#C8CACF;font-size:14px;letter-spacing: 0.6px" maxlength="10" class="base-input" placeholder="收件人" placeholder-class="placeholder" type="text">
      </div>
      <div class="form-item">
        <div class="label-text">手机号码</div>
        <input v-model="edit.mobile" placeholder-style="color:#C8CACF;font-size:14px;letter-spacing: 0.6px" maxlength="11" class="base-input" placeholder="收件人手机号" placeholder-class="placeholder" type="text">
      </div>
      <div class="form-item">
        <div class="label-text">选择地区</div>
        <picker mode="region" class="pick-wrap" @change="changeArea" :value="area">
          <div class="picker">
            <div v-if="!edit.province && !edit.city && !edit.district " class="base-input address-item placeholder">请选择所在地区</div>
            <div v-else class="address-item">{{edit.province}}，{{edit.city}}，{{edit.district }}</div>
            <img src="./icon-pressed_my@2x.png" class="arrow-right">
          </div>
        </picker>
      </div>
      <div class="form-item detail-address-item">
        <div class="label-text">详细地址</div>
        <textarea v-model="edit.address" placeholder-style="color:#C8CACF;font-size:14px;letter-spacing: 0.6px" class="base-input textarea" :class="{'regimental-text-ios': isIos}" placeholder="街道、楼牌号等" placeholder-class="placeholder" type="text"></textarea>
      </div>
    </div>
    <div class="form-item default-set">
      <div class="label-text">设为默认地址</div>
      <div class="switch-button" :id="edit.is_default" :class="{active:edit.is_default}" @click="switchChange">
        <div class="active-circle"></div>
      </div>
    </div>
    <button v-if="isDisable" class="button-primary button-disable">{{id ? '保存':'保存'}}地址</button>
    <button v-else class="button-primary" @click="_addAddrss">{{id ? '保存':'保存'}}地址</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'NEW_ADDRESS'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        area: ['广东省', '广州市', '荔湾区'],
        id: 0,
        isIos: false,
        edit: {
          is_default: 0,
          name: '',
          mobile: '',
          province: '',
          city: '',
          district: '',
          address: ''
        }
      }
    },
    computed: {
      isDisable() {
        return !this.edit.name || !this.edit.mobile || !this.edit.province || !this.edit.city || !this.edit.district || !this.edit.address
      }
    },
    onLoad(options) {
      wx.getSystemInfo({
        success: (res) => {
          this.isIos = res.system.includes('iOS') || false
        }
      })
      let { id } = options
      this.id = id || 0
      if (id) this._getAddressDetail(id)
    },
    methods: {
      // 是否默认
      switchChange() {
        this.$set(this.edit, 'is_default', this.edit.is_default ? 0 : true)
      },
      _getAddressDetail(id) {
        API.Address.getAddressDetail({ data: { id } }).then((res) => {
          this.edit = res.data
        })
      },
      changeArea(val) {
        this.area = val.mp.detail.value
        this.edit.province = this.area[0]
        this.edit.city = this.area[1]
        this.edit.district = this.area[2]
      },
      _addAddrss() {
        let requestName = this.id ? 'editAddress' : 'addAddress'
        let data = this.id ? { ...this.edit, id: this.id } : this.edit
        API.Address[requestName]({ data }).then(() => {
          wx.showToast({ title: '保存地址成功', icon: ',/icon-success_save@2.png' })
          wx.navigateBack({ delta: 1 })
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/base.styl"

  .new-address
    width: 100%

  .input-content
    margin-top: 10px
    padding: 0 15px
    background-color: $color-white

  .form-item
    min-height: 50px
    display: flex
    align-items: center
    border-bottom-1px(#EBEAF3)

    .label-text
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-main
      white-space: nowrap
      flex-shrink: 0
      width: 86px

    .pick-wrap
      flex: 1
      height: 50px
      line-height: 50px

      .picker
        display:flex
        align-items:center

        .address-item
          display: flex
          align-items: center
          justify-content: space-between
          height: 50px
          line-height: 50px
          flex: 1
          font-size: 14px

        .arrow-right
          width: 5px
          height: 10px
          margin-right: 15px

    .base-input
      flex: 1
      padding-right: 10px
      font-size: $font-size-14
      letter-spacing: 0.6px
      height: 40px

  .detail-address-item
    padding: 18px 0
    align-items: flex-start
    border-none()

    .textarea
      height: 44px

      &.regimental-text-ios
        padding-top: -10px
        padding-left: -4px


  .default-set
    min-height: 48px
    padding-left: 15px
    background-color: $color-white
    margin-top: 10px
    padding-right: 15px
    justify-content: space-between
    border-none()

    .switch-button
      width: 50px
      height 26px
      background-color #D4D4D4
      border-radius: 13px

      .active-circle
        width: 22px
        height: 22px
        border-radius: 11px
        margin: 2px
        background-color: $color-white
        transition: all 0.3s

      &.active
        background-color: $color-main

        .active-circle
          transform: translateX(24px)

  .button-primary
    margin: 20px 15px
    height: 45px
    line-height: @height
    border-radius: 23px
    font-size: $font-size-16

  .placeholder
    color: $color-text-assist
    font-size: $font-size-14
    letter-spacing: 0.6px

</style>
