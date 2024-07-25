import Mock from 'mockjs'
Mock.XHR.prototype.withCredentials = true
// 生成数据列表
var dataList = [
  // {
  //   menuId: 9,
  //   parentId: 0,
  //   parentName: null,
  //   name: '首页',
  //   url: '/home',
  //   perms: null,
  //   type: 0,
  //   icon: 'system',
  //   orderNum: 0,
  //   open: null,
  //   list: null
  // },
  {
    menuId: 8,
    parentId: 0,
    parentName: '代码生成',
    name: '代码生成',
    url: 'sys/generate',
    perms: null,
    type: 1,
    icon: 'nav_icon2',
    orderNum: 3,
    open: null,
    list: null
  },
  {
    menuId: 1,
    parentId: 0,
    parentName: null,
    name: '系统管理',
    url: null,
    perms: null,
    type: 0,
    icon: 'nav_icon11',
    orderNum: 0,
    open: null,
    list: null
  },
  {
    menuId: 10,
    parentId: 0,
    parentName: '',
    name: '信息管理',
    url: '',
    perms: null,
    type: 0,
    icon: 'list_icon9',
    orderNum: 0,
    open: null,
    list: null
  },
  {
    menuId: 11,
    parentId: 10,
    parentName: '',
    name: '资料管理',
    url: 'info/resource',
    perms: null,
    type: 0,
    icon: 'menu',
    orderNum: 1,
    open: null,
    list: null
  },
  {
    menuId: 12,
    parentId: 10,
    parentName: '',
    name: '课目管理',
    url: 'info/subject',
    perms: null,
    type: 0,
    icon: 'menu',
    orderNum: 5,
    open: null,
    list: null
  },
  {
    menuId: 20,
    parentId: 0,
    parentName: '',
    name: '训练计划',
    url: '',
    perms: null,
    type: 0,
    icon: 'list_icon9',
    orderNum: 0,
    open: null,
    list: null
  },
  {
    menuId: 21,
    parentId: 20,
    parentName: '',
    name: '训练大纲',
    url: 'train/trainProgram',
    perms: null,
    type: 0,
    icon: 'menu',
    orderNum: 1,
    open: null,
    list: null
  },
  {
    menuId: 9,
    parentId: 1,
    parentName: '系统管理',
    name: '部门管理',
    url: 'sys/dept',
    perms: null,
    type: 1,
    icon: 'menu',
    orderNum: 3,
    open: null,
    list: null
  },
  {
    menuId: 7,
    parentId: 1,
    parentName: '系统管理',
    name: '日志管理',
    url: 'sys/logSystem',
    perms: null,
    type: 1,
    icon: 'menu',
    orderNum: 3,
    open: null,
    list: null
  },
  {
    menuId: 8,
    parentId: 7,
    parentName: '系统管理',
    name: '日志管理',
    url: 'sys/logSystem',
    perms: null,
    type: 1,
    icon: 'menu',
    orderNum: 3,
    open: null,
    list: null
  },
  {
    menuId: 2,
    parentId: 1,
    parentName: '系统管理',
    name: '用户管理',
    url: 'sys/user',
    perms: null,
    type: 1,
    icon: 'menu',
    orderNum: 3,
    open: null,
    list: null
  },
  {
    menuId: 3,
    parentId: 1,
    parentName: '系统管理',
    name: '角色管理',
    url: 'sys/role',
    perms: null,
    type: 1,
    icon: 'role',
    orderNum: 2,
    open: null,
    list: null
  },
  {
    menuId: 4,
    parentId: 1,
    parentName: '系统管理',
    name: '菜单管理',
    url: 'sys/menu',
    perms: null,
    type: 1,
    icon: 'menu',
    orderNum: 3,
    open: null,
    list: null
  }
]
var navDataList = [
  {
    menuId: 1,
    parentId: 0,
    parentName: null,
    name: '系统管理',
    url: null,
    perms: null,
    type: 0,
    icon: 'system',
    orderNum: 0,
    open: null,
    list: [
      {
        menuId: 2,
        parentId: 1,
        parentName: null,
        name: '管理员列表',
        url: 'sys/user',
        perms: null,
        type: 1,
        icon: 'admin',
        orderNum: 1,
        open: null,
        list: null
      },
      {
        menuId: 3,
        parentId: 1,
        parentName: null,
        name: '角色管理',
        url: 'sys/role',
        perms: null,
        type: 1,
        icon: 'role',
        orderNum: 2,
        open: null,
        list: null
      },
      {
        menuId: 4,
        parentId: 1,
        parentName: null,
        name: '菜单管理',
        url: 'sys/menu',
        perms: null,
        type: 1,
        icon: 'menu',
        orderNum: 3,
        open: null,
        list: null
      },
      {
        menuId: 5,
        parentId: 1,
        parentName: null,
        name: 'SQL监控',
        url: 'http://localhost:8080/renren-fast/druid/sql.html',
        perms: null,
        type: 1,
        icon: 'sql',
        orderNum: 4,
        open: null,
        list: null
      },
      {
        menuId: 6,
        parentId: 1,
        parentName: null,
        name: '定时任务',
        url: 'job/schedule',
        perms: null,
        type: 1,
        icon: 'job',
        orderNum: 5,
        open: null,
        list: null
      },
      {
        menuId: 27,
        parentId: 1,
        parentName: null,
        name: '参数管理',
        url: 'sys/config',
        perms:
          'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete',
        type: 1,
        icon: 'config',
        orderNum: 6,
        open: null,
        list: null
      },
      {
        menuId: 30,
        parentId: 1,
        parentName: null,
        name: '文件上传',
        url: 'oss/oss',
        perms: 'sys:oss:all',
        type: 1,
        icon: 'oss',
        orderNum: 6,
        open: null,
        list: null
      },
      {
        menuId: 29,
        parentId: 1,
        parentName: null,
        name: '系统日志',
        url: 'sys/log',
        perms: 'sys:log:list',
        type: 1,
        icon: 'log',
        orderNum: 7,
        open: null,
        list: null
      }
    ]
  }
]

// 获取导航菜单列表 / 权限
export function nav() {
  return {
    // isOpen: false,
    url: '/sys/menu/nav',
    type: 'get',
    data: {
      msg: 'success',
      code: 0,
      menuList: navDataList,
      permissions: [
        'sys:schedule:info',
        'sys:menu:update',
        'sys:menu:delete',
        'sys:config:info',
        'sys:menu:list',
        'sys:config:save',
        'sys:config:update',
        'sys:schedule:resume',
        'sys:user:delete',
        'sys:config:list',
        'sys:user:update',
        'sys:role:list',
        'sys:menu:info',
        'sys:menu:select',
        'sys:schedule:update',
        'sys:schedule:save',
        'sys:role:select',
        'sys:user:list',
        'sys:menu:save',
        'sys:role:save',
        'sys:schedule:log',
        'sys:role:info',
        'sys:schedule:delete',
        'sys:role:update',
        'sys:schedule:list',
        'sys:user:info',
        'sys:schedule:run',
        'sys:config:delete',
        'sys:role:delete',
        'sys:user:save',
        'sys:schedule:pause',
        'sys:log:list',
        'sys:oss:all'
      ]
    }
  }
}

// 获取菜单列表
export function list() {
  return {
    // isOpen: false,
    url: '/sys/menu/list',
    type: 'get',
    data: dataList
  }
}

// 获取上级菜单
export function select() {
  let dataList = JSON.parse(JSON.stringify(navDataList))
  dataList = dataList.concat(dataList[0].list)
  return {
    // isOpen: false,
    url: '/sys/menu/select',
    type: 'get',
    data: {
      msg: 'success',
      code: 0,
      menuList: dataList
    }
  }
}

// 获取菜单信息
export function info() {
  return {
    // isOpen: false,
    url: '/sys/menu/info',
    type: 'get',
    data: {
      msg: 'success',
      code: 0,
      menu: dataList[0]
    }
  }
}

// 添加菜单
export function add() {
  return {
    // isOpen: false,
    url: '/sys/menu/save',
    type: 'post',
    data: {
      msg: 'success',
      code: 0
    }
  }
}

// 修改菜单
export function update() {
  return {
    // isOpen: false,
    url: '/sys/menu/update',
    type: 'post',
    data: {
      msg: 'success',
      code: 0
    }
  }
}

// 删除菜单
export function del() {
  return {
    // isOpen: false,
    url: '/sys/menu/delete',
    type: 'post',
    data: {
      msg: 'success',
      code: 0
    }
  }
}

// 测试mock数据用，无任何实用意义
function getMenuDataMock() {
  return {
    httpCode: 200,
    data: dataList
  }
}
function getPreData() {
  return {
    code: 'OK',
    data: {
      msg: 'success',
      code: 0,
      menuList: navDataList,
      permissions: [
        'sys:schedule:info',
        'sys:menu:update',
        'sys:menu:delete',
        'sys:config:info',
        'sys:menu:list',
        'sys:config:save',
        'sys:config:update',
        'sys:schedule:resume',
        'sys:user:delete',
        'sys:config:list',
        'sys:user:update',
        'sys:role:list',
        'sys:menu:info',
        'sys:menu:select',
        'sys:schedule:update',
        'sys:schedule:save',
        'sys:role:select',
        'sys:user:list',
        'sys:menu:save',
        'sys:role:save',
        'sys:schedule:log',
        'sys:role:info',
        'sys:schedule:delete',
        'sys:role:update',
        'sys:schedule:list',
        'sys:user:info',
        'sys:schedule:run',
        'sys:config:delete',
        'sys:role:delete',
        'sys:user:save',
        'sys:schedule:pause',
        'sys:log:list',
        'sys:oss:all'
      ]
    }
  }
}

Mock.mock(/\/sysMenu\/getMenuDataMock/, 'get', getMenuDataMock()) // 菜单列表
Mock.mock(/\/sysMenu\/getPreData/, 'get', getPreData()) // 菜单权限
