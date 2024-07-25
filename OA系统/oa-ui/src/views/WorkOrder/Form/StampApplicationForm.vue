<!-- 请假申请 -->
<script setup lang="ts">
import './urgency.less'
import { ref, reactive, getCurrentInstance } from 'vue'
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

const pageFlag = ref<string>('add') // see 查看 edit 编辑 add 新增
const detailsId = ref<string>('')
//保存数据
const { proxy } = getCurrentInstance() as any
const { seal } = proxy.useDict('seal')
// 弹窗的开启和关闭
const dialogFlag = ref<Boolean>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
const releaseLoading = ref(false)
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
        chapter: {
          chapterDate: ruleForm.value.chapterDate,
          chapterUse: ruleForm.value.chapterUse,
          names: ruleForm.value.materialsName.map((v) => {
            return {
              materialsName: v
            }
          }),
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
// 用章 新增
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

// 用章 编辑
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
const pageTite = ref<string>('')
//打开drawer并初始化
const openDrawer = (id: string, flag: string) => {
  dialogFlag.value = true
  pageFlag.value = flag
  pageTite.value = flag == 'add' ? props.title : flag == 'edit' ? '编辑' : '详情'
  elDialogFef.value.isFullscreen = false
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

      ruleForm.value.chapterDate = data.chapter.chapterDate
      ruleForm.value.chapterUse = data.chapter.chapterUse

      if (data.chapter.names.length) {
        ruleForm.value.materialsName = data.chapter.names.map((v) => {
          return v.materialsName
        })
      }

      if (data.chapter.files.length) {
        ruleForm.value.fileUrl = data.chapter.files
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
    type: 7,
    urgency: '1',
    materialsName: '',
    chapterDate: '',
    chapterUse: '',
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

//请假类型选择
const selApplyType = (value: any) => {}

//表单数据
const ruleForm = ref<any>({
  flag: '',
  type: 7,
  urgency: '1',
  materialsName: '',
  chapterDate: '',
  chapterUse: '',
  fileUrl: ''
})
//表单验证规则
const rules = reactive({
  chapterUse: [
    { required: true, message: '请输入用章事由', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  materialsName: [{ required: true, message: '请选择用章名称', trigger: 'blur' }],
  chapterDate: [{ required: true, message: '请选择用章日期', trigger: 'change' }],
  fileUrl: [{ required: true, message: '请上传附件', trigger: 'change' }],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }]
})

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
          <el-form-item label="用章事由" prop="chapterUse">
            <el-input
              :disabled="pageFlag === 'see'"
              type="textarea"
              :rows="4"
              maxlength="500"
              v-model="ruleForm.chapterUse"
              placeholder="请输入用章事由"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用章日期" prop="chapterDate">
            <el-date-picker
              :disabled="pageFlag === 'see'"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择用章日期"
              class="date-picker"
              v-model="ruleForm.chapterDate"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="用章名称" prop="materialsName">
            <el-select
              :disabled="pageFlag === 'see'"
              fit-input-width
              filterable
              multiple
              :max-collapse-tags="3"
              v-model="ruleForm.materialsName"
              class="w-full"
              placeholder="请选择用章名称"
            >
              <el-option
                v-for="item in seal"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
              v-model:modelValue="ruleForm.fileUrl"
              :disabled="pageFlag === 'see'"
              :limit="10"
              :fileSize="2 * 1024"
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
          :disabled="releaseLoading"
          :loading="loading"
          @click="save(1)"
          v-if="pageFlag !== 'see'"
        >
          暂存
        </el-button>
        <el-button
          class="dialog-btn-sure"
          :disabled="loading"
          :loading="releaseLoading"
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

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
</style>
