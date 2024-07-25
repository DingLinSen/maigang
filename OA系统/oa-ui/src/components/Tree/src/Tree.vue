<script setup lang='ts'>
// import { Form } from '@/components/Form'
import { PropType, computed, unref, ref, watch, provide } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElButton, ElTree, ElForm, ElFormItem, ElInput } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
// import { useForm } from '@/hooks/web/useForm'
import type { DeptTreeData } from '@/api/user/types'

import { FormSchema } from '@/types/form'
// import LineHeight from 'wangeditor/dist/menus/lineHeight'
import { string } from 'vue-types'

const { t } = useI18n()

const props = defineProps({
  // 生成Form的布局结构数组
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
  maxHeight: propTypes.number.def(500),
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
  placeholder: {
    type: String,
    default: ''
  },
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  data: {
    type: Array as PropType<Recordable[]>,
    default: () => []
  }
})

// 子传父事件
const emit = defineEmits(['tree', 'reset', 'allTreeData', 'onAllNodeClick'])

const treeRef = ref<InstanceType<typeof ElTree>>()

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

// 树节点过滤所需字段
const filterText = ref('')

// 树节点过滤
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

// const treedataList: DeptTreeData[] = props.data
// 点击重置按钮
const onAllNodeClick = (val: any) => {
  filterText.value = ''
  emit('allTreeData', val.id, val.label)
}

emit('onAllNodeClick', onAllNodeClick)
// 树节点点击事件
const onNodeClick = (val: any) => {
  emit('tree', val.id, val.label)

  // selections.value = selection
}

const opend = (val: any) => {
}

defineExpose({
  onAllNodeClick
})
</script>

<template>
  <ElForm v-on:submit.prevent>
    <ElFormItem style='margin-right: 0 !important;'>
      <div class='search-content'>
        <ElInput
          v-model='filterText'
          clearable
          :placeholder="placeholder ? placeholder : '搜索标签...'"
        >
          <template #prefix>
            <Icon :size='12' icon='svg-icon:search_icon' class='mr-5px' />
          </template>
        </ElInput>
        <div class='reset-icon' @click='onAllNodeClick({ id: null, label: null })'>
          <img class='icon' src='@/assets/imgs/sx_icon.png'
          /></div>
      </div>
    </ElFormItem>
  </ElForm>

  <ElTree
    ref='treeRef'
    class='tree departmentTree'
    :data='props.data'
    accordion
    node-key='id'
    :style="{ maxHeight: props.maxHeight - 100 + 'px' }"
    style='overflow: auto'
    icon='none'
    highlight-current
    :filter-node-method='filterNode'
    @node-click='onNodeClick'
  >
    <template #default='{ node, data }'>
      <span class='custom-tree-node'>
        <img
          :class="node.level === 1 ? 'level-one' : node.level === 2 ? 'level-two' : ''"
          style=''
          v-if='node.level === 1 || node.level === 2'
          @click='opend(node)'
          src='@/assets/imgs/yj_icon.png'
          alt=''
        />
        <img v-if='node.level > 2' @click='opend(node)' src='@/assets/imgs/ej_icon.png' alt='' />

        <span
          class='nodeLabel'
          :style="{
            fontFamily: node.level === 1 ? 'Alibaba PuHuiTi M' : 'Alibaba PuHuiTi R',
            fontWeight: node.level === 1 ? 500 : 400
          }"
        >{{ node.label }}</span
        >
        <span>
          <!-- <a @click="append(data)"> Append </a>
          <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a> -->
        </span>
      </span>
    </template>
  </ElTree>
</template>
<style lang='less' scoped>
:deep(.el-tree-node .is-current > .el-tree-node__content) {
  background-color: #f3f3f5 !important;
}


.search-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .reset-icon {
    cursor: pointer;
    margin-left: 5px;

    padding: 9px;
    background: #f9f9f9;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    // width: 34px;
    // height: 34px;
    .icon {
      width: 100%;
      height: 100%;
    }
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  font-size: 15px;
  padding-right: 8px;
  // line-height: 38px;

  .nodeLabel {
    padding-left: 7px;
  }
}

.level-one {
  width: 15px;
  height: 13px;
}

.level-two {
  width: 12px;
  height: 11px;
}

:deep(.el-input__wrapper) {
  padding: 2px 11px;
}

:deep(.el-input__wrapper) {
  padding: 2px 11px;
}

:deep(.el-tree-node__content) {
  line-height: 38px;
  height: auto;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f3f3f5;
}
</style>
