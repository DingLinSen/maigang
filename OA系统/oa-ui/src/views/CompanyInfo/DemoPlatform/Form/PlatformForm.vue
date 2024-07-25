<!-- 演示平台的新增/编辑 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, inject } from 'vue'
import { projectType } from './config'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { savePlatformApi, editPlatformApi, getPlatformDetailApi } from '@/api/platform'

const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace } = useValidator()

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const pageTitle = ref<string>('')
const detailsId = ref<string>('')
const openDrawer = (type: string, id: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  pageTitle.value = type == 'add' ? '新增' : type == 'edit' ? '编辑' : '详情'
  nextTick(() => {
    detailsId.value = id
    getDetailsData()
  })
}

//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      loading.value = true
      let params = ruleForm.value
      if (detailsId.value) {
        params.id = detailsId.value
        const res = await editPlatformApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('platform', 'add')
          closeDialog()
        }
      } else {
        const res = await savePlatformApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('platform', 'add')
          closeDialog()
        }
      }
    }
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getPlatformDetailApi(detailsId.value)
    if (res && res.data) {
      ruleForm.value.sysName = res.data.sysName
      ruleForm.value.sysType = String(res.data.sysType)
      ruleForm.value.sysUrl = res.data.sysUrl ? res.data.sysUrl : ''
      ruleForm.value.remark = res.data.remark
    }
  }
}

//表单验证规则
const rules = reactive({
  sysName: [
    { required: true, message: '请输入平台名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  sysType: [{ required: true, message: '请选择类型', trigger: 'change' }],
  sysUrl: [
    { required: true, message: '请输入演示地址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (
          /(^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$)/.test(value)
        ) {
          callback()
        } else {
          callback(new Error('演示地址格式有误'))
        }
      },
      trigger: 'blur'
    }
  ]
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    sysType: '',
    sysName: '',
    sysUrl: '',
    remark: ''
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  sysType: '',
  sysName: '',
  sysUrl: '',
  remark: ''
})

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
defineExpose({
  openDrawer
})
</script>
<template>
  <ElDialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="pageTitle"
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
          <el-form-item label="类型" prop="sysType">
            <el-select
              placeholder="请选择类型"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              v-model="ruleForm.sysType"
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
        <el-col :span="24">
          <el-form-item label="平台名称" prop="sysName">
            <el-input
              maxlength="30"
              v-model="ruleForm.sysName"
              placeholder="请输入平台名称"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="演示地址" prop="sysUrl">
            <el-input
              maxlength="50"
              v-model="ruleForm.sysUrl"
              placeholder="请输入演示地址"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              maxlength="200"
              v-model="ruleForm.remark"
              placeholder="请输入备注"
              type="textarea"
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-sure" :loading="loading" @click="save"> 确定 </el-button>
        <el-button class="dialog-btn-cancel" @click="resetForm"> 重置 </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped>
</style>