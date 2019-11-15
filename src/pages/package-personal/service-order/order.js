// 初始化订单列表数据
export default class {
  constructor(num) {
    return new Array(num).fill({
      arr: [],
      classifyMore: false,
      isEmpty: false,
      lastPage: 2,
      page: 1,
      height: 145
    })
  }
}
