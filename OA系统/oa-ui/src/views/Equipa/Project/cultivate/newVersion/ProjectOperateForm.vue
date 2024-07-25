<template>
  <Dialog
    ref="ElDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="pageTite"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-width="120"
      ref="formRef"
      v-loading="pageLoading"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="项目名称" prop="projectTitle">
            <el-input
              maxlength="200"
              v-model="ruleForm.projectTitle"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              placeholder="请输入项目名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'add' || pageFlag == 'edit'">
          <el-form-item label="项目来源" prop="projectSource">
            <el-select
              v-model="ruleForm.projectSource"
              placeholder="请选择项目来源"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              :filterable="true"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in projectSource"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'alter' && ruleForm.customerId">
          <el-form-item label="项目来源" prop="projectSource">
            <el-select
              v-model="ruleForm.projectSource"
              placeholder="请选择项目来源"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              :filterable="true"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in projectSource"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属行业" prop="projectType">
            <el-select
              v-model="ruleForm.projectType"
              placeholder="请选择所属行业"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in projectType"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'add' || pageFlag == 'edit'">
          <el-form-item label="客户名称" prop="customerId">
            <el-select
              v-model="ruleForm.customerId"
              placeholder="请选择客户名称"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              @change="customerChange"
            >
              <el-option
                :value="item.id"
                :label="item.customerName"
                v-for="item in customerArray"
                :key="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'add' || pageFlag == 'edit'">
          <el-form-item label="客户联系人" prop="customerContactsId">
            <el-select
              v-model="ruleForm.customerContactsId"
              placeholder="请选择客户联系人"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
            >
              <el-option
                :value="item.id"
                :label="item.contacts"
                v-for="item in contactsArray"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'alter'">
          <el-form-item label="客户名称" prop="ownerName">
            <el-input
              maxlength="100"
              :title="ruleForm.ownerName"
              v-model="ruleForm.ownerName"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              placeholder="请输入客户名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'alter' && ruleForm.customerId">
          <el-form-item label="客户联系人" prop="contacts">
            <el-input
              maxlength="100"
              :title="ruleForm.contacts"
              v-model="ruleForm.contacts"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              placeholder="请输入客户联系人"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'alter' && ruleForm.customerId">
          <el-form-item label="电话" prop="phone">
            <el-input
              maxlength="100"
              v-model="ruleForm.phone"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              placeholder="请输入电话"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'alter' && !ruleForm.customerId">
          <el-form-item label="预计金额(万元)" prop="estimatedAmount">
            <el-input
              maxlength="13"
              v-model="ruleForm.estimatedAmount"
              clearable
              @change="changeAmount"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              placeholder="请输入预计金额(万元)"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="pageFlag == 'alter'">
          <el-form-item label="当前负责人" prop="principalPerson">
            <el-cascader
              v-model="ruleForm.principalPerson"
              placeholder="请选择当前负责人"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="principalTree"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="pageFlag == 'alter' && !ruleForm.customerId">
          <el-form-item label="所属省份" prop="province">
            <el-select
              v-model="ruleForm.province"
              placeholder="请选择所属省份"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in province"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="pageFlag == 'alter'">
          <el-form-item label="详细地址" prop="address">
            <el-input
              maxlength="200"
              v-model="ruleForm.address"
              type="textarea"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              :autosize="{ minRows: 1, maxRows: 3 }"
              placeholder="请输入详细地址"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目内容" prop="planContent">
            <el-input
              maxlength="1000"
              type="textarea"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              :autosize="{ minRows: 4, maxRows: 8 }"
              v-model="ruleForm.planContent"
              placeholder="请输入项目内容"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="上传文件" prop="fileList">
            <div
              style="width: 100%; vertical-align: middle; line-height: normal; align-items: center"
            >
              <FileUpload
                v-model:modelValue="ruleForm.fileList"
                style="width: 100%"
                :limit="5"
                :disabled="pageFlag == 'see' || pageFlag == 'alter'"
                :fileSize="2 * 1024"
                :fileType="['pdf', 'doc', 'docx', 'png', 'jpg', 'xls', 'xlsx', 'zip', 'rar']"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="save"> 提交 </el-button>
        <el-button @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog } from '@/components/Dialog'
import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { getCurrentInstance, inject, reactive, ref } from 'vue'
import {
  saveCultivateApi,
  editCultivateApi,
  getCultivateApi,
  changePrincipalPersonCultivateApi
} from '@/api/project/cultivate'
import { projectSource, projectType } from '../../config/config'
import { getCustomerDetailApi, getCustomerListApi } from '@/api/customer'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { ElMessage } from 'element-plus'
import { element } from '@/config/element'

const { proxy } = getCurrentInstance() as any
const { province } = proxy.useDict('province')
const changeAmount = (num: any) => {
  var x = String(num).indexOf('.') + 1 //得到小数点的位置
  var y = String(num).length - x //小数点的位数
  if (x > 0 && y > 6) {
    ruleForm.value.estimatedAmount = Number(Number(num).toFixed(6))
  } else {
    ruleForm.value.estimatedAmount = num
  }
}

// callback 类型
type Callback = (error?: string | Error | undefined) => void
const dialogFlag = ref<boolean>(false)
const emit = defineEmits(['resetList'])
const { required, notSpace } = useValidator()

const principalTree = inject<any>('principalTree')
const pageTite = ref<string>('')
const detailsId = ref<number | string | null>(null)
const pageFlag = ref<string>('')
const ElDialogFef = ref()
//打开drawer并初始化
const openDialog = (flag: string, id: number) => {
  dialogFlag.value = true
  ElDialogFef.value.isFullscreen = false
  //重置表单
  pageFlag.value = flag
  pageTite.value = flag == 'alter' ? '变更' : flag == 'add' ? '新增' : flag == 'edit' ? '编辑' : ''
  getCustomerArray()
  if (id) {
    getDetailsData(id)
  }
}

const ruleForm = ref<any>({
  id: '',
  projectTitle: '',
  projectSource: '',
  customerId: '',
  projectType: '',
  customerContactsId: '',
  contacts: '',
  ownerName: '',
  estimatedAmount: '',
  principalPerson: '',
  province: '',
  address: '',
  planContent: '',
  fileList: ''
})

//表单验证规则
const rules = reactive({
  projectTitle: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  ownerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  estimatedAmount: [
    { required: true, message: '请输入预计金额(万元)', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (/(^[1-9]{1}\d{0,4}$)|(^[0-9]{1}\d{0,4}[.]{1}[0-9]{1,6}$)/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入大于0小于100000之间的数字，小数点后最多六位'))
        }
      },
      trigger: 'blur'
    }
  ],
  address: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  province: [{ required: true, message: '请选择所属省份', trigger: 'change' }],
  projectSource: [{ required: true, message: '请选择项目来源', trigger: 'change' }],
  projectType: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
  customerId: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
  contacts: [{ required: true, message: '请选择客户联系人', trigger: 'change' }],
  phone: [{ required: true, message: '请选择电话', trigger: 'change' }],
  customerContactsId: [{ required: true, message: '请选择客户联系人', trigger: 'change' }],
  planContent: [
    { required: true, message: '请输入项目内容', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  principalPerson: [{ required: true, message: '请选择当前负责人', trigger: 'change' }]
})
//获取详情
const getDetailsData = async (ids: number) => {
  detailsId.value = ids
  let params = { id: ids }
  pageLoading.value = true
  const res = await getCultivateApi(params).finally(() => {
    pageLoading.value = false
  })
  if (res && res.data) {
    ruleForm.value = res.data
    ruleForm.value.address = res.data.address
    ruleForm.value.fileList = res.data.filePath
    if (ruleForm.value.customerId) {
      let res = await getCustomerDetailApi(ruleForm.value.customerId)
      if (res && res.data) {
        contactsArray.value = res.data.contacts && res.data.contacts.length ? res.data.contacts : []
        let checkData = customerArray.value.find(
          (element: any) => element.id == ruleForm.value.customerId
        )
        if (!checkData) {
          customerArray.value.push({
            id: ruleForm.value.customerId,
            customerName: res.data.customerName,
            disabled: true
          })
        }
      }
    }
  }
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (ElDialogFef.value) {
    ElDialogFef.value.isFullscreen = false
  }
  resetForm()
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    projectTitle: '',
    projectSource: '',
    projectTypeIndustry: '',
    customerId: '',
    customerContactsId: '',
    projectType: '',
    contacts: '',
    ownerName: '',
    estimatedAmount: '',
    principalPerson: '',
    province: '',
    address: '',
    planContent: '',
    fileList: ''
  }
  detailsId.value = ''
  contactsArray.value = []
  customerArray.value = []
}

//选择客户
const customerChange = (value: any) => {
  contactsArray.value = []
  if (value) {
    getContactsArrayByCustomer(value)
  } else {
    ruleForm.value.customerContactsId = ''
  }
}
//客户集合
const customerArray = ref<any>([])
const getCustomerArray = async () => {
  let param = { pageSize: 999, pageNum: 1, status: '2' }
  let res = await getCustomerListApi(param)
  if (res) {
    customerArray.value = res.rows
  }
}

//用户联系人
const contactsArray = ref<any>([])
const getContactsArrayByCustomer = async (id: string) => {
  let res = await getCustomerDetailApi(id)
  if (res && res.data) {
    contactsArray.value = res.data.contacts && res.data.contacts.length ? res.data.contacts : []
    if (contactsArray.value.length > 0) {
      ruleForm.value.customerContactsId = contactsArray.value[0].id
    } else {
      ruleForm.value.customerContactsId = ''
    }
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

const loading = ref<boolean>(false)
const pageLoading = ref<boolean>(false)
//表单
const formRef = ref<any>()
const save = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      loading.value = true
      let data = ruleForm.value
      data.filePath = data.fileList
      if (pageFlag.value === 'alter') {
        //变更
        alertUser(data)
      } else if (pageFlag.value === 'add') {
        //新增
        addApply(data)
      } else if (pageFlag.value === 'edit') {
        //编辑
        editApply(data)
      }
    }
  })
}

//变更
const alertUser = async (data: any) => {
  if (data.id && detailsId.value) {
    let params = {
      id: detailsId.value,
      principalPerson:
        typeof data.principalPerson === 'number' && !isNaN(data.principalPerson)
          ? [data.principalPerson]
          : data.principalPerson[data.principalPerson.length - 1]
    }
    const res = await changePrincipalPersonCultivateApi(params)
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          loading.value = false
        }, 200)
      })
    if (res) {
      ElMessage.success('保存信息成功')
      emit('resetList')
      closeDialog()
    }
  }
}

//新增
const addApply = async (data: any) => {
  const res = await saveCultivateApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('resetList')
    closeDialog()
  }
}

//编辑
const editApply = async (data: any) => {
  const res = await editCultivateApi(true, data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('resetList')
    closeDialog()
  }
}

defineExpose({
  openDialog
})
</script>

<style lang="less" scoped>
</style>