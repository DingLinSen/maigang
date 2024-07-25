<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
// import { any, DictOptionData } from '@/api/dict/types'
import {
  saveInfoBonuspenaltApi,
  updateInfoBonuspenaltApi,
  getInfoBonuspenaltApi
} from '@/api/person/rewardPunManage'

import { getAllUserListApi } from '@/api/user'

import { ElMessage } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'

const { proxy } = getCurrentInstance() as any
const { repu_bon_type } = proxy.useDict('repu_bon_type')
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const userListData = ref()

const init = async () => {
  let res = await getAllUserListApi({ pageSize: 99999 })
  userListData.value = res.data
}

init()

const getUserLabel = (value: string): string => {
  let label = ''
  unref(userListData).map((item: any) => {
    if (value == item.userId) {
      label = item.nickName
    }
  })
  return label
}
const getUserAvatar = (value: string): string => {
  let avatar = ''
  unref(userListData).map((item: any) => {
    if (value == item.userId) {
      avatar = item.avatar
    }
  })
  return avatar
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 50,
      clearable: false
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
    field: 'bonType',
    label: '类型',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%',
      clearable: false,
      options: repu_bon_type
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'content',
    label: '描述',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 200,
      type: 'textarea',
      autosize: true,
      rows: 6
    },
    formItemProps: {
      rules: [
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'user',
    label: '人员',
    value: [],
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [
        required('该项为必选项'),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'change'
        }
      ]
    }
  },
  {
    field: 'filePath',
    label: '上传文件',
    component: 'FileUpload',
    componentProps: {
      style: 'width:100%',
      disabled: false,
      limit: 1, // 数量限制
      fileType: ['pdf', 'doc', 'docx', 'xls', 'xlsx'] // 文件类型
    },
    colProps: {
      span: 24
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

// 多选
const userData = ref<any>()

const personnelSelectionRef = ref<ComponentRef<typeof PersonnelSelection>>()

const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as any
      data.tinfoBonuspenaltyUserDos = userData.value.map((v) => {
        return { userId: v }
      })

      const match = /\/([^/]+)$/.exec(data.filePath)
      if (match) {
        data.fileName = match[0].replace('/', '')
      }

      if (detailsId.value) {
        editDict(data)
      } else {
        addDict(data)
      }
    }
  })
}

// 修改奖惩
const editDict = async (data: any) => {
  const res = await updateInfoBonuspenaltApi(data)
    .catch(() => {})
    .finally(() => {})
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('getList', 'add')
    closeDrawer()
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}

// 新增奖惩
const addDict = async (data: any) => {
  const res = await saveInfoBonuspenaltApi(data)
    .catch(() => {})
    .finally(() => {})
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('getList', 'add')
    closeDrawer()
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')
const ElDialogFef = ref()
//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  //重置表单
  detailsId.value = ''
  userData.value = []
  setValue(true)
  isSave.value = flag === 'see' ? false : true
  changeDisabled(flag === 'see')
  if (flag === 'see') {
    schema[4].componentProps.disabled = true
  } else {
    schema[4].componentProps.disabled = false
  }
  pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')
  // drawerWrap.value.isShow = true
  DialogFlag.value = true
  ElDialogFef.value.isFullscreen = false
  if (id) {
    getDetailsData(id)
  }
}

//关闭drawer
const closeDrawer = () => {
  // drawerWrap.value.isShow = false
  DialogFlag.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}

let rewardPunData = reactive<any>({
  bonType: '',
  bonTypeName: '',
  content: '',
  createTime: '',
  createUser: '',
  createUserName: '',
  editTime: '',
  editUser: '',
  editUserName: '',
  fileName: '',
  filePath: '',
  flag: '',
  id: '',
  pubTime: '',
  rewardsPunishmentsUnit: '',
  title: '',
  userId: ''
})

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getInfoBonuspenaltApi(id)
  if (res && res.data) {
    rewardPunData = res.data
    if (rewardPunData.tinfoBonuspenaltyUserDos) {
      userData.value = rewardPunData.tinfoBonuspenaltyUserDos.map((v) => v.userId)
    }
    setValues(rewardPunData)
    setValues({ user: userData.value })
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      bonType: '',
      bonTypeName: '',
      content: '',
      createTime: '',
      createUser: '',
      createUserName: '',
      editTime: '',
      editUser: '',
      editUserName: '',
      fileName: '',
      filePath: '',
      flag: '',
      id: '',
      pubTime: '',
      rewardsPunishmentsUnit: '',
      title: '',
      userId: ''
    })
  }
}

const setValues = (form: any) => {
  unref(formRef)?.setValues(form)
}

const addPerson = () => {
  personnelSelectionRef.value.openDialog(userData.value)
  // selectedPersonArray.value =
}

const savePerson = (value) => {
  userData.value = value
  setValues({ user: value })
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}
const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}
defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <ElDialog
    ref="ElDialogFef"
    class="cultivate-custom"
    v-model="DialogFlag"
    :title="pageTite"
    @closed="DialogFlag = false"
  >
    <Form label-position="top" :schema="schema" ref="formRef" :disabled="!isSave">
      <template #user>
        <div class="div-person-bg">
          <div v-for="item in userData" :key="item" class="h-64px">
            <div class="person-popper-class flex flex-col justify-center items-center">
              <img
                v-if="getUserAvatar(item) && getUserAvatar(item) !== ''"
                :src="getUserAvatar(item)"
                class="person-bg"
                @error="setDefaultImage"
              />
              <img v-else src="@/assets/imgs/avatar.jpg" class="person-bg" />
              <p :title="getUserLabel(item)" class="text-center pl-8px text-sm div-person-text">{{
                getUserLabel(item)
              }}</p>
            </div>
          </div>
          <div :class="userData.length ? 'h-64px' : 'pb-6px'">
            <div class="add-person-bg cursor-pointer items-start" v-if="isSave" @click="addPerson">
              <img src="@/assets/imgs/icon/add_icon.png" />
            </div>
          </div>
        </div>
      </template>
    </Form>

    <template #footer>
      <div class="footer">
        <el-button type="primary" v-if="isSave" :loading="loading" :disabled="loading" @click="save"
          >提交</el-button
        >
        <el-button @click="closeDrawer">取消</el-button>
      </div>
    </template>
    <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
  </ElDialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}

.add-person-bg {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 8px;
  background-color: #ebeced;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.person-bg {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 8px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.div-person-bg {
  padding-top: 8px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.div-person-text {
  width: 55px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style>
.person-popper-class {
  /* margin-top: -14px !important; */
  /* margin: 0px 4px; */
}
</style>
