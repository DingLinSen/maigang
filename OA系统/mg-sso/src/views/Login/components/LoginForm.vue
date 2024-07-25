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
import { reactive, ref, unref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useCookies } from 'vue3-cookies'
import { UserType } from '@/api/login/types'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, getTokenApi } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import { constantRouterMap } from '@/router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { useIcon } from '@/hooks/web/useIcon'
import { njxEncode, njxDecode } from '@/utils/ancode'
type Callback = (error?: string | Error | undefined) => void
const { cookies } = useCookies()
const { required } = useValidator()
// const emit = defineEmits(['to-register'])
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const { currentRoute, addRoute, push } = useRouter()

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
const remember = ref(false)
const { register, elFormRef, methods } = useForm()
const loading = ref(false)
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
// 进入登录页是判断用户是否已登录，并根据内外部的登录不同跳转到不同的地址
const loginTGC = async () => {
  let token = cookies.get('access_token')
  const routeQuery = currentRoute.value.query
  // 获取路由中的clientId，redirectUri（外部路由地址，登录后跳回这个地址）
  const clientId = routeQuery.clientId
    ? routeQuery.clientId
    : routeQuery.client_id
    ? routeQuery.client_id
    : ''
  const redirectUri = routeQuery.redirectUri
    ? routeQuery.redirectUri
    : routeQuery.redirect_uri
    ? routeQuery.redirect_uri
    : ''
  // 判断地址中是否有clientId和redirectUri，如果有则为外部链接，
  // 外部链接跳转时会判断sso是否已经登录，如果已登录，（包含TGC）通过地址中的参数获取code并跳转
  // TGC f12应用中保存的sso是否登录,sso已登录后其他项目无需登录
  const logut = routeQuery.logout ? routeQuery.logout : 'false'
  // logut用于其他项目退出时来判断是否需要清空cookie中的信息
  if (logut === 'true') {
    wsCache.clear()
    cookies.remove('access_token')
    cookies.remove('TGC')
    cookies.remove('user_info')
    cookies.remove('refresh_token')
  }
  if (clientId && redirectUri) {
    const TGC = cookies.get('TGC')
    if (TGC) {
      const params: any = {
        clientId: clientId,
        redirectUri: redirectUri
      }
      await loginApi(params).then((res) => {
        let code = res.data
        let index = redirectUri.indexOf('?')
        if (index !== -1) {
          window.location.href =
            redirectUri + '&code=' + code + (routeQuery.state ? '&state=' + routeQuery.state : '')
        } else {
          window.location.href =
            redirectUri + '?code=' + code + (routeQuery.state ? '&state=' + routeQuery.state : '')
        }
      })
    }
  } else {
    // 判断自动登录，加上此代码，会在token存在时无法跳转到login页面切换登录用户
    if (token) {
      const avatar = cookies.get('user_info')
      wsCache.set(appStore.getUserInfo, avatar)
      push({ path: '/change' })
    } else {
      // 如果有项目通过跳转到sso登录后，cookie中会有TGC，
      // 当用户在次访问sso时获取cookie中的TGC实现默认登录
      let initTGC = cookies.get('TGC')
      if (initTGC) {
        const params: any = {}
        await loginApi(params).then(async (res) => {
          let params: any = {
            code: res.data
          }
          await ssoLogin(params)
          push({ path: '/change' })
        })
      }
    }
  }
}
onMounted(() => {
  loginTGC()
  window.addEventListener('keydown', keyDown)
  wsCache.set(wsCache.get('dynamicRouter'), true)
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
      // 通过router获取地址中的参数
      const routeQuery = currentRoute.value.query

      // 获取路由中的clientId，redirectUri（外部路由地址，登录后跳回这个地址）
      const clientId = routeQuery.clientId
        ? routeQuery.clientId
        : routeQuery.client_id
        ? routeQuery.client_id
        : ''
      const redirectUri = routeQuery.redirectUri
        ? routeQuery.redirectUri
        : routeQuery.redirect_uri
        ? routeQuery.redirect_uri
        : ''
      loading.value = true
      const { getFormData } = methods
      let formData = await getFormData<UserType>()
      formData.clientId = clientId as string
      formData.redirectUri = redirectUri as string
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
        await loginApi(formData).then((res: any) => {
          // 获取code
          if (res.data) {
            const code = res.data
            let param: any = {
              code: code
            }
            getToken(param)
          }
        })
      } finally {
        loading.value = false
      }
    }
  })
}
// 获取token
const getToken = async (params) => {
  // 通过router获取地址中的参数，
  // 内部跳转获取token后跳转到change页
  // 外部跳转不获取token拼接code后跳转回原来地址
  const routeQuery = currentRoute.value.query
  const clientId = routeQuery.clientId
    ? routeQuery.clientId
    : routeQuery.client_id
    ? routeQuery.client_id
    : ''
  const redirectUri = routeQuery.redirectUri
    ? routeQuery.redirectUri
    : routeQuery.redirect_uri
    ? routeQuery.redirect_uri
    : ''
  const state = routeQuery.state ? routeQuery.state : null
  // 使用code调用接口获取token
  // clientId判断是否是内部跳转
  // 内部登录直接跳转到首页，外部地址获取地址栏中redirectUri后跟的地址并判断是否含有参数
  if (!clientId) {
    await ssoLogin(params)
    ElMessage.success('登录成功')
    push({ path: '/change' })
  } else {
    let index = redirectUri.indexOf('?')
    // // 如果有项目通过跳转到sso登录后，cookie中会有TGC，
    // // 当用户在次访问sso时获取cookie中的TGC实现默认登录
    // let initTGC = cookies.get('TGC')
    // //实现点击登录后跳转时也进行sso项目获取token
    // if (initTGC) {
    //   const params: any = {}
    //   await loginApi(params).then(async (res) => {
    //     let params: any = {
    //       code: res.data
    //     }
    //     await ssoLogin(params)
    //   })
    // }
    if (index !== -1) {
      window.location.href =
        redirectUri +
        currentRoute.value.hash +
        '&code=' +
        params.code +
        (routeQuery.state ? '&state=' + routeQuery.state : '')
    } else {
      window.location.href =
        redirectUri +
        currentRoute.value.hash +
        '?code=' +
        params.code +
        (routeQuery.state ? '&state=' + routeQuery.state : '')
    }
  }
}
// 获取token以及存储信息
const ssoLogin = async (params) => {
  await getTokenApi(params).then((res) => {
    if (res.data) {
      const data = res.data
      cookies.set('access_token', data.accessToken, data.refreshTokenExpireTime)
      cookies.set('refresh_token', data.refreshToken, data.refreshTokenExpireTime)
      cookies.set('user_info', JSON.stringify(data.user), data.refreshTokenExpireTime)
      wsCache.set(appStore.getToken, data.accessToken)
      wsCache.set(appStore.agetVatar, data.user.avatar)
      wsCache.set(appStore.agetName, data.user.name)
      wsCache.set(appStore.getUserInfo, data.user)
      loginFlag.value = true
    }
  })
  // 添加路由
  const roleRouters = wsCache.get('roleRouters') || []
  permissionStore.generateRoutes('none', roleRouters as AppCustomRouteRecordRaw[])
  permissionStore.getAddRouters.forEach((route) => {
    addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
  })
  permissionStore.setIsAddRouters(false)
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
const getRole = async () => {}
// 获取验证码
const getCodeImg = async () => {}
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
  font-family: Alibaba PuHuiTi R;
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
    font-size: 14px;
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
