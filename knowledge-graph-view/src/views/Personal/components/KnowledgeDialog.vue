<template>
  <Dialog ref="KnowledgeDialogRef" v-model="KnowledgeDialogVisible" title="选择知识分类">
    <el-breadcrumb :separator-icon="ArrowRight" v-if="showBread">
      <el-breadcrumb-item>知识分类</el-breadcrumb-item>
      <el-breadcrumb-item v-if="fatherName">{{ fatherName }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="sonName">{{ sonName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-loading="loading">
      <div class="Knowledge_header">
        <div class="left">
          <el-input v-model="keyword" placeholder="请输入关键词" @input="handleSearch">
            <template #suffix>
              <el-icon class="el-input__icon">
                <component :is="Search" @click="handleSearch" />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="right">
          <ElButton class="btn-add" plain @click="openAddKnowledgeDialog">
            <template #icon>
              <Icon :size="14" icon="svg-icon:addBut" />
            </template>
            新增
          </ElButton>
        </div>
      </div>
      <el-empty description="暂无数据" v-if="emptyFlag" />
      <div class="Knowledge_content" v-else>
        <div class="Knowledge_list">
          <div
            v-for="item in knowledgeData"
            :key="item.id"
            class="radio_list"
            :class="parentHighlight == item.id ? 'knowledgeLight' : ''"
          >
            <el-radio v-model="knowledgeValue" @change="handleRadio(item, 'p')" :label="item.id" />
            <span class="ml-5px cursor-pointer knowledgeName" @click="handleKnowledge(1, item)">
              {{ item.knowledgeName }}
            </span>
          </div>
        </div>
        <div class="Knowledge_list" v-if="twoLevelList.length">
          <div
            v-for="item in twoLevelList"
            :key="item.id"
            class="radio_list"
            :class="sonHighlight == item.id ? 'knowledgeLight' : ''"
          >
            <el-radio v-model="knowledgeValue" @change="handleRadio(item, 's')" :label="item.id" />
            <span class="ml-5px cursor-pointer knowledgeName" @click="handleKnowledge(2, item)">
              {{ item.knowledgeName }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="back">取消</el-button>
      </div>
    </template>
    <Dialog ref="AddKnowledgeDialogRef" v-model="AddKnowledgeDialogVisible" title="新增知识分类">
      <Form :schema="schema" ref="formRef" />
      <template #footer>
        <div class="footer">
          <el-button type="primary" :loading="AddLoading" @click="saveAddKnowledgeDialog"
            >确定
          </el-button>
          <el-button @click="backAddKnowledgeDialog">取消</el-button>
        </div>
      </template>
    </Dialog>
  </Dialog>
</template>
<script setup lang="ts">
import { reactive, ref, unref, watch, nextTick } from 'vue'
import { Dialog } from '@/components/Dialog'
import { Form, FormExpose } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
import { tagTypeListAllApi, tagTypeAddApi } from '@/api/classification/knowledge'
import { listToTree } from '@/utils/tree'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

type Callback = (error?: string | Error | undefined) => void
const { required, notSpace } = useValidator()
const formRef = ref(null)
const parentHighlight = ref()
const sonHighlight = ref()
const emit = defineEmits(['handleKnowledgeValue'])
const knowledgeData = ref<any>([])
const dataList = ref([])
// 表单的数据
const schema = reactive<FormSchema[]>([
  {
    field: 'knowledgeName',
    label: '知识名称',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'parentId', // key
    label: '父分类', // label
    component: 'Select', // 使用组件
    colProps: {
      // 所占col
      span: 24
    },
    componentProps: {
      filterable: true,
      style: 'width:100%;', //宽度
      options: []
    },
    formItemProps: {
      // 表单校验
      rules: []
    }
  },
  {
    field: 'note',
    label: '分类说明',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      type: 'textarea',
      rows: 4,
      maxLength: 1000,
      showWordLimit: true
    },
    formItemProps: {
      // 表单校验
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  }
])
// 搜索栏的值
const keyword = ref<any>('')
// 单选框的值
const knowledgeValue = ref()
// 单选框的数据
let twoLevelList = ref<any>([])
let threeLevelList = ref<any>([])
// 选择分类弹窗默认关闭
const KnowledgeDialogVisible = ref<boolean>(false)
// 新增分类弹窗默认关闭
const AddKnowledgeDialogVisible = ref<boolean>(false)
// 选择知识分类加载
const loading = ref(false)
// 新增知识分类加载
const AddLoading = ref(false)
let params = reactive<any>({
  pageNum: 1,
  pageSize: 9999
})
const allKnowledgeData = ref<any>([])
const getKnowledgeList = async () => {
  loading.value = true
  allKnowledgeData.value = []
  const res = await tagTypeListAllApi()
  if (res && res.data) {
    loading.value = false
    // 拷贝原数据
    res.data.forEach((item) => {
      if (item.status == 1) {
        let data = Object.assign({}, item)
        allKnowledgeData.value.push(data)
      }
    })
    knowledgeData.value = listToTree(res.data, {
      id: 'id',
      children: 'children',
      pid: 'parentId'
    }).filter((v) => {
      return v.parentId == 0 && v.status == 1
    })
    // 下拉选择父级数据
    dataList.value = res.data
      .filter((v) => {
        return v.parentId == 0 && v.status == 1
      })
      .map((v) => {
        return {
          value: v.id,
          label: v.knowledgeName
        }
      })
    let defaultRow = knowledgeData.value.filter((v) => {
      return v.children.some((j) => j.id == knowledgeValue.value)
    })
    if (defaultRow.length) {
      parentHighlight.value = defaultRow[0].id
      handleKnowledge(defaultRow[0])
    }
  }
}
const fatherName = ref<any>()
const sonName = ref<any>()
// 点击单选框
const handleKnowledge = (type, data) => {
  if (type === 1 && !isClick.value) {
    twoLevelList.value = data.children
    parentHighlight.value = data.id
  } else if (type === 1) {
    fatherName.value = data.knowledgeName
    sonName.value = ''
    showBread.value = true
    parentHighlight.value = data.id
  } else if (type === 2 && isClick.value) {
    let list = allKnowledgeData.value.filter((item) => {
      return data.parentId == item.id
    })
    fatherName.value = list[0].knowledgeName
    sonName.value = data.knowledgeName
    sonHighlight.value = data.id
    showBread.value = true
  }
}
const knowledgeClassification = ref()
// 选择单选框
const handleRadio = (data, type) => {
  if (type == 'p') {
    parentHighlight.value = data.id
    sonHighlight.value = null
  } else if (type == 's') {
    sonHighlight.value = data.id
  }
  knowledgeClassification.value = data
}
// 打开弹出框
const openDialog = (id) => {
  KnowledgeDialogVisible.value = true
  emptyFlag.value = false
  getKnowledgeList()
  // 清空单选框的值
  twoLevelList.value = []
  threeLevelList.value = []
  knowledgeValue.value = null
  keyword.value = null
  parentHighlight.value = ''
  sonHighlight.value = ''
  isClick.value = false
  fatherName.value = ''
  sonName.value = ''
  showBread.value = false
  if (id) {
    knowledgeValue.value = id
  }
}
const emptyFlag = ref<boolean>(false)
const isClick = ref<boolean>(false)
const showBread = ref<boolean>(false)
// 搜索
const handleSearch = () => {
  // 清空第二层数据
  twoLevelList.value = []
  let searchList: any = []
  // allKnowledgeData.value.forEach((item) => {
  //   let index = auxiliaryList.value.findIndex((ele) => ele.id == item.id)
  //   item.flag = index > -1
  // })
  //搜索出来的数据
  if (keyword.value) {
    isClick.value = true
    // allKnowledgeData.value.forEach((item) => {
    //   if (item.knowledgeName.includes(keyword.value)) {
    //     let data = Object.assign({}, item)
    //     searchList.push(data)
    //   }
    // })
    // 如果搜索框有值  循环所有的数据 拿到搜索出来的所有数据
    allKnowledgeData.value.forEach((item) => {
      if (item.knowledgeName.includes(keyword.value)) {
        let data = Object.assign({}, item)
        searchList.push(data)
      }
    })
    // 循环搜索出来的数据找出他的父级
    let fatherList = searchList.filter((item) => {
      return item.parentId == 0
    })
    // 转化数据结构
    knowledgeData.value = listToTree(fatherList, {
      id: 'id',
      children: 'children',
      pid: 'parentId'
    })
    // 循环搜索出来的数据找出他的子级
    let sonSearchList = searchList.filter((item) => {
      return item.parentId != 0
    })
    // 转化数据结构
    twoLevelList.value = listToTree(sonSearchList, {
      id: 'id',
      children: 'children',
      pid: 'parentId'
    })
    // 循环所有子级 判断搜索出来的子级是否包含父级
    // sonSearchList.forEach((item) => {
    //   let index = searchList.findIndex((ele) => ele.id == item.parentId)
    //   if (index == -1) {
    //     //  如果没有父级 给他添加父级
    //     let parentIndex = allKnowledgeData.value.findIndex((ele) => ele.id == item.parentId)
    //     let data = Object.assign({}, allKnowledgeData.value[parentIndex])
    //     searchList.push(data)
    //   }
    // })
    if (!searchList.length) {
      emptyFlag.value = true
    } else {
      emptyFlag.value = false
    }
  } else {
    isClick.value = false
    showBread.value = false
    emptyFlag.value = false
    //  如果搜索栏的值为空
    allKnowledgeData.value.forEach((item) => {
      if (item.status == 1) {
        let data = Object.assign({}, item)
        searchList.push(data)
      }
    })
    knowledgeData.value = listToTree(searchList, {
      id: 'id',
      children: 'children',
      pid: 'parentId'
    })
  }
}
// 打开新增弹窗
const openAddKnowledgeDialog = () => {
  AddKnowledgeDialogVisible.value = true
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: 'parentId',
        path: 'componentProps.options',
        value: dataList.value
      }
    ])
  })
}
// 点击确定
const save = () => {
  emit('handleKnowledgeValue', knowledgeClassification.value)
  KnowledgeDialogVisible.value = false
}
// 点击取消
const back = () => {
  KnowledgeDialogVisible.value = false
}
// 新增知识分类
const saveAddKnowledgeDialog = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      AddLoading.value = true
      let data = form?.formModel as any
      data.knowledgeName = data.knowledgeName ? data.knowledgeName : ''
      data.parentId = data.parentId ? data.parentId : null
      data.level = data.parentId == null || data.parentId == 0 ? '2' : '1'
      data.note = data.note ? data.note : ''
      const res = await tagTypeAddApi(data)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            AddLoading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('信息提交成功')
        AddKnowledgeDialogVisible.value = false
        await getKnowledgeList()
      }
    }
  })
}
// 取消新增知识分类
const backAddKnowledgeDialog = () => {
  AddKnowledgeDialogVisible.value = false
}
// 传递给父组件的方法
defineExpose({
  openDialog
})
</script>
<style lang="less">
.radio_list {
  display: flex;
  align-items: center;
  padding: 6px 20px;
}
</style>
<style lang="less" scoped>
:deep(.el-radio) {
  margin-right: 0 !important;
}
:deep(.el-radio__label) {
  display: none !important;
}
:deep(.el-input__suffix:hover) {
  cursor: pointer !important;
}
:deep(.el-empty) {
  height: 400px !important;
  margin-top: 10px;
}
.Knowledge_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
}
.Knowledge_content {
  margin-top: 10px;
  border: 1px solid #e2e2e2;
  display: flex;
  .Knowledge_list {
    height: 400px;
    overflow: scroll;
    border-right: 1px solid #e2e2e2;
    width: 50%;
    &:first-child {
      border-right: 1px solid #e2e2e2 !important;
    }
    &:last-child {
      border-right: none;
    }
    .knowledgeName {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .knowledgeLight {
      background: #f3f3f3;
    }
  }
}
.list_footer {
  border: 1px solid #e2e2e2;
  padding: 10px;
  border-top: none;
}
</style>