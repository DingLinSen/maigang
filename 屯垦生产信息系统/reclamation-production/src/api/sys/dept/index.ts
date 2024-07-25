import request from '@/config/axios'
import type { TableData } from './types'
import { download } from '@/api/common'
import { service } from '@/config/axios/service'
import { ElMessage, ElLoading } from 'element-plus'
import { blobValidate } from '@/utils/downUtils'
import { saveAs } from 'file-saver'

// 获取列表数据
export const getTableListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/management/dept/list', params })
}
// 保存数据
export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/system/management/dept', data })
}
// 修改数据
export const updateTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.put({ url: '/system/management/dept', data })
}
// 根据ID获取数据
export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({ url: `/system/management/dept/${id}` })
}
// 删除列表数据
export const delTableListApi = (ids: string | number): Promise<IResponse> => {
  return request.delete({ url: `/system/management/dept/${ids}`, data: { ids } })
}
// let downloadLoadingInstance: any
// 导出
export const exportDeptListApi = (data: any) => {
  return download('/system/management/dept/exportDept', data, `部门_${new Date().getTime()}.xlsx`)
  // return request.post({ url: '/system/management/dept/exportDept', data })

  // downloadLoadingInstance = ElLoading.service({
  //   text: '正在下载数据，请稍候',
  //   background: 'rgba(0, 0, 0, 0.7)'
  // })
  // return service
  //   .post('/system/management/dept/exportDept', data, {
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     responseType: 'blob'
  //   })
  //   .then(async (data) => {
  //     const isBlob = blobValidate(data)
  //     if (isBlob) {
  //       const blob = new Blob([data.data])
  //       saveAs(blob, '部门管理.xlsx')
  //     }
  //     downloadLoadingInstance.close()
  //   })
  //   .catch((r) => {
  //     console.error(r)
  //     ElMessage.error('下载文件出现错误，请联系管理员！')
  //     downloadLoadingInstance.close()
  //   })
}
