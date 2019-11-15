import Vue from 'vue'
import App from './App'
import '@utils/env-clear'
import '@utils/app-plugins'
import '@style/common.styl'
import '@utils/http-handler'

Vue.config._mpTrace = process.env !== 'production'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
