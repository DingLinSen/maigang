import { removeToken } from '@/libs/util'
export default {
  // namespaced: true,
  state: {
    deleteInfo: { // 列表删除提示操作
      title: '确认删除操作',
      msg: '确定删除选中的数据信息吗？'
    },
    openStatusInfo: { // 列表启用提示操作
      title: '确认启用操作',
      msg: '确定启用选中的数据信息吗？'
    },
    stopStatusInfo: { // 列表禁用提示操作
      title: '确认禁用操作',
      msg: '确定禁用选中的数据信息吗？'
    },
    releaseStatusInfo: { // 列表发布提示操作
      title: '确认发布操作',
      msg: '确定发布选中的数据信息吗？'
    }
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    logout() {
      removeToken()
    }
  }
}
