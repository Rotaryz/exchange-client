<template>
  <div class="page-missing">
    <navigation-bar title=""></navigation-bar>
    <div class="page-container">
      <empty tip="抱歉！您访问的页面丢失啦…"></empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'PAGE_MISSING'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .page-missing
    width: 100%
    height:100vh
    background-color: $color-white
</style>
