import 'es6-promise/auto'
import 'babel-polyfill'
// import 'lib-flexible'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/assets/css/main.less'
import '@/common/icon/iconfont.css' // 引入图标文件

// import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import CryptoJS from 'crypto-js' // 加密文件
import 'video.js/dist/video-js.min.css'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
/**
 * 配置样式数据源、图标、国际化等
 */
import '@/mock'

/**
 * 引入插件
 */
import '@/common/icons'
import '@/common/plugins'
import '@/common/iview-ui'
import '@/common/element-ui'
import '@/common/element-ui/element-ui-theme'
import moment from 'moment' // 导入时间格式
import cloneDeep from 'lodash/cloneDeep'
// import '@/assets/css/zujian.less'

// 实际打包时应该不引入mock
import env from '../config/env'

// Vue.use(VueAwesomeSwiper)
if (env === 'development') {
  require('@/mock')
}

Vue.config.productionTip = false

/**
 * 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$moment = moment
Vue.use(CryptoJS) // 加密插件
Vue.prototype.$video = Video

/**
 * 注册指令
 */
importDirective(Vue)
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  // i18n,
  store,
  render: h => h(App),
  created() {
    // 初始化应用数据
    // store.dispatch('initTrackList')
  }
})
router.beforeEach((to, from, next) => {
  next()
  // if (sessionStorage.getItem('isToRouter') === 'true') {
  //   if (to.meta.title) {
  //   }
  //   next()
  // } else {
  //   if (to.path === '/download') {
  //     next()
  //   } else {
  //     next('/download')
  //   }
  // }
})
