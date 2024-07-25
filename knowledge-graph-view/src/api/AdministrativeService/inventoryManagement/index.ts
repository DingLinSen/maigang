// 库存管理接口
import request from '@/config/axios'
import { downloadDoc } from '@/api/common'

// 物品新增
export const addTinfoGoods = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-administrative/tinfoGoods', data })
}

// 获取库存管理信息（无权限）
export const getAllTinfoGoodsList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoGoods/getAll', params })
}

// 获取库存管理信息
export const getTinfoGoodsList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoGoods', params })
}

// 根据id删除库存管理信息
export const deltinfoGoods = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-administrative/tinfoGoods?ids=' + params })
}

// 根据id获取详情信息
export const getDetailTinfoGoods = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoGoods/findById', params })
}

// 物品修改
export const editTinfoGoods = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-administrative/tinfoGoods', data })
}

// 获取物品列表
export const getGoodsList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoGoods/goodsList', params })
}

// 根据物品id获取历史详情信息
export const getDetailGoodsList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-administrative/tinfoGoods/findByGoodsId', params })
}

// 库存管理导出
export const exportTinfoGoodsListApi = (data: any) => {
  return downloadDoc(
    '/oa-administrative/tinfoGoods/excelOutPut',
    data,
    `库存管理_${new Date().getTime()}.xlsx`
  )
}
// 物品出入库历史记录数据导出
export const exportRecordGoodsListApi = (data: any) => {
  return downloadDoc(
    '/oa-administrative/tinfoGoods/exportRecord',
    data,
    `出入库管理${new Date().getTime()}.xlsx`
  )
}
