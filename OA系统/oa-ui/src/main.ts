// 引入windi css
import '@/plugins/windi.css'
// import '../config/flexible'

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

// 引入全局样式

import '@/assets/font/font.css'
import '@/styles/index.less'

// 引入vue-simple-uploader
import uploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'

/** iconfont
 * Symbol 引用
 */
import './assets/fileIconfont/iconfont'
// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission, setDialogDraw } from './directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'
import './flexble'

import Title from '@/views/Components/Title/index.vue'

import { useDict } from '@/utils/dict'

import diyDialogDrag from '@/utils/dialogDrag'

// 引入 Vue 自定义指令集并配置为全局属性
import diyVueDirectives from "@/utils/diyVueDirectives"

const app = createApp(App)

// 创建实例
const setupAll = async () => {
  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)
  // setDialogDraw(app)

  setupPermission(app)
  app.use(ElementPlus)
  app.use(VueCookies)
  app.use(diyDialogDrag)
  app.use(diyVueDirectives)
  app.use(uploader)
  app.component('Title', Title)
  app.mount('#app')
  // 全局方法挂载
  app.config.globalProperties.useDict = useDict
}

setupAll()

export default app
