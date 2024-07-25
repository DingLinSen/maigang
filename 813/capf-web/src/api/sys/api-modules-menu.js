import httpRequest from '@/api/httpRequest'
import { API_MENU } from '@/api/sys/api-address-sys'

/**
 * 获取 Menu-列表数据
 * @param {*} params 请求参数
 */
export const initMenuList = params => {
  return httpRequest.$getList({
    url: API_MENU().BASE_LIST,
    // url: 'sysMenu/getMenuData', // 获取菜单列表的mock
    params: params
  })
}

/**
 * 获取 Menu-保存、编辑
 * @param {*} params 请求参数
 */
export const operateMenuInfo = (formData) => {
  return httpRequest.$request({
    url: formData.isOperate
      ? API_MENU().BASE_UPDATE
      : API_MENU().BASE_SAVE,
    method: formData.isOperate ? 'put' : 'post',
    data: formData
  })
}
/**
 * 获取 Menu-根据 id 获取详情信息
 * @param {*} params 请求参数 -- id
 */
export const initMenuDetailsById = ({ id }) => {
  return httpRequest.$get({
    url: API_MENU().BASE_DETAILS_INFO + '?id=' + id
  })
}

/**
 * 获取 Menu-根据 IDS 删除列表数据
 * @param {*} params 请求参数 ids
 */
export const deleteMenuByIds = ({ ids }) => {
  return httpRequest.$delete({
    url: API_MENU().BASE_DELETE + '?ids=' + ids
  })
}

/**
 * 获取 Menu-根据 roleId获取选中的菜单树
 * @param {*} params 请求参数
 */
export const initMenuTreeByRoleId = params => {
  return httpRequest.$get({
    url: API_MENU().BASE_MENU_BY_ROLE + '?id=' + params.id
  })
}
