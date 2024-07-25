import request from '@/config/axios'
import { downloadDoc } from '@/api/common'

//分页获取积分管理信息
export const getPointManageListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/apply/list', params })
}
//删除积分管理信息
export const delPointManageListApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-fraction/apply/remove?id=' + params })
}
//新增积分管理信息
export const savePointManageApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-fraction/apply/save', data })
}

//驳回编辑补充
export const editPointManageApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-fraction/apply/edit', data })
}
//根据id查询积分管理信息
export const getPointManageDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/apply/getById?id=' + id })
}
//审批-归档
export const auditPointManageApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-fraction/apply/audit', data })
}

//分页获取积分明细信息
export const getPointRecordListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/detail/list', params })
}
//根据id查询积分管理信息
export const getPointRecordDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/detail/getById?id=' + id })
}

//获取商城商品列表
export const getPointMarketListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/shop/list', params })
}
//根据id查询商品信息
export const getGoodsDetailApi = (id: string): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/shop/getById?id=' + id })
}
//编辑商品信息
export const editGoodsApi = (data: any): Promise<IResponse> => {
  return request.put({ url: '/oa-fraction/shop/edit', data })
}
//新增商品信息
export const savGoodsApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-fraction/shop/add', data })
}
//删除商品信息
export const delGoodsApi = (params: any): Promise<IResponse> => {
  return request.delete({ url: '/oa-fraction/shop/remove?id=' + params })
}
//兑换商品
export const exchangeGoodsApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/oa-fraction/shop/exchange', data })
}
//分页获取兑换信息
export const getExchangeListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/shop/exchangeList', params })
}
//兑换商品
export const buyOrReceiveGoodsApi = (params: any): Promise<IResponse> => {
  return request.post({ url: '/oa-fraction/shop/audit', params })
}
// 导出积分明细
export const exportPointRecordApi = (data: any) => {
  return downloadDoc(
    '/oa-fraction/detail/exportWord',
    data,
    `积分明细_${new Date().getTime()}.xlsx`
  )
}
//分页获取积分排行信息
export const getPoinRankListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/detail/ranking', params })
}
// 积分排行榜导出
export const exportPointRankApi = (data: any) => {
  let fileName = '积分排行榜'
  if (data.type == '1') {
    fileName = fileName + '_年度_' + new Date().getTime() + '.xlsx'
  } else if (data.type == '2') {
    fileName = fileName + '_季度_' + new Date().getTime() + '.xlsx'
  } else if (data.type == '3') {
    fileName = fileName + '_月度_' + new Date().getTime() + '.xlsx'
  } else {
    fileName = fileName + '_累计_' + new Date().getTime() + '.xlsx'
  }
  console.log('data.type==>', data.type)
  console.log('fileName==>', fileName)
  return downloadDoc(
    '/oa-fraction/detail/export',
    data,
    fileName
  )
}

//积分排行榜(首页 年度 前三加自己)
export const getPointRankHomeApi = (): Promise<IResponse> => {
  return request.get({ url: '/oa-fraction/detail/top' })
}


