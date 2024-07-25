<template>
  <Dialog
    ref="elDialogRef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="props.title"
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称" prop="name">
            <el-input
              placeholder="请输入商品名称"
              maxlength="100"
              v-model="ruleForm.name"
              :disabled="pageFlag === 'see'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" prop="cash">
            <el-input
              placeholder="请输入价格"
              maxlength="8"
              v-model="ruleForm.cash"
              :disabled="pageFlag === 'see'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品封面" prop="coverUrl">
            <div class="cover-wrap">
              <ImgUpload
                v-model:modelValue="ruleForm.coverUrl"
                :limit="1"
                :disabled="pageFlag === 'see'"
                :fileType="['png', 'jpg', 'jpeg']"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品图片" prop="pictureUrl">
            <div class="cover-wrap">
              <ImgUploadMutil
                v-model:modelValue="ruleForm.pictureUrl"
                :limit="8"
                :disabled="pageFlag === 'see'"
                :fileType="['png', 'jpg', 'jpeg']"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :loading="loading"
          @click="save"
          v-if="pageFlag !== 'see'"
        >
          确定
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ImgUpload } from '@/components/ImgUpload' // 文件上传组件
import { ImgUploadMutil } from '@/components/ImgUploadMutil' // 文件上传组件
import { ref, nextTick, reactive } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Dialog } from '@/components/Dialog'
import { savGoodsApi, editGoodsApi, getGoodsDetailApi } from '@/api/point'
import { ElMessage } from 'element-plus'

const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

//表单数据
const ruleForm = ref<any>({
  name: '',
  cash: '',
  coverUrl: '',
  pictureUrl: '',
  files: []
})

//表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  cash: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (/(^[1-9](\d+)?(\.\d{1,1})?$)|(^\d\.\d{1,1}$)/.test(value) && Number(value) > 0) {
          callback()
        } else {
          callback(new Error('请输入大于0的数字，小数点后最多一位'))
        }
      },
      trigger: 'blur'
    }
  ],
  coverUrl: [{ required: true, message: '请上传商品封面', trigger: 'change' }]
})

const props = defineProps({
  title: propTypes.string.def('')
})

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
      let data = ruleForm.value
      if (pageFlag.value === 'add') {
        //新增
        addApply(data)
      } else {
        //编辑
        editApply(data)
      }
    }
  })
}
//新增
const addApply = async (data: any) => {
  let files: any = []
  if (data.pictureUrl) {
    const list = data.pictureUrl.split(';')
    list.forEach((element: any) => {
      files.push({ url: element })
    })
  }
  let params = {
    name: data.name,
    cash: data.cash,
    coverUrl: data.coverUrl,
    files: files
  }
  const res = await savGoodsApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('pointMarket', 'refresh')
    closeDialog()
  }
}
//编辑
const editApply = async (data: any) => {
  let files: any = []
  if (data.pictureUrl) {
    const list = data.pictureUrl.split(';')
    list.forEach((element: any) => {
      files.push({ url: element })
    })
  }
  let params = {
    id: detailsId.value,
    name: data.name,
    cash: data.cash,
    coverUrl: data.coverUrl,
    files: files
  }
  const res = await editGoodsApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('pointMarket', 'refresh')
    closeDialog()
  }
}
//弹窗
const elDialogRef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增

const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogRef.value.isFullscreen = false
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getDetailsData()
  })
}
//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    await getGoodsDetailApi(detailsId.value)
      .then((res) => {
        if (res) {
          let files = res.data.files
          ruleForm.value.name = res.data.name ? res.data.name : ''
          ruleForm.value.cash = res.data.cash ? res.data.cash : ''
          ruleForm.value.coverUrl = res.data.coverUrl ? res.data.coverUrl : ''
          if (files && files.length) {
            ruleForm.value.pictureUrl = listToString(files)
          }
        }
      })
      .catch(() => {})
  }
}

// 对象转成指定字符串分隔
const listToString = (list: any[]) => {
  let strs = ''
  for (let i in list) {
    if (list[i].url) {
      strs += list[i].url + ';'
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : ''
}
//清空表单
const resetForm = () => {
  ruleForm.value = {
    name: '',
    cash: '',
    coverUrl: '',
    pictureUrl: '',
    files: []
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogRef.value) {
    elDialogRef.value.isFullscreen = false
  }
  resetForm()
}
defineExpose({
  openDrawer
})
</script>

<style lang="less" scoped>
.cover-wrap {
  width: 100%;
  display: flex;
  vertical-align: middle;
  line-height: normal;
  align-items: center;
}
</style>