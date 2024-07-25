<script setup lang="ts">
import { onBeforeUnmount, computed, PropType, unref, nextTick, ref, watch, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
  IDomEditor,
  DomEditor,
  IEditorConfig,
  IToolbarConfig,
  i18nChangeLanguage
} from '@wangeditor/editor'
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is'
import { ElMessage } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'

import axios from 'axios'
import { config } from '@/config/axios/config'
import { useCookies } from 'vue3-cookies'

import tupianChange from '@/assets/svgs/picture.svg'

const localeStore = useLocaleStore()
const appStore = useAppStoreWithOut()

const currentLocale = computed(() => localeStore.getCurrentLocale)
i18nChangeLanguage(unref(currentLocale).lang)
// 声明类型
type InsertFnType = (url: string, alt: string, href: string) => void
type InsertFnVideoType = (url: string, poster: string) => void
// 获取当前接口前缀
const { base_url } = config
const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]
const uploadURL = import.meta.env.VITE_BASE_URL
const filrUrl = '/file/upload'
const { cookies } = useCookies()
const { wsCache } = useCache()
const token = wsCache.get(appStore.getToken)
const props = defineProps({
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number]).def(500),
  editorConfig: {
    type: Object as PropType<IEditorConfig>,
    default: () => undefined
  },
  modelValue: propTypes.string.def(''),
  isReadOnly: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['change', 'update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

const valueHtml = ref('')
// 上传视屏
// const uploadVideo = () => {}
// watch(
//   () => props.modelValue,
//   (val: string) => {
//     if (val === unref(valueHtml)) return
//     valueHtml.value = val
//   },
//   {
//     immediate: true
//   }
// )
watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  },
  {
    immediate: true
  }
)
// 监听
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}
// 编辑器菜单配置
const toolbarConfig: Partial<IToolbarConfig> = {}
// 配置工具栏，添加后即可有此功能
toolbarConfig.toolbarKeys = [
  'redo', // 下一步
  'undo', // 上一步
  '|', // 模块分割线
  'headerSelect', // 标题
  'blockquote', // 引用
  '|', // 模块分割线
  'clearStyle', // 清除样式
  'bold', //粗体
  'italic', // 斜体
  'underline', // 下换线
  'color', // 文字颜色
  'bgColor', // 文字背景颜色
  'justifyLeft',
  // 'code', //行内代码
  // {
  //   key: 'group-characters', // 必填，要以 group 开头
  //   title: '···', // 必填
  //   iconSvg: '<span style="font-size:18px">···</span>',
  //   menuKeys: [
  //     'through', // 删除线
  //     'sub', // 下标
  //     'sup', // 上标
  //     'indent', //增加缩进
  //     'delIndent' // 减小缩进
  //   ]
  // },
  '|', // 模块分割线
  'lineHeight', // 行高
  'fontSize', // 文字大小
  'fontFamily', // 文字样式
  '|', // 模块分割线
  // 'todo', //代办
  'justifyLeft', // 左对齐
  'justifyRight', // 右对齐
  'justifyCenter', // 居中对齐
  'justifyJustify', // 两端对齐
  'insertTable', // 表格
  'bulletedList', // 无序列表
  'numberedList', // 有序列表
  'insertLink', // 插入链接
  // 'editLink', //修改链接
  // 'unLink', //取消链接
  // 'viewLink',// 查看链接
  // 'codeBlock', 代码块
  // 'codeSelectLang', // 选择语言
  'divider', // 分割线
  // 'emotion', // 表情
  '|', // 模块分割线
  // 上传图片
  {
    key: 'group-image', // 必填，要以 group 开头
    title: '图片', // 必填
    iconSvg: '<img style="width:20px;height:20px" src="' + tupianChange + '"></img>',
    menuKeys: [
      'uploadImage',
      // 'insertImage', // 网络图片
      'viewImageLink', // 查看图片
      // 'deleteImage', //删除图片
      'imageWidth30', // 控制图片百分比
      'imageWidth50',
      'imageWidth100'
    ]
  },
  'fullScreen' // 全屏
]
// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  MENU_CONF: {},
  scroll: false,
  readOnly: props.isReadOnly
}
const editorStyle = computed(() => {
  return {
    // height: isNumber(props.height) ? `${props.height}px` : props.height
    // 'mix-height': isNumber(props.height) ? `${props.height}px` : props.height
  }
})
// 执行上传图片功能
editorConfig.MENU_CONF!.uploadImage = {
  async customUpload(file: File, insertFn: InsertFnType) {
    // file 即选中的文件
    if (file.type.substring(0, 6) === 'image/') {
    } else {
      ElMessage.error('请上传图片格式的文件')
      return false
    }
    if (file.size > 10 * 1024 * 1024) {
      ElMessage.error('请上传小于10M的图片')
      return false
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('onePathName', 'report')
    formData.append('twoPathName', 'report')
    // 自己实现上传，并得到图片 url alt href
    axios.defaults.withCredentials = true
    axios
      .post(PATH_URL + '/file/upload', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        insertFn(res.data.data.url, res.data.data.name, res.data.data.url)
      })
  }
}
// 回调函数
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}

// 点击编辑器聚焦到文本框
const handleClick = () => {
  const editor = unref(editorRef.value)
  editor?.focus()
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)
  if (editor === null) return

  // 销毁，并移除 editor
  editor?.destroy()
})

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}

defineExpose({
  getEditorRef
})
</script>

<template>
  <div
    class="border-1 border-solid border-[var(--tags-view-border-color)] z-99"
    :style="{ minHeight: height + 'px', width: '100%' }"
    @click="handleClick"
  >
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :editorId="editorId"
      :defaultConfig="toolbarConfig"
      class="border-bottom-1 border-solid border-[var(--tags-view-border-color)]"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="valueHtml"
      id="editorId"
      :editorId="editorId"
      :defaultConfig="editorConfig"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css">
:deep(.border-solid) {
  width: 100% !important;
}

:deep() ;
</style>
