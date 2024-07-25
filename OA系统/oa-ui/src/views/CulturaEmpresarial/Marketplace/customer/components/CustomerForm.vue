<template>
  <ElDialog
    ref="elDialogFef"
    v-model="dialogVisible"
    :title="dialogTitle"
    class="cultivate-custom"
    width="60%"
    @closed="resetFormAfterClose"
  >
    <el-form
      v-loading="pageLoading"
      :model="ruleForm"
      :rules="canEdit ? rules : auditRules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="contact-class"
    >
      <FormHeader title="基础信息" class="20px" />
      <el-row class="mt-[15px]">
        <el-col :span="8">
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              :class="
                isModify('customerName', -1) && dialogFlag == 'audit' ? 'attention-class' : ''
              "
              type="text"
              :title="canEdit ? '' : ruleForm.customerName"
              v-model="ruleForm.customerName"
              placeholder="请填写营业执照上完整的公司名称"
              :disabled="!canEdit"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="行业类型" prop="type">
            <el-select
              :class="isModify('type', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              placeholder="请选择行业类型"
              style="width: 100%"
              :clearable="true"
              :disabled="!canEdit"
              v-model="ruleForm.type"
            >
              <el-option
                :value="item.label"
                :label="item.label"
                v-for="item in industry_type"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="客户性质" prop="nature">
            <el-select
              :class="isModify('nature', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              placeholder="请选择客户性质"
              style="width: 100%"
              :clearable="true"
              :disabled="!canEdit"
              v-model="ruleForm.nature"
            >
              <el-option
                :value="item.label"
                :label="item.label"
                v-for="item in customer_nature"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="客户类别" prop="category">
            <el-select
              :class="isModify('category', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              placeholder="请选择客户类别"
              style="width: 100%"
              :clearable="true"
              :disabled="!canEdit"
              v-model="ruleForm.category"
            >
              <el-option
                :value="item.label"
                :label="item.label"
                v-for="item in customer_category"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="所属区域" prop="location">
            <el-cascader
              :class="isModify('location', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              placeholder="请选择所属区域"
              style="width: 100%"
              :options="provinceData"
              :props="props"
              :clearable="true"
              :disabled="!canEdit"
              v-model="ruleForm.location"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="电话" prop="telephone">
            <el-input
              :class="isModify('telephone', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              type="text"
              :title="canEdit ? '' : ruleForm.telephone"
              v-model="ruleForm.telephone"
              placeholder="请填写公司固定电话"
              :disabled="!canEdit"
              maxlength="15"
            />
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item label="详细地址" prop="address">
            <el-input
              :class="isModify('address', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              type="text"
              :title="canEdit ? '' : ruleForm.address"
              v-model="ruleForm.address"
              placeholder="请填写公司详细地址"
              :disabled="!canEdit"
              maxlength="300"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="网址" prop="url">
            <el-input
              :class="isModify('url', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              type="text"
              :title="canEdit ? '' : ruleForm.url"
              v-model="ruleForm.url"
              placeholder="请填写公司网址"
              :disabled="!canEdit"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公司介绍" prop="introduce">
            <el-input
              :class="isModify('introduce', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 8 }"
              v-model="ruleForm.introduce"
              placeholder="请填写公司介绍"
              :disabled="!canEdit"
              maxlength="1000"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <FormHeader
        title="联系人信息"
        :line="true"
        :addFlag="canEdit"
        @add-click="addContact"
        class="mr-[5px]"
      />
      <div class="mt-[8px] mr-[5px]">
        <div v-if="ruleForm.contacts.length">
          <div
            ref="dom"
            v-for="(item, index) in ruleForm.contacts"
            :key="index"
            class="contact-content"
          >
            <div class="flex-1">
              <el-form
                class="contact-class"
                :model="item"
                :ref="(el) => refChange(el, index)"
                :disabled="!canEdit"
                :rules="contactRules"
              >
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="联系人" prop="contacts">
                      <el-Input
                        maxlength="100"
                        :title="canEdit ? '' : item.contacts"
                        placeholder="请填写联系人"
                        v-model="item.contacts"
                        :class="
                          isModify('contacts', index) && dialogFlag == 'audit'
                            ? 'attention-class'
                            : ''
                        "
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="职务" prop="position">
                      <el-Input
                        maxlength="15"
                        :title="canEdit ? '' : item.position"
                        placeholder="请填写职务"
                        v-model="item.position"
                        :class="
                          isModify('position', index) && dialogFlag == 'audit'
                            ? 'attention-class'
                            : ''
                        "
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="手机号码" prop="phone">
                      <el-Input
                        :title="canEdit ? '' : item.phone"
                        maxlength="11"
                        placeholder="请填写手机号码"
                        v-model="item.phone"
                        :class="
                          isModify('phone', index) && dialogFlag == 'audit' ? 'attention-class' : ''
                        "
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="邮箱" prop="email">
                      <el-autocomplete
                        :title="canEdit ? '' : item.email"
                        style="width: 100%"
                        maxlength="100"
                        placeholder="请填写邮箱"
                        v-model="item.email"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        :class="
                          isModify('email', index) && dialogFlag == 'audit' ? 'attention-class' : ''
                        "
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="备注" prop="remark">
                      <el-Input
                        :title="canEdit ? '' : item.remark"
                        maxlength="1000"
                        placeholder="请填写备注"
                        v-model="item.remark"
                        :class="
                          isModify('remark', index) && dialogFlag == 'audit'
                            ? 'attention-class'
                            : ''
                        "
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div>
              <el-button class="add-contact-btn" @click="delContact(index)" v-if="canEdit"
                ><Icon icon="ep:delete" />删除</el-button
              ></div
            >
          </div>
        </div>
        <div v-else class="new-add-form bg-[#f5fbfe] h-[45px] mb-[40px]">
          <div
            class="cursor-pointer justify-center flex items-center h-full text-[#00a0e9]"
            v-if="canEdit"
            @click="addContact()"
          >
            <img class="mr-5px" src="@/assets/imgs/icon/add_bar_icon1.png" />
            <span>请添加联系人信息</span>
          </div>
          <div class="justify-center flex items-center h-full text-[#00a0e9]" v-else>
            <span>暂无数据</span>
          </div>
        </div>
      </div>
      <FormHeader title="财务信息" :line="true" />

      <el-row class="mt-[8px]">
        <el-col :span="8">
          <el-form-item label="税号" prop="taxId">
            <el-input
              type="text"
              :title="canEdit ? '' : ruleForm.taxId"
              :class="isModify('taxId', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              v-model="ruleForm.taxId"
              placeholder="请填写税号"
              :disabled="!canEdit"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票抬头" prop="invoiceHeader">
            <el-input
              :title="canEdit ? '' : ruleForm.invoiceHeader"
              type="text"
              :class="
                isModify('invoiceHeader', -1) && dialogFlag == 'audit' ? 'attention-class' : ''
              "
              v-model="ruleForm.invoiceHeader"
              placeholder="请填写发票抬头"
              :disabled="!canEdit"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户银行" prop="openingBank">
            <el-input
              :title="canEdit ? '' : ruleForm.openingBank"
              type="text"
              :class="isModify('openingBank', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              v-model="ruleForm.openingBank"
              placeholder="请填写开户银行"
              :disabled="!canEdit"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input
              type="text"
              :title="canEdit ? '' : ruleForm.bankAccount"
              :class="isModify('bankAccount', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              v-model="ruleForm.bankAccount"
              placeholder="请填写银行账号"
              :disabled="!canEdit"
              maxlength="50"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="电话号码" prop="phoneNumber">
            <el-input
              :title="canEdit ? '' : ruleForm.phoneNumber"
              :class="isModify('phoneNumber', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              type="text"
              v-model="ruleForm.phoneNumber"
              placeholder="请填写电话号码"
              :disabled="!canEdit"
              maxlength="15"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="单位地址" prop="unitAddress">
            <el-input
              :title="canEdit ? '' : ruleForm.unitAddress"
              type="text"
              :class="isModify('unitAddress', -1) && dialogFlag == 'audit' ? 'attention-class' : ''"
              v-model="ruleForm.unitAddress"
              placeholder="请填写单位地址"
              :disabled="!canEdit"
              maxlength="300"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="dialogFlag === 'audit'">
        <el-col :span="24">
          <el-form-item label="" prop="orderExpain">
            <span>审核意见（驳回必填<span class="red"> *</span>）</span>
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="200"
              v-model="ruleForm.orderExpain"
              placeholder="请输入审核意见"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button v-if="canEdit" :loading="passLoading" class="dialog-btn-sure" @click="save"
          >提交
        </el-button>
        <el-button v-if="canEdit" @click="reset" class="dialog-btn-cancel">重置</el-button>
        <el-button
          class="dialog-btn-sure"
          :loading="passLoading"
          :disabled="rejectLoading"
          @click="pass"
          v-if="dialogFlag === 'audit'"
        >
          通过
        </el-button>
        <el-button
          class="dialog-btn-reject"
          :loading="rejectLoading"
          :disabled="passLoading"
          @click="reject"
          v-if="dialogFlag === 'audit'"
          plain
        >
          驳回
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog" v-if="pageFlag === 'see'">
          取消
        </el-button>
      </div>
    </template>
  </ElDialog>
</template>
<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue'
import { ElDialog } from '@/components/ElDialog'
import { useValidator } from '@/hooks/web/useValidator'
import { FormHeader } from '../components'
import { CascaderProps, ElMessage } from 'element-plus'
import { getCityApi } from '@/api/person/induction'
import {
  saveCustomerApi,
  editCustomerApi,
  getCustomerDetailApi,
  auditCustomerApi,
  checkContactDelApi
} from '@/api/customer'

type Callback = (error?: string | Error | undefined) => void

const { required, notSpace, validatePhone, validateEmail, validatePhoneNumber, validateIPhone } =
  useValidator()
const provinceData: any = inject('provinceData')
const emit = defineEmits(['refreshTable'])
//省市懒加载
const props: CascaderProps = {
  lazy: true,
  async lazyLoad(node, resolve) {
    const { level, data } = node
    if (level == 0) {
      resolve(provinceData.value)
    } else {
      let nodes: any = []
      if (data) {
        let res = await getCityApi(data?.id)
        res.data.forEach((element: any) => {
          nodes.push({
            value: element.code,
            label: element.city,
            leaf: true,
            id: element.id
          })
        })
      }
      resolve(nodes)
    }
  }
}
const industry_type = inject('industry_type')
const customer_nature = inject('customer_nature')
const customer_category = inject('customer_category')
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('客户管理信息')
const dialogFlag = ref<string>('add')
const detailId = ref<string>('')
const pageLoading = ref<boolean>(false)
const canEdit = ref<boolean>(false)
const elDialogFef = ref()

//打开
const openDialog = (flag: string, id: string) => {
  dialogVisible.value = true
  dialogFlag.value = flag
  detailId.value = id
  dialogTitle.value =
    flag == 'add' ? '新增' : flag == 'edit' ? '编辑' : flag == 'audit' ? '审核' : '详情'

  canEdit.value = flag == 'add' || flag == 'edit'
  if (id) {
    getDetails(id)
  }
}

const ruleForm = ref<any>({
  id: '',
  customerName: '',
  type: '',
  nature: '',
  category: '',
  location: [],
  province: '',
  city: '',
  telephone: '',
  url: '',
  address: '',
  introduce: '',
  contacts: [],
  taxId: '',
  invoiceHeader: '',
  openingBank: '',
  bankAccount: '',
  phoneNumber: '',
  unitAddress: '',
  orderExpain: ''
})
const rules = reactive({
  customerName: [
    { required: true, message: '请填写营业执照上完整的公司名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  type: [{ required: true, message: '请选择行业类型', trigger: 'change' }],
  nature: [{ required: true, message: '请选择客户性质', trigger: 'change' }],
  category: [{ required: true, message: '请选择客户类别', trigger: 'change' }],
  location: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
  telephone: [
    { required: false, message: '请填写公司固定电话', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validatePhone(value, callback, '电话格式错误')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  address: [
    { required: false, message: '请填写公司详细地址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  url: [
    { required: false, message: '请填写公司网址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  introduce: [
    { required: false, message: '请填写公司介绍', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  taxId: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  invoiceHeader: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  openingBank: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  bankAccount: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  phoneNumber: [
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validatePhone(value, callback, '电话号码格式错误')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  unitAddress: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const contactRules = reactive({
  contacts: [
    { required: true, message: '请填写联系人', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  position: [
    { required: true, message: '请填写职位', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请填写手机号码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validateIPhone(value, callback, '请输入正确的手机号')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  email: [
    { required: false, message: '请填写邮箱', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validateEmail(value, callback, '邮箱格式错误')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value && value.indexOf('@') > -1) {
          validateEmail(value, callback, '邮箱格式错误')
        } else {
          callback()
        }
      },
      trigger: 'change'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  remark: [
    { required: false, message: '请填写备注', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const auditRules = reactive({
  orderExpain: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

//获取详情
const getDetails = async (id: string) => {
  pageLoading.value = true
  const res = await getCustomerDetailApi(id)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        pageLoading.value = false
      }, 200)
    })
  if (res) {
    ruleForm.value.id = res.data.id ? res.data.id : ''
    ruleForm.value.customerName = res.data.customerName ? res.data.customerName : ''
    ruleForm.value.type = res.data.type ? res.data.type : ''
    ruleForm.value.nature = res.data.nature ? res.data.nature : ''
    ruleForm.value.category = res.data.category ? res.data.category : ''
    ruleForm.value.location = []
    ruleForm.value.province = res.data.province ? res.data.province : ''
    ruleForm.value.city = res.data.city ? res.data.city : ''
    ruleForm.value.telephone = res.data.telephone ? res.data.telephone : ''
    ruleForm.value.url = res.data.url ? res.data.url : ''
    ruleForm.value.address = res.data.address ? res.data.address : ''
    ruleForm.value.introduce = res.data.introduce ? res.data.introduce : ''
    ruleForm.value.contacts = res.data.contacts && res.data.contacts.length ? res.data.contacts : []
    ruleForm.value.taxId = res.data.taxId ? res.data.taxId : ''
    ruleForm.value.invoiceHeader = res.data.invoiceHeader ? res.data.invoiceHeader : ''
    ruleForm.value.openingBank = res.data.openingBank ? res.data.openingBank : ''
    ruleForm.value.bankAccount = res.data.bankAccount ? res.data.bankAccount : ''
    ruleForm.value.phoneNumber = res.data.phoneNumber ? res.data.phoneNumber : ''
    ruleForm.value.unitAddress = res.data.unitAddress ? res.data.unitAddress : ''
    if (ruleForm.value.province) {
      ruleForm.value.location.push(ruleForm.value.province)
    }
    if (ruleForm.value.city) {
      ruleForm.value.location.push(ruleForm.value.city)
    }
    modifyFieldList.value = []
    if (res.data.customerChanges && res.data.customerChanges.length) {
      res.data.customerChanges.map((item: any) => {
        modifyFieldList.value.push(item.fieldName)
      })
    }
  }
}

const passLoading = ref<boolean>(false)

const rejectLoading = ref<boolean>(false)

//提交
const formRef = ref()
const save = async () => {
  let res: any = []
  // 表单校验整合
  if (ruleForm.value.contacts && ruleForm.value.contacts.length) {
    ruleForm.value.contacts.forEach((item: any, index: number) => {
      res.push(ruleForm.value.contacts[index].el.validate())
    })
  }
  res.push(formRef.value?.validate())
  Promise.all(res)
    .then(async () => {
      if (dialogFlag.value == 'add') {
        addCustomer()
      } else {
        updateCustomer()
      }
    })
    .catch(() => {})
}

//新增
const addCustomer = async () => {
  passLoading.value = true
  ruleForm.value.province =
    ruleForm.value.location && ruleForm.value.location.length ? ruleForm.value.location[0] : ''
  ruleForm.value.city =
    ruleForm.value.location && ruleForm.value.location.length > 1 ? ruleForm.value.location[1] : ''
  const res = await saveCustomerApi(ruleForm.value)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        passLoading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    closeDialog()
    emit('refreshTable')
  }
}

//编辑
const updateCustomer = async () => {
  passLoading.value = true
  ruleForm.value.id = detailId.value
  ruleForm.value.province =
    ruleForm.value.location && ruleForm.value.location.length ? ruleForm.value.location[0] : ''
  ruleForm.value.city =
    ruleForm.value.location && ruleForm.value.location.length > 1 ? ruleForm.value.location[1] : ''
  const res = await editCustomerApi(ruleForm.value)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        passLoading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    closeDialog()
    emit('refreshTable')
  }
}

//通过
const pass = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      passLoading.value = true
      let data = ruleForm.value
      approveApply(data, '已通过')
    }
  })
}

//审核
const approveApply = async (data: any, flag: string) => {
  let params = {
    explain: data.orderExpain,
    customerId: detailId.value,
    step: flag
  }
  const res = await auditCustomerApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        rejectLoading.value = false
        passLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '已驳回') {
      ElMessage.success('驳回成功')
    } else {
      ElMessage.success('保存信息成功')
    }
    //通知列表刷新
    closeDialog()
    emit('refreshTable')
  }
}

//驳回
const reject = async () => {
  //表单验证
  if (!ruleForm.value.orderExpain) {
    ElMessage.error('请输入审核意见')
    return
  }
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      rejectLoading.value = true
      let data = ruleForm.value
      approveApply(data, '已驳回')
    }
  })
}

//重置
const reset = () => {
  ruleForm.value = {
    id: '',
    customerName: '',
    type: '',
    nature: '',
    category: '',
    location: [],
    province: '',
    city: '',
    telephone: '',
    url: '',
    address: '',
    introduce: '',
    contacts: [],
    taxId: '',
    invoiceHeader: '',
    openingBank: '',
    bankAccount: '',
    phoneNumber: '',
    unitAddress: ''
  }
}

//关闭
const closeDialog = () => {
  dialogVisible.value = false
}

//关闭后重置
const resetFormAfterClose = () => {
  dialogVisible.value = false
  passLoading.value = false
  rejectLoading.value = false
  modifyFieldList.value = []
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  reset()
}

const refChange = (ref: any, index: number) => {
  if (ruleForm.value.contacts.length > index) {
    ruleForm.value.contacts[index].el = ref
  }
}

//添加联系人信息
const addContact = () => {
  ruleForm.value.contacts.push({ contacts: '', position: '', phone: '', email: '', remark: '' })
}
//删除联系人信息
const delContact = async (index: number) => {
  let contactsId = ruleForm.value.contacts[index].id
  if (contactsId) {
    const res = await checkContactDelApi(contactsId)
    if (res && res.data) {
      ruleForm.value.contacts.splice(index, 1)
    } else {
      ElMessage.error('已分配项目无法删除')
    }
  } else {
    ruleForm.value.contacts.splice(index, 1)
  }
}
const querySearch = (queryString: string, cb: any) => {
  let queryArray: any = []
  emailArray.value.map((item: any) => {
    queryArray.push({ value: queryString.split('@')[0] + item })
  })
  const results = queryString ? queryArray.filter(createFilter(queryString)) : queryArray
  cb(results)
}
const createFilter = (queryString: string) => {
  return (item: any) => {
    return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
const emailArray = ref<any>([
  '@qq.com',
  '@163.com',
  '@139.com',
  '@sohu.com',
  '@aliyun.com',
  '@sina.com'
])

//字段是否修改的
const modifyFieldList = ref<any>([])
const isModify = (field: string, index: number) => {
  let isModify = false
  if (index > -1) {
    if (ruleForm.value.contacts && ruleForm.value.contacts.length > index) {
      let changeRecord = ruleForm.value.contacts[index].customerContactsChanges
      if (changeRecord && changeRecord.length > 0) {
        isModify = changeRecord.findIndex((item: any) => item.fieldName == field) > -1
      }
    }
  } else {
    if (field == 'location') {
      isModify =
        modifyFieldList.value.indexOf('province') > -1 || modifyFieldList.value.indexOf('city') > -1
    } else {
      isModify = modifyFieldList.value.indexOf(field) > -1
    }
  }
  return isModify
}

// 传递给父组件的方法
defineExpose({
  openDialog
})
</script>

<style lang="less" scoped>
.red {
  color: red;
}
.new-add-form {
  border-top: 1px dashed #99d9f6;
  border-bottom: 1px dashed #99d9f6;
  border-left: 1px solid #99d9f6;
  border-right: 1px solid #99d9f6;
}
.contact-content {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="less">
.add-contact-btn {
  margin-top: 30px;
  height: 32px !important;
}
.contact-class {
  .el-form-item__label {
    color: #444444 !important;
  }
  .el-form-item__content {
    color: #444444 !important;
  }
}
.attention-class {
  .el-input__wrapper {
    background: #e5f5fd !important;
    border: 1px solid #00a0e9 !important;
  }
  .el-textarea__inner {
    background: #e5f5fd !important;
    border: 1px solid #00a0e9 !important;
  }
}
</style>