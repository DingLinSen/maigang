<template>
  <Dialog
    ref="elDialogFef"
    width="68%"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="dialogTitle"
    :maxHeight="'auto'"
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
              <el-form-item label="标题" prop="title">
                <el-input
                  v-model="ruleForm.title"
                  disabled
                  maxlength="100"
                  placeholder="请输入标题"
                  type="text"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="反馈类型" prop="type">
                <el-select
                  placeholder="请选择反馈类型"
                  style="width: 100%"
                  :clearable="true"
                  disabled
                  v-model="ruleForm.type"
                >
                  <el-option
                    v-for="item in feedback_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="描述" prop="content">
                <el-input
                  v-model="ruleForm.content"
                  disabled
                  maxlength="500"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入问题与建议描述"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="上传图片" prop="filePaths">
                <FileButtonUpload
                  v-model:modelValue="ruleForm.filePaths"
                  :limit="5"
                  :isMultiple="true"
                  :disabled="true"
                  splitter=";"
                  :fileType="['png', 'jpg', 'jpeg']"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="pageFlag === 'approve'">
            <el-col :span="24">
              <el-form-item label="" prop="remark">
                <span>审核意见（驳回必填<span class="red"> *</span>）</span>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  maxlength="200"
                  v-model="ruleForm.remark"
                  placeholder="请输入审核意见"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="right-form-class">
          <p>审批记录</p>
          <FeedbackStep :flowDatas="flowDatas" />
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :loading="passLoading"
          :disabled="rejectLoading"
          @click="pass"
          v-if="pageFlag === 'approve'"
        >
          通过
        </el-button>

        <el-button
          class="dialog-btn-reject"
          :loading="rejectLoading"
          :disabled="passLoading"
          @click="reject"
          v-if="pageFlag === 'approve'"
          plain
        >
          驳回
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDrawer" v-if="pageFlag === 'see'">
          取消
        </el-button>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { Dialog } from '@/components/Dialog'
import { ComponentOptions } from '@/types/components'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
// import { ImgUpload } from '@/components/ImgUploadMutil' // 文件上传组件
import { FeedbackStep } from './index'
import { auditFeedbackApi, getFeedbackDetailApi } from '@/api/feedback'
import { FileButtonUpload } from '@/components/FileButtonUpload' // 文件上传组件

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})
//保存数据
const { proxy } = getCurrentInstance() as any
const { feedback_type } = proxy.useDict('feedback_type')
// callback 类型
type Callback = (error?: string | Error | undefined) => void

// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
const { required, notSpace } = useValidator()

//审核流程
const flowDatas = ref<any[]>([])

//表单数据
const ruleForm = ref<any>({
  title: '',
  type: '',
  content: '',
  filePaths: '',
  remark: '',
  status: ''
})
//表单验证规则
const rules = reactive({
  remark: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const dialogTitle = ref<string>('')
const elDialogFef = ref()
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增
//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  //重置表单
  resetForm()
  dialogFlag.value = true
  pageFlag.value = flag
  elDialogFef.value.isFullscreen = false
  dialogTitle.value = flag === 'approve' ? '审核' : '详情'
  if (id) {
    getDetailsData(id)
  }
}
//关闭drawer
const closeDrawer = () => {
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

//清空表单
const resetForm = () => {
  flowDatas.value = []
  detailsId.value = ''
  ruleForm.value = {
    title: '',
    type: '',
    content: '',
    filePaths: '',
    remark: '',
    status: ''
  }
}

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getFeedbackDetailApi(id)
  if (res && res.data) {
    ruleForm.value.title = res.data.title ? res.data.title : ''
    ruleForm.value.type = res.data.type ? res.data.type : ''
    ruleForm.value.content = res.data.content ? res.data.content : ''
    ruleForm.value.filePaths = res.data.filePaths ? res.data.filePaths : ''
    ruleForm.value.status = res.data.status ? res.data.status : ''
    let audits = res.data.auditList
    flowDatas.value = audits
    let arr: any = []
    if (res.data.status == '0') {
      arr = [
        {
          roleName: '综合部经理',
          createByName: '高敬',
          feedbackStep: '待审核'
        },
        {
          roleName: '行业工程师',
          createByName: '储吉群',
          feedbackStep: '待评估'
        }
      ]
    } else if (res.data.status == '1') {
      arr = [
        {
          roleName: '行业工程师',
          createByName: '储吉群',
          feedbackStep: '待评估'
        }
      ]
    }

    flowDatas.value = [...flowDatas.value, ...arr]
  }
}

//表单
const formRef = ref<any>()
//保存等待
const passLoading = ref(false)
//保存数据
const pass = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      passLoading.value = true
      let params = {
        remark: ruleForm.value.remark,
        id: detailsId.value,
        status: ruleForm.value.status == '0' ? '1' : ruleForm.value.status == '1' ? '3' : '',
        feedbackStep: '已通过'
      }
      const res = await auditFeedbackApi(params)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            rejectLoading.value = false
            passLoading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('保存信息成功')
        //通知列表刷新
        emitter.emit('feedback', 'refresh')
        closeDrawer()
      }
    }
  })
}

const rejectLoading = ref(false)
//保存数据
const reject = async () => {
  //表单验证
  if (!ruleForm.value.remark) {
    ElMessage.error('请输入审核意见')
    return
  }
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      rejectLoading.value = true
      let params = {
        remark: ruleForm.value.remark,
        id: detailsId.value,
        status: '2',
        feedbackStep: '已驳回'
      }
      const res = await auditFeedbackApi(params)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            rejectLoading.value = false
            passLoading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('驳回成功')
        //通知列表刷新
        emitter.emit('feedback', 'refresh')
        closeDrawer()
      }
    }
  })
}

defineExpose({
  openDrawer
})
</script>
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
.file-no-wrap {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
  width: 100%;
  padding: 0px 10px;
}
.file-no-text {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #444444;
}
</style>

