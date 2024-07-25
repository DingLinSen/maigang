const moduleHttp = window.SITE_CONFIG.baseUrl // 模块服务路径
/**
 * User -系统管理--用户 - API
 * @type ALL IS String
 */
export const API_USER = () => {
  const BASE = 'system/sysUser'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList',
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById',
      BASE_UPDATE: moduleHttp + BASE + '/update',
      BASE_SAVE: moduleHttp + BASE + '/save',
      BASE_DELETE: moduleHttp + BASE + '/delete',
      BASE_PASSWORD: moduleHttp + BASE + '/updatePassword', // 修改密码
      BASE_STATUS: moduleHttp + BASE + '/updateStatus' // 启用
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/excel',
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/download',
      LIST_UPLOAD_URL: moduleHttp + BASE + '/upload'
    }
  )
}

/**
 * Menu - 系统管理--菜单 - API
 * @type ALL IS String
 */
export const API_MENU = () => {
  const BASE = 'system/sysMenu'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getTree', // 获取树
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById',
      BASE_UPDATE: moduleHttp + BASE + '/update',
      BASE_SAVE: moduleHttp + BASE + '/save',
      BASE_DELETE: moduleHttp + BASE + '/delete',
      BASE_MENU_BY_ROLE: moduleHttp + BASE + '/queryMenuByRoleId' // 根据角色id获取树
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/excel',
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/download',
      LIST_UPLOAD_URL: moduleHttp + BASE + '/upload'
    }
  )
}

/**
 * Role -系统管理--角色 - API
 * @type ALL IS String
 */
export const API_ROLE = () => {
  const BASE = 'system/sysRole'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList',
      BASE_LIST_SEARCH: moduleHttp + BASE + '/findEnableRole', // 查询可用的角色
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById',
      BASE_UPDATE: moduleHttp + BASE + '/update',
      BASE_SAVE: moduleHttp + BASE + '/save',
      BASE_DELETE: moduleHttp + BASE + '/delete'
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/excel',
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/download',
      LIST_UPLOAD_URL: moduleHttp + BASE + '/upload'
    }
  )
}

/**
 * roleBlock -系统管理--角色获取区块相关信息 - API
 * @type ALL IS String
 */
export const API_BLOCK = () => {
  const BASE = 'system/sysRoleBlock'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/queryBlockList', // 查询所有的区块 flag =1 种植 flag =2 养殖
      BASE_DETAILS_INFO: moduleHttp + BASE + '/queryBlockByRoleId' // 根据角色id查询区块
    }
  )
}

/**
 * Log - 系统日志表 - API对象
 * @description 系统日志表 模块下的所有API对象
 */
export const API_LOG = () => {
  const BASE = 'system/sysLog'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList',
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById',
      BASE_UPDATE: moduleHttp + BASE + '/update',
      BASE_SAVE: moduleHttp + BASE + '/save',
      BASE_DELETE: moduleHttp + BASE + '/delete'
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/excel',
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/download',
      LIST_UPLOAD_URL: moduleHttp + BASE + '/upload'
    }
  )
}

/**
 * Bulkimportlog - 批量导入日志表 - API对象
 * @description 批量导入日志表 模块下的所有API对象
 */
export const API_BULKIMPORTLOG = () => {
  const BASE = 'sys/bulkimportlog'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList',
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById',
      BASE_UPDATE: moduleHttp + BASE + '/update',
      BASE_SAVE: moduleHttp + BASE + '/save',
      BASE_DELETE: moduleHttp + BASE + '/delete'
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/excel',
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/download',
      LIST_UPLOAD_URL: moduleHttp + BASE + '/upload'
    }
  )
}
/**
 * dept -系统管理--部门管理 - API
 * @type ALL IS String
 */
export const API_DEPT = () => {
  const BASE = 'system/sysDept'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList',
      BASE_LIST_All: moduleHttp + BASE + '/listAll',
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById',
      BASE_UPDATE: moduleHttp + BASE + '/update',
      BASE_SAVE: moduleHttp + BASE + '/save',
      BASE_DELETE: moduleHttp + BASE + '/delete'
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/excel',
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/download',
      LIST_UPLOAD_URL: moduleHttp + BASE + '/upload'
    }
  )
}
/**
 * safe -系统管理--安全设置 - API
 * @type ALL IS String
 */
export const API_SAFE = () => {
  const BASE = 'system/sysSafe'
  return Object.assign(
    {
      BASE_LIST: moduleHttp + BASE + '/getByList',
      BASE_DETAILS_INFO: moduleHttp + BASE + '/findById',
      BASE_UPDATE: moduleHttp + BASE + '/update',
      BASE_SAVE: moduleHttp + BASE + '/save',
      BASE_DELETE: moduleHttp + BASE + '/delete'
    },
    {
      LIST_EXPORT_URL: moduleHttp + BASE + '/excel',
      LIST_DOWNLOAD_URL: moduleHttp + BASE + '/download',
      LIST_UPLOAD_URL: moduleHttp + BASE + '/upload'
    }
  )
}
