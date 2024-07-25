<script lang="tsx">
import { ElTree, ElTableColumn, ElInput, ElPagination, ElForm, ElFormItem } from 'element-plus'
import { defineComponent, PropType, ref, computed, unref, watch, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { setIndex } from './helper'
import { getSlot } from '@/utils/tsxHelper'
import type { TableProps } from './types'
import { set } from 'lodash-es'
import { TableColumn, TableSlotDefault, Pagination, TableSetPropsType } from '../../../types/table'
import { log } from 'console'

export default defineComponent({
  name: 'Tree',
  props: {
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),
    // table 高度
    height: propTypes.number.def(500),
    // 是否多选
    selection: propTypes.bool.def(true),
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: propTypes.bool.def(true),
    // 表头
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    // 展开行
    expand: propTypes.bool.def(false),
    // 是否展示分页
    pagination: {
      type: Object as PropType<Pagination>,
      default: (): Pagination | undefined => undefined
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: propTypes.bool.def(false),
    // 加载状态
    loading: propTypes.bool.def(false),
    // 是否叠加索引
    reserveIndex: propTypes.bool.def(false),
    // 对齐方式
    align: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    // 表头对齐方式
    headerAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    }
  },
  emits: ['update:pageSize', 'update:currentPage', 'register'],
  setup(props, { attrs, slots, emit, expose }) {
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

    const treedata: Tree[] = [
      {
        id: 1,
        label: '济南分公司',
        children: [
          {
            id: 4,
            label: '研发部门',
            children: [
              {
                id: 9,
                label: '前端'
              },
              {
                id: 10,
                label: '后端'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '深圳分公司',
        children: [
          {
            id: 5,
            label: 'Level two 2-1'
          },
          {
            id: 6,
            label: 'Level two 2-2'
          }
        ]
      },
      {
        id: 3,
        label: 'Level one 3',
        children: [
          {
            id: 7,
            label: 'Level two 3-1'
          },
          {
            id: 8,
            label: 'Level two 3-2'
          }
        ]
      }
    ]

    watch(filterText, (val) => {
      console.log(treeRef)

      treeRef.value!.filter(val)
    })
    // 注册
    onMounted(() => {
      const tableRef = unref(treeRef)
      emit('register', tableRef?.$parent, treeRef)
    })

    const defaultProps = {
      children: 'children',
      label: 'label'
    }
    const onNodeClick = (val: any) => {
      console.log(1)

      console.log(val)

      // selections.value = selection
    }

    expose({})

    return () => (
      <div>
        <ElForm>
          <ElFormItem>
            <ElInput v-model={filterText.value} placeholder="请输入部门名称"></ElInput>
          </ElFormItem>
        </ElForm>

        <ElTree
          // @ts-ignore
          ref={treeRef}
          data={unref(treedata)}
          filter-node-method={filterNode}
          node-click={onNodeClick}
        >
          {/* {{
            default: () => rnderTableColumn(),
            // @ts-ignore
            append: () => getSlot(slots, 'append')
          }} */}
        </ElTree>
      </div>
    )
  }
})
</script>
