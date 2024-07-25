<!-- 请假申请 -->
<script setup lang="ts">
import './urgency.less'
import { ref, reactive, getCurrentInstance, unref, nextTick } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { applyOrderApi, editOrderApi, getOrderDetailApi } from '@/api/order'
import { FileButtonUpload } from '@/components/FileButtonUpload'
import moment from 'moment'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElInput
} from 'element-plus'
import { Dialog } from '@/components/Dialog'

const { emitter } = useEmitt()
const { proxy } = getCurrentInstance() as any
const { materials_type } = proxy.useDict('materials_type')
// const { ht } = proxy.useDict('ht')

const materials_name_list = ref<any>([])
// 弹窗的开启和关闭
const dialogFlag = ref<Boolean>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const pageFlag = ref<string>('add') // see 查看 edit 编辑 add 新增
//发布等待
//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
const releaseLoading = ref(false)

const detailsId = ref<string>('')
//保存数据
const save = async (flag) => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      if (flag === 1) {
        loading.value = true
      } else {
        releaseLoading.value = true
      }

      let data = {
        flag: flag,
        type: ruleForm.value.type,
        urgency: ruleForm.value.urgency,

        workorderLend: {
          remark: ruleForm.value.remark,
          types: ruleForm.value.materialsType.map((v) => {
            return {
              materialsType: v
            }
          }),
          planLendDate: ruleForm.value.planLendDate,
          planBackDate: ruleForm.value.planBackDate,
          names: ruleForm.value.materialsName.map((v) => {
            return {
              materialsName: v
            }
          }),
          goodUse: ruleForm.value.goodUse,
          files: ruleForm.value.fileUrl
            ? ruleForm.value.fileUrl.split(',').map((v) => {
                return {
                  fileUrl: v
                }
              })
            : []
        }
      }
      if (pageFlag.value === 'add') {
        addApply(data)
      } else {
        editApply(data)
      }
    }
  })
}

//物资外借 新增
const addApply = async (data: any) => {
  const res = await applyOrderApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (data.flag == '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

//物资外借 编辑
const editApply = async (data: any) => {
  data.id = detailsId.value
  const res = await editOrderApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (data.flag == '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const pageTite = ref<string>('')
const openDrawer = (id: string, flag: string) => {
  dialogFlag.value = true
  pageFlag.value = flag
  pageTite.value = flag == 'add' ? props.title : flag == 'edit' ? '编辑' : '详情'
  elDialogFef.value.isFullscreen = false
  nextTick(() => {
    materials_type.value.forEach((v) => {
      let typeName = v.value
      proxy.useDict(typeName)[typeName].value
    })
  })
  if (id) {
    detailsId.value = id
    getDetailsData()
  }
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let data = res.data
      ruleForm.value.flag = data.flag
      ruleForm.value.type = data.type
      ruleForm.value.urgency = String(data.urgency)
      ruleForm.value.remark = data.workorderLend.remark

      ruleForm.value.planLendDate = data.workorderLend.planLendDate
      ruleForm.value.planBackDate = data.workorderLend.planBackDate
      if (data.workorderLend.types.length) {
        ruleForm.value.materialsType = data.workorderLend.types.map((v) => {
          return v.materialsType
        })
        materialsTypeChange(ruleForm.value.materialsType)
      }
      if (data.workorderLend.names.length) {
        ruleForm.value.materialsName = data.workorderLend.names.map((v) => {
          return v.materialsName
        })
      }

      ruleForm.value.goodUse = data.workorderLend.goodUse
      if (data.workorderLend.files.length) {
        ruleForm.value.fileUrl = data.workorderLend.files
          .map((v) => {
            return v.fileUrl
          })
          .join(',')
      }
    }
  }
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    flag: '',
    type: 5,
    materialsType: '',
    planLendDate: '',
    planBackDate: '',
    materialsName: '',
    goodUse: '',
    urgency: '1',
    fileUrl: ''
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  resetForm()
}

//物资类型
const selApplyType = (value: any) => {}

//表单数据
const ruleForm = ref<any>({
  flag: '',
  type: 5,
  materialsType: '',
  planLendDate: '',
  planBackDate: '',
  materialsName: '',
  goodUse: '',
  urgency: '1',
  fileUrl: ''
})

const rules = reactive({
  goodUse: [{ required: true, message: '请选择用途', trigger: 'change' }],
  planLendDate: [
    { required: true, message: '请选择计划借出日期', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (ruleForm.value.planBackDate && ruleForm.value.planLendDate) {
          if (
            new Date(ruleForm.value.planLendDate).getTime() >
            new Date(ruleForm.value.planBackDate).getTime()
          ) {
            callback(new Error('计划借出日期不得晚于计划归还日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  planBackDate: [
    { required: true, message: '请选择计划归还日期', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (ruleForm.value.planLendDate) {
          if (
            new Date(ruleForm.value.planLendDate).getTime() >
            new Date(ruleForm.value.planBackDate).getTime()
          ) {
            callback(new Error('计划归还日期不得早于计划借出日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  materialsType: [{ required: true, message: '请选择物资类型', trigger: 'blur' }],
  materialsName: [{ required: true, message: '请选择物资名称', trigger: 'blur' }],
  remark: [
    { required: true, message: '请输入物资外借事由', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],

  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }]
})

const materialsTypeChange = (value) => {
  ruleForm.value.materialsName = ''
  nextTick(() => {
    let list = []
    value.forEach((item, index) => {
      console.log(proxy.useDict(item)[item].value, item)
      list = [...proxy.useDict(item)[item].value, ...list]
    })
    console.log(list)
    // materials_name_list.value = proxy.useDict(value)[value].value
    materials_name_list.value = list
  })
}

defineExpose({
  openDrawer
})
</script>

<template>
  <Dialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="pageTite"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="用途" prop="goodUse">
            <el-select
              :disabled="pageFlag === 'see'"
              fit-input-width
              v-model="ruleForm.goodUse"
              class="w-full"
              placeholder="请选择用途"
            >
              <el-option value="外借" label="外借" />
              <el-option value="借阅复印" label="借阅复印" />
              <el-option value="其他" label="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划借出日期" prop="planLendDate">
            <el-date-picker
              :disabled="pageFlag === 'see'"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择计划借出日期"
              class="date-picker"
              v-model="ruleForm.planLendDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划归还日期" prop="planBackDate">
            <el-date-picker
              :disabled="pageFlag === 'see'"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择计划归还日期"
              class="date-picker"
              v-model="ruleForm.planBackDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="物资类型" prop="materialsType">
            <el-select
              :disabled="pageFlag === 'see'"
              fit-input-width
              filterable
              multiple
              :max-collapse-tags="3"
              v-model="ruleForm.materialsType"
              @change="materialsTypeChange"
              class="w-full"
              placeholder="请选择物资类型"
            >
              <el-option
                v-for="item in materials_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="物资名称" prop="materialsName">
            <el-select
              :disabled="pageFlag === 'see'"
              fit-input-width
              multiple
              :max-collapse-tags="3"
              collapse-tags
              collapse-tags-tooltip
              v-model="ruleForm.materialsName"
              :filterable="pageFlag !== 'see'"
              class="w-full"
              placeholder="请选择物资名称"
            >
              <el-option
                v-for="item in materials_name_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="物资外借事由" prop="remark">
            <el-input
              :disabled="pageFlag === 'see'"
              type="textarea"
              :rows="4"
              maxlength="500"
              v-model="ruleForm.remark"
              placeholder="请输入物资外借事由"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="紧急程度" prop="urgency">
            <el-select
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.urgency"
              style="width: 100%"
              placeholder="请选择紧急程度"
            >
              <template #prefix
                ><div
                  class="sel-urgency-class"
                  :class="
                    ruleForm.urgency === '1'
                      ? 'sel-urgency-low'
                      : ruleForm.urgency === '2'
                      ? 'sel-urgency-middle'
                      : 'sel-urgency-high'
                  "
                ></div
              ></template>
              <el-option value="1" class="urgencyClass urgency-low" label="正常" />
              <el-option value="2" class="urgencyClass urgency-middle" label="重要" />
              <el-option value="3" class="urgencyClass urgency-high" label="紧急" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="fileUrl">
            <FileButtonUpload
              :isMultiple="true"
              :fileSize="2 * 1024"
              v-model:modelValue="ruleForm.fileUrl"
              :disabled="pageFlag === 'see'"
              :limit="10"
              :fileType="[
                'pdf',
                'doc',
                'docx',
                'png',
                'jpg',
                'jpeg',
                'bmp',
                'xls',
                'xlsx',
                'zip',
                'rar'
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :loading="loading"
          :disabled="releaseLoading"
          @click="save(1)"
          v-if="pageFlag !== 'see'"
        >
          暂存
        </el-button>
        <el-button
          class="dialog-btn-sure"
          :loading="releaseLoading"
          :disabled="loading"
          @click="save(2)"
          v-if="pageFlag !== 'see'"
        >
          发布
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>
