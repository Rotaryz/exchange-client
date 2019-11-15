// 不需要自动重置data数据的页
const unResetPage = []

export default {
  data() {
    return {
      imageUrl: this.$imageUrl,
      $routes: this.$routes
    }
  },
  onLoad() {
  },
  onUnload() {
    this.timer && clearInterval(this.timer)
    this.timer && clearTimeout(this.timer)
    this._resetData()
    this._clearWatcher()
  },
  methods: {
    _clearWatcher() {
      if (!this.$mp) return
      // 清除mpvue的wathcers
      this._watchers = []
      this._watcher && this._watcher.teardown()
    },
    _resetData() {
      // 重置页面组件的data数据
      if (!this.$mp) return
      // 重置页面的data数据
      let flag = unResetPage.some(value => {
        let reg = new RegExp(value)
        return reg.test(this.$options.__file)
      })
      if (!flag && this.$options.data) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
