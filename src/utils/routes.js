// PACKAGE_PATH
const OTHER = '/package-other'
const ACTIVE = '/package-active'
const PERSONAL = '/package-personal'
const MAIN = '/pages'
/* eslint-disable */
export default {
  other: {
    PACKAGE: OTHER,
    EXCHANGE_SUCCESS:`${OTHER}/exchange-success`,
    NETWORK_ERROR:`${OTHER}/network-error`,
    LOGIN:`${OTHER}/login`,
    // package-other
  },
  active: {
    PACKAGE: ACTIVE,
    WHEEL:`${ACTIVE}/wheel`,
    GROUP_DETAIL:`${ACTIVE}/group-detail`,
    GROUP_GOODS_DETAIL:`${ACTIVE}/group-goods-detail`,
    BARGAIN_GOODS_DETAIL:`${ACTIVE}/bargain-goods-detail`,
    SHARE_LIST:`${ACTIVE}/share-list`,
    BARGAIN_DETAIL:`${ACTIVE}/bargain-detail`,
    // package-active
  },
  personal: {
    PACKAGE: PERSONAL,
    ORDER_LIST:`${PERSONAL}/order-list`,
    EXCHANGE_RECORD:`${PERSONAL}/exchange-record`,
    ORDER_DETAIL:`${PERSONAL}/order-detail`,
    NEW_ADDRESS: `${PERSONAL}/new-address`,
    MY_ADDRESS: `${PERSONAL}/my-address`,
    MY_GRANT:`${PERSONAL}/my-grant`,
    EXCHANGE_DETAIL:`${PERSONAL}/exchange-detail`,
    LOGISTICS_INFORMATION:`${PERSONAL}/logistics-information`,
    SERVICE_ORDER:`${PERSONAL}/service-order`,
    ORDER_REFUND:`${PERSONAL}/order-refund`,
    SERVICE_DETAIL:`${PERSONAL}/service-detail`,
    MY_SHARE:`${PERSONAL}/my-share`,
    MY_BARGAIN:`${PERSONAL}/my-bargain`,
    SERVICE_ORDER_DETAIL:`${PERSONAL}/service-order-detail`,
    PRIZE_RECORD:`${PERSONAL}/prize-record`,
    // package-personal
  },
  main: {
    PACKAGE: MAIN,
    HOME:`${MAIN}/home`,
    MINE:`${MAIN}/mine`,
    COMPANY_EXPLAIN:`${MAIN}/company-explain`,
    GOODS_CLASSIFY:`${MAIN}/goods-classify`,
    GOODS_EXCHANGE:`${MAIN}/goods-exchange`,
    PAGE_MISSING:`${MAIN}/page-missing`,
    SHOPPING_CART: `${MAIN}/shopping-cart`,
    GOODS_DETAIL: `${MAIN}/goods-detail`,
    GOODS_DETAIL_EXCHANGE:`${MAIN}/goods-detail-exchange`,
    SUBMIT_ORDER: `${MAIN}/submit-order`,
    PAY_SUCCESS:`${MAIN}/pay-success`,
    GOODS_ERROR:`${MAIN}/goods-error`,
    EXCHANGE_EXPLAIN:`${MAIN}/exchange-explain`,
    OUT_HTML:`${MAIN}/out-html`,
    SHOP:`${MAIN}/shop`,
    SERVE_DETAIL:`${MAIN}/serve-detail`,
    // main
  }
}
