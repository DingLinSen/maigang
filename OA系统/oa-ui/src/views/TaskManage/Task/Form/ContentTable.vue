<template>
  <div>
    <header class="flex itesms-end justify-between mb-10px">
      <h3 class="relative flex items-center font-bold text-base title-clas pl-8px text-[#333]">{{
        title
      }}</h3>
      <div class="flex itesms-center">
        <ElButton class="btn-other" @click="allDel()" plain v-if="props.editFlag == 'all'">
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          一键删除
        </ElButton>
      </div>
    </header>

    <el-table class="w-full mb-20px" :data="formData" border>
      <el-table-column
        :width="item.width ? item.width : 'auto'"
        :label="item.title"
        :render-header="({ column, $index }) => addRedStar({ column, $index }, item)"
        prop="date"
        v-for="(item, index) in headerTitle"
        :key="index"
      >
        <template #default="scope">
          <div v-if="scope.row.isEdit || item.isSlot">
            <el-form
              :model="scope.row"
              :ref="'milestoneTitleForm' + scope.$index"
              v-if="item.field == 'milestoneTitle'"
            >
              <el-form-item prop="milestoneTitle" :rules="rules.milestoneTitle">
                <el-input
                  maxlength="30"
                  :disabled="props.editFlag == 'status'"
                  v-model="scope.row.milestoneTitle"
                  placeholder="请输入里程碑标题"
                  type="text"
                />
              </el-form-item>
            </el-form>
            <el-form
              :model="scope.row"
              :ref="'milestoneDeadlineForm' + scope.$index"
              v-if="item.field == 'milestoneDeadline'"
            >
              <el-form-item prop="milestoneDeadline" :rules="rules.milestoneDeadline">
                <el-date-picker
                  :disabled="props.editFlag == 'status'"
                  v-model="scope.row.milestoneDeadline"
                  :clearable="true"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择截至时间"
                  :disabled-date="milestoneDeadlinelimit"
                  type="date"
                />
              </el-form-item>
            </el-form>
            <el-form
              :model="scope.row"
              :ref="'milestoneStatusForm' + scope.$index"
              v-if="item.field == 'milestoneStatus'"
            >
              <el-form-item prop="milestoneStatus" :rules="rules.milestoneStatus">
                <el-radio-group v-model="scope.row.milestoneStatus">
                  <el-radio label="0">未完成</el-radio>
                  <el-radio label="1">已完成</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <el-form
              :model="scope.row"
              :ref="'milestoneDescriptionForm' + scope.$index"
              v-if="item.field == 'milestoneDescription'"
            >
              <el-form-item prop="milestoneDescription" :rules="rules.milestoneDescription">
                <el-input
                  maxlength="2000"
                  :disabled="props.editFlag == 'status'"
                  v-model="scope.row.milestoneDescription"
                  placeholder="请输入里程碑描述"
                  type="textarea"
                  autosize
                />
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <el-radio-group
              v-model="scope.row[item.field]"
              v-if="item.field == 'milestoneStatus'"
              disabled
            >
              <el-radio label="0">未完成</el-radio>
              <el-radio label="1">已完成</el-radio>
            </el-radio-group>
            <span style="white-space: pre-wrap; word-break: break-word" v-else>{{
              scope.row[item.field]
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        prop="pmProgressList"
        align="center"
        v-if="props.editFlag != 'see'"
      >
        <template #default="scope">
          <div v-if="scope.row.isEdit">
            <span class="cursor-pointer text-blue-500 mr-[0.45vw]" @click="sub(scope.$index)">
              保存</span
            >
            <span
              class="cursor-pointer text-blue-500"
              @click="del(scope.$index)"
              v-if="props.editFlag != 'status'"
            >
              删除</span
            >
          </div>
          <div v-else>
            <span class="cursor-pointer text-blue-500 mr-[0.45vw]" @click="edit(scope.$index)">
              编辑</span
            >
            <span
              class="cursor-pointer text-blue-500"
              @click="del(scope.$index)"
              v-if="props.editFlag != 'status'"
            >
              删除</span
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="props.editFlag == 'all'"
      @click="add"
      class="rounded-sm cursor-pointer w-full h-[44px] border-1 border-dashed border-[#99D9F6] flex justify-center items-center bg-[#F5FBFE] text-[#00A0E9]"
    >
      <Icon :size="14" icon="svg-icon:addBut" />
      <p class="text-xs ml-[0.2vw]">新增</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import getAssetsFile from '@/utils/pubUse'
import { ref, computed, watch, inject, h, getCurrentInstance, proxyRefs, nextTick } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import moment from 'moment'

const { proxy } = getCurrentInstance() as any
const milestoneDeadlinelimit = (time: any) => {
  if (props.deadline) {
    return time.getTime() > new Date(props.deadline).getTime()
  }
  return false
}

interface headTitle {
  title: String
  field: String
  width: String
  isSlot: Boolean
}
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace, validateEmail, validatePhoneNumber, validateNormalBySearch } =
  useValidator()

const formData = ref<any>([])

const rules = ref<any>({
  milestoneTitle: [
    { required: true, message: '请输入里程碑标题', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  milestoneDeadline: [
    { required: true, message: '请选择截至时间', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          if (new Date(value).getTime() > new Date(props.deadline).getTime()) {
            callback(new Error('里程碑截至时间不得晚于任务截止时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  milestoneStatus: [{ required: true, message: '请选择里程碑状态', trigger: 'change' }],
  milestoneDescription: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const props = defineProps({
  title: propTypes.string.def(''),
  canDelete: {
    type: Boolean,
    default: true
  },
  editFlag: propTypes.string.def('all'),
  dataArray: propTypes.array.def([]),
  headerTitle: {
    type: Array<headTitle>,
    default: null
  },
  deadline: propTypes.string.def('')
})

const emit = defineEmits(['dataChange'])

// 给表头加必填符号*
const addRedStar = ({ column, $index }, item) => {
  if (item.isRequired) {
    return [h('span', { style: 'color: red' }, '*'), h('span', ' ' + item.title)]
  } else {
    return [h('span', ' ' + item.title)]
  }
}

// 删除
const del = (index: number) => {
  if (formData.value.length) {
    formData.value.splice(index, 1)
  }
  let savedData: any = []
  formData.value.forEach((element: any) => {
    if (!element.isEdit) {
      savedData.push(element)
    }
  })
  emit('dataChange', savedData)
}
// 编辑
const edit = (index: number) => {
  formData.value[index].isEdit = true
}

const promiseValidate = (key: string) => {
  return new Promise((resolve, reject) => {
    try {
      let formrRef = proxy.$refs[key][0]
      formrRef.validate((isValid: boolean) => {
        resolve(isValid)
      })
    } catch (err) {
      reject(err)
    }
  })
}

// 新增
const add = () => {
  if (!props.deadline) {
    ElMessage.warning('请先选择任务截止时间再添加里程碑')
    return
  }
  if (!formData.value.length) {
    formData.value = []
  }
  let obj = {}
  props.headerTitle.map((v) => {
    if (v.field == 'milestoneStatus') {
      obj[v.field as string] = '0'
    } else {
      obj[v.field as string] = ''
    }
  })
  obj['isEdit'] = true
  formData.value.push(obj)
}
// 保存
const sub = async (num: number) => {
  const validates = await Promise.all([
    promiseValidate('milestoneTitleForm' + num),
    promiseValidate('milestoneDeadlineForm' + num),
    promiseValidate('milestoneStatusForm' + num),
    promiseValidate('milestoneDescriptionForm' + num)
  ])
  if (validates.every((item) => item)) {
    formData.value[num].isEdit = false
    let savedData: any = []
    formData.value.forEach((element: any) => {
      if (!element.isEdit) {
        savedData.push(element)
      }
    })
    emit('dataChange', savedData)
  }
}

// 一键删除
const allDel = () => {
  if (!formData.value.length) {
    ElMessage.warning('暂无可删除的数据')
  } else {
    ElMessageBox.confirm('是否要一键删除' + props.title + '所有数据?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      formData.value.splice(0, formData.value.length)
      emit('dataChange', formData.value)
      ElMessage.success('删除成功')
    })
  }
}

const updateArray = (value: any) => {
  nextTick()
  formData.value = value
}

const getAllArray = () => {
  return formData.value
}

defineExpose({
  updateArray,
  getAllArray
})
</script>
<style lang="less" scoped>
.title-clas::after {
  content: '';
  width: 3px;
  height: 15px;
  position: absolute;
  top: 50%;
  background: #00a0e9;
  left: 0px;
  transform: translateY(-50%);
  border-radius: 1.5px;
}
</style>
