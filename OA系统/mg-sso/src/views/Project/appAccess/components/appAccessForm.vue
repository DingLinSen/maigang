<script setup lang="ts">
import { ref, unref, reactive, nextTick } from 'vue'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
import { Form, FormExpose } from '@/components/Form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElDialog } from '@/components/ElDialog'
import { accessType } from '@/api/applicationManage/types'
import { FileUpload } from '@/components/FileUpload/index'
import { ElInput, ElButton, ElRadioGroup, ElRadioButton, ElMessage } from 'element-plus'
import {
  getRoleData,
  getAccessDataUpdate,
  getAccessDataById,
  getaccessDataAdd,
  applicationList
} from '@/api/applicationManage'
const { required } = useValidator()
// 角色和应用的禁用/启用
const limits = ref(true)
// 接收角色数组
const roleList: any = ref([])
// 用于获取状态
const relationStatus = ref('1')
//获取指定应用列表
const appList: any = ref([])
// 创建emit使用
const { emitter } = useEmitt()
// 声明model
const isShow = ref<boolean>(false)
// 是否显示保存按钮
const isSave = ref(false)
// 保存loding
const loading = ref(false)
// 初始化数据
let applicationData = reactive<accessType>({
  id: '',
  roleId: null,
  relation: 1,
  appId: null
})
// 获取角色数组
const getRoleDataList = async () => {
  roleList.value = []
  let params = {}
  await getRoleData(params).then((res) => {
    if (res && res.data) {
      const data = res.data
      data.forEach((item) => {
        roleList.value.push({
          value: item.id,
          label: item.name
        })
      })
    }
  })
}
// 获取应用列表// 未有获取所有应用列表的接口，目前对接的是应用列表获取list的接口
const getAppList = async () => {
  appList.value = []
  const params = {
    pageNum: 1,
    pageSize: 100
  }
  await applicationList(params).then((res) => {
    if (res && res.data) {
      const list = res.data.list
      list.forEach((item) => {
        appList.value.push({
          value: item.id,
          label: item.name
        })
      })
    }
  })
}
// 表单字段设置
const schema = reactive<FormSchema[]>([
  {
    field: 'roleId',
    label: '角色',
    component: 'Select',
    componentProps: {
      disabled: limits,
      style: 'minWidth:100%;',
      options: roleList
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'relation',
    label: '访问关系',
    colProps: {
      span: 24
    }
  },
  {
    field: 'appId',
    label: '指定应用',
    component: 'Select',
    componentProps: {
      disabled: limits,
      style: 'minWidth:100%;',
      options: appList
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
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
//编辑时禁用角色和应用
const limitsEdit = () => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: 'roleId',
        path: 'componentProps.disabled',
        value: limits
      },
      {
        field: 'appId',
        path: 'componentProps.disabled',
        value: limits
      }
    ])
  })
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
        roleId: null,
        relation: 1,
        appId: null
      })
    }
  }, 100)
}
// 表单赋值
const setValues = (form: accessType) => {
  unref(formRef)?.setValues(form)
}
// 打开
const openDrawer = (flag: string, id?: string) => {
  setValue(true)
  isSave.value = flag === 'see' ? false : true
  isShow.value = true
  changeDisabled(flag === 'see')
  if (flag === 'add') {
    limits.value = false
    limitsEdit()
  }
  if (flag === 'edit') {
    limits.value = true
    limitsEdit()
  }
  getRoleDataList()
  getAppList()
  if (id) {
    getFromData(id)
  }
}
// 获取表单数据
const getFromData = async (id: string) => {
  let res = await getAccessDataById(id)
  if (res) {
    const data = res.data
    applicationData = data
    relationStatus.value = String(applicationData.relation)
    setTimeout(() => {
      setValues(applicationData)
    }, 100)
  }
}
// 保存数据
const saveData = async () => {
  const unrefForm = unref(formRef)?.getElFormRef()
  await unrefForm?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      // 获取表单数据
      let value = unref(formRef)?.formModel as accessType
      value.relation = Number(relationStatus.value)
      if (value.id) {
        editApplication(value)
      } else {
        addApplication(value)
      }
    }
  })
}
// 新增方法
const addApplication = async (val) => {
  loading.value = false
  const res = await getaccessDataAdd(val)
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
  loading.value = false
  const res = await getAccessDataUpdate(val)
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
  relationStatus.value = '1'
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
    :title="'应用访问'"
    @close="closeDrawer"
  >
    <Form :schema="schema" ref="formRef" class="form">
      <template #icon>
        <FileUpload class="uploade-img" :fileType="['jpg', 'jpeg', 'png']" />
      </template>
      <template #relation>
        <div class="enabled-optition">
          <ElRadioGroup v-model="relationStatus">
            <ElRadioButton label="1">允许登录</ElRadioButton>
            <ElRadioButton label="2">禁止登录</ElRadioButton>
          </ElRadioGroup>
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
.tip-title {
  text-align: center;
  width: 100%;
  font-size: 16px;
  line-height: 14px;
  margin-bottom: 20px;
  color: #f56e6e;
}
</style>
