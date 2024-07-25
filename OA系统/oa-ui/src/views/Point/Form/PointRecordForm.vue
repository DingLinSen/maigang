<!-- 积分管理详情/审核 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
import moment from 'moment'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElInput
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { PointStep } from '../Step'
import { getPointRecordDetailApi } from '@/api/point'

const { proxy } = getCurrentInstance() as any
const { human_resources_type } = proxy.useDict('human_resources_type')
const { department_type } = proxy.useDict('department_type')
const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)

const props = defineProps({
  title: propTypes.string.def('')
})

const pointTypeArray = ref<any>([])

const dialogTitle = ref<string>('')

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增

const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  pointTypeArray.value = human_resources_type.value.concat(department_type.value)
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getDetailsData()
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getPointRecordDetailApi(detailsId.value)
    if (res && res.data) {
      let audits = res.data.audits
      nextTick()
      ruleForm.value = {
        userName: res.data.userName ? res.data.userName : '',
        type: res.data.type ? res.data.type : '',
        bonusPenalty: res.data.bonusPenalty ? res.data.bonusPenalty : '',
        fraction: res.data.fraction ? res.data.fraction : '',
        cash: res.data.cash ? res.data.cash : '0',
        applyReason: res.data.applyReason ? res.data.applyReason : ''
      }
      flowDatas.value = audits
    }
  }
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    type: '',
    bonusPenalty: '',
    fraction: '',
    cash:'',
    applyReason: '',
    orderExpain: '',
    userName: ''
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
  flowDatas.value = []
  resetForm()
}

//表单数据
const ruleForm = ref<any>({
  type: '',
  bonusPenalty: '',
  fraction: '',
  applyReason: '',
  orderExpain: '',
  userName: '',
  cash:''
})
//表单验证规则
const rules = reactive({})

//审核流程
const flowDatas = ref<any[]>([])

defineExpose({
  openDrawer
})
</script>
<template>
  <Dialog
    ref="elDialogFef"
    width="68%"
    class="cultivate-custom"
    :maxHeight="'auto'"
    v-model="dialogFlag"
    :title="title"
    v-loading="loading"
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
      <div class="flex w-full">
        <div class="left-form-class">
          <el-row>
            <el-col :span="24">
              <el-form-item label="姓名">
                <el-input
                  v-model="ruleForm.userName"
                  disabled
                  placeholder="请输入姓名"
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="奖惩项目">
                <el-select
                  placeholder="请选择奖惩项目"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  v-model="ruleForm.bonusPenalty"
                >
                  <el-option
                    :value="item.value"
                    :label="item.label"
                    v-for="item in pointTypeArray"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="类型">
                <el-select
                  placeholder="请选择类型"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  v-model="ruleForm.type"
                >
                  <el-option value="1" label="奖分" />
                  <el-option value="2" label="扣分" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="积分">
                <el-input
                  placeholder="请输入积分"
                  maxlength="5"
                  v-model="ruleForm.fraction"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="现金价值">
                <el-input
                  placeholder="请输入现金价值"
                  maxlength="10"
                  v-model="ruleForm.cash"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="申请理由">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  maxlength="500"
                  disabled
                  v-model="ruleForm.applyReason"
                  placeholder="请输入申请理由"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="right-form-class">
          <p>审批记录</p>
          <PointStep :flowDatas="flowDatas" />
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.red {
  color: red;
}

.left-form-class {
  width: 60%;
}

.right-form-class {
  width: 39%;
  padding-left: 30px;
  padding-right: 10px;
  overflow-y: auto;
}

.right-title-p-class {
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 400;
}

.right-title-p-class {
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 400;
}
</style>

