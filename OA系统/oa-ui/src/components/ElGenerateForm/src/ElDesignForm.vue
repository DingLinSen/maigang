<!-- 表单设计器主页面 -->
<template>
  <div class="fc-style" :style="{ height: contentHeight + 'px' }">
    <ElContainer class="fc-container">
      <ElMain class="fc-main">
        <ElContainer>
          <!-- 左侧组件区域 -->
          <ElAside width="250px">
            <div class="components">
              <ComponentGroup
                title="基础字段"
                :fields="basicFields"
                :list="element.basicComponents"
              />
              <ComponentGroup
                title="高级字段"
                :fields="advanceFields"
                :list="element.advanceComponents"
              />
              <ComponentGroup
                title="布局字段"
                :fields="layoutFields"
                :list="element.layoutComponents"
              />
            </div>
          </ElAside>
          <!-- 中间组件内容区域 -->
          <ElMain class="center-container">
            <!-- 自定义头部区域 -->
            <ElCustomHeader
              v-bind="$props"
              @preview="() => (previewVisible = true)"
              @uploadJson="() => (uploadJsonVisible = true)"
              @generateJson="handleGenerateJson"
              @generateCode="handleGenerateCode"
              @clearable="handleClearable"
            >
              <slot name="header"></slot>
            </ElCustomHeader>
            <ElMain :class="{ 'widget-empty': widgetForm.list }">
              <ElWidgetForm
                ref="widgetFormRef"
                v-model:widgetForm="widgetForm"
                v-model:widgetFormSelect="widgetFormSelect"
              />
            </ElMain>
          </ElMain>
          <ElAside class="widget-config-container" width="300px">
            <ElContainer>
              <ElHeader>
                <div
                  class="config-tab"
                  :class="{ active: configTab === 'widget' }"
                  @click="configTab = 'widget'"
                >
                  字段属性
                </div>
                <div
                  class="config-tab"
                  :class="{ active: configTab === 'form' }"
                  @click="configTab = 'form'"
                >
                  表单属性
                </div>
              </ElHeader>
              <ElMain class="config-content">
                111
                <!-- <ElWidgetConfig v-show="configTab === 'widget'" v-model:select="widgetFormSelect" />
                <ElFormConfig v-show="configTab === 'form'" v-model:config="widgetForm.config" /> -->
              </ElMain>
            </ElContainer>
          </ElAside>
        </ElContainer>
      </ElMain>

      <ElDialog v-model="uploadJsonVisible" title="导入JSON" :width="800">
        <ElAlert
          type="info"
          title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"
          style="margin-bottom: 10px"
        />
        <!-- <CodeEditor v-model:value="jsonEg" language="json" /> -->
        <template #footer>
          <ElButton @click="() => (uploadJsonVisible = false)">取消</ElButton>
          <ElButton type="primary" @click="handleUploadJson">导入</ElButton>
        </template>
      </ElDialog>

      <ElDialog v-model="previewVisible" title="预览" :width="800">
        <!-- <ElGenerateForm ref="generateFormRef" v-if="previewVisible" :data="widgetForm" /> -->
        <template #footer>
          <ElButton @click="handleReset">重置</ElButton>
          <ElButton type="primary" @click="handleGetData">获取数据</ElButton>
        </template>

        <ElDialog v-model="dataJsonVisible" title="获取数据" :width="800">
          <!-- <CodeEditor :value="dataJsonTemplate" language="json" readonly /> -->

          <template #footer>
            <ElButton @click="() => (dataJsonVisible = false)">取消</ElButton>
            <ElButton type="primary" @click="handleCopyClick(dataJsonTemplate)">Copy</ElButton>
          </template>
        </ElDialog>
      </ElDialog>

      <ElDialog v-model="generateJsonVisible" title="生成JSON" :width="800">
        <!-- <CodeEditor :value="generateJsonTemplate" language="json" readonly /> -->

        <template #footer>
          <ElButton @click="() => (generateJsonVisible = false)">取消</ElButton>
          <ElButton type="primary" @click="handleCopyClick(generateJsonTemplate)">Copy</ElButton>
        </template>
      </ElDialog>

      <ElDialog v-model="dataCodeVisible" title="生产代码" :width="800">
        <ElTabs type="card" v-model="codeLanguage" :tabBarStyle="{ margin: 0 }">
          <ElTabPane label="Vue Component" :name="codeType.Vue">
            222
            <!-- <CodeEditor :value="dataCodeTemplate" language="html" readonly /> -->
          </ElTabPane>
          <ElTabPane label="HTML" :name="codeType.Html">
            222
            <!-- <CodeEditor :value="dataCodeTemplate" language="html" readonly /> -->
          </ElTabPane>
        </ElTabs>

        <template #footer>
          <ElButton @click="() => (dataCodeVisible = false)">取消</ElButton>
          <ElButton type="primary" @click="handleCopyClick(dataCodeTemplate)">Copy</ElButton>
        </template>
      </ElDialog>
    </ElContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, toRefs, watchEffect, computed, ref } from 'vue'
import {
  ElMessage,
  ElContainer,
  ElMain,
  ElAside,
  ElHeader,
  ElDialog,
  ElButton,
  ElTabs,
  ElTabPane,
  ElAlert
} from 'element-plus'
import { defaultsDeep } from 'lodash-es'
// import CodeEditor from '@/components/CodeEditor.vue'
import ComponentGroup from './component/ComponentGroup.vue' // 左侧拖拽组件
import ElCustomHeader from './ElCustomHeader.vue' // 自定义头部
import ElWidgetForm from './ElWidgetForm.vue' // 中间组件显示区域
// import ElGenerateForm from './ElGenerateForm.vue'
// import ElWidgetConfig from './ElWidgetConfig.vue'
// import ElFormConfig from './ElFormConfig.vue'
import { element } from '@/config/element'
import { copy } from '@/utils'
import { CodeType, PlatformType } from '@/enums'
import generateCode from '@/utils/generateCode'
import { WidgetForm } from '@/config/element/element'
import { useAppStore } from '@/store/modules/app'

export default defineComponent({
  name: 'ElDesignForm',
  components: {
    ElCustomHeader, // 自定义头部
    ComponentGroup, // 左侧可选组件区域
    // CodeEditor,
    ElWidgetForm // 中间组件显示区域
    // ElGenerateForm,
    // ElWidgetConfig,
    // ElFormConfig
  },
  props: {
    preview: {
      type: Boolean,
      default: true
    },
    generateCode: {
      type: Boolean,
      default: true
    },
    generateJson: {
      type: Boolean,
      default: true
    },
    uploadJson: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    basicFields: {
      type: Array as PropType<Array<string>>,
      default: () => [
        'input',
        'password',
        'textarea',
        'number',
        'radio',
        'checkbox',
        'time',
        'date',
        'rate',
        'select',
        'switch',
        'slider',
        'text'
      ]
    },
    advanceFields: {
      type: Array as PropType<Array<string>>,
      default: () => ['img-upload', 'richtext-editor', 'cascader']
    },
    layoutFields: {
      type: Array as PropType<Array<string>>,
      default: () => ['grid']
    }
  },
  setup(props) {
    const state = reactive({
      element,
      codeType: CodeType,
      widgetForm: JSON.parse(JSON.stringify(element.widgetForm)),
      widgetFormSelect: undefined,
      generateFormRef: null as any,
      configTab: 'widget',
      previewVisible: false,
      uploadJsonVisible: false,
      dataJsonVisible: false,
      dataCodeVisible: false,
      generateJsonVisible: false,
      generateCodeVisible: false,
      generateJsonTemplate: JSON.stringify(element.widgetForm, null, 2),
      dataJsonTemplate: '',
      dataCodeTemplate: '',
      codeLanguage: CodeType.Vue,
      jsonEg: JSON.stringify(element.widgetForm, null, 2)
    })
    const appStore = useAppStore()
    const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
    const topWrap = document.querySelector('.el-dialog__header')
    const contentHeight = ref(0)
    console.log(documentClientHeight.value)
    contentHeight.value = documentClientHeight.value - 60
    const handleUploadJson = () => {
      try {
        state.widgetForm.list = []
        defaultsDeep(state.widgetForm, JSON.parse(state.jsonEg))

        if (state.widgetForm.list) {
          state.widgetFormSelect = state.widgetForm.list[0]
        }

        state.uploadJsonVisible = false
        ElMessage.success('上传成功')
      } catch (error) {
        ElMessage.error('上传失败')
      }
    }

    const handleCopyClick = (text: string) => {
      copy(text)
      ElMessage.success('Copy成功')
    }

    const handleGetData = () => {
      state.generateFormRef.getData().then((res: any) => {
        state.dataJsonTemplate = JSON.stringify(res, null, 2)
        state.dataJsonVisible = true
      })
    }

    const handleGenerateJson = () =>
      (state.generateJsonTemplate = JSON.stringify(state.widgetForm, null, 2)) &&
      (state.generateJsonVisible = true)

    const handleGenerateCode = () => {
      state.codeLanguage = CodeType.Vue
      state.dataCodeVisible = true
    }

    watchEffect(() => {
      if (state.dataCodeVisible) {
        state.dataCodeTemplate = generateCode(
          state.widgetForm,
          state.codeLanguage,
          PlatformType.Element
        )!
      }
    })

    const handleClearable = () => {
      state.widgetForm.list = []
      defaultsDeep(state.widgetForm, JSON.parse(JSON.stringify(element.widgetForm)))
      state.widgetFormSelect = undefined
    }

    const handleReset = () => state.generateFormRef.reset()

    const getJson = () => state.widgetForm

    const setJson = (json: WidgetForm) => {
      state.widgetForm.list = []
      defaultsDeep(state.widgetForm, json)
      if (json.list.length) {
        state.widgetFormSelect = json.list[0]
      }
    }

    const getTemplate = (codeType: CodeType) =>
      generateCode(state.widgetForm, codeType, PlatformType.Element)

    const clear = () => handleClearable()

    return {
      ElContainer,
      ElMain,
      ElAside,
      ElHeader,
      ElDialog,
      ElButton,
      ElTabs,
      ElTabPane,
      ElAlert,
      ...toRefs(state),
      handleUploadJson,
      handleCopyClick,
      handleGetData,
      handleGenerateJson,
      handleGenerateCode,
      handleClearable,
      handleReset,
      getJson,
      setJson,
      getTemplate,
      clear,
      contentHeight
    }
  }
})
</script>

<style lang="less">
@import '../index.less';
</style>
