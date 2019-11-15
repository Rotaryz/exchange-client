import API from '@api'
import storage from '@utils/storage'
import appJson from '../../app.json'
import $$routes from '@utils/routes'
const shopCartIndex = appJson.tabBar.list.findIndex(val => $$routes.main.SHOPPING_CART === ('/' + val.pagePath))

export const state = {
  count: '',
  order: {
    list: [],
    type: 'goods_detail'
  }
}

export const getters = {
  count(state) {
    return state.count
  },
  order(state) {
    return state.order
  }
}

export const mutations = {
  // 设置购物车所有商品总数
  SET_CART_COUNT(state, count) {
    state.count = count
    if (count > 0 && shopCartIndex > -1) {
      wx.setTabBarBadge({
        index: shopCartIndex,
        text: (count > 0 ? count : '') + ''
      })
    } else {
      wx.removeTabBarBadge({ index: shopCartIndex })
    }
  },
  // 设置 提交的订单
  SET_ORDER(state, obj) {
    state.order = obj
  }
}

export const actions = {
  // 加入购物车
  _addToCart({ commit, dispatch }, obj) {
    API.Cart.addToCart(obj).then((res) => {
      wx.showToast({ title: '加入购物车成功', duration: 1000, icon: 'none' })
      dispatch('_getCartCount')
    })
  },
  // 获取购物车数量
  _getCartCount({ commit }) {
    API.Cart.getCartCount({ loading: false }).then((res) => {
      let count = res.data.goods_count
      commit('SET_CART_COUNT', count)
      storage('cart.count', count)
    })
  },
  // 微信支付接口
  _payFor({ commit }, payRes) {
    return new Promise((resolve, reject) => {
      const { timestamp, nonceStr, signType, paySign } = payRes
      // 微信支付原生接口
      wx.requestPayment({
        timeStamp: timestamp,
        nonceStr,
        package: payRes.package,
        signType,
        paySign,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          console.log('支付失败 ')
          reject(err)
        }
      })
    })
  }
}
