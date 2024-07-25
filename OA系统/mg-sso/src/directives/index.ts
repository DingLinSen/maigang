// import type { App } from 'vue'
import type { App, Directive, DirectiveBinding } from 'vue'
import { setupPermissionDirective } from './permission/hasPermi'
import { setuoDialogDraw } from './permission/dialogDraw'

/**
 * 导出指令：v-xxx
 * @methods hasPermi 按钮权限，用法: v-hasPermi
 */
export const setupPermission = (app: App<Element>) => {
  setupPermissionDirective(app)
}
/**
 * 导出指令：v-xxx
 * @methods hasPermi 按钮权限，用法: v-hasPermi
 */
export const setDialogDraw = (app: App<Element>) => {
  setuoDialogDraw(app)

  /**
   *  注意：如果是el-dialog弹出的表单el-form，最好不要把提交按钮当做el-form-item（elementUI文档是这么用的），放在el-dialog里。
   *  不然按钮会同el-dialog中标签一样被overflow；
   */
}
