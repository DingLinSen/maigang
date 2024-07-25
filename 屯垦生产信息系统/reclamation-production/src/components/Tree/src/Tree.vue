<script setup lang="ts">
import { PropType, ref, unref, watch, reactive, nextTick } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElTree, ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { Message } from '@element-plus/icons-vue/dist/types'
import { Dialog } from '@/components/Dialog'
import { Form, FormExpose } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
const { required } = useValidator()
const props = defineProps({
  // 生成Form的布局结构数组
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },

  defaultHeight: propTypes.number.def(),
  isShowExpend: propTypes.bool.def(true),
  isShowLeft: {
    type: Boolean,
    default: true
  },
  expendAll: propTypes.bool.def(false),
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
  // 操作按钮风格位置
  layout: propTypes.string.validate((v: string) => ['inline', 'bottom'].includes(v)).def('inline'),
  // 底部按钮的对齐方式
  buttomPosition: propTypes.string
    .validate((v: string) => ['left', 'center', 'right'].includes(v))
    .def('center'),
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  // 是否显示伸缩
  expand: propTypes.bool.def(false),
  // 伸缩的界限字段
  expandField: propTypes.string.def(''),
  inline: propTypes.bool.def(true),
  treeButton: propTypes.bool.def(true), // 是否有按钮
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  data: {
    type: Array as PropType<Recordable[]>,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  nodeKey: {
    type: String,
    default: 'id'
  },
  width: {
    type: String,
    default: '20%'
  },
  // 默认展开
  defaultExpendKeys: {
    type: Array,
    default: () => []
  },
  // 默认选中
  defaultCheckedKeys: {
    type: Array,
    default: () => []
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  //是否在点击节点的时候展开或者收缩节点
  expandOnClickNode: {
    type: Boolean,
    default: true
  }
})
const addTreeLoading = ref<boolean>(false) // 表单保存按钮loading
const formMenuList = ref<any>([])
// tree按钮
const treeDelete = ref<boolean>(true) // 删除
const treeImport = ref<boolean>(false) // 导出
const treeSave = ref<boolean>(true) // 新增
const treeUpdate = ref<boolean>(true) // 编辑
// 按钮loading
const delLoading = ref<boolean>(false) // 删除
const exLoading = ref<boolean>(false) // 导出
const formRef = ref<FormExpose>() // 表单ref
const optionData = ref<boolean>(false) // 新增编辑弹框
const treeTitle = ref<any>('') // 表单title
// 子传父事件
const emit = defineEmits(['tree', 'reset', 'isShowLeftChange'])
const treeRef = ref<InstanceType<typeof ElTree>>()
interface Tree {
  id: number
  label: string
  children?: Tree[]
}
const chooseData = ref<Array<Tree>>([])
// 树节点过滤所需字段
const filterText = ref('')
const treeContainner = ref()
// 树节点过滤
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
// const treedataList: DeptTreeData[] = props.data
// 树节点点击事件
const onNodeClick = (val: any) => {
  emit('tree', val)
  chooseData.value = []
  if (val) {
    chooseData.value.push(val)
  }
  // selections.value = selection
}
const showLeft = ref(props.isShowLeft)
const showLeftChange = () => {
  showLeft.value = !showLeft.value
  emit('isShowLeftChange', showLeft.value)
}
const wResize = ref()
defineExpose({
  treeContainner,
  wResize
})
// 新增编辑表单内容
const schema = reactive<FormSchema[]>([
  {
    field: 'upMenu',
    label: '上级目录',
    component: 'Cascader',
    hidden: false,
    colProps: {
      span: 24
    },
    componentProps: {
      options: formMenuList,
      props: {
        checkStrictly: true
      },
      clearable: true,
      filterable: true,
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'menuName',
    label: '目录名称',
    component: 'Input',
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  }
])

// tree事件
// 导出
const importTree = () => {
  exLoading.value = true
  setTimeout(() => {
    exLoading.value = false
    ElMessage.success('导出成功')
  }, 200)
}
//删除
const delDataChange = () => {
  if (chooseData.value.length < 1) {
    ElMessage.error('请选择一条数据')
  } else {
    delLoading.value = true
    ElMessageBox.confirm('是否删除所选中数据?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        delLoading.value = false
        chooseData.value = []
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
      })
      .catch(() => {
        delLoading.value = false
      })
  }
}
// 新增
const treeSaveChange = () => {
  treeTitle.value = '新增'
  nextTick(() => {
    const elFormRef = unref(formRef)?.getElFormRef()
    elFormRef?.resetFields()
    unref(formRef)?.setSchema([
      {
        field: 'upMenu',
        path: 'hidden',
        value: false
      }
    ])
  })
  optionData.value = true
  formMenuList.value = props.data
}
// 编辑
const treeUpdateChange = () => {
  treeTitle.value = '编辑'
  if (chooseData.value.length < 1) {
    ElMessage.error('请选择一条数据')
  } else {
    const elFormRef = unref(formRef)?.getElFormRef()
    nextTick(() => {
      unref(formRef)?.setSchema([
        {
          field: 'upMenu',
          path: 'hidden',
          value: true
        }
      ])
    })
    elFormRef?.resetFields()
    optionData.value = true
    formMenuList.value = props.data
  }
}
// 关闭树形目录数据操作弹框
const closeDrawer = () => {
  optionData.value = false
}
// 确认编辑或新增
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      addTreeLoading.value = true
      optionData.value = false
      nextTick(() => {
        setTimeout(() => {
          addTreeLoading.value = false
        }, 300)
      })
    }
  })
}
</script>

<template>
  <div class="tree-container" ref="treeContainner" :style="{}">
    <div
      class="tree-main"
      :style="{ width: width, height: defaultHeight + 'px', overflow: 'hidden' }"
      v-show="showLeft"
    >
      <div class="top-header flex">
        <h3
          :style="{
            'text-align': 'center',
            'padding-bottom': '10px',
            'font-weight': 'bold'
          }"
          v-if="title"
          >{{ title }}</h3
        >
        <div class="expend-lr" v-if="isShowExpend" @click="showLeftChange()">
          <img v-if="showLeft" src="@/assets/imgs/icons/retract_icon.png" alt="" />
          <img v-else src="@/assets/imgs/icons/expand_icon.png" alt="" />
        </div>
      </div>
      <!-- 按钮 -->
      <ElForm>
        <ElFormItem class="button-tree" v-if="treeButton">
          <div class="but-content">
            <ElButton type="text" @click="importTree" :loading="exLoading" v-if="treeImport">
              导出
            </ElButton>
            <ElButton type="text" @click="treeSaveChange" v-if="treeSave">
              <img
                style="padding: 5px; border: 1px solid rgba(60, 154, 76, 0.9)"
                src="@/assets/imgs/icons/add_tree_icon.png"
            /></ElButton>
            <ElButton type="text" @click="treeUpdateChange" v-if="treeUpdate">
              <img
                style="padding: 5px; border: 1px solid rgba(60, 154, 76, 0.9)"
                src="@/assets/imgs/icons/edit_icon.png"
              />
            </ElButton>
            <ElButton :loading="delLoading" v-if="treeDelete" @click="delDataChange()" type="text">
              <img
                style="padding: 5px; border: 1px solid rgba(60, 154, 76, 0.9)"
                src="@/assets/imgs/icons/delete_icon.png"
              />
            </ElButton>
          </div>
        </ElFormItem>
      </ElForm>

      <el-input v-model="filterText" placeholder="请输入" />

      <div
        class="scroll-p"
        :style="{ height: defaultHeight - (title ? 40 : 0) - 70 + 'px' }"
        :height="defaultHeight - (title ? 40 : 0) - 70 + 'px'"
      >
        <el-scrollbar>
          <ElTree
            ref="treeRef"
            :data="props.data"
            :empty-text="props.emptyText"
            highlight-current
            :expand-on-click-node="props.expandOnClickNode"
            :filter-node-method="filterNode"
            :default-expand-all="expendAll"
            @node-click="onNodeClick"
          />
          <!-- <div class="tree-main-scroll"> </div> -->
        </el-scrollbar>
      </div>
    </div>
    <div class="tree-main-hidden" v-show="!showLeft">
      <div class="expend-lr" v-if="isShowExpend" @click="showLeftChange()">
        <img v-if="showLeft" src="@/assets/imgs/icons/retract_icon.png" alt="" />
        <img v-else src="@/assets/imgs/icons/expand_icon.png" alt="" />
        <!-- <Icon icon="ep:arrow-left" class="mr-5px" v-if="showLeft" />
        <Icon icon="ep:arrow-right" class="mr-5px" v-else /> -->
      </div>
    </div>
    <div class="w-resize" ref="wResize" v-show="showLeft"></div>
    <Dialog
      v-model="optionData"
      class="option-tree-dialog"
      close-on-click-modal="false"
      width="40%"
      :title="treeTitle"
      @close="closeDrawer"
    >
      <Form :schema="schema" ref="formRef" class="form-content" />
      <template #footer>
        <div class="details-footer">
          <ElButton @click="closeDrawer"> 取消 </ElButton>
          <ElButton type="primary" :loading="addTreeLoading" @click="save"> 保存 </ElButton>
        </div>
      </template>
    </Dialog>
  </div>
</template>
<style lang="less">
.tree-container {
  background: #fff;
  position: relative;
  margin-right: 10px;
  .tree-main {
    padding: 16px 10px;
    min-width: 200px;
    width: 200px;
    .tree-main-scroll {
      height: 100%;
      overflow-y: scroll;
    }
  }
  .tree-main-hidden {
    position: absolute;
    left: -20px;
    width: 28px;
    height: 28px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 0.04rem;
  height: 0.16rem;
  background-color: #f5f5f5;
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.top-header {
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  margin-bottom: 5px;
  h3 {
    border-bottom: none;
  }
  .expend-lr {
    width: 28px;
    height: 28px;
  }
}
.expend-lr {
  // position: absolute;
  // top: 50%;
  // right: -20px;
  // transform: translate(-50%, -50%);
  cursor: pointer;
}
.button-tree {
  display: flex;
  justify-content: right;
  align-items: stretch;
  margin: 10px 0;
  // padding-right: 10px;
}
.but-content {
  width: 100%;
  text-align: right;
}
.option-tree-dialog {
  height: 330px !important;
}
</style>
