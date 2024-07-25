<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElTree, ElForm, ElFormItem, ElInput } from 'element-plus'
import { FormSchema } from '@/types/form'

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

// 子传父事件
const emit = defineEmits(['tree', 'reset', 'isShowLeftChange'])
const treeRef = ref<InstanceType<typeof ElTree>>()

interface Tree {
  id: number
  label: string
  children?: Tree[]
}
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

      <ElForm>
        <ElFormItem />
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
</style>
