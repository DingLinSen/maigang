<script setup lang="ts">
import { ref, unref, reactive, nextTick } from 'vue'
import { ElButton, ElMessage, ElInput, ElSelect, ElOption, ElDatePicker } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
// import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import { relative } from 'path'
// import {
//   addImageContentApi,
//   editImageContentApi,
//   getImageContentDetailApi
// } from '@/api/imageContent'

// const { proxy } = getCurrentInstance() as any

// 表单校验
// type Callback = (error?: string | Error | undefined) => void
// const { required, validatePhone } = useValidator()
const apiPath = ref<string>() // 服务路径
const apiBodyJson = ref('') // json时的请求体
const relativeData = ref('') // 接收返回值
const requestMethod = ref<string>('POST') // 服务类型
const chooseDate = ref('') // 同步时间
interface header {
  keyName: string
  valueStr: string
  remark: string
}
const apiHeaderList = ref<header[]>([]) // 请求头参数数组
const apiBodyList = ref<header[]>([]) // 请求体参数数组
const bodyTypeData = ref('') // 选中的请求体类型
const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'taskName',
    label: '接口信息',
    component: 'Divider'
  },
  {
    field: 'taskName',
    label: '资源目录',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'route',
    label: '接口名称',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'apiRouter',
    label: '接口路径',
    colProps: {
      span: 24
    }
  },
  {
    field: 'apiUnit',
    label: '接口提供单位',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'apiSource',
    label: '接口来源系统',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'taskName',
    label: '请求参数',
    component: 'Divider'
  },
  {
    field: 'apiHeaders',
    label: '',
    colProps: {
      span: 12
    }
  },
  {
    field: 'apiParameter',
    label: '',
    colProps: {
      span: 12
    }
  },
  {
    field: 'taskName',
    label: '响应结果',
    component: 'Divider'
  },
  {
    field: 'apiRelevant',
    label: '',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'taskName',
    label: '接口数据同步策略',
    component: 'Divider'
  },
  {
    field: 'cycle',
    label: '同步周期',
    component: 'Select',
    colProps: {
      span: 8
    },
    componentProps: {
      style: 'width:100%;', //宽度
      // multiple: true,
      options: [
        {
          label: '每天',
          value: 0
        },
        {
          label: '每周',
          value: 1
        },
        {
          label: '每月',
          value: 2
        },
        {
          label: '每年',
          value: 3
        }
      ]
    }
  },
  {
    field: 'date',
    label: '同步时间',
    colProps: {
      span: 8
    }
  },
  {
    field: 'strategy',
    label: '同步策略',
    component: 'Select',
    colProps: {
      span: 8
    },
    componentProps: {
      style: 'width:100%;', //宽度
      // multiple: true,
      options: [
        {
          label: '全量',
          value: 0
        },
        {
          label: '增量',
          value: 1
        }
      ]
    }
  }
])

const formRef = ref<FormExpose>()

const isShow = ref<boolean>(false)

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})

const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  // const form = unref(formRef)
  // const elFormRef = form?.getElFormRef()
  // await elFormRef?.validate(async (isValid) => {
  //   if (isValid) {
  //     loading.value = true
  //     let data = form?.formModel as any
  //     if (data.id && detailsId.value) {
  //       editPost(data)
  //     } else {
  //       data.id = ''
  addPost()
  //     }
  //   }
  // })
}

//编辑岗位
const editPost = async (data: any) => {
  const res = await editImageContentApi(data)
    .catch(() => {})
    .finally(() => {
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getImageList', 'edit')
    closeDrawer()
  }
}

//新增岗位
const addPost = async () => {
  // const res = await addImageContentApi(data)
  //   .catch(() => {})
  //   .finally(() => {
  //     nextTick(() => {
  //       setTimeout(() => {
  //         loading.value = false
  //       }, 300)
  //     })
  //   })
  // if (res) {
  ElMessage.success('成功保存信息')
  // emitter.emit('getImageList', 'add')
  closeDrawer()
  // }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  isShow.value = true
  nextTick(() => {
    //重置表单
    detailsId.value = ''
    setValue(false)
    apiPath.value = ''
    apiBodyJson.value = ''
    relativeData.value = ''
    chooseDate.value = ''
    apiHeaderList.value = [
      {
        keyName: '',
        valueStr: '',
        remark: ''
      }
    ]
    apiBodyList.value = [
      {
        keyName: '',
        valueStr: '',
        remark: ''
      }
    ]
    bodyTypeData.value = '1'
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
    if (id) {
      getDetailsData(id)
    }
  })
}

//关闭drawer
const closeDrawer = () => {
  isShow.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}
let ImageContentData = reactive<any>({
  content: '',
  coverUrl: '',
  title: '',
  fileName: ''
})
//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
}
//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      content: '',
      coverUrl: '',
      title: '',
      fileName: ''
    })
  }
}

const setValues = (form: any) => {
  unref(formRef)?.setValues(form)
}
// 请求参数方法
//添加请求头
const addHeader = () => {
  apiHeaderList.value.push({
    keyName: '',
    valueStr: '',
    remark: ''
  })
}
// 删除请求头
const deleteHeader = (row) => {
  apiHeaderList.value.map((item, index) => {
    if (index === row) {
      apiHeaderList.value.splice(index, 1)
      return
    }
  })
}
// 添加请求体
const addBody = () => {
  apiBodyList.value.push({
    keyName: '',
    valueStr: '',
    remark: ''
  })
}
// 删除请求体
const deleteBody = (row) => {
  console.log(row)
  apiBodyList.value.map((item, index) => {
    if (index === row) {
      apiBodyList.value.splice(index, 1)
      return
    }
  })
}
// 选择请求体类型
const changeBodyType = (val) => {
  console.log(val)
}
// 测试接口
const testApi = () => {
  const newData = `<div>
        <span>data: null</span></br>
        <span>httpCode: 200</span></br>
        <span>msg: "执行成功" </span></br>
        <span>result: OK</span>
    </div>`
  relativeData.value = newData
}
//表单禁用
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <Dialog v-model="isShow" width="80%" :maxHeight="'auto'" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content">
      <template #apiRouter>
        <ElInput v-model="apiPath" placeholder="请输入服务路径" maxlength="100">
          <template #prepend>
            <ElSelect v-model="requestMethod" style="width: 115px">
              <ElOption value="GET" label="GET" />
              <ElOption value="POST" label="POST" />
            </ElSelect>
          </template>
        </ElInput>
      </template>
      <template #apiHeaders>
        <div class="api-header">
          <p>请求头参数Headers</p>
          <div class="header-api-content">
            <div v-for="(item, index) in apiHeaderList" :key="index" class="head-item">
              <ElInput
                v-model="item.keyName"
                placeholder="请输入参数名"
                maxlength="100"
                style="width: 20%; margin: 0 2px"
              />
              <span>:</span>
              <ElInput
                v-model="item.valueStr"
                placeholder="请输入参数值"
                maxlength="2000"
                style="width: 30%; margin: 0 2px"
              />
              <ElInput
                v-model="item.remark"
                placeholder="请输入参数说明"
                maxlength="100"
                style="width: 30%; margin: 0 2px"
              />
              <ElButton
                type="danger"
                size="small"
                style="margin: 0 2px; width: 8%"
                @click="deleteHeader(index)"
              >
                删除
              </ElButton>
            </div>
            <ElButton type="success" @click="addHeader" style="width: 50%; margin: 10px 5px"
              >添加请求头参数</ElButton
            >
          </div>
        </div>
      </template>
      <template #apiParameter>
        <div class="api-body">
          <div class="body-top">
            <p>查询参数配置</p>
            <ElSelect v-model="bodyTypeData" style="width: 115px" @change="changeBodyType(val)">
              <ElOption value="1" label="表单" />
              <ElOption value="2" label="JSON格式" />
            </ElSelect>
          </div>
          <div v-if="bodyTypeData === '2'" class="body-json">
            <ElInput
              type="textarea"
              v-model="apiBodyJson"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="2000"
            />
          </div>
          <div v-if="bodyTypeData === '1'" class="body-form">
            <div v-for="(item, index) in apiBodyList" :key="index" class="body-form-item">
              <ElInput
                v-model="item.keyName"
                placeholder="请输入参数名"
                maxlength="100"
                style="width: 20%; margin: 0 2px"
              />
              <span>:</span>
              <ElInput
                v-model="item.valueStr"
                placeholder="请输入参数值"
                maxlength="2000"
                style="width: 30%; margin: 0 2px"
              />
              <ElInput
                v-model="item.remark"
                placeholder="请输入参数说明"
                maxlength="100"
                style="width: 30%; margin: 0 2px"
              />
              <ElButton
                type="danger"
                size="small"
                style="margin: 0 2px; width: 8%"
                @click="deleteBody(index)"
              >
                删除
              </ElButton>
            </div>
            <ElButton type="success" @click="addBody" style="width: 50%; margin: 10px 5px"
              >添加请求体参数</ElButton
            >
          </div>
        </div>
      </template>
      <template #apiRelevant>
        <div class="api-relevant">
          <span v-html="relativeData"></span>
        </div>
      </template>
      <template #date>
        <ElDatePicker
          style="width: 100%"
          v-model="chooseDate"
          class="synchronous-date"
          type="date"
          placeholder="请选择同步时间"
        />
      </template>
    </Form>
    <template #footer>
      <div class="details-footer">
        <ElButton @click="closeDrawer"> 取消 </ElButton>
        <ElButton type="primary" @click="testApi"> 测试 </ElButton>
        <ElButton v-if="isSave" type="primary" :loading="loading" @click="save"> 保存 </ElButton>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
.api-header {
  width: 100%;
  height: 100%;
  background-color: rgba(246, 246, 246);

  display: flex;
  flex-direction: column;
  p {
    display: inline-block;
    width: 100%;
    padding: 5px 10px;
    text-align: left;
    border-bottom: 1px solid #eeeeee;
  }
  .header-api-content {
    text-align: center;
    flex: 1;
    padding: 15px 0;
    .head-item {
      margin-bottom: 10px;
    }
  }
}
.api-body {
  width: 100%;
  background-color: rgba(246, 246, 246);
  .body-top {
    width: 100%;
    display: flex;
    padding: 5px 10px;
    justify-content: space-between;
    border-bottom: 1px solid #eeeeee;
  }
  .body-json {
    padding: 15px;
  }
  .body-form {
    text-align: center;
    padding: 15px 0;
    .body-form-item {
      margin-bottom: 10px;
    }
  }
}
.api-relevant {
  width: 100%;
  height: 180px;
  overflow: auto;
  background-color: rgba(246, 246, 246);
  padding: 15px;
}
:deep(.synchronous-date) {
  .el-input__wrapper {
    width: 100%;
  }
}
</style>
