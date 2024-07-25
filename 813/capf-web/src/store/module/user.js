import { userLogin, initUserInfo } from '@/api/api-base'
import { setToken, getToken } from '@/libs/util'

export default {
  namespaced: true,
  state: {
    username: null, // 登录名
    name: null, // 姓名
    userId: null,
    roleId: null, // 角色id
    roleName: null, // 角色名称
    deptName: null,
    avatorImgPath: null,
    token: getToken(),
    access: null,
    addTree: false,
    lastLoginTime: null, // 上次登陆时间
    websocketFlag: null, // websocket接收消息的标识
    isNotAssessToday: null, // 今天是否有考试
    assId: null // 有考核的id
  },
  getters: {
    getUsername (state) {
      return state.username
    },
    getName (state) {
      return state.name
    },
    getLastLoginTime (state) {
      return state.lastLoginTime
    },
    getUserLine (state) {
      return state.line
    },
    TREELOGO(state, addTree) {
      state.addTree = addTree
    },
    getWebsocketFlag (state) {
      return state.websocketFlag
    },
    getRoleName (state) {
      return state.roleName
    },
    getDeptName (state) {
      return state.deptName
    },
    getIsNotAssessToday (state) {
      return state.isNotAssessToday
    },
    getAssId (state) {
      return state.assId
    }

  },
  mutations: {
    editeTreeLogo({commit}, addTree) {
      commit('TREELOGO', addTree)
    },
    setUserLine (state, line) {
      state.line = line
    },
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setRoleId (state, id) {
      state.roleId = id
    },
    setUsername (state, name) {
      state.username = name
    },
    setName (state, name) {
      state.name = name
    },
    setLastLoginTime (state, lastLoginTime) {
      state.lastLoginTime = lastLoginTime
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setWebsocketFlag (state, websocketFlag) {
      state.websocketFlag = websocketFlag
    },
    setRoleName (state, roleName) {
      state.roleName = roleName
    },
    setDeptName (state, deptName) {
      state.deptName = deptName
    },
    setIsNotAssessToday (state, isNotAssessToday) {
      state.isNotAssessToday = isNotAssessToday
    },
    setAssId (state, assId) {
      state.assId = assId
    }

  },
  actions: {
    // 测试登录store
    handleLogin ({ commit }, {username, password, code}) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        userLogin({
          username,
          password,
          code
        }).then(res => {
          if (!res.status) {
            return
          }

          let data = res.data
          commit('setAvator', null)
          commit('setUsername', data.user.name)
          commit('setUserId', data.user.user_ID)
          commit('setUserLine', data.user.line)
          commit('setAccess', data.user.rights)

          // todo - 后续修改为携带令牌验证， 需后台同步更新
          // 目前令牌作用是前台是否登录标示
          commit('setToken', data.user.rights + '-' + data.user.user_ID)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      // return new Promise((resolve, reject) => {
      //   userLogout(state.token).then(() => {
      //     commit('setToken', '')
      //     commit('setAccess', [])
      //     resolve()
      //   }).catch(err => {
      //     reject(err)
      //   })
      // })
      // 无需请求接口退出登录
      commit('setToken', '')
      commit('setAccess', [])
      // resolve()
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        initUserInfo().then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
