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
        <el-col :span="12">
          <el-form-item label="申请人" prop="createByName">
            <el-input
              type="text"
              v-model="ruleForm.createByName"
              placeholder="请输入申请人"
              disabled
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请部门" prop="deptId">
            <el-select
              v-model="ruleForm.deptId"
              style="width: 100%"
              placeholder="请选择申请部门"
              disabled
            >
              <el-option
                v-for="item in filiteDeptData"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <!-- <el-input type="text" v-model="ruleForm.deptId" placeholder="请选择申请部门" disabled>
            </el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="顺延时长" prop="sumDate">
            <el-input
              type="text"
              v-model="ruleForm.sumDate"
              placeholder="请输入顺延时长"
              :disabled="pageFlag === 'see'"
              maxlength="6"
            >
              <template #append>小时</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急程度" prop="urgency">
            <el-select
              v-model="ruleForm.urgency"
              style="width: 100%"
              :disabled="pageFlag === 'see'"
              placeholder="紧急程度"
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
          <el-form-item label="顺延原因" prop="reason">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="200"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.reason"
              placeholder="请输入顺延原因"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :disabled="releaseLoading"
          :loading="loading"
          @click="save"
          v-if="pageFlag !== 'see'"
        >
          暂存
        </el-button>
        <el-button
          class="dialog-btn-sure"
          :disabled="loading"
          :loading="releaseLoading"
          @click="releaseApply"
          v-if="pageFlag !== 'see'"
        >
          发布
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { useCache } from '@/hooks/web/useCache'
import { useValidator } from '@/hooks/web/useValidator'
import { applyOrderApi, getOrderDetailApi, editOrderApi, getHolidayDurationApi } from '@/api/order'
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { ElMessage } from 'element-plus'
import { useEmitt } from '@/hooks/web/useEmitt'

const { wsCache } = useCache()
const { emitter } = useEmitt()
const loginUser = ref<any>(wsCache.get('userInfo')) // 登录用户信息
type Callback = (error?: string | Error | undefined) => void
const { required, validateEnglishAndNumber, notSpace } = useValidator()
//调休小时
const relaxDay = ref<number>(0)
//获取调休时长和年假时长
const getUserHolidayDuration = async () => {
  const res = await getHolidayDurationApi()
  if (res && res.data) {
    res.data.forEach((element: any) => {
      if (element.type === '2') {
        relaxDay.value = element.hours
      }
    })
  }
}

//获取所有部门
const filiteDeptData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    filiteDeptData.value = res.data.map((v) => {
      return {
        value: v.deptId,
        label: v.deptName
      }
    })
  } catch (error) {
    console.log(error)
  }
}

getAllUserlist()

//表单数据
const ruleForm = ref<any>({
  createByName: loginUser.value.nickName,
  createBy: loginUser.value.userId,
  deptId: loginUser.value.deptId,
  urgency: '1',
  sumDate: '', //顺延时长 小数点后一位小数
  reason: '' //顺延事由 200
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    createByName: loginUser.value.nickName,
    createBy: loginUser.value.userId,
    deptId: loginUser.value.deptId,
    urgency: '1',
    sumDate: '', //顺延时长 小数点后一位小数
    reason: '' //顺延事由 200
  }
}

//弹窗
const elDialogFef = ref()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增
const pageTite = ref<string>('')
const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  pageTite.value = flag == 'add' ? '调休顺延申请' : flag == 'edit' ? '编辑' : '详情'
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getUserHolidayDuration()
    getDetailsData()
  })
}

const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let workorderDelay = res.data.workorderDelay
      nextTick()
      ruleForm.value = {
        sumDate: workorderDelay.sumDate ? workorderDelay.sumDate : '',
        urgency: res.data.urgency ? String(res.data.urgency) : '',
        reason: workorderDelay.reason ? workorderDelay.reason : '',
        createByName: res.data.createByName ? res.data.createByName : '',
        createBy: res.data.createBy,
        deptId: res.data.deptId
      }
    }
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

//表单验证规则
const rules = reactive({
  createByName: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择申请部门', trigger: 'change' }],
  sumDate: [
    { required: true, message: '请输入顺延时长', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (/(^[1-9]{1}\d{0,2}$)|(^\d{0,3}[.]{1}[0-9]{0,1}$)/.test(value)) {
          if (Number(value) > relaxDay.value) {
            callback(new Error('调休剩余时间不足'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入大于0且小于1000的数字，小数点后最多一位'))
        }
      },
      trigger: 'blur'
    }
  ],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  reason: [
    { required: true, message: '请输入顺延原因', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

//表单
const formRef = ref<any>()
//发布等待
const releaseLoading = ref(false)
//保存数据
const releaseApply = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      releaseLoading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'add') {
        addApply(data, '2')
      } else {
        //编辑
        editApply(data, '2')
      }
    }
  })
}

//保存等待
const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      loading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'add') {
        //新增
        addApply(data, '1')
      } else {
        //编辑
        editApply(data, '1')
      }
    }
  })
}

//新增
const addApply = async (data: any, flag: string) => {
  let workorderDelay = {
    reason: data.reason,
    sumDate: data.sumDate
  }
  let params = {
    type: '9',
    urgency: data.urgency,
    flag: flag,
    workorderDelay: workorderDelay
  }
  const res = await applyOrderApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    if (flag === '2') {
      emitter.emit('order', 'update')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

//编辑
const editApply = async (data: any, flag: string) => {
  let workorderDelay = {
    reason: data.reason,
    sumDate: data.sumDate
  }
  let params = {
    type: '9',
    urgency: data.urgency,
    flag: flag,
    id: detailsId.value,
    workorderDelay: workorderDelay
  }
  const res = await editOrderApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    if (flag === '2') {
      emitter.emit('order', 'update')
    }
    closeDialog()
  }
}

defineExpose({
  openDrawer
})
</script>

<style lang="less" scoped>
.urgencyClass {
  display: flex;
  align-items: center;
  &:before {
    content: ' ';
    display: inline-block;
    margin-right: 12px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
}
.urgency-low:before {
  background-color: #80c36a;
}
.urgency-middle:before {
  background-color: #eeb915;
}
.urgency-high:before {
  background-color: #df3c2f;
}
.sel-urgency-class {
  content: ' ';
  display: inline-block;
  margin-right: 0.16rem;
  width: 12px;
  height: 12px;
  vertical-align: text-bottom;
  border-radius: 4px;
}

.sel-urgency-low {
  background-color: #80c36a;
}

.sel-urgency-middle {
  background-color: #eeb915;
}

.sel-urgency-high {
  background-color: #df3c2f;
}
</style>
