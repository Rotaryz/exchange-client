<template>
  <div class="out-html">
    <!--<navigation-bar title="兑换商城"></navigation-bar>-->
    <web-view :src="webView"></web-view>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'OUT_HTML'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        webView: ''
      }
    },
    onLoad(option) {
      this.webView = option.url
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .out-html
    width: 100%
</style>
