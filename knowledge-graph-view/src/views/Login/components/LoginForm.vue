<template>
  <Form
    ref="formModel"
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid) login-form"
    @register="register"
  >
    <template #title>
      <h2 class="w-[100%] login-title">{{ t('login.login') }}</h2>
    </template>
    <template #verificationCode>
      <div class="code" @click="getCodeImg">
        <img :src="state.verificationCode" alt="" />
      </div>
    </template>
    <template #tool>
      <div class="flex justify-between items-center w-[100%]">
        <el-checkbox v-model="remember" :label="t('login.remember')" size="small" />
      </div>
    </template>

    <template #login>
      <div class="w-[100%]">
        <el-button :loading="loading" type="primary" class="w-[100%]" @click="signIn">
          {{ t('login.loginBtn') }}
        </el-button>
        <div class="recommend-browser">
          <p>推荐使用谷歌浏览器 </p>
        </div>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { reactive, ref, unref, watch, onMounted, onUnmounted, toRefs, toRaw } from 'vue'
import { useCookies } from 'vue3-cookies'

import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElLink, ElMessage, ElForm, ElInput } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { getCode, loginApi, getTestRoleApi, getAdminRoleApi } from '@/api/login'
import { getUserInfoApi } from '@/api/sys/user'
import { getMenuList } from '@/api/common'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useIcon } from '@/hooks/web/useIcon'
import { njxEncode, njxDecode } from '@/utils/ancode'
type Callback = (error?: string | Error | undefined) => void
const { cookies } = useCookies()
const { required } = useValidator()
const emit = defineEmits(['to-register'])
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const { currentRoute, addRoute, push, replace } = useRouter()
const { wsCache } = useCache()
const { t } = useI18n()
const formModel = ref<Recordable>({})
const rules = {
  username: [
    required('请输入用户名'),
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value.trim() === '') {
          formModel.value.setValues({
            username: ''
          })
          callback(new Error('请输入正确的用户名'))
        } else {
          formModel.value.setValues({
            username: value.trim()
          })
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
    required('请输入密码'),
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value.trim() === '') {
          formModel.value.setValues({
            password: ''
          })
          callback(new Error('请输入正确的用户名'))
        } else {
          formModel.value.setValues({
            password: value
          })
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [required()]
}
const state = reactive({
  verificationCode: '',
  uuid: '',
  code: '',
  enabled: ''
})
const formData = ref({
  username: '',
  password: '',
  code: '',
  uuid: ''
})
const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    }
  },
  {
    field: 'username',
    label: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      prefixIcon: useIcon({ icon: 'svg-icon:admin_icon' }),
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      prefixIcon: useIcon({ icon: 'svg-icon:password_icon' }),
      style: {
        width: '100%'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'code',
    label: '验证码',
    value: '',
    component: 'Input',
    hidden: state.enabled ? false : true,
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: '请输入验证码'
    }
  },
  {
    field: 'verificationCode',
    label: ' ',
    hidden: state.enabled ? false : true,
    colProps: {
      span: 6
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    }
  }
])
const loginFlag = ref(true)
const iconSize = 30
const remember = ref(false)
const { register, elFormRef, methods } = useForm()
const loading = ref(false)
const iconColor = '#999'
const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  window.addEventListener('keydown', keyDown)
  wsCache.set(wsCache.get('dynamicRouter'), true)
  getCodeImg()
  handleRemember()
})
onUnmounted(() => {
  window.removeEventListener('keydown', keyDown, false)
})

const handleRemember = () => {
  const clearStorage = () => {
    localStorage.removeItem('NJX_LOGININFO_KEY')
    localStorage.removeItem('NJX_LOGININFO_CONTENT')
    remember.value = false
  }

  const content = localStorage.getItem('NJX_LOGININFO_CONTENT')
  const key = localStorage.getItem('NJX_LOGININFO_KEY')

  // 没有保存内容
  if (!content || !key) {
    clearStorage()
    return
  }
  const { res } = njxDecode(content, key)

  if (!res) {
    clearStorage()
  } else {
    formModel.value.setValues({
      username: JSON.parse(res).username,
      password: JSON.parse(res).password
    })
    // formData.value.username = JSON.parse(res).username
    // formData.value.password = JSON.parse(res).password
    remember.value = true
  }
}
// enter 键登录事件
const keyDown = (e: any) => {
  if (loginFlag.value === true && (e.keyCode == 13 || e.keyCode == 100)) {
    loginFlag.value = false
    setTimeout(() => {
      signIn()
    }, 500)
  }
}
// 登录
const signIn = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      let formData = await getFormData<UserType>()
      formData.uuid = state.uuid

      if (remember.value) {
        const params: any = JSON.stringify({
          username: formData.username,
          password: formData.password
        })
        const { key, data } = njxEncode(params)

        localStorage.setItem('NJX_LOGININFO_KEY', key)
        localStorage.setItem('NJX_LOGININFO_CONTENT', data)
      } else {
        localStorage.removeItem('NJX_LOGININFO_KEY')
        localStorage.removeItem('NJX_LOGININFO_CONTENT')
      }
      try {
        await loginApi(formData)
          .then((res: any) => {
            if (res) {
              cookies.set('access_token', res.data.access_token, 0)
              cookies.set('Admin-Expires-In', res.data.expires_in)
              wsCache.set(appStore.getToken, res.data.access_token)
              wsCache.set(appStore.getExpires, res.data.expires_in)
              getUserInfo()
              ElMessage.success('登录成功')
              loginFlag.value = true
              // 是否使用动态路由
              // if (appStore.getDynamicRouter) {
              //   getRole()
              // } else {
              //   permissionStore.generateRoutes('none').catch(() => {})
              //   permissionStore.getAddRouters.forEach((route) => {
              //     addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
              //   })
              //   permissionStore.setIsAddRouters(true)
              //   push({ path: redirect.value || permissionStore.addRouters[0].path })
              // }
            }
          })
          .catch((error) => {
            getCodeImg()
          })
      } finally {
        loading.value = false
      }
    }
  })
}

const getUserInfo = async () => {
  let param = {}
  await getUserInfoApi(param).then((res) => {
    const user = Object.assign(res.data.user, {
      permissions: res.data.permissions
    })
    appStore.setUserNickName(user.nickName)
    wsCache.set(appStore.getUserInfo, user)
    getMenuDataList()
  })
}
const getMenuDataList = async () => {
  await getMenuList().then((res) => {
    let routers: any[] = []
    routers = routers.concat(res.data)
    wsCache.set('roleRouters', routers)
    appStore.setDynamicRouter(true)
    permissionStore
      .generateRoutes('admin', routers)
      .then(() => {})
      .catch(() => {})
    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(false)
    setTimeout(() => {
      let url = ''
      let routerList: any = permissionStore.getAddRouters[0]

      if (routerList && routerList.children?.length > 0) {
        url = `${routerList.path === '/' ? '' : routerList.path}/${routerList.children[0].path}`

        if (routerList.children.find((s) => s.isDefaultHidden)) {
          let list = routerList.children.find((s) => !s.isDefaultHidden)
          url = `${list.path}`
        }
      } else {
        url = routerList.path
      }

      push({ path: redirect.value || url || '/home' })
    }, 100)
  })
}

// 获取路由最后一个
const getRouterLast = (list: any) => {
  let url: any = ''
  if (list && list.children?.length > 0) {
    if (list.path == '/') {
      url = ''
    } else {
      url = list.path + '/' + list.children[0].path
      if (list.children[0].children && list.children[0].children.length > 0) {
        url += '/' + getRouterLast(list.children[0].children[0])
      }
    }
  } else {
    url = list.path
  }
  return url
}

// 获取角色信息
const getRole = async () => {
  const { getFormData } = methods
  const formData = await getFormData<UserType>()
  const params = {
    roleName: formData.username
  }
  // admin - 模拟后端过滤菜单
  // test - 模拟前端过滤菜单
  const res =
    formData.username === 'admin' ? await getAdminRoleApi(params) : await getTestRoleApi(params)
  if (res) {
    const { wsCache } = useCache()
    const routers = res.data || []
    wsCache.set('roleRouters', routers)

    formData.username === 'admin'
      ? await permissionStore.generateRoutes('admin', routers).catch(() => {})
      : await permissionStore.generateRoutes('test', routers).catch(() => {})

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}
// 获取验证码
const getCodeImg = async () => {
  await getCode()
    .then((res) => {
      if (res) {
        state.uuid = res.data.uuid
        state.verificationCode = 'data:image/gif;base64,' + res.data.img
        state.enabled = res.data.enabled
        schema.map((item) => {
          if (item.field === 'code' || item.field === 'verificationCode') {
            item.hidden = state.enabled ? false : true
          }
        })
      }
    })
    .catch(() => {})
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
}
</script>

<style lang="less" scoped>
:deep(.el-form-item) {
  margin-bottom: 0px;
  margin-right: 0px;
}

:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
.code {
  width: 100%;
  height: 40px;
  margin-top: 22px;
  cursor: pointer;
}
.login-title {
  font-size: 23px;
  line-height: 23px;
  margin-bottom: 28.48px;
}
.login-form {
  :deep(.el-row) {
    margin-top: 31.2vh;
    min-height: 299px;
    .el-col {
      padding: 0px !important;
      .el-form-item__content {
        .el-form-item__error {
          top: 40px !important;
        }
      }

      .el-input {
        margin-bottom: 1.22rem;
        .el-input__wrapper {
          background-color: #fcfcfc !important;
        }

        .el-input__prefix {
          .el-icon {
            width: 1rem;
            height: 1rem;
            min-height: 16px;
            min-width: 16px;
            margin-right: 0.625rem;
          }
        }
        .el-input__inner {
          height: 2.434rem;
          min-height: 39px;
        }
      }
      .el-checkbox {
        margin-bottom: 1.335rem;
        height: 1.1125rem;
        .el-checkbox__input {
          .el-checkbox__inner {
            height: 1.1125rem;
            width: 1.1125rem;
            min-height: 17.8px;
            min-width: 17.8px;
          }
          .el-checkbox__inner::after {
            width: 0.28rem;
            height: 0.62rem;
            min-height: 9px;
            min-width: 5px;
            padding-left: 0.1rem;
          }
        }
        .el-checkbox__label {
          font-size: 0.779px;
        }
      }
      .el-button {
        height: 2.55875rem !important;
        min-height: 39px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px !important;
        margin-bottom: 2.17rem;
        span {
          font-family: Alibaba PuHuiTi M;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }
      }
    }
  }
}
.recommend-browser {
  position: relative;
  width: 100%;
  text-align: center;
  p {
    font-family: Alibaba PuHuiTi R;
    font-size: 0.875rem;
    font-weight: 400;
    color: #888;
    line-height: 0.875rem;
  }
}
.recommend-browser::before {
  content: '';
  display: inline-block;
  width: 7.875rem;
  height: 1px;
  background-color: #0a0204;
  position: absolute;
  left: 0px;
  top: 0.43rem;
  opacity: 0.08;
}
.recommend-browser::after {
  content: '';
  display: inline-block;
  width: 7.875rem;
  height: 1px;
  background-color: #0a0204;
  position: absolute;
  right: 0px;
  top: 0.43rem;
  opacity: 0.08;
}
</style>
