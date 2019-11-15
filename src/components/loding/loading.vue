<template>
  <div class="loading">
    <img src="./icon-loading@2x.png" class="loading-img">
    <div class="loading-text">玩命加载中...</div>
  </div>
</template>

<script>
  const PAGE_NAME = 'loading'

  export default {
    name: PAGE_NAME
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .loading
    background: $color-white
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 10

  .loading-img
    width: 42.5px
    height: 42.5px

  .loading-text
    margin-top: 23.5px
    color: $color-text-sub
    font-family: $font-family-regular
    font-size: $font-size-14
</style>
