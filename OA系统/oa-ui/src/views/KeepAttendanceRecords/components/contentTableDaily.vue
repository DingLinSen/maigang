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
          一键删除
        </ElButton>
      </div>
    </header>
    <el-table
      class="w-full mb-20px"
      :data="modelValue"
      :height="modelValue.length ? 'auto' : 40"
      border
    >
      <el-table-column
        :height="10"
        :minWidth="item.width ? item.width : 'auto'"
        :label="item.title"
        prop="date"
        v-for="(item, index) in headerTitle"
        :key="index"
      >
        <template #default="scope">
          <div v-if="(isEdit(scope.$index) || item.isSlot) && !item.noSlot" class="pt-18px">
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
            <div v-if="item.isSelect"> {{ assessmentlabel(scope.row[item.field]) }}</div>
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
      <p class="text-14px ml-[0.2vw]">新增</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import getAssetsFile from '@/utils/pubUse'
import { ref, computed, watch, inject, getCurrentInstance, nextTick } from 'vue'
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
const saveArr = ref()
const props: any = defineProps({
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
    type: Array,
    default: null
  }
})
const emit = defineEmits(['update:modelValue'])
const editRowIndex = ref<any>([])

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
  return new Promise(async (resolve, reject) => {
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

    console.log(res)
    if (res.length) {
      arr = res.map((v) => {
        return promiseValidate(v)
      })
    }
    const validates = await Promise.all(arr)

    resolve(validates.every((item) => item))
  })
}

// 删除
const del = (index: number) => {
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

// 一键删除
const allDel = () => {
  if (!props.modelValue.length) {
    ElMessage.warning('暂无可删除的数据')
  } else {
    ElMessageBox.confirm('是否要一键删除' + props.title + '所有数据?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    })
      .then(async () => {
        editRowIndex.value = []
        props.modelValue.splice(0, props.modelValue.length)
        emit('update:modelValue', props.modelValue)
        ElMessage.success('删除成功')
      })
      .catch(() => {})
  }
}

const reset = () => {
  console.log(editRowIndex.value)
  editRowIndex.value = []
}
defineExpose({
  subCont,
  reset,
  check
})
</script>

<style lang="less" scoped>
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
