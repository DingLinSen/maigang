<script lang="tsx">
import { defineComponent, PropType, ref, computed, unref, watch, onMounted, nextTick } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElCheckboxGroup,
  ElCheckbox,
  ElMessage
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { propTypes } from '@/utils/propTypes'
import { getSlot } from '@/utils/tsxHelper'
import type { TableProps } from './types'
import { set } from 'lodash-es'
import { setIndex } from './helper'
import { TableColumn, TableSlotDefault, Pagination, TableSetPropsType } from '../../../types/table'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useCache } from '@/hooks/web/useCache'

import { saveWidthApi, editWidthApi } from '@/api/common'

export default defineComponent({
  name: 'Table',
  props: {
    //是否显示筛选列
    isShowFilter: propTypes.bool.def(true),
    //高度
    height: propTypes.number.def(0),
    //分页
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),
    //是否是被嵌套在Drawer页
    isDrawer: propTypes.bool.def(false),
    // 是否多选
    selection: propTypes.bool.def(true),
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: propTypes.bool.def(true),
    // 跨页选择内容
    chooseListAll: {
      type: Array,
      default: () => []
    },
    stripe: propTypes.bool.def(true),
    rowClassName: {
      type: String,
      default: ''
    },
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
    keyTable: {
      type: String,
      default: 'id'
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: propTypes.bool.def(false),
    // 加载状态
    loading: propTypes.bool.def(false),
    // 保存列宽加载
    // widthFlagLoading: propTypes.bool.def(false),
    // 是否叠加索引
    reserveIndex: propTypes.bool.def(true),
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
    },
    // 列宽列表
    widthList: {
      type: Object,
      default: () => {}
    },
    // 列宽数据
    widthData: {
      type: Object,
      default: () => {}
    },
    widthFlag: {
      type: String || Number,
      default: null
    },
    // 1-默认，2-原件
    widthType: propTypes.number.def(1),
    // 页面名称
    pageName: {
      type: String,
      default: ''
    },
    cellAlgin: {
      type: Object,
      default: () => {}
    },
    footerHeight: {
      type: Boolean,
      default: false
    },
    buttonShow: propTypes.bool.def(true)
  },
  emits: [
    'update:pageSize',
    'update:currentPage',
    'register',
    'update:selection',
    'sortChange',
    'widthChange'
  ],
  setup(props, { attrs, slots, emit, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()
    const { emitter } = useEmitt()
    const appStore = useAppStore()
    const { wsCache } = useCache()
    const userInfo = wsCache.get(appStore.getUserInfo)
    useEmitt({
      name: 'window',
      callback: (type: string) => {
        if (type === 'resize') {
          resetTableHeight()
        }
      }
    })
    // 展开、收起查询
    useEmitt({
      name: 'changeShowSearchCom',
      callback: (_: boolean) => {
        nextTick(() => {
          resetTableHeight()
        })
      }
    })
    // 列宽保存
    const widthSave = () => {
      const tableRef = unref(elTableRef)?.context?.refs?.tableHeaderRef
      const list: any = []
      tableRef?.columnRows[0].map((item: any) => {
        list.push({
          label: item.label,
          prop: item.property,
          type: item.type,
          width: item.width
        })
      })
      if (props.widthData && props.widthData.id) {
        editWidth(list)
      } else {
        saveWidth(list)
      }
    }
    // 列宽保存
    useEmitt({
      name: 'widthSaveChange',
      callback: (name: string) => {
        nextTick(() => {
          if (name === props.pageName) {
            widthSave()
          }
        })
      }
    })
    // 筛选列
    useEmitt({
      name: 'filterColumnsChange',
      callback: (val: any) => {
        nextTick(() => {
          if (val.pageName === props.pageName) {
            changeGroup(val.columns)
          }
        })
      }
    })
    // 筛选列全选
    useEmitt({
      name: 'allColumnsChange',
      callback: (val: any) => {
        nextTick(() => {
          if (val.pageName === props.pageName) {
            handleCheckAllChange(val.checked)
          }
        })
      }
    })
    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef)
      resetTableHeight()
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
    const selectionsListAll = ref<any>([])

    const selectionChange = (selection: Recordable[]) => {
      selections.value = selection
    }
    const selectAllChange = (selection) => {
      if (selection.length > 0) {
        selection.map((item) => {
          let row = unref(getProps).chooseListAll.find(
            (s: any) => s[props.keyTable] === item[props.keyTable]
          )
          if (!row) {
            unref(getProps).chooseListAll.push(item)
          }
        })
        selectionsListAll.value = unref(getProps).chooseListAll
      } else {
        props.data.map((item) => {
          let index = unref(getProps).chooseListAll.findIndex(
            (s: any) => s[props.keyTable] === item[props.keyTable]
          )
          if (index > -1) {
            unref(getProps).chooseListAll.splice(index, 1)
          }
        })
        selectionsListAll.value = unref(getProps).chooseListAll
      }
    }
    const selectChange = (_: Recordable[], row: any) => {
      let index = unref(getProps).chooseListAll.findIndex(
        (s: any) => s[props.keyTable] === row[props.keyTable]
      )
      if (index > -1) {
        unref(getProps).chooseListAll.splice(index, 1)
      } else {
        unref(getProps).chooseListAll.push(row)
      }
      selectionsListAll.value = unref(getProps).chooseListAll
      emit('update:selection', unref(getProps).chooseListAll)
    }

    const defaultHeight = ref<number>(0)

    const resetTableHeight = () => {
      // body高度
      var bodyHeight = document.body.offsetHeight
      //分页操作栏高度
      let paginationH: number = getPaginationHeight()
      //页面padding
      let paddingH = 40
      //搜索框加操作栏高度
      let topH: number = unref(getProps).isShowFilter ? getSearchWrapperHeight() : 0
      defaultHeight.value =
        bodyHeight - topH - paddingH - paginationH - 100 + 40 + (props.footerHeight ? paddingH : 0)
      // defaultHeight.value = 0
      // if (unref(getProps).height) {
      //   let checkboxHeight = getTableHeaderSwitchHeight()
      //   defaultHeight.value = unref(getProps).height - checkboxHeight
      // } else if (unref(getProps).isDrawer) {
      //   //页面padding
      //   let paddingH = 80
      //   //搜索框加操作栏高度
      //   let topH: number = getSearchWrapperHeight()
      //   //分页操作栏高度
      //   let paginationH: number = getPaginationHeight()
      //   let checkboxHeight = getTableHeaderSwitchHeight()
      //   nextTick(() => {
      //     //50 => drawer header的高度 ； 20 => drawer content 的padding
      //     defaultHeight.value =
      //       documentClientHeight.value - topH - paddingH - paginationH - 50 - 20 - checkboxHeight
      //   })
      // } else {
      //   //页面padding
      //   let paddingH = 80
      //   //搜索框加操作栏高度
      //   let topH: number = getSearchWrapperHeight()

      //   //底部高度
      //   let footerHeight = 0
      //   const footer = document.querySelector('.v-footer')
      //   if (footer) {
      //     footerHeight = footer.clientHeight
      //   }
      //   //
      //   let checkboxHeight = getTableHeaderSwitchHeight()
      //   //分页操作栏高度
      //   let paginationH: number = getPaginationHeight()
      //   let filterHeight: number = unref(getProps).buttonShow
      //     ? getFilterBtnHeight() + 10
      //     : getFilterBtnHeight()

      //   nextTick(() => {
      //     defaultHeight.value =
      //       documentClientHeight.value -
      //       footerHeight -
      //       topH -
      //       paddingH -
      //       paginationH -
      //       checkboxHeight -
      //       filterHeight -
      //       16
      //     // console.log('documentClientHeight.value', documentClientHeight.value, defaultHeight.value)
      //     // console.log('footerHeight.value', footerHeight)
      //     // console.log('topH', topH)
      //     // console.log('paddingH', paddingH)
      //     // console.log('paginationH', paginationH)
      //     // console.log('checkboxHeight', checkboxHeight)
      //   })
      // }
    }

    const getTableHeaderSwitchHeight = (): number => {
      let topH = 0
      // const checkboxWrapper = document.querySelector('.el-checkbox-group')
      // if (checkboxWrapper) {
      //   topH = topH + checkboxWrapper.clientHeight + 10
      // }
      return topH
    }

    const getSearchWrapperHeight = (): number => {
      //搜索框加操作栏高度
      let topH = 85
      const searchWrapper = document.querySelector('.search-container')
      if (searchWrapper) {
        topH = topH + searchWrapper.clientHeight
      }

      // const buttonWrapper = document.querySelector('.mb-10px')
      // if (buttonWrapper) {
      //   topH = topH + buttonWrapper.clientHeight
      // }
      return topH
    }
    const getFilterBtnHeight = (): number => {
      //搜索框加操作栏高度
      let topH = 0
      const filterBtn = document.querySelector('.filter-btn')
      if (filterBtn) {
        topH = filterBtn.clientHeight
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

    expose({
      setProps,
      setColumn,
      selections,
      elTableRef,
      selectionsListAll,
      getProps
    })

    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          background: false,
          pagerCount: 7,
          layout: '->, total, sizes, prev, pager, next, jumper',
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
      () => unref(getProps).chooseListAll,
      () => {
        selectionsListAll.value = unref(getProps).chooseListAll
      }
    )
    watch(
      () => unref(getProps).isShowFilter,
      () => {
        // console.log('isShowFilter', unref(getProps).isShowFilter)
      }
    )
    //所有表头集合
    let defaultColumnsArray: TableColumn[] = []

    defaultColumnsArray = unref(getProps).columns
    watch(
      () => unref(getProps).columns,
      () => {
        defaultColumnsArray = unref(getProps).columns
      }
    )

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...props }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })

    const renderTableSelection = () => {
      const { selection, reserveSelection, align, headerAlign } = unref(getProps)
      // 渲染多选
      return selection ? (
        <ElTableColumn
          type="selection"
          reserveSelection={reserveSelection}
          align={align}
          headerAlign={headerAlign}
          width="50"
        ></ElTableColumn>
      ) : undefined
    }

    const renderTableExpand = () => {
      const { align, headerAlign, expand } = unref(getProps)
      // 渲染展开行
      return expand ? (
        <ElTableColumn type="expand" align={align} headerAlign={headerAlign}>
          {{
            // @ts-ignore
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }

    const rnderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip } = unref(getProps)
      return columnsChildren.map((v) => {
        const props = { ...v }
        if (props.children) delete props.children
        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
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
      unref(getProps).columns.map((item: any) => {
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
                align={v.align || align}
                {...v}
                headerAlign={v.headerAlign || headerAlign}
                label={v.label}
                width="65px"
              >
                {{
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
                align={align}
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
    const crudSchemasGroup = ref<string[]>([])

    //所有表头集合 - 默认显示所有列
    const getAllColumnsName = () => {
      crudSchemasGroup.value = []
      unref(getProps).columns.map((item: Recordable) => {
        crudSchemasGroup.value.push(item.label)
      })
    }

    //获取所有表头集合
    getAllColumnsName()

    const checkAll = ref(true)
    const isIndeterminate = ref(false)
    //筛选列checkbox变化事件
    const changeGroup = (value: string[]) => {
      crudSchemasGroup.value = []

      crudSchemasGroup.value = [...value]
      nextTick(() => {
        unref(getProps).columns = []
        const columns: TableColumn[] = []
        defaultColumnsArray.map((item: TableColumn) => {
          const label: string = item.label ? item.label : ''
          if (value.length > 0 && value.indexOf(label) > -1) {
            item.table = { show: true }
            columns.push(item)
            unref(getProps).columns.push(item)
          } else {
            item.table = { show: false }
          }
        })
        // unref(getProps).columns = columns
        checkAll.value = columns.length === defaultColumnsArray.length
        isIndeterminate.value = columns.length > 0 && columns.length < defaultColumnsArray.length
        nextTick(() => {
          resetTableHeight()
        })
      })
    }
    // 筛选列全选
    const handleCheckAllChange = (val) => {
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

    const filterChange = () => {
      // console.log('filterChange', row)
    }
    const widthFlagLoading = ref<Boolean>(false)
    const sortChange = ({ column, prop, order }) => {
      emit('sortChange', { column, prop, order })
    }
    // 列宽新增
    const saveWidth = async (data: any) => {
      widthFlagLoading.value = true

      let widthContent =
        props.widthType === 1
          ? {
              original: [],
              default: data
            }
          : {
              original: data,
              default: []
            }
      const param = {
        flag: props.widthFlag,
        widthContent: JSON.stringify(widthContent)
      }
      const res: any = await saveWidthApi(param)
      if (res) {
        ElMessage.success('保存成功')
        widthFlagLoading.value = false
        emitter.emit('widthChange', props.pageName)
      }
    }
    // 列宽修改
    const editWidth = async (data: any) => {
      widthFlagLoading.value = true
      let widthContent =
        props.widthType === 1
          ? {
              original: props.widthList.original || [],
              default: data
            }
          : {
              original: data,
              default: props.widthList.default || []
            }
      const param = {
        ...props.widthData,
        widthContent: JSON.stringify(widthContent)
      }
      const res: any = await editWidthApi(param)
      if (res) {
        ElMessage.success('保存成功')
        widthFlagLoading.value = false
        emitter.emit('widthChange', props.pageName)
      }
    }
    return () => (
      <div v-loading={unref(getProps).loading}>
        {unref(getProps).buttonShow ? (
          <div class="filter-btn">
            <span>
              <>{slots.operateBtnLeft?.()}</>
            </span>
            <span>
              <>{slots.operateBtnRight?.()}</>
              <>{slots.filterColumns?.()}</>
              {props.widthFlag && userInfo.admin ? (
                <el-button
                  v-preventReClick
                  onClick={() => {
                    const tableRef = unref(elTableRef)?.context?.refs?.tableHeaderRef
                    const list: any = []
                    tableRef?.columnRows[0].map((item: any) => {
                      list.push({
                        label: item.label,
                        prop: item.property,
                        type: item.type,
                        width: item.width
                      })
                    })
                    if (props.widthData && props.widthData.id) {
                      editWidth(list)
                    } else {
                      saveWidth(list)
                    }
                  }}
                >
                  列宽保存
                </el-button>
              ) : (
                ''
              )}

              {unref(getProps).isShowFilter ? (
                <el-popover
                  placement="bottom"
                  title={''}
                  popper-class="filter-popover"
                  width="200"
                  trigger="click"
                >
                  {{
                    reference: () => (
                      <el-button type="warning" circle>
                        <el-tooltip content={'筛选列'}>
                          <Icon icon="ep:filter" />
                        </el-tooltip>
                      </el-button>
                    ),
                    default: () => (
                      <div style="max-height: 45vh;overflow-y: auto;">
                        <ElCheckbox
                          class="mb-10px"
                          v-model={checkAll.value}
                          indeterminate={isIndeterminate.value}
                          onChange={handleCheckAllChange}
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
            </span>
          </div>
        ) : (
          ''
        )}

        <ElTable
          // @ts-ignore
          ref={elTableRef}
          cell-style={unref(getProps).cellAlgin}
          header-cell-style={unref(getProps).cellAlgin}
          data={unref(getProps).data}
          rowClassName={unref(getProps).rowClassName}
          onSelection-change={selectionChange}
          onSelect={selectChange}
          onSelect-all={selectAllChange}
          onFilter-change={filterChange}
          stripe={unref(getProps).stripe}
          onSort-change={sortChange}
          {...unref(getBindValue)}
          height={unref(defaultHeight)}
        >
          {{
            default: () => {
              return rnderTableColumn()
            },
            // @ts-ignore
            append: () => getSlot(slots, 'append')
          }}
          {/* {renderTableExpand()}
          {renderTableSelection()}
          {unref(getProps).columns.map((item) =>
            item?.type === 'index' ? (
              <el-table-column
                type="index"
                index={
                  item.index
                    ? item.index
                    : (index) =>
                        setIndex(
                          unref(getProps).reserveIndex,
                          index,
                          unref(getProps).pageSize,
                          unref(getProps).currentPage
                        )
                }
                align={item.align || unref(getProps).align}
                {...item}
                headerAlign={item.headerAlign || unref(getProps).headerAlign}
                label={item.label}
                width="65px"
              ></el-table-column>
            ) : (
              <el-table-column
                showOverflowTooltip={unref(getProps).showOverflowTooltip}
                align={unref(getProps).align}
                headerAlign={unref(getProps).headerAlign}
                {...item}
                prop={item.field}
              >
                {{
                  default: (data: TableSlotDefault) => {
                    return item.children?.length
                      ? rnderTreeTableColumn(item.children)
                      : getSlot(slots, item.field, data) ||
                          item?.formatter?.(
                            data.row,
                            data.column,
                            data.row[item.field],
                            data.$index
                          ) ||
                          data.row[item.field]
                  },
                  header: () => getSlot(slots, `${item.field}-header`) || item.label
                }}
              </el-table-column>
            )
          )} */}
        </ElTable>
        {unref(getProps).pagination ? (
          <ElPagination
            v-model:pageSize={pageSizeRef.value}
            v-model:currentPage={currentPageRef.value}
            class="mt-10px"
            teleported={false}
            {...unref(pagination)}
          ></ElPagination>
        ) : undefined}
      </div>
    )
  }
})
</script>
<style lang="less">
.filter-btn {
  // text-align: right;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.filter-popover {
  .el-checkbox-group {
    .el-checkbox {
      display: block;
    }
  }
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 0.04rem;
  height: 10px;
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
  background-color: #409eff;
}

.el-table .el-scrollbar__bar.is-horizontal {
  height: 10px !important;
  text-align: left !important;
}

.el-table {
  .el-table__header-wrapper,
  .el-scrollbar__wrap {
    text-align: left;
  }

  .el-table__header-wrapper {
    th.el-table__cell {
      background: #f7f8fa;
      color: #111;
    }
  }

  .el-table__body {
    td {
      .cell {
        // white-space: normal;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 3;
        // -webkit-box-orient: vertical;
      }
    }
  }
}

.table-yellow-row {
  background-color: yellow !important;
  color: black;

  .el-table__cell {
    background-color: yellow !important;
  }
}

.table-red-row {
  background-color: red !important;
  color: #fff;

  .el-table__cell {
    background-color: red !important;
  }
}

.table-purple-row {
  background-color: #ed00b1 !important;
  color: #fff;

  .el-table__cell {
    background-color: #ed00b1 !important;
  }
}
</style>
