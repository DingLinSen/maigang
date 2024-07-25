<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
// import { ElButton } from 'element-plus'
// import { DrawerWrap } from '@/components/DrawerWrap'
// import { ContentWrap } from '@/components/ContentWrap'
import { Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'

// import './designer.style.css' //引入VForm3样式

onMounted(() => {})
const designerConfig = {
  // 是否显示语言切换菜单
  languageMenu: false,
  // 是否显示GitHub、文档等外部链接
  externalLink: false,
  // 是否显示表单模板
  formTemplates: true,
  // 是否禁止修改唯一名称
  widgetNameReadonly: false,
  // 是否显示组件事件属性折叠面板
  eventCollapse: true,
  // 是否显示清空设计器按钮
  clearDesignerButton: true,
  // 是否显示预览表单按钮
  previewFormButton: true,
  // 是否显示导入JSON按钮
  importJsonButton: false,
  // 是否显示导出JSON器按钮
  exportJsonButton: false,
  // 是否显示导出代码按钮
  exportCodeButton: false,
  // 是否显示生成SFC按钮
  generateSFCButton: false,
  // 工具按钮栏最大宽度（单位px）
  toolbarMaxWidth: 180,
  // 工具栏按钮最小宽度（单位px）
  toolbarMinWidth: 180,
  // 表单设计器预设CSS代码
  presetCssCode: ''
}
const vfdRef = ref(null)
const formJson = reactive({
  widgetList: [],
  formConfig: {
    modelName: 'formData',
    refName: 'vForm',
    rulesName: 'rules',
    labelWidth: 80,
    labelPosition: 'left',
    size: '',
    labelAlign: 'label-left-align',
    cssCode: '',
    customClass: '',
    functions: '',
    layoutType: 'PC',
    jsonVersion: 3,
    onFormCreated: '',
    onFormMounted: '',
    onFormDataChange: ''
  }
})
const formData = reactive({})
const optionData = reactive({})
const vFormRef = ref(null)

const submitForm = () => {
  vFormRef.value
    .getFormData()
    .then((formData) => {
      // Form Validation OK
      alert(JSON.stringify(formData))
    })
    .catch((error) => {
      // Form Validation failed
      ElMessage.error(error)
    })
}
</script>

<template>
  <ContentWrap>
    <div class="form-create">
      <v-form-designer ref="vfdRef"></v-form-designer>
      <!-- <v-form-render
        :form-json="formJson"
        :form-data="formData"
        :option-data="optionData"
        ref="vFormRef"
      >
      </v-form-render> -->
    </div>
  </ContentWrap>
</template>
<style lang="less">
// @import './designer.style.css';
body {
  margin: 0; /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
.form-create {
  height: calc(100vh - 120px);
}
.el-container {
  height: 100%;
  .el-scrollbar.container-scroll-bar{
    height: 100% !important;
  }
  .main-header {
    display: none;
  }
  .color-svg-icon {
    display: inline-block;
  }
  .el-container.center-layout-container {
    min-width: auto;
  }
}
</style>