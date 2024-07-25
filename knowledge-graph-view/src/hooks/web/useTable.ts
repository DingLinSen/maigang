import { Table, TableExpose } from '@/components/Table'
import { ElTable, ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, watch, computed, unref, nextTick } from 'vue'
import { get } from 'lodash-es'
import type { TableProps } from '@/components/Table/src/types'
import { useI18n } from '@/hooks/web/useI18n'
import { TableSetPropsType } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { setIndex } from '@/components/Table/src/helper'

const { t } = useI18n()
const { emitter } = useEmitt()
interface TableResponse<T = any> {
  total: number
  list: T[]
  pageNumber: number
  pageSize: number
}
interface UseTableConfig<T = any> {
  getListApi: (option: any) => Promise<IResponse<TableResponse<T>>>
  delListApi?: (option: any) => Promise<IResponse>
  // 返回数据格式配置
  response: {
    list: string
    total?: string
    key?: string
  }
  // 默认传递的参数
  defaultParams?: Recordable
  props?: TableProps
}
interface TableObject<T = any> {
  pageSize: number
  currentPage: number
  total: number
  tableList: T[]
  params: any
  headerAlign: string
  align: string
  loading: boolean
  currentRow: Nullable<T>
  data: any
}
export const useTable = <T = any>(config?: UseTableConfig<T>) => {
  const tableObject = reactive<TableObject<T>>({
    // 页数
    pageSize: config?.defaultParams?.pageSize || 10,
    // 当前页
    currentPage: 1,
    // 总条数
    total: 10,
    // 表格数据
    tableList: [],
    // 表头对齐方式
    headerAlign: 'center',
    // 单元格内容对齐方式
    align: 'center',
    // AxiosConfig 配置
    params: {
      ...(config?.defaultParams || {})
    },
    // 加载中
    loading: true,
    // 当前行的数据
    currentRow: null,
    data: null
  })
  const paramsObj = computed(() => {
    return {
      ...tableObject.params,
      pageSize: tableObject.pageSize,
      pageNum: tableObject.currentPage
    }
  })
  watch(
    () => tableObject.currentPage,
    () => {
      methods.getList()
    }
  )
  watch(
    () => tableObject.pageSize,
    () => {
      // 当前页不为1时，修改页数后会导致多次调用getList方法
      if (tableObject.currentPage === 1) {
        methods.getList()
      } else {
        tableObject.currentPage = 1
        methods.getList()
      }
    }
  )
  // Table实例
  const tableRef = ref<typeof Table & TableExpose>()
  // ElTable实例
  const elTableRef = ref<ComponentRef<typeof ElTable>>()
  watch(
    () => tableRef.value?.selectionsListAll,
    () => {
      if (tableRef.value?.selectionsListAll.length === 0) {
        elTableRef.value?.clearSelection()
      }
    }
  )
  const register = (ref: typeof Table & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
    tableRef.value = ref
    elTableRef.value = unref(elRef)
  }
  const getTable = async () => {
    await nextTick()
    const table = unref(tableRef)
    if (!table) {
      console.error('The table is not registered. Please use the register method to register')
    }
    return table
  }
  const delData = async (ids: string[] | number[], flag: boolean) => {
    let res
    if (flag) {
      res = await (config?.delListApi && config?.delListApi({ id: ids.toString() }))
    } else {
      res = await (config?.delListApi && config?.delListApi(ids.toString()))
    }
    emitter.emit('getList', 'del')
    if (res) {
      ElMessage.success(t('common.delSuccess'))
      // 计算出临界点
      const currentPage =
        tableObject.total % tableObject.pageSize === ids.length || tableObject.pageSize === 1
          ? tableObject.currentPage > 1
            ? tableObject.currentPage - 1
            : tableObject.currentPage
          : tableObject.currentPage
      tableObject.currentPage = currentPage
      methods.getList()
    }
  }
  const methods = {
    getList: async () => {
      tableObject.loading = true
      const res = await config?.getListApi(unref(paramsObj)).finally(() => {
        tableObject.loading = false
      })
      // if (res) {
      //   tableObject.tableList = get(res.data || {}, config?.response.list as string)
      //   tableObject.total = get(res.data || {}, config?.response?.total as string) || 0
      //   emitter.emit('tableList', 'refresh')
      // }
      if (res) {
        tableObject.data = res
        tableObject.tableList = get(res || {}, config?.response.list as string)
        tableObject.total = get(res || {}, config?.response?.total as string) || 0
        nextTick(() => {
          elTableRef.value?.clearSelection()
          tableObject.tableList?.map((item: any, index: number) => {
            item.sortIndexNumber = unref(paramsObj).noPage
              ? index + 1
              : setIndex(true, index, unref(paramsObj).pageSize, unref(paramsObj).pageNum)
            const d = tableRef.value?.selectionsListAll.find(
              (s: any) =>
                String(s[config?.response?.key || 'id']) ===
                String(item[config?.response?.key || 'id'])
            )
            setTimeout(() => {
              elTableRef.value?.toggleRowSelection(item, d ? true : false)
            }, 200)
          })
        })
      }
    },
    setProps: async (props: TableProps = {}) => {
      const table = await getTable()
      table?.setProps(props)
    },
    setColumn: async (columnProps: TableSetPropsType[]) => {
      const table = await getTable()
      table?.setColumn(columnProps)
    },
    getSelections: async () => {
      const table = await getTable()
      return (table?.selections || []) as T[]
    },
    // 与Search组件结合
    setSearchParams: (data: Recordable) => {
      tableObject.currentPage = 1
      tableObject.params = Object.assign(tableObject.params, {
        pageSize: tableObject.pageSize,
        pageNum: tableObject.currentPage,
        ...data
      })
      methods.getList()
    },
    // 删除数据
    delList: async (ids: string[] | number[], multiple: boolean, message = true, flag = false) => {
      const tableRef = await getTable()
      if (multiple) {
        if (!tableRef?.selections.length) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      } else {
        if (!tableObject.currentRow) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      }
      if (message) {
        ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
          confirmButtonText: t('common.delOk'),
          cancelButtonText: t('common.delCancel'),
          type: 'warning',
          autofocus: false
        }).then(async () => {
          await delData(ids, flag)
          emitter.emit('del', 'sure')
        })
      } else {
        await delData(ids, flag)
      }
    }
  }
  config?.props && methods.setProps(config.props)
  return {
    register,
    elTableRef,
    tableObject,
    methods
  }
}
