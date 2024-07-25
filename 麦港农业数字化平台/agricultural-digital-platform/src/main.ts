// 引入windi css
import '@/plugins/windi.css'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'
import ElementPlus from 'element-plus'
import VueCookies from 'vue3-cookies'

// 引入vue-simple-uploader
import uploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'

// 引入全局样式
import '@/styles/index.less'

// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission, dialogDragWidth } from './directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'


// import '@/utils/flexible'
//引入
import print from 'vue3-print-nb'

const app = createApp(App)

import { useDict } from '@/utils/dict'

import Image from '@/views/Components/Image/index.vue'
// 全局引入防抖
import preventReClick from '@/hooks/event/preventReClick'
const h = document.body.clientHeight || document.documentElement.clientHeight

app.config.globalProperties.$h = h
// 创建实例
const setupAll = async () => {
  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  setupPermission(app)
  dialogDragWidth(app)

  app.use(ElementPlus)
  app.use(VueCookies)
  app.use(uploader)
  app.use(print)
  app.use(preventReClick)
  app.component('Image', Image)
  app.mount('#app')
  // 全局方法挂载
  app.config.globalProperties.useDict = useDict
}

setupAll()

export default app
