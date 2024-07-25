<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { useValidator } from '@/hooks/web/useValidator'
import { changeApplyApi } from '@/api/project/ssxm'
import { useCache } from '@/hooks/web/useCache'
import moment from 'moment'
import { useEmitt } from '@/hooks/web/useEmitt'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})

const emit = defineEmits(['closeDialogClick', 'closeDialogSure'])
const options = inject<any>('principalOtherTree')

const sureLoading = ref<boolean>(false)
const formRef = ref<any>()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace } = useValidator()

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id

const rules = reactive({
  adjustItemPm: [
    {
      trigger: 'change',
      validator: (rule: any, value: string, callback: Callback) => {
        if (value && value.length < 2) {
          callback(new Error('请选择项目经理'))
        }
        callback()
      }
    }
  ],
  adjustItemSm: [
    {
      trigger: 'change',
      validator: (rule: any, value: string, callback: Callback) => {
        if (value && value.length < 2) {
          callback(new Error('请选择销售经理'))
        }
        callback()
      }
    }
  ],
  adjustReason: [
    { required: true, message: '请输入调整原因', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  adjustItemOther: [
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          notSpace(value, callback, '不能输入纯空格')
        } else if (
          !ruleForm.value.adjustItemPm &&
          !ruleForm.value.adjustItemSm &&
          !ruleForm.value.adjustItemPaymentDate &&
          !ruleForm.value.adjustItemAccecptDate
        ) {
          callback(new Error('请填写其他调整项'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
})

const ruleForm = ref<any>({
  pid: props.detailsData.pid,
  adjustItemPm: '',
  adjustItemSm: '',
  adjustItemOther: '',
  adjustItemPaymentDate: '',
  adjustItemAccecptDate: '',
  adjustReason: ''
})
// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
}

const callbackDetail = () => {
  emit('closeDialogSure')
}

const changeStep = ref<Number>(1) // 1项目经理 2销售经理 3项目经理上级 4销售经理上级

const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      let param = ruleForm.value
      param.adjustItemAccecptDate = param.adjustItemAccecptDate
        ? moment(param.adjustItemAccecptDate).format('YYYY-MM-DD')
        : ''
      param.adjustItemPaymentDate = param.adjustItemPaymentDate
        ? moment(param.adjustItemPaymentDate).format('YYYY-MM-DD')
        : ''

      if (param.adjustItemSm) {
        param.adjustItemSm =
          param.adjustItemSm instanceof Array
            ? param.adjustItemSm[param.adjustItemSm.length - 1] + ''
            : param.adjustItemSm
      }

      if (param.adjustItemPm) {
        param.adjustItemPm =
          param.adjustItemPm instanceof Array
            ? param.adjustItemPm[param.adjustItemPm.length - 1] + ''
            : param.adjustItemPm
      }

      const res = await changeApplyApi(param)
        .catch(() => {})
        .finally(() => {
          sureLoading.value = false
        })
      if (res) {
        ElMessage.success('信息保存成功')
        callbackDetail()
        //通知刷新实施项目列表
        // emitter.emit('ssxm', 'refresh')
      }
    }
  })
}

const getChangeStep = () => {
  if (loginUserId.value === props.detailsData.projectManagerLeader) {
    changeStep.value = 3
  } else if (loginUserId.value === props.detailsData.salesManagerLeader) {
    changeStep.value = 4
  } else if (
    loginUserId.value === props.detailsData.projectManager &&
    props.detailsData.salesManager === props.detailsData.projectManager
  ) {
    changeStep.value = 5
  } else if (loginUserId.value === props.detailsData.projectManager) {
    changeStep.value = 1
  } else if (loginUserId.value === props.detailsData.salesManager) {
    changeStep.value = 2
  }
}

//判断是否超过预计验收时间
const checkAcceptDate = () => {
  if (loginUserId.value === props.detailsData.projectManagerLeader) {
    return true
  }
  let acceptDateStr = props.detailsData.predictAcceptDate
  if (acceptDateStr) {
    let acceptDate = new Date(acceptDateStr + ' 23:59:59')
    if (acceptDate.getTime() < new Date().getTime()) {
      //超过预计验收时间
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

//判断是否超过预计回款时间
const checkPaymentDate = () => {
  if (loginUserId.value === props.detailsData.salesManagerLeader) {
    return true
  }
  let acceptDateStr = props.detailsData.predictPaymentDate
  if (acceptDateStr) {
    let acceptDate = new Date(acceptDateStr + ' 23:59:59')
    if (acceptDate.getTime() < new Date().getTime()) {
      //超过预计回款时间
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

getChangeStep()
</script>

<template>
  <section class="content-wrap">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="调整原因" prop="adjustReason">
        <el-input
          :maxlength="500"
          placeholder="请输入"
          type="textarea"
          autosize
          v-model="ruleForm.adjustReason"
        />
      </el-form-item>

      <div class="form-row">
        <div class="left form-label-title">
          <p>调整项</p>
        </div>
        <div class="right">
          <el-row>
            <el-col :span="12" v-if="changeStep === 3 || changeStep === 4">
              <el-form-item label="" prop="adjustItemPm">
                <el-cascader
                  v-model="ruleForm.adjustItemPm"
                  placeholder="选择项目经理"
                  style="width: 100%"
                  :filterable="true"
                  :disabled="false"
                  :clearable="true"
                  :props="{ label: 'deptName', value: 'deptId' }"
                  :controlsPosition="'right'"
                  :options="options"
                  @change="handleChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="changeStep === 3 || changeStep === 4">
              <el-form-item label="" label-position="left" prop="adjustItemSm">
                <el-cascader
                  v-model="ruleForm.adjustItemSm"
                  placeholder="选择销售经理"
                  style="width: 100%"
                  :filterable="true"
                  :disabled="false"
                  :clearable="true"
                  :props="{ label: 'deptName', value: 'deptId' }"
                  :controlsPosition="'right'"
                  :options="options"
                  @change="handleChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            ><el-col
              :span="12"
              v-if="
                (((changeStep === 1 || changeStep === 5) && checkAcceptDate()) ||
                  changeStep === 3 ||
                  changeStep === 4) &&
                detailsData.status !== '3'
              "
            >
              <el-form-item label="" label-position="left" prop="adjustItemAccecptDate">
                <div class="el-p">
                  <el-date-picker
                    type="date"
                    placeholder="请选择预计验收日期"
                    style="width: 99%"
                    v-model="ruleForm.adjustItemAccecptDate"
                    :editable="false"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="
                ((changeStep === 2 || changeStep === 5) && checkPaymentDate()) ||
                changeStep === 3 ||
                changeStep === 4
              "
            >
              <el-form-item label="" label-position="left" prop="adjustItemPaymentDate">
                <div class="el-p">
                  <el-date-picker
                    type="date"
                    placeholder="请选择预计回款日期"
                    style="width: 100%"
                    v-model="ruleForm.adjustItemPaymentDate"
                    :editable="false"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <el-form-item label="其他调整项" prop="adjustItemOther">
        <div class="w-full">
          <el-input
            v-model="ruleForm.adjustItemOther"
            type="textarea"
            placeholder="请输入"
            autosize
            :maxlength="1000"
          />
        </div>
      </el-form-item>
    </el-form>

    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
    &nbsp;
  </section>
</template>

<style lang="less">
.el-p {
  width: 100%;
  .el-input__wrapper {
    width: 100%;
  }
}

.must-label {
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 0.16rem;
  color: #ed4014;
}
.el-form-item__content {
  margin-left: 0px !important;
}

.left {
  display: flex;
  height: 32px;
  line-height: 32px;
  p {
    width: 100%;
    text-align: right;
    padding-right: 12px;
  }
}
.right {
  width: 89%;
}
.form-row {
  display: flex;
}
</style>
<style lang="less" scoped>
.content-wrap {
  max-height: 600px;
}
.form-label-title {
  width: 100px;
  padding-left: 7px;
}
</style>