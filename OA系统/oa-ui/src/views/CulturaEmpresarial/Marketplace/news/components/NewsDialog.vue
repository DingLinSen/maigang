<template>
  <ElDialog
    ref="ElDialogRef"
    v-model="AddDialogVisible"
    :title="dialogTitle"
    class="cultivate-custom"
    @closed="back"
  >
    <Form ref="formRef" :schema="schema">
      <!-- 富文本 -->
      <template #content>
        <div
          v-if="isDisabled"
          class="border editor_bor"
          @click="setImgBigger"
          v-html="content"
        ></div>
        <Editor
          v-else
          ref="editorRef"
          v-model="content"
          :height="500"
          :isReadOnly="isDisabled"
          :isCompanyNews="basePath == 'pro'"
        />
      </template>
    </Form>
    <template #footer>
      <div class="footer">
        <el-button v-if="!isDisabled" :loading="loading" type="primary" @click="save"
          >保存
        </el-button>
        <el-button v-if="!isDisabled" @click="reset">重置</el-button>
        <el-button @click="back">返回</el-button>
      </div>
    </template>
  </ElDialog>
  <BigImg :ifImgShow="ifImgShow" :imgSite="imgSite" :imgSrc="imgSrc" @close-big-img="closeBigImg" />
</template>
<script lang="ts" setup>
import { ref, unref, onMounted, watch } from 'vue'
import { ElDialog } from '@/components/ElDialog'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { Form, FormExpose } from '@/components/Form'
import { Editor } from '@/components/Editor'
import {
  addCompanyContent,
  editCompanyContent,
  getDetailCompanyContent
} from '@/api/CulturaEmpresarial/news'
import { getdeptListApi } from '@/api/user'
import { ElMessage } from 'element-plus'
import { isAuth } from '@/utils/is'
import { BigImg } from '@/views/Components/Details/index'
import axios from 'axios'
// import { useCache } from '@/hooks/web/useCache'
// import { useAppStoreWithOut } from '@/store/modules/app'

// const appStore = useAppStoreWithOut()
// const { wsCache } = useCache()
// const token = wsCache.get(appStore.getToken)
const basePath = import.meta.env.VITE_API_BASEPATH
const imgSrc = ref<string>('')
const ifImgShow = ref<boolean>(false)
const imgSite = ref<any>({
  height: 0,
  width: 0
})
const setImgBigger = (e: any) => {
  if (e.target.nodeName === 'IMG') {
    let userAgent = navigator.userAgent //识别浏览器
    if (userAgent.indexOf('Chrome') > -1) {
      imgSrc.value = e.target.currentSrc //谷歌
    } else {
      imgSrc.value = e.target.href //其他
    }
    ifImgShow.value = true
    imgSite.value.height = e.target.offsetHeight
    imgSite.value.width = e.target.offsetWidth
  }
}

const closeBigImg = () => {
  ifImgShow.value = false
  imgSrc.value = ''
}
const formRef = ref<FormExpose>()
const { required, notSpace } = useValidator()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
const groupList = ref<any>()
const checkAll = ref<boolean>(true) // 全选
const isIndeterminate = ref<boolean>(false) //复选框的样式,
const content = ref<any>()
const checkboxList = ref<any>()
const loading = ref(false)
// 弹窗默认关闭
const AddDialogVisible = ref<boolean>(false)
// 弹出框的标题
const dialogTitle = ref<string>('')
// 是否为编辑
const isEdit = ref<boolean>(false)
const emit = defineEmits(['changeGetDetailAndList'])
onMounted(() => {
  // getdeptList()
})
const isDisabled = ref(false)
// 表单项
const schema = ref<FormSchema[]>([
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;',
      maxlength: 200,
      clearable: false,
      placeholder: '请输入标题',
      disabled: isDisabled
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'subTitle',
    label: '副标题',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;',
      maxlength: 500,
      type: 'textarea',
      rows: 3,
      clearable: false,
      placeholder: '请输入副标题',
      disabled: isDisabled
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'content',
    component: 'Editor',
    label: '新闻内容',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%',
      maxlength: 2000,
      disabled: isDisabled,
      isCompanyNews: true
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  }
])

watch(
  () => content.value,
  (val) => {
    let str = val.replace(/<[^>]+>/g, '')
    setValues({ content: str })
  }
)

// 打开弹出框
const openDialog = (flag: boolean, id: number, str: string) => {
  AddDialogVisible.value = true
  isEdit.value = flag ? false : true
  if (id) {
    getDetail(id)
  }
  if (str) {
    getDetail(id)
    isDisabled.value = true
    dialogTitle.value = '详情'
  } else {
    dialogTitle.value = flag ? '新增' : '编辑'
  }
}
// 获取详情
const getDetail = async (id) => {
  const res = await getDetailCompanyContent(id)
  if (res && res.data) {
    var arr = []
    if (res.data.tinfoAnnouncementDeptDos) {
      res.data.tinfoAnnouncementDeptDos.forEach((v) => {
        if (arr.indexOf(v.deptId) == -1) {
          arr.push(v.deptId)
        }
      })
    }
    groupList.value = arr
    content.value = res.data.content ? res.data.content : ''
    setValues(res.data)
  }
}
const setValues = (form) => {
  unref(formRef)?.setValues(form)
}
// 点击返回
const back = () => {
  content.value = ''
  checkAll.value = true
  AddDialogVisible.value = false
  isDisabled.value = false
}
// 新增
const addAnnouncement = async (data: any) => {
  const res = await addCompanyContent(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('changeGetDetailAndList')
    AddDialogVisible.value = false
    // if (res.data && basePath == 'pro') {
    //   const paramsMg = res.data
    //   // 向另一个库增加数据
    //   axios.defaults.withCredentials = true
    //   axios.post('/news-api/companyContent', paramsMg).then((res) => {
    //     console.log('新闻保存：' + res.status)
    //   })
    // }
  }
}
// 编辑
const EditAnnouncement = async (data: any) => {
  const res = await editCompanyContent(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('修改信息成功')
    emit('changeGetDetailAndList')
    AddDialogVisible.value = false
    // // 向另一个库增加数据
    // if (res.data && basePath == 'pro') {
    //   const paramsMg = res.data
    //   axios.defaults.withCredentials = true
    //   axios.put('/news-api/companyContent', paramsMg).then((res) => {
    //     console.log('新闻保存：' + res)
    //   })
    // }
  }
}
// 点击保存
const save = async (num: number) => {
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate((isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as any
      // 描述
      data.content = content.value
      if (basePath == 'pro') {
        data.flag = '0'
      }
      if (isEdit.value) {
        EditAnnouncement(data)
      } else {
        addAnnouncement(data)
      }
    }
  })
}
// 点击重置
const reset = () => {
  if (isDisabled.value == true) {
    return
  }
  unref(formRef)?.setValues({
    title: '',
    subTitle: ''
  })
  content.value = ''
  checkAll.value = true
}
// 传递给父组件的方法
defineExpose({
  openDialog
})
</script>
<style lang="less" scoped>
.editor_bor {
  width: 100%;
  min-height: 80px;
  padding: 10px;
}

:deep(ul) {
  list-style: disc !important;
}

:deep(a) {
  color: #00a0e9;
  text-decoration: underline !important;
}

:deep(table) {
  border: 1px solid black;
}

:deep(tr) {
  border: 1px solid black;
}

:deep(th) {
  min-width: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid black;
}

:deep(td) {
  min-width: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid black;
}

:deep(h1) {
  font-size: 22px;
  font-weight: bold;
}

:deep(h2) {
  font-size: 20px;
  font-weight: bold;
}

:deep(h3) {
  font-size: 18px;
  font-weight: bold;
}

:deep(h4) {
  font-size: 16px;
  font-weight: bold;
}

:deep(h5) {
  font-size: 14px;
  font-weight: bold;
}
</style>
<style lang="less">
  .editor_bor{
    img{
      display: inline-block;
    }
  }
</style>
