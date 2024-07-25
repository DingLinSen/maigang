<script setup lang="ts">
import { ref, unref, reactive } from 'vue'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
import { Form, FormExpose } from '@/components/Form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElDialog } from '@/components/ElDialog'
import { SsoManageType } from '@/api/applicationManage/types'
import {
  ElInput,
  ElButton,
  ElRadioGroup,
  ElRadioButton,
  ElMessage,
  ElForm,
  ElFormItem
} from 'element-plus'
import { getDataById, getDataAdd, getDataUpdate } from '@/api/applicationManage'
const { validWebsidProve } = useValidator()
const { required } = useValidator()
type Callback = (error?: string | Error | undefined) => void
// 声明数组，用于接收授权的url数组
const allowUrl: any = ref([])
// 用于获取状态
const enabledStatus = ref('true')
// 上传的图标地址
// const iconUrl = ref('')
const publicedStatus = ref('true')
// 创建emit使用
const { emitter } = useEmitt()
// 声明model
const isShow = ref<boolean>(false)
// 是否显示保存按钮
const isSave = ref(false)
// 保存loding
const loading = ref(false)
// 初始化数据
let applicationData = reactive<SsoManageType>({
  id: '',
  appDesc: '',
  icon: '',
  name: '',
  clientId: '',
  uriList: [],
  enabled: 'true',
  defaultRedirectUri: '',
  owner: '',
  publiced: 'true',
  createTime: null
})
// 授权url新增
const actionUrl = () => {
  if (allowUrl.value.length < 10) {
    allowUrl.value.push({ url: '' })
  } else {
    ElMessage.error('已添加至最大条数，请删除一条后再添加')
  }
}
// 删除指定的url
const deleteUrl = (val: any, itemindex) => {
  allowUrl.value.splice(itemindex, 1)
}
// 表单字段设置
const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '应用名称',
    component: 'Input',
    componentProps: {
      maxlength: 20
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'owner',
    label: '负责人',
    component: 'Input',
    componentProps: {
      maxlength: 10
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'icon',
    label: '应用图标',
    component: 'ImgUpload',
    colProps: {
      span: 24
    },
    componentProps: {
      limit: 1, // 数量限制
      fileType: ['jpg', 'jpeg', 'png'] // 文件类型
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'appDesc',
    label: '应用介绍',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      maxlength: 200,
      rows: 4
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'uriList',
    label: '允许授权的URL',
    componentProps: {
      maxlength: 100
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      // rules: [required()]
    }
  },
  {
    field: 'defaultRedirectUri',
    label: '默认url',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入以https://或http://开头的网址'
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validWebsidProve(value, callback, '请输入正确的url'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'enabled',
    label: '应用状态',
    colProps: {
      span: 24
    }
  },
  {
    field: 'publiced',
    label: '是否公开',
    colProps: {
      span: 24
    }
  }
])
const formRef = ref<FormExpose>()
// 表单禁用
const changeDisabled = (bool: boolean) => {
  setTimeout(() => {
    unref(formRef)?.setProps({
      disabled: bool
    })
  }, 500)
}
// 表单重置
const setValue = (reset: boolean) => {
  setTimeout(() => {
    const elFormRef = unref(formRef)?.getElFormRef()
    if (reset) {
      elFormRef?.resetFields()
    } else {
      unref(formRef)?.setValues({
        id: '',
        appDesc: '',
        icon: '',
        clientId: '',
        createTime: null,
        defaultRedirectUri: '',
        owner: '',
        name: '',
        uriList: [],
        enabled: '',
        publiced: ''
      })
    }
  }, 100)
}
// 表单赋值
const setValues = (form: SsoManageType) => {
  unref(formRef)?.setValues(form)
}
// 打开
const openDrawer = (flag: string, id?: string) => {
  setValue(true)
  isSave.value = flag === 'see' ? false : true
  isShow.value = true
  changeDisabled(flag === 'see')
  if (flag === 'see') {
    schema[2].componentProps.disabled = true
  } else {
    schema[2].componentProps.disabled = false
  }
  console.log(flag)

  if (flag === 'add') {
    allowUrl.value.push({
      url: ''
    })
  }
  if (id) {
    getFromData(id)
  }
}
// 获取表单数据
const getFromData = async (id: string) => {
  let res = await getDataById(id)
  if (res) {
    const data = res.data
    applicationData = data
    applicationData.enabled = String(data.enabled)
    applicationData.publiced = String(data.publiced)
    applicationData.uriList = data.uriList
    enabledStatus.value = data.enabled
    publicedStatus.value = data.publiced
    applicationData.uriList.forEach((item) => {
      allowUrl.value.push({
        url: item
      })
    })
    setTimeout(() => {
      setValues(applicationData)
    }, 100)
  }
}
// 保存数据
const saveData = async () => {
  const unrefForm = unref(formRef)?.getElFormRef()
  let valid = false
  let vallidUrl = false
  // 表单验证
  await unrefForm?.validate(async (isValid) => {
    if (isValid) {
      vallidUrl = true
    }
  })
  // 通过验证的条数
  let proveNumber = 0
  // 循环数组全部内容，手动验证是否全部合格，
  for (let i = 0; i < allowUrl.value.length; i++) {
    const item = allowUrl.value[i]
    console.log('item', item)
    if (item && item.url.trim()) {
    } else {
      ElMessage.error('允许授权的URL存在未填项')
      return
    }
  }
  // 循环所有数组 手动验证是否有未填项和格式不正确的项，
  for (let i = 0; i < allowUrl.value.length; i++) {
    const item = allowUrl.value[i]
    const test = /https?:\/\//
    if (!test.test(item.url)) {
      ElMessage.error(`数据第${i + 1}条数据格式不正确，请输入以https:// 或http://开头的网址`)
      return
    } else {
      proveNumber += 1
    }
  }
  // 如果通过的个数等于数组的长度
  if (proveNumber === allowUrl.value.length) {
    valid = true
  }
  if (valid && vallidUrl) {
    allowUrl.value = allowUrl.value.filter((item: any) => item.url !== '')
    if (allowUrl.value.length === 0) {
      ElMessage.error('允许授权的url至少为一条')
    } else {
      loading.value = true
      // 获取表单数据
      let value = unref(formRef)?.formModel as SsoManageType
      // 授权url数组
      value.uriList = []

      allowUrl.value.forEach((item: any) => {
        value.uriList.push(item.url)
      })
      value.enabled = enabledStatus.value === 'true' ? true : false
      value.publiced = publicedStatus.value === 'true' ? true : false
      if (value.id) {
        editApplication(value)
      } else {
        addApplication(value)
      }
    }
  }
}
// 新增方法
const addApplication = async (val) => {
  const res = await getDataAdd(val)
  loading.value = false
  if (res.message === 'OK') {
    emitter.emit('getRampInfoList', 'add')
    closeDrawer()
    ElMessage.success('新增成功')
  } else {
    ElMessage.error('新增失败')
  }
}
// 编辑方法
const editApplication = async (val) => {
  const res = await getDataUpdate(val)
  loading.value = false
  if (res.message === 'OK') {
    emitter.emit('getRampInfoList', 'update')
    closeDrawer()
    ElMessage.success('编辑成功')
  } else {
    ElMessage.error('编辑失败')
  }
}
// 关闭
const closeDrawer = () => {
  allowUrl.value = []
  publicedStatus.value = 'true'
  enabledStatus.value = 'true'
  setValue(true)
  isShow.value = false
}
defineExpose({
  isShow,
  openDrawer
})
</script>
<template>
  <ElDialog
    v-model="isShow"
    ref="drawerWrap"
    width="40%"
    class="application-form"
    :maxHeight="'auto'"
    :title="'应用'"
    @close="closeDrawer"
  >
    <Form :schema="schema" ref="formRef" class="form" :disabled="!isSave">
      <template #uriList>
        <div class="allow-url-optation">
          <template v-for="(ruleForm, index) in allowUrl" :key="index">
            <el-form
              :model="ruleForm"
              :ref="(el) => (ruleForm.el = el)"
              style="margin-bottom: 12px"
            >
              <el-form-item prop="url">
                <div class="allow-url" :fileSize="2" :id="String(index)">
                  <ElInput
                    v-model="ruleForm.url"
                    :disabled="!isSave"
                    maxlength="100"
                    placeholder="请输入以https://或http://开头的网址"
                  />
                  <span v-if="isSave" class="delete-allow-url" @click="deleteUrl(ruleForm, index)"
                    >删除
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </template>

          <div class="add-allow-url" v-if="isSave"
            ><span style="cursor: pointer" @click="actionUrl">新增</span></div
          >
        </div>
        <div style="display: block; color: #f56c6c">允许授权的url需要至少存在一条</div>
      </template>
      <template #enabled>
        <div class="enabled-optition">
          <ElRadioGroup v-model="enabledStatus">
            <ElRadioButton label="true">启用</ElRadioButton>
            <ElRadioButton label="false">禁用</ElRadioButton>
          </ElRadioGroup>
          <div>应用启用时允许用户登录，禁用时无法登录</div>
        </div>
      </template>
      <template #publiced>
        <div class="publiced-optation">
          <ElRadioGroup v-model="publicedStatus">
            <ElRadioButton label="true">公开应用</ElRadioButton>
            <ElRadioButton label="false">私有应用</ElRadioButton>
          </ElRadioGroup>
          <div>公开应用默认所有用户可登录，私有应用只有被授权的用户才可以登录</div>
        </div>
      </template>
    </Form>
    <template #footer>
      <div class="details-footer">
        <ElButton v-if="isSave" type="primary" @click="saveData()" :loading="loading">
          保存
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped>
.form {
  padding-right: 40px;
}
.allow-url-optation {
  width: 100%;
  .allow-url {
    width: 100%;
    position: relative;
    margin: 5px 0;

    .delete-allow-url {
      position: absolute;
      right: -3rem;
      color: #f56e6e;
      cursor: pointer;
    }
  }
  .add-allow-url {
    display: block;
    color: #1fa0e9;
  }
}
.enabled-optition {
  width: 100%;
}
.publiced-optation {
  width: 100%;
}
</style>
