import Mock from 'mockjs'
Mock.XHR.prototype.withCredentials = true
// 生成数据列表
var dataList = []
// for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
for (let i = 0; i < 10; i++) {
  dataList.push(
    Mock.mock({
      userId: '@increment' + '',
      username: '@name',
      email: '@email',
      mobile: /^1[0-9]{10}$/,
      status: 1,
      roleIdList: null,
      createUserId: 1,
      createTime: 'datetime'
    })
  )
}

// 获取用户列表
export function list() {
  return {
    url: '/sys/user/list',
    data: {
      msg: 'success',
      code: 0,
      page: {
        totalCount: dataList.length,
        pageSize: 10,
        totalPage: 1,
        currPage: 1,
        list: dataList
      }
    }
  }
}

// 获取用户信息
export function info() {
  return {
    // isOpen: false,
    url: '/sys/user/info',
    type: 'get',
    data: {
      msg: 'success',
      code: 0,
      user: dataList[0]
    }
  }
}

// 修改密码
export function updatePassword() {
  return {
    // isOpen: false,
    url: '/sys/user/password',
    type: 'post',
    data: {
      msg: 'success',
      code: 0
    }
  }
}

// 添加用户
export function add() {
  return {
    // isOpen: false,
    url: '/sys/user/save',
    type: 'post',
    data: {
      msg: 'success',
      code: 0
    }
  }
}

// 修改用户
export function update() {
  return {
    // isOpen: false,
    url: '/sys/user/update',
    type: 'post',
    data: {
      msg: 'success',
      code: 0
    }
  }
}

// 删除用户
export function del() {
  return {
    // isOpen: false,
    url: '/sys/user/delete',
    type: 'post',
    data: {
      msg: 'success',
      code: 0
    }
  }
}

function login() {
  return {
    code: 'OK',
    data: {
      userRoleList: [
        {
          roleId: '1'
        }
      ],
      userId: 1,
      name: '超级管理员',
      icon: '图标',
      username: 'admin',
      token: '123456'
    }
  }
}

Mock.mock(/\/sysUser\/login/, 'post', login()) // 用户登录
Mock.mock(/\/sys\/user/, 'get', list()) // 用户登录
