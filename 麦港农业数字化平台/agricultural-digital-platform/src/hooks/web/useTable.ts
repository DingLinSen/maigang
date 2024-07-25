import { ref, reactive, watch, computed, unref, nextTick } from 'vue'
import { ElTable, ElMessageBox, ElMessage } from 'element-plus'
import { Table, TableExpose } from '@/components/Table'
import type { TableProps } from '@/components/Table/src/types'

import { get } from 'lodash-es'

import { useI18n } from '@/hooks/web/useI18n'
import { TableSetPropsType } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { getWidthByFlagApi } from '@/api/common'

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
  exportListApi?: (option: any) => Promise<any>
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
interface CustomWidth<T = any> {
  widthData: any
  widthList: any
}

export const useTable = <T = any>(config?: UseTableConfig<T>) => {
  const tableObject = reactive<TableObject<T>>({
    // 页数
    pageSize: 10,
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

  const customWidth = reactive<CustomWidth<T>>({ widthData: null, widthList: null })

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
  /**
   * 改变字符串为标签样式
   * @param name
   * @returns {string}
   */
  const str2label = (name) => {
    let result = ''
    // 首字母小写执行标签化
    if (!name.charAt(0).match(/[A-Z]+/)) {
      // 根据大写字母进行分组
      const names = name.split(/[A-Z]+/)
      // 循环数组
      names.forEach((item, index) => {
        // 判断index>0时进行添加字母处理
        if (index > 0) {
          // 分组时干掉的字母位置
          let strlength = 0
          // 循环获得字母位置
          for (let i = index; i > 0; i--) {
            strlength += names[i - 1].length
          }
          // 从源字符串中截取字母
          const str = name.substring(strlength, strlength + 1)
          // 将字母添加到相应位置
          names[index] = str + item
          // 组合成相应标签格式
          result += '_' + names[index].toLowerCase()
        } else {
          // 数组第一个不用加下划线
          result = names[index].toLowerCase()
        }
      })
    } else {
      result = name.toLowerCase()
    }
    return result
  }
  // 使用orderByColumn字段排序
  const sortChange = (sort) => {
    if (sort.order) {
      if (sort.column.sortBy) {
        if (Array.isArray(sort.column.sortBy)) {
          const list: any = []
          sort.column.sortBy.map((ele) => {
            list.push((ele += ' desc'))
          })
          tableObject.params.orderByColumn =
            sort.order === 'descending' ? list.join(',') : sort.column.sortBy.join(',')
          paramsObj.value.orderByColumn =
            sort.order === 'descending' ? list.join(',') : sort.column.sortBy.join(',')
        } else {
          tableObject.params.orderByColumn =
            sort.order === 'descending' ? sort.column.sortBy + ' desc' : sort.column.sortBy
          paramsObj.value.orderByColumn =
            sort.order === 'descending' ? sort.column.sortBy + ' desc' : sort.column.sortBy
        }
      } else {
        tableObject.params.orderByColumn =
          sort.order === 'descending' ? str2label(sort.prop) + ' desc' : str2label(sort.prop)
        paramsObj.value.orderByColumn =
          sort.order === 'descending' ? str2label(sort.prop) + ' desc' : str2label(sort.prop)
      }
    } else {
      tableObject.params.orderByColumn = null
      paramsObj.value.orderByColumn = null
    }

    methods.getList()
  }
  // 嵌套params传参排序
  const sortChangeNew = (sort) => {
    if (sort.order) {
      if (sort.column.sortBy) {
        if (Array.isArray(sort.column.sortBy)) {
          const list: any = []
          sort.column.sortBy.map((ele) => {
            list.push((ele += ' desc'))
          })
          paramsObj.value.params.param =
            sort.order === 'descending' ? list.join(',') : sort.column.sortBy.join(',')
        } else {
          paramsObj.value.params.param =
            sort.order === 'descending' ? sort.column.sortBy + ' desc' : sort.column.sortBy
        }
      } else {
        paramsObj.value.params.param =
          sort.order === 'descending' ? str2label(sort.prop) + ' desc' : str2label(sort.prop)
      }
    } else {
      paramsObj.value.params.param = null
    }
    methods.getList()
  }
  // 无params传参排序
  const sortChangeNoParam = (sort) => {
    if (sort.order) {
      if (sort.column.sortBy) {
        if (Array.isArray(sort.column.sortBy)) {
          const list: any = []
          sort.column.sortBy.map((ele) => {
            list.push((ele += ' desc'))
          })
          paramsObj.value.param =
            sort.order === 'descending' ? list.join(',') : sort.column.sortBy.join(',')
        } else {
          paramsObj.value.param =
            sort.order === 'descending' ? sort.column.sortBy + ' desc' : sort.column.sortBy
        }
      } else {
        paramsObj.value.param =
          sort.order === 'descending' ? str2label(sort.prop) + ' desc' : str2label(sort.prop)
      }
    } else {
      paramsObj.value.param = null
    }
    methods.getList()
  }
  const getTable = async () => {
    await nextTick()
    const table = unref(tableRef)
    if (!table) {
      // console.error('The table is not registered. Please use the register method to register')
    }
    return table
  }

  const delData = async (ids: string[] | number[], data?: any) => {
    const res = await (config?.delListApi && config?.delListApi(data ? data : ids.toString()))
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
      emitter.emit('deleteSuccess', true)
    }
  }

  const methods = {
    getWidthByFlag: async (param) => {
      const res: any = await getWidthByFlagApi(param)
      if (res) {
        customWidth.widthData = res.data
        customWidth.widthList =
          res.data && res.data.widthContent ? JSON.parse(res.data.widthContent) : []
      }
    },
    getList: async () => {
      tableObject.loading = true
      if (unref(paramsObj).noPage) {
        delete unref(paramsObj).pageSize
        delete unref(paramsObj).pageNum
        delete unref(paramsObj).noPage
      }
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
          tableObject.tableList?.map((item: any) => {
            const d = tableRef.value?.selectionsListAll.find(
              (s: any) => s[config?.response?.key || 'id'] === item[config?.response?.key || 'id']
            )
            elTableRef.value?.toggleRowSelection(item, d ? true : false)
          })
        })
      }
    },
    exportList: async (param) => {
      tableObject.loading = true
      if (unref(paramsObj).noPage) {
        delete unref(paramsObj).pageSize
        delete unref(paramsObj).pageNum
        delete unref(paramsObj).noPage
      }
      if (tableObject.tableList.length === 0) {
        ElMessage.warning('查询无数据, 无需导出数据')
        return
      }
      tableObject.loading = true
      await (config?.exportListApi &&
        config?.exportListApi(param).finally(() => {
          tableObject.loading = false
          elTableRef.value?.clearSelection()
        }))
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
      if (data.params) {
        data.params.param = paramsObj.value.params?.param || paramsObj.value.param
      } else {
        data.param = paramsObj.value.param
      }

      tableObject.currentPage = 1
      tableObject.params = Object.assign(tableObject.params, {
        pageSize: tableObject.pageSize,
        pageNum: tableObject.currentPage,
        ...data
      })
      methods.getList()
    },
    // 删除数据
    delList: async (ids: string[] | number[], multiple: boolean, message = true) => {
      const tableRef = await getTable()

      if (multiple) {
        if (!tableRef?.selections.length) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      } else {
        elTableRef.value?.clearSelection()
        if (!tableObject.currentRow) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      }
      if (message) {
        ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
          confirmButtonText: t('common.delOk'),
          cancelButtonText: t('common.delCancel'),
          autofocus: false,
          type: 'warning'
        }).then(async () => {
          await delData(ids)
        })
      } else {
        await delData(ids)
      }
    },
    // 删除数据
    deleteList: async (data: any, multiple: boolean, message = true) => {
      const tableRef = await getTable()

      if (multiple) {
        if (!tableRef?.selections.length) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      } else {
        elTableRef.value?.clearSelection()
        if (!tableObject.currentRow) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      }
      if (message) {
        ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
          confirmButtonText: t('common.delOk'),
          cancelButtonText: t('common.delCancel'),
          autofocus: false,
          type: 'warning'
        }).then(async () => {
          await delData(data.ids, data)
        })
      } else {
        await delData(data.ids, data)
      }
    }
  }

  config?.props && methods.setProps(config.props)

  return {
    register,
    sortChange,
    sortChangeNew,
    sortChangeNoParam,
    elTableRef,
    tableObject,
    methods,
    customWidth
  }
}
