import { mapGetters, mapActions, mapMutations } from 'vuex'
// -----------  购物车 ----------
export const cartComputed = {
  ...mapGetters('cart', ['count', 'order'])
}
export const cartMethods = {
  ...mapActions('cart', ['_addToCart', '_getCartCount', '_payFor']),
  ...mapMutations('cart', ['SET_ORDER', 'SET_CART_COUNT'])
}
export const globalComputed = {
  ...mapGetters('global', ['statusBarHeight', '$vw', '$systemInfo', '$discountStandard', '$discountVersatile', '$discountPartner'])
}

export const globalMethods = {
  ...mapMutations('global', ['SET_NAVIGATION_CONFIG', 'SET_VW', 'SET_SYSTEM_INFO']),
  ...mapActions('global', ['getPriceTemplate'])
}
//
// export const orderComputed = {
//   ...mapGetters('order', ['goodsList', 'total', 'deliverAt', 'couponInfo', 'beforeTotal', 'commodityItem'])
// }
//
// export const orderMethods = {
//   ...mapActions('order', ['setOrderInfo', 'submitOrder', 'saveCoupon', 'setCommodityItem'])
// }
//
// export const cartMethods = {
//   ...mapActions('cart', ['setCartCount'])
// }
//
// export const jwtComputed = {
//   ...mapGetters('jwt', ['token', 'userInfo'])
// }
//
// export const jwtMethods = {
//   ...mapActions('jwt', ['setToken', 'setUserInfo'])
// }
