<template>
  <div>
    <header class="flex itesms-end justify-between mb-10px">
      <h3 class="h3After relative flex items-center font-bold text-16px pl-8px text-[#333]">{{
        title
      }}</h3>
      <div class="flex itesms-center">
        <ElButton class="btn-other" @click="allDel()" plain v-if="!isDelAction">
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          批量删除
        </ElButton>
      </div>
    </header>
    <el-table
      flexible
      class="w-full mb-20px"
      :data="modelValue"
      ref="tableRef"
      @selection-change="handleSelectionChange($event)"
      :height="modelValue.length ? 'auto' : 40"
      border
    >
      <el-table-column type="expand" width="30" v-if="isDelAction && isDropdown">
        <template #default="scope">
          <div class="flex">
            <p class="border-r-1 border-[#ebeef5]" style="width: 30px !important"></p>
            <div class="flex-1">
              <div
                v-for="(item, index) in dropdownData"
                :key="index"
                class="pr-20px py-5px flex pl-5px"
              >
                <p class="">{{ item.title }}：</p>
                <p class="flex-1 break-all overflow-hidden" style="word-wrap: break-word">{{
                  item.isSelect ? assessmentText(scope.row[item.field]) : scope.row[item.field]
                }}</p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="30" align="center" v-if="!isDelAction" />
      <el-table-column
        :height="10"
        :minWidth="item.width ? item.width : 'auto'"
        :label="item.title"
        prop="date"
        v-for="(item, index) in headerData"
        :key="index"
      >
        <template #default="scope">
          <div v-if="(isEdit(scope.$index) || item.isSlot) && !item.noSlot" class="pt-10px">
            <el-form :model="scope.row" :rules="item.rules" :ref="item.field + scope.$index">
              <el-form-item class="mb-0" :prop="item.field">
                <slot
                  :name="item.field"
                  :item="scope.row"
                  :index="scope.$index"
                  :field="item.field"
                ></slot>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="table_content">
            <div v-if="item.isSelect" :title="assessmentText(scope.row[item.field])">
              {{ assessmentlabel(scope.row[item.field]) }}</div
            >
            <div v-else>
              <div v-if="/\n/.test(scope.row[item.field])">
                <p v-for="(im, index) in scope.row[item.field].split('\n')" :key="index">
                  {{ im }}</p
                >
              </div>
              <div v-else-if="item.field == 'selfEvaluationDeduction'"
                >{{ scope.row[item.field] ? scope.row[item.field] : '0' }}
              </div>
              <div v-else-if="item.field == 'leaderDeduction'"
                >{{ scope.row[item.field] ? scope.row[item.field] : '0' }}
              </div>
              <p v-else>{{ scope.row[item.field] }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        :width="actionWidth"
        prop="pmProgressList"
        align="center"
        v-if="!isDelAction || !addAction"
      >
        <template #default="scope">
          <div class="flex justify-center items-center">
            <div v-if="isEdit(scope.$index)">
              <span class="cursor-pointer text-blue-500 mr-[0.45vw]" @click="sub(scope.$index)">
                保存</span
              >
              <span v-if="!delyj" class="cursor-pointer text-blue-500" @click="del(scope.$index)">
                删除</span
              >
              <span
                v-if="!scope.row.id && delyj"
                class="cursor-pointer text-blue-500"
                @click="del(scope.$index)"
              >
                删除</span
              >
            </div>
            <div v-else>
              <span class="cursor-pointer text-blue-500 mr-[0.45vw]" @click="edit(scope.$index)">
                编辑</span
              >
              <span v-if="!delyj" class="cursor-pointer text-blue-500" @click="del(scope.$index)">
                删除</span
              >
              <span
                v-if="!scope.row.id && delyj"
                class="cursor-pointer text-blue-500"
                @click="del(scope.$index)"
              >
                删除</span
              >
            </div>
            <div class="ml-[0.45vw]">
              <slot name="action" :item="scope.row" :index="scope.$index"></slot>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div
      v-if="!isDelAction || !addAction"
      @click="add"
      class="rounded-sm cursor-pointer w-full h-[44px] border-1 border-dashed border-[#99D9F6] flex justify-center items-center bg-[#F5FBFE] text-[#00A0E9]"
    >
      <Icon :size="14" icon="svg-icon:addBut" />
      <p class="text-14px ml-4px">新增</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance() as any

interface headTitle {
  isSelect: Boolean
  title: String
  field: String
  width: String
  isSlot: Boolean
  noSlot: Boolean
  rules: any
  el: any
}
const props: any = defineProps({
  isDropdown: {
    type: Boolean,
    default: true
  },
  delyj: {
    type: Boolean,
    default: false
  },
  addAction: {
    type: Boolean,
    default: true
  },
  actionWidth: {
    type: Number,
    default: 180
  },
  selectData: {
    type: Array,
    default: null
  },
  title: propTypes.string.def(''),
  isDelAction: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array,
    default: []
  },
  headerTitle: {
    type: Array<any>,
    default: []
  }
})

const tableRef = ref()
const headerData: any = ref([])
const multipleSelection: any = ref([])
headerData.value = props.headerTitle
const dropdownData: any = ref([])

const emit = defineEmits(['update:modelValue'])
const editRowIndex = ref<any>([])
const indices = ref([])

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
  indices.value = val.map((item) => props.modelValue.indexOf(item)).sort((a, b) => a - b)
}
const promiseValidate = (key: any) => {
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

const assessmentText = (id) => {
  let label = ''
  if (props.selectData) {
    props.selectData.map((item: any) => {
      if (item.children) {
        item.children.forEach((v) => {
          if (id == v.value) {
            label = v.text
          }
        })
      }
    })
  }
  return label
}

const assessmentlabel = (id) => {
  let label = ''
  if (props.selectData) {
    props.selectData.map((item: any) => {
      if (item.children) {
        item.children.forEach((v) => {
          if (id == v.value) {
            label = v.label
          }
        })
      }
    })
  }
  return label
}

const isEdit = computed(() => {
  return (a) => {
    if (!editRowIndex.value.length) return false
    return editRowIndex.value.some((v) => {
      return v == a
    })
  }
})

// 校验
const check = async () => {
  return new Promise(async (resolve) => {
    var res: any = []
    if (props.modelValue.length) {
      props.modelValue.forEach((v, index) => {
        for (let i = 0; i < props.headerTitle.length; i++) {
          if (props.headerTitle[i].rules) {
            res.push(props.headerTitle[i].field + index)
          }
        }
      })
    }

    let arr = []
    if (res.length) {
      arr = res.map((v) => {
        return promiseValidate(v)
      })
    }
    const validates = await Promise.all(arr)

    resolve(validates.every((item) => item))
  })
}

const deldata = (index: number) => {
  if (props.modelValue.length) {
    editRowIndex.value = editRowIndex.value.filter((v) => {
      return v != index
    })

    editRowIndex.value = editRowIndex.value
      .map((v) => {
        return Number(v) > index ? Number(v) - 1 : v
      })
      .filter((v) => v >= 0)

    editRowIndex.value = Array.from(new Set(editRowIndex.value))
    props.modelValue.splice(index, 1)
  }
}

const qiehuandata = async (index: number) => {
  return new Promise(async (resolve) => {
    let a = editRowIndex.value.some((v) => {
      return v == index
    })

    if (a) {
      ElMessage.error('存在未保存的周报内容！')
    } else {
      resolve(null)
    }
  })
}

// 删除
const del = (index: number) => {
  ElMessageBox.confirm('是否要删除此条数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  })
    .then(async () => {
      deldata(index)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
// 编辑
const edit = (index) => {
  editRowIndex.value.push(index)
}

const subCont = () => {
  if (editRowIndex.value.length) {
    return true
  } else {
    return false
  }
}
// 新增
const add = () => {
  if (!props.modelValue) {
    props.modelValue = []
  }
  let obj = {}
  props.headerTitle.map((v) => {
    obj[v.field] = ''
  })
  props.modelValue.push(obj)
  editRowIndex.value.push(props.modelValue.length - 1)
}
// 保存
const sub = async (num) => {
  let res: any = []
  for (let i = 0; i < props.headerTitle.length; i++) {
    if (props.headerTitle[i].rules) {
      res.push(promiseValidate(props.headerTitle[i].field + num))
    }
  }

  const validates = await Promise.all(res)
  if (validates.every((item) => item)) {
    editRowIndex.value = editRowIndex.value.filter((v) => num !== v)
    emit('update:modelValue', props.modelValue)
  } else {
  }
}
// //取消
// const close = (num) => {
//   editRowIndex.value = editRowIndex.value.filter((v) => num !== v)
// }

// 批量删除
const allDel = () => {
  if (!indices.value.length) {
    ElMessage.warning('请选择要删除的数据！')
  } else {
    ElMessageBox.confirm('是否要删除' + props.title + '选中的数据?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    })
      .then(async () => {
        let count = 0
        indices.value.forEach((v) => {
          deldata(v - count)
          count += 1
        })

        emit('update:modelValue', props.modelValue)
        ElMessage.success('删除成功')
        indices.value = []
      })
      .catch(() => {})
  }
}

watch(props, () => {
  if (props.isDelAction) {
    headerData.value = props.headerTitle.filter((item: any) => {
      return item.isShow == true
    })
    dropdownData.value = props.headerTitle.filter((item: any) => {
      return item.dropdownShow == true
    })
  } else {
    headerData.value = props.headerTitle
    dropdownData.value = props.headerTitle
  }
})

const reset = () => {
  editRowIndex.value = []
}
defineExpose({
  subCont,
  reset,
  check,
  qiehuandata
})
</script>

<style lang="less" scoped>
:deep(.el-table--default .cell) {
  padding: 0 5px 0 5px !important;
}
:deep(.el-table__expand-column) {
  border-bottom: 0 !important;
}

:deep(.el-table--default .cell .el-form-item) {
  margin-right: 0 !important;
}

:deep(.el-table__cell.el-table__expanded-cell) {
  padding: 0 !important;
}
:deep(.el-table thead) {
  height: 40px !important;
}
.h3After {
  &::after {
    content: '';
    width: 3px;
    height: 15px;
    position: absolute;
    top: 50%;
    background: #00a0e9;
    left: 0;
    transform: translateY(-50%);
  }
}
.table_content {
  word-break: break-all;
  overflow-wrap: break-word;
}
</style>
