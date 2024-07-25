<script lang="tsx">
import { ElTable, ElTableColumn, ElPagination, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { defineComponent, PropType, ref, computed, unref, watch, onMounted, nextTick } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { setIndex } from './helper'
import { getSlot } from '@/utils/tsxHelper'
import type { TableProps } from './types'
import { set } from 'lodash-es'
import { TableColumn, TableSlotDefault, Pagination, TableSetPropsType } from '../../../types/table'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Icon } from '@/components/Icon'

export default defineComponent({
  name: 'Table',
  props: {
    // 是否显示表格
    isShowTable:{
      type:Boolean,
      default:true
    },
     // 是否显示表头
    showHeader:{
      type:Boolean,
      default:true
    },
    //是否显示筛选列
    isShowFilter: propTypes.bool.def(true),
    //是否显示筛选列
    isShowCell: propTypes.bool.def(false),
    //高度
    height: propTypes.number,
    //分页
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),
    //是否是被嵌套在Drawer页
    isDrawer: propTypes.bool.def(false),
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
    // 跨页选择内容
    chooseListAll: {
      type: Array,
      default: () => []
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: propTypes.bool.def(false),
    // 加载状态
    loading: propTypes.bool.def(false),
    // 是否叠加索引
    reserveIndex: propTypes.bool.def(false),
    // 对齐方式
    // align: propTypes.string
    //   .validate((v: string) => ['left', 'center', 'right'].includes(v))
    //   .def('left'),
    // 内容对齐
    cotentAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    // 表头对齐方式
    headerAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    cellAlgin: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['update:pageSize', 'update:currentPage', 'register','selectionChange'],
  setup(props, { attrs, slots, emit, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()

    const appStore = useAppStore()

    useEmitt({
      name: 'window',
      callback: (type: string) => {
        if (type === 'resize') {
          resetTableHeight()
        }
      }
    })

    // 注册
    onMounted(() => {
      resetTableHeight()
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef)
    })

    const documentClientHeight = computed(() => appStore.getDocumentClientHeight)

    const pageSizeRef = ref(props.pageSize)

    const currentPageRef = ref(props.currentPage)

    // useTable传入的props
    const outsideProps = ref<TableProps>({})

    const mergeProps = ref<TableProps>({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = props
    }

    const setColumn = (columnProps: TableSetPropsType[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const selections = ref<Recordable[]>([])

    const selectionChange = (selection: Recordable[]) => {
      selections.value = selection
      emit('selectionChange',selections.value)
    }
    const selectAllChange = (selection) => {
      if (selection.length > 0) {
        selection.map((item) => {
          let row = unref(getProps).chooseListAll.find((s: any) => s.id === item.id)
          if (!row) {
            unref(getProps).chooseListAll.push(item)
          }
        })
      } else {
        props.data.map((item) => {
          let index = unref(getProps).chooseListAll.find((s: any) => s.id === item.id)
          if (index) {
            unref(getProps).chooseListAll.splice(index, 1)
          }
        })
      }
    }
    const selectChange = (selection: Recordable[], row: any) => {
      let index = unref(getProps).chooseListAll.find((s: any) => s.id === row.id)
      if (index) {
        unref(getProps).chooseListAll.splice(index, 1)
      } else {
        unref(getProps).chooseListAll.push(row)
      }
    }
    const defaultHeight = ref<number>(0)

    const resetTableHeight = () => {
      defaultHeight.value = 0
      if (unref(getProps).height) {
        unref(getProps).height
        //页面padding
        let paddingH = 40
        //搜索框加操作栏高度
        let topH: number = getSearchWrapperHeight()
        //分页操作栏高度
        let paginationH: number = getPaginationHeight()
        // let checkboxHeight = getTableHeaderSwitchHeight()
        nextTick(() => {
          //50 => drawer header的高度 ； 20 => drawer content 的padding

          defaultHeight.value = unref(getProps).height - topH - paddingH - paginationH + 50
        })
        // let checkboxHeight = getTableHeaderSwitchHeight()
        // defaultHeight.value = unref(getProps).height - checkboxHeight
      } else if (unref(getProps).isDrawer) {
        //页面padding
        let paddingH = 80
        //搜索框加操作栏高度
        let topH: number = getSearchWrapperHeight()
        //分页操作栏高度
        let paginationH: number = getPaginationHeight()
        // let checkboxHeight = getTableHeaderSwitchHeight()
        nextTick(() => {
          //50 => drawer header的高度 ； 20 => drawer content 的padding
          defaultHeight.value = documentClientHeight.value - topH - paddingH - paginationH - 50 - 20
        })
      } else {
        //页面padding
        let paddingH = 74
        //搜索框加操作栏高度
        let topH: number = getSearchWrapperHeight()
        //底部高度
        let footerHeight = 0
        const footer = document.querySelector('.v-footer')
        if (footer) {
          footerHeight = footer.clientHeight
        }
        //
        // let checkboxHeight = getTableHeaderSwitchHeight()
        //分页操作栏高度
        let paginationH: number = getPaginationHeight()
        nextTick(() => {
          defaultHeight.value =
            documentClientHeight.value - footerHeight - topH - paddingH - paginationH
        })
      }
    }
    const getTableHeaderSwitchHeight = (): number => {
      let topH = 0
      const checkboxWrapper = document.querySelector('.el-checkbox-group')
      if (checkboxWrapper) {
        topH = topH + checkboxWrapper.clientHeight + 10
      }
      return topH
    }

    const getSearchWrapperHeight = (): number => {
      //搜索框加操作栏高度
      let topH = 85
      const searchWrapper = document.querySelector('.searchWrapper')
      if (searchWrapper) {
        topH = topH + searchWrapper.clientHeight
      }
      const buttonWrapper = document.querySelector('.filter-btn')
      if (buttonWrapper) {
        topH = topH + buttonWrapper.clientHeight
      }
      return topH
    }

    const getPaginationHeight = (): number => {
      //搜索框加操作栏高度
      let paginationH = 15
      if (unref(getProps).pagination) {
        paginationH = 60
      }
      return paginationH
    }
    //筛选列
    //所有表头集合
    const crudSchemasGroup = ref<string[]>([])

    //所有表头集合 - 默认显示所有列
    const getAllColumnsName = () => {
      crudSchemasGroup.value = []
      unref(getProps).columns.map((item: Recordable) => {
        crudSchemasGroup.value.push(item.label)
      })
    }

    //获取所有表头集合
    // getAllColumnsName()

    expose({
      getAllColumnsName,
      setProps,
      setColumn,
      selections,
      elTableRef
    })

    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          background: false,
          pagerCount: 7,
          layout: '->,total,sizes, prev, pager, next, jumper ',
          pageSizes: [10, 20, 30, 40, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 10
        },
        unref(getProps).pagination
      )
    })

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )

    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val
      }
    )

    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val)
      }
    )

    watch(
      () => unref(getProps).height,
      () => {
        resetTableHeight()
      }
    )
    watch(
      () => unref(getProps).isShowFilter,
      () => {}
    )
    watch(
      () => unref(getProps).isShowCell,
      () => {
        setTimeout(() => {
          resetTableHeight()
        }, 100)
      }
    )

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...props }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })

    const renderTableSelection = () => {
      const { selection, reserveSelection, cotentAlign, headerAlign } = unref(getProps)
      // 渲染多选
      return selection ? (
        <ElTableColumn
          type="selection"
          reserveSelection={reserveSelection}
          align={cotentAlign}
          headerAlign={headerAlign}
          width="50"
        ></ElTableColumn>
      ) : undefined
    }

    const renderTableExpand = () => {
      const { align, cotentAlign, headerAlign, expand } = unref(getProps)
      // 渲染展开行
      return expand ? (
        <ElTableColumn type="expand" align={cotentAlign} headerAlign={headerAlign}>
          {{
            // @ts-ignore
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }

    const rnderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, cotentAlign, headerAlign, showOverflowTooltip } = unref(getProps)
      return columnsChildren.map((v) => {
        const props = { ...v }
        if (props.children) delete props.children
        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={cotentAlign}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
          >
            {{
              default: (data: TableSlotDefault) =>
                v.children && v.children.length
                  ? rnderTableColumn(v.children)
                  : // @ts-ignore
                    getSlot(slots, v.field, data) ||
                    v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                    data.row[v.field],
              // @ts-ignore
              header: getSlot(slots, `${v.field}-header`)
            }}
          </ElTableColumn>
        )
      })
    }
    const initColumnList = () => {
      const columns: TableColumn[] = []
      unref(getProps).columns.map((item: TableColumn) => {
        if (crudSchemasGroup.value.includes(item.label)) {
          columns.push(item)
        }
      })
      unref(getProps).columns = columns
    }
    const rnderTableColumn = (columnsChildren?: TableColumn[]) => {
      initColumnList()
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        cotentAlign,
        headerAlign,
        showOverflowTooltip
      } = unref(getProps)
      return [...[renderTableExpand()], ...[renderTableSelection()]].concat(
        (columnsChildren || columns).map((v) => {
          // 自定生成序号
          if (v.type === 'index') {
            return (
              <ElTableColumn
                type="index"
                index={
                  v.index
                    ? v.index
                    : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
                }
                align={v.cotentAlign || cotentAlign}
                headerAlign={v.headerAlign || headerAlign}
                label={v.label}
                width="65px"
              >{{
                  default: (data: TableSlotDefault) =>
                    v.index ? v.index : setIndex(reserveIndex, data.$index, pageSize, currentPage)
                }}
              </ElTableColumn>
            )
          } else {
            const props = { ...v }
            if (props.children) delete props.children
            return (
              <ElTableColumn
                showOverflowTooltip={showOverflowTooltip}
                align={cotentAlign}
                headerAlign={headerAlign}
                {...props}
                prop={v.field}
              >
                {{
                  default: (data: TableSlotDefault) =>
                    v.children && v.children.length
                      ? rnderTreeTableColumn(v.children)
                      : // @ts-ignore
                        getSlot(slots, v.field, data) ||
                        v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                        data.row[v.field],
                  // @ts-ignore
                  header: () => getSlot(slots, `${v.field}-header`) || v.label
                }}
              </ElTableColumn>
            )
          }
        })
      )
    }

    //筛选列
    //所有表头集合

    //所有表头集合 - 默认显示所有列

    //获取所有表头集合
    getAllColumnsName()
    let defaultColumnsArray: TableColumn[] = []
    defaultColumnsArray = unref(getProps).columns
    const checkAll = ref(true)
    const isIndeterminate = ref(false)
    //checkbox变化事件
    const changeGroup = (value: string[]) => {
      crudSchemasGroup.value = value
      nextTick(() => {
        const columns: TableColumn[] = []
        defaultColumnsArray.map((item: TableColumn) => {
          const label: string = item.label ? item.label : ''
          if (value.length > 0 && value.indexOf(label) > -1) {
            item.table = { show: true }
            columns.push(item)
          } else {
            item.table = { show: false }
          }
        })
        unref(getProps).columns = columns
        checkAll.value = columns.length === defaultColumnsArray.length
        isIndeterminate.value = columns.length > 0 && columns.length < defaultColumnsArray.length
        nextTick(() => {
          resetTableHeight()
        })
      })
    }



    // 筛选列全选
    const handleCheckAllChange = (val: any) => {
      isIndeterminate.value = false
      crudSchemasGroup.value = []
      nextTick(() => {
        const columns: TableColumn[] = []
        defaultColumnsArray.map((item: TableColumn) => {
          const label: string = item.label ? item.label : ''
          item.table = { show: val }
          if (val) {
            crudSchemasGroup.value.push(label)
            columns.push(item)
          } else {
            // if (item.type === 'index') {
            //   crudSchemasGroup.value.push(label)
            //   columns.push(item)
            // }
          }
        })

        unref(getProps).columns = columns
        nextTick(() => {
          if (val) {
            resetTableHeight()
          }
        })
      })
    }

    return () => (
      <div v-loading={unref(getProps).loading}>
        <div class="filter-btn">
          <div>
            <>{slots.operateBtnLeft?.()}</>
          </div>
          <div>
            <>{slots.operateBtnRight?.()}</>

            <>{slots.filterColumns?.()}</>
            {unref(getProps).isShowFilter ? (
              <el-popover
                placement="bottom"
                title="筛选列"
                popper-class="filter-popover"
                width="200"
                trigger="click"
              >
                {{
                  reference: () => (
                    <ElButton type="" style="padding: 10px !important; margin-bottom: 18px;">
                      <Icon  icon="svg-icon:screen" />
                    </ElButton>
                  ),
                  default: () => (
                    <div>
                      <ElCheckbox
                        v-model={checkAll.value}
                        indeterminate={isIndeterminate.value}
                        onChange={handleCheckAllChange}
                        style="display: block;"
                      >
                        全选
                      </ElCheckbox>
                      <ElCheckboxGroup
                        modelValue={crudSchemasGroup.value}
                        onChange={changeGroup}
                        min={0}
                        class="mb-10px"
                      >
                        {defaultColumnsArray.map((item: Recordable, index: number) => (
                          <ElCheckbox key={index} modelValue={item.field} label={item.label} />
                        ))}
                      </ElCheckboxGroup>
                    </div>
                  )
                }}
              </el-popover>
            ) : (
              ''
            )}
            <>{slots.icon?.()}</>
          </div>
          
        </div>
        {unref(getProps).showHeader ? undefined : <div class="w-full h-[1px]" style="background: #ebeef5;" ></div>}
        
        <div>
            <>{slots.filesTop?.()}</>
        </div>
        {unref(getProps).isShowTable ? (
          <ElTable
          // @ts-ignore
          ref={elTableRef}
          cell-style={unref(getProps).cellAlgin}
          header-cell-style={unref(getProps).cellAlgin}
          data={unref(getProps).data}
          onSelection-change={selectionChange}
          {...unref(getBindValue)}
          height={unref(defaultHeight) || unref(getProps).height}
        >
          {{
            default: () => rnderTableColumn(),
            // @ts-ignore
            append: () => getSlot(slots, 'append')
          }}
        </ElTable>
        ) : <div style={{height:unref(defaultHeight)+'px' || unref(getProps).height+'px'}}>
              <>{slots.grid?.()}</>
            </div>}
        {unref(getProps).pagination ? (
          <ElPagination
            v-model:pageSize={pageSizeRef.value}
            v-model:currentPage={currentPageRef.value}
            class="mt-10px"
            {...unref(pagination)}
          ></ElPagination>
        ) : undefined}
      </div>
    )
  }
})
</script>
<style lang="less" scoped>
.filter-btn {
  display: flex;
  justify-content: space-between;
  // text-align: right;
  // margin-bottom: 10px;
}
.filter-popover {
  .el-checkbox-group {
    .el-checkbox {
      display: block;
    }
  }
}
:deep(.el-pager li.is-active) {
  color: #fff;
  background-color: var(--el-pagination-hover-color);
}
:deep(.el-popper) {
  max-width: 500px;
}
:deep(.el-table th.el-table__cell .cell) {
  // padding-top: 15px;
  // padding-bottom: 18px;
  font-size: 15px !important;
  font-family: 'Alibaba PuHuiTi R' !important;
}
:deep(.el-loading-mask) {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
:deep(.el-input__wrapper) {
  padding: 3px 11px;
  box-sizing: content-box;
}
</style>
