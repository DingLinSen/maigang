<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { ComponentOptions } from '@/types/components'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import moment from 'moment'
// import { ImgUpload } from '@/components/ImgUploadMutil' // 文件上传组件
import { saveFeedbackApi, getFeedbackDetailApi } from '@/api/feedback'
import { FileButtonUpload } from '@/components/FileButtonUpload' // 文件上传组件

//保存数据
const { proxy } = getCurrentInstance() as any
const { feedback_type } = proxy.useDict('feedback_type')
// callback 类型
type Callback = (error?: string | Error | undefined) => void

// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
const { required, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
//表单数据
const ruleForm = ref<any>({
  title: '',
  type: '',
  content: '',
  filePaths: ''
})
//表单验证规则
const rules = reactive({
  type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  content: [
    { required: true, message: '请输入问题与建议描述', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})

const loading = ref(false)
//表单
const formRef = ref<any>()
//保存数据
const save = async () => {
  //表单验证
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = ruleForm.value
      saveFeedback(data)
    }
  })
}

//保存建议
const saveFeedback = async (data: any) => {
  const res = await saveFeedbackApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 300)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('feedback', 'refresh')
    closeDrawer()
  }
}

const pageTite = ref<string>('')
const elDialogFef = ref()
//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  //重置表单
  resetForm()
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  pageTite.value = flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情'
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
  ruleForm.value = {
    title: '',
    type: '',
    content: '',
    filePaths: ''
  }
}

//获取详情
const getDetailsData = async (id: string) => {
  const res = await getFeedbackDetailApi(id)
  if (res && res.data) {
    ruleForm.value.title = res.data.title
    ruleForm.value.type = res.data.type
    ruleForm.value.content = res.data.content
    ruleForm.value.filePaths = res.data.filePaths
  }
}

defineExpose({
  openDrawer
})
</script>

<template>
  <el-dialog
    ref="elDialogFef"
    class="feedback-dailog-class"
    :width="'35%'"
    :align-center="true"
    v-model="dialogFlag"
    :title="pageTite"
    @closed="dialogFlag = false"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <slot name="title">
          <div class="title-wrap">
            <span class="main-title-text">意见反馈</span>
            <span class="sub-title-text">欢迎提出宝贵的意见和建议 </span>
          </div>
        </slot>
        <img class="feedback-img" src="@/assets/imgs/home/feedback.png" />
        <div class="pl-[5px] pr-[5px] cursor-pointer" @click="close">
          <Icon class="is-hover z-10 mt-5px" icon="svg-icon:close_icon_dialog" :size="14" />
        </div>
      </div>
    </template>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="form-content-feed"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="ruleForm.title"
              :disabled="pageFlag == 'see'"
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
              :disabled="pageFlag === 'see'"
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
              :disabled="pageFlag == 'see'"
              maxlength="500"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入问题与建议描述"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="" prop="filePaths">
            <!-- <ImgUpload
              v-model:modelValue="ruleForm.filePaths"
              :limit="5"
              :disabled="pageFlag === 'see'"
              :fileType="['png', 'jpg', 'jpeg']"
            /> -->
            <FileButtonUpload
              v-model:modelValue="ruleForm.filePaths"
              :limit="5"
              buttonText="上传图片"
              :isMultiple="true"
              splitter=";"
              :disabled="pageFlag === 'see'"
              :fileType="['png', 'jpg', 'jpeg']"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          type="primary"
          class="dialog-btn-sure"
          :loading="loading"
          @click="save"
          v-if="pageFlag !== 'see'"
        >
          提交
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDrawer"> 取消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
.text-tip {
  width: 100%;
  text-align: center;
  margin-bottom: 2vh;
  font-size: 16px;
}
</style>

<style lang="less">
.feedback-dailog-class {
  border-radius: 4px !important;
  .el-dialog__header {
    height: 28vh;
    position: relative;
    border-radius: 4px;
    background: linear-gradient(180deg, #e7eef7 0%, rgba(231, 234, 247, 0) 100%) !important;
    font-size: 16px !important;
    font-family: Alibaba PuHuiTi M;
    border-bottom: 0px solid var(--tags-view-border-color);
  }
  .el-dialog__headerbtn {
    display: none;
  }
  .el-dialog__body {
    margin-top: -13vh;
  }
  .title-wrap {
    display: grid;
    flex: 1;
    grid-template-rows: 28px;
    margin-top: 6.5vh;
  }
  .main-title-text {
    font-size: 22px;
    margin-left: 44px;
    line-height: 24px;
    color: #333333;
    font-family: Alibaba PuHuiTi B;
  }
  .sub-title-text {
    font-size: 14px;
    color: #666666;
    margin-left: 44px;
    font-family: Alibaba PuHuiTi R;
  }

  .feedback-img {
    // width: 14vh;
    height: 10vh;
    margin-right: 45px;
    margin-top: 3vh;
  }
  .form-content-feed {
    padding: 0px 45px;
    max-height: 60vh;
    overflow-y: auto;
  }
  .el-dialog__footer {
    margin: 0px 45px;
    padding-top: 3vh;
    padding-bottom: 6vh;
    text-align: center;
    border-top: 1px solid var(--tags-view-border-color);
  }
}
</style>
