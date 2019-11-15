export default {
  data() {
    return {
      timer: '', // 定时器
      title: '', // 头部标题
      goodsDetail: {}, // 商品详情
      bannerImgs: [], // 轮播图
      currentNum: 1, // 轮播图当前值
      firstLoading: true, // 是否第一次加载
      refresh: false, // 页面onShow是否刷新
      eventNo: '' // 雷达事件号
    }
  },
  onLoad() {
  },
  methods: {
    // 设置头部标题
    _setTitle(title) {
      this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle(title)
    },
    // 轮播图滚动
    bannerChange(e) {
      this.currentNum = e.mp.detail.current * 1 + 1
    },
    // 跳转门店
    toShop() {
      let url = `${this.$routes.main.SHOP}`
      wx.switchTab({ url })
    },
    // 设置AI雷达事件号
    _setEventNo() {
      let entryAppType = wx.getStorageSync('entryAppType')
      this.eventNo = this.eventConfig[entryAppType]
    }
  }
}
