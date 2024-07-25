<script setup lang="ts">
import { onBeforeUnmount, computed, PropType, unref, nextTick, ref, watch, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import attachmentModule from '@wangeditor/plugin-upload-attachment'
import {
  IDomEditor,
  IEditorConfig,
  i18nChangeLanguage,
  IToolbarConfig,
  Boot
} from '@wangeditor/editor'
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is'
import { ElMessage } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { uploldFile } from '@/api/common'

// 注册。要在创建编辑器之前注册，且只能注册一次，一定要判断，不可重复注册。
if (Boot.plugins.length < 13) {
  //判断如果已经插入进去，不在二次插入
  Boot.registerModule(attachmentModule)
}

const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.getCurrentLocale)

i18nChangeLanguage(unref(currentLocale).lang)

const props = defineProps({
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number, String]),
  minHeight: propTypes.oneOfType([Number, String]).def('30vh'),
  isDisabled: {
    type: Boolean,
    defalut: false
  },
  isShowMenu: {
    type: Boolean,
    defalut: true
  },
  editorConfig: {
    type: Object as PropType<IEditorConfig>,
    default: () => undefined
  },
  // 菜单目前定死
  // toolbarConfig: {
  //   type: Object as PropType<IToolbarConfig>,
  //   default: () => undefined
  // },
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['change', 'update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

const valueHtml = ref('')
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}
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
const disabledChange = (val) => {
  if (editorRef.value) {
    if (val) {
      editorRef.value.disable()
    } else {
      editorRef.value.enable()
    }
  }
}
// 监听
watch(
  () => props.isDisabled,
  (val: any) => {
    nextTick(() => {
      disabledChange(val)
    })
  },
  {
    immediate: true
  }
)

// 编辑器配置
// eslint-disable-next-line vue/no-dupe-keys
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      readOnly: false,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      scroll: true,
      uploadImgShowBase64: true,
      hoverbarKeys: {
        attachment: {
          menuKeys: ['downloadAttachment'] // “下载附件”菜单
        }
      },

      MENU_CONF: {
        // fullScreen: {},
        uploadImage: {
          server: '/mgdaas-file/upload',
          fieldName: '上传',
          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 10 * 1024 * 1024, // 1M
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 10,
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],
          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          // meta: {
          //   token: 'xxx',
          //   otherKey: 'yyy'
          // },

          // 将 meta 拼接到 url 参数中，默认 false
          metaWithUrl: false,
          // 自定义增加 http  header
          // headers: {
          //   Accept: 'text/x-json',
          //   otherKey: 'xxx'
          // },
          // 跨域是否传递 cookie ，默认为 false
          withCredentials: true,
          // 超时时间，默认为 10 秒
          timeout: 15 * 1000, // 5 秒
          async customUpload(file, insertFn) {
            // 文件上传
            const list = ['bmp', 'gif', 'jpg', 'jpeg', 'png']
            const fileName = file.name.split('.')
            const fileExt = fileName[fileName.length - 1]
            if (!list.find((s) => s === fileExt)) {
              return ElMessage.error('只能上传bmp, gif, jpg, jpeg, png类型的图片')
            }
            if (fileName[0].length > 100) {
              return ElMessage.error('文件名最大不超过100')
            }
            if (file.size > 10 * 1024 * 1024) {
              return ElMessage.error('图片最大不超过10M')
            }
            await uploldFile('/mgdaas-file/upload', { file: file }).then((res: any) => {
              if (res) {
                insertFn(res.data.url, res.data.name, res.data.name)
              }
            })
          },
          // 上传之前触发
          onBeforeUpload(file: File) {
            // file 选中的文件，格式如 { key: file }
            return file

            // 可以 return
            // 1. return file 或者 new 一个 file ，接下来将上传
            // 2. return false ，不上传这个 file
          },
          // 上传进度的回调函数
          onProgress(progress: number) {
            // progress 是 0-100 的数字
            // console.log('progress', progress)
          },
          // 单个文件上传成功之后
          onSuccess(file: File, res: any) {
            // console.log(`${file.name} 上传成功`, res)
          },

          // 单个文件上传失败
          onFailed(file: File, res: any) {
            // console.log(`${file.name} 上传失败`, res)
          },

          // 上传错误，或者触发 timeout 超时
          onError(file: File, err: any, res: any) {
            // console.log(`${file.name} 上传出错`, err, res)
          }
        },
        uploadVideo: {
          server: '/mgdaas-file/upload',
          fieldName: '上传',
          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 1024 * 1024 * 1024, // 1M
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 10,
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['video/*'],
          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          // meta: {
          //   token: 'xxx',
          //   otherKey: 'yyy'
          // },

          // 将 meta 拼接到 url 参数中，默认 false
          metaWithUrl: false,
          // 自定义增加 http  header
          // headers: {
          //   Accept: 'text/x-json',
          //   otherKey: 'xxx'
          // },
          // 跨域是否传递 cookie ，默认为 false
          withCredentials: true,
          // 超时时间，默认为 10 秒
          timeout: 15 * 1000, // 5 秒
          async customUpload(file, insertFn) {
            const list = ['mp4']
            const fileName = file.name.split('.')
            const fileExt = fileName[fileName.length - 1]
            if (!list.find((s) => s === fileExt)) {
              return ElMessage.error('只能上传mp4类型的视频')
            }
            if (fileName[0].length > 100) {
              return ElMessage.error('文件名最大不超过100')
            }
            // 文件上传
            if (file.size > 1024 * 1024 * 1024) {
              return ElMessage.error('视频最大不超过10M')
            }
            await uploldFile('/mgdaas-file/upload', { file: file }).then((res: any) => {
              if (res) {
                console.log('res', res)
                if (res.data) {
                  insertFn(res.data.url, res.data.name, res.data.name)
                }
              }
            })
          },
          // 上传之前触发
          onBeforeUpload(file: File) {
            // file 选中的文件，格式如 { key: file }
            return file

            // 可以 return
            // 1. return file 或者 new 一个 file ，接下来将上传
            // 2. return false ，不上传这个 file
          },
          // 上传进度的回调函数
          onProgress(progress: number) {
            // progress 是 0-100 的数字
            // console.log('progress', progress)
          },
          // 单个文件上传成功之后
          onSuccess(file: File, res: any) {
            // console.log(`${file.name} 上传成功`, res)
          },

          // 单个文件上传失败
          onFailed(file: File, res: any) {
            // console.log(`${file.name} 上传失败`, res)
          },

          // 上传错误，或者触发 timeout 超时
          onError(file: File, err: any, res: any) {
            // console.log(`${file.name} 上传出错`, err, res)
          }
        },
        // “上传附件”菜单的配置
        uploadAttachment: {
          server: '/mgdaas-file/upload', // 服务端地址
          timeout: 15 * 1000, // 5s
          fieldName: 'custom-fileName',
          meta: { token: 'xxx', a: 100 }, // 请求时附加的数据
          metaWithUrl: true, // meta 拼接到 url 上
          headers: { Accept: 'text/x-json' },

          maxFileSize: 10 * 1024 * 1024, // 10M
          async customUpload(file, insertFn) {
            const list = [
              'bmp',
              'gif',
              'jpg',
              'jpeg',
              'png',
              'doc',
              'docx',
              'xls',
              'xlsx',
              'ppt',
              'pptx',
              'html',
              'htm',
              'txt',
              'rar',
              'zip',
              'gz',
              'bz2',
              'mp4',
              'avi',
              'rmvb',
              'pdf'
            ]
            const fileName = file.name.split('.')
            const fileExt = fileName[fileName.length - 1]
            if (!list.find((s) => s === fileExt)) {
              return ElMessage.error(
                '只能上传bmp, gif, jpg, jpeg, png, doc, docx, xls, xlsx, ppt, pptx, html, htm, txt, rar, zip, gz, bz2, mp4, avi, rmvb, pdf类型的文件'
              )
            }
            if (fileName[0].length > 100) {
              return ElMessage.error('文件名最大不超过100')
            }
            if (file.size > 10 * 1024 * 1024) {
              return ElMessage.error('附件最大不超过10M')
            }
            await uploldFile('/mgdaas-file/upload', { file: file }).then((res: any) => {
              if (res) {
                insertFn(res.data.name, res.data.url)
              }
            })
          },
          onBeforeUpload(file: File) {
            return file // 上传 file 文件
            // return false // 会阻止上传
          },
          onProgress(progress: number) {
            // console.log('onProgress', progress)
          },
          onSuccess(file: File, res: any) {
            // console.log('onSuccess', file, res)
          },
          onFailed(file: File, res: any) {
            ElMessage.error(res.message)
            // console.log('onFailed', file, res)
          },
          onError(file: File, err: Error, res: any) {
            ElMessage.error(err.message)
            // console.error('onError', file, err, res)
          },

          // // 上传成功后，用户自定义插入文件
          // customInsert(res: any, file: File, insertFn: Function) {
          //   console.log('customInsert', res)
          //   const { url } = res.data || {}
          //   if (!url) throw new Error(`url is empty`)

          //   // 插入附件到编辑器
          //   insertFn(`customInsert-${file.name}`, url)
          // },

          // // 用户自定义上传
          // customUpload(file: File, insertFn: Function) {
          //   console.log('customUpload', file)

          //   return new Promise((resolve) => {
          //     // 插入一个文件，模拟异步
          //     setTimeout(() => {
          //       const src = `https://www.w3school.com.cn/i/movie.ogg`
          //       insertFn(`customUpload-${file.name}`, src)
          //       resolve('ok')
          //     }, 500)
          //   })
          // },

          // // 自定义选择
          // customBrowseAndUpload(insertFn: Function) {
          //   alert('自定义选择文件，如弹出图床')
          //   // 自己上传文件
          //   // 上传之后用 insertFn(fileName, link) 插入到编辑器
          // },

          // 插入到编辑器后的回调
          onInsertedAttachment(elem: any) {
            // console.log('onInsertedAttachment', elem)
          }
        }
      }
    },
    props.editorConfig || {}
  )
})
/* 工具栏配置 */
// eslint-disable-next-line vue/no-dupe-keys
// 配置全部菜单
// const toolbarConfig = computed(() => {
//   return Object.assign(
//     {
//       // 插入哪些菜单
//       insertKeys: {
//         index: 24, // 自定义插入的位置
//         keys: ['uploadAttachment'] // “上传附件”菜单
//       },
//       excludeKeys: ['insertImage', 'insertVideo']
//       // modalAppendToBody: true
//     },
//     props.toolbarConfig || {}
//   )
// })
// 编辑器菜单配置
const toolbarConfig: Partial<IToolbarConfig> = {}
toolbarConfig.toolbarKeys = [
  // 'headerSelect', // 标题
  // {
  //   key: 'group-header',
  //   title: '标题',
  //   menuKeys: [
  //     'header1', // 标题1
  //     'header2', // 标题2
  //     'header3', // 标题3
  //     'header4', // 标题4
  //     'header5' // 标题5
  //   ]
  // },
  // '|', // 模块分割线
  'bold', // 粗体
  'underline', // 下划线
  'italic', // 斜体
  // 'through', // 删除线
  // 'code', // 行内代码
  // 'sub', // 下标
  // 'sup', // 上标
  // 'clearStyle', // 清除格式
  'color', // 字体颜色
  'bgColor', // 背景色
  '|', // 模块分割线
  'fontSize', // 字号
  'fontFamily', // 字体
  'lineHeight', // 行高
  '|', // 模块分割线
  'justifyLeft', // 左对齐
  'justifyRight', // 右对齐
  'justifyCenter', // 居中对齐
  'justifyJustify', // 两端对齐
  'indent', // 增加缩进
  'delIndent', // 减少缩进
  '|', // 模块分割线
  'uploadVideo', // 上传视频
  // 'insertVideo', // 插入网络视频
  // 'editVideoSize', // 修改视频尺寸
  'uploadImage', // 上传图片
  'uploadAttachment', // 上传附件
  // 'insertImage', // 网络图片
  // 'deleteImage', // 删除图片
  // 'editImage', // 编辑图片
  // 'viewImageLink', // 查看链接
  // 'imageWidth30', // 图片宽度相对于编辑器宽度的百分比30
  // 'imageWidth50', // 图片宽度相对于编辑器宽度的百分比50
  // 'imageWidth100', // 图片宽度相对于编辑器宽度的百分比100
  // 'divider', // 分割线
  // 'emotion', // 表情
  // 'insertLink', // 插入链接
  // 'editLink', // 修改链接
  // 'unLink', // 取消链接
  // 'viewLink', // 查看链接
  // 'codeBlock', // 代码块
  // 'blockquote', // 引用

  // 'todo', // 待办
  // 'redo', // 重做
  // 'undo', // 撤销
  // 'fullScreen', // 全屏
  // 'enter', // 回车
  // 'bulletedList', // 无序列表
  // 'numberedList', // 有序列表
  'insertTable' // 插入表格
  // 'deleteTable', // 删除表格
  // 'insertTableRow', // 插入行
  // 'deleteTableRow', // 删除行
  // 'insertTableCol', // 插入列
  // 'deleteTableCol', // 删除列
  // 'tableHeader', // 表头
  // 'tableFullWidth', // 宽度自适应
  // 'codeSelectLang' // 选择语言
]
const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height,
    minHeight: isNumber(props.minHeight) ? `${props.minHeight}px` : props.minHeight
  }
})

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
    class="editor-wrapper border-1 border-solid border-[var(--tags-view-border-color)] z-99"
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
      :editorId="editorId"
      :defaultConfig="editorConfig"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>
<style lang="less" scoped>
.editor-wrapper {
  width: 100%;
}
</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>
