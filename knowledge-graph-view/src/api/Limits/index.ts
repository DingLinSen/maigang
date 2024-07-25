// 权限接口
import request from '@/config/axios'

// 根据组件路径获取所有角色权限
export const getAllRoleMenuListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/knowledge-mapping/management/menu/getAllRoleMenu', params })
}
