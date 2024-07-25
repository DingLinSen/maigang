<template>
  <Form
    ref="formModel"
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid) form-content"
    @register="register"
  >
    <template #title>
      <h2 class="text-2xl font-bold text-center w-[100%]">用户登录</h2>
    </template>
    <template #username-prefix>
      <img src="@/assets/imgs/login/admin_icon.png" alt="" />
    </template>
    <template #password-prefix>
      <img src="@/assets/imgs/login/password_icon.png" />
    </template>
    <template #verificationCode>
      <div class="code" @click="getCodeImg">
        <!-- <el-input v-model="formData.code" placeholder="请输入验证码" /> -->
        <img :src="state.verificationCode" alt="" />
      </div>
    </template>

    <template #tool>
      <div class="flex justify-between items-center w-[100%]">
        <el-checkbox v-model="remember" :label="t('login.remember')" size="small" />
        <!-- &lt;!&ndash;
        <el-link type="primary" :underline="false">{{ t('login.forgetPassword') }}</el-link>
        &ndash;&gt; -->
      </div>
    </template>

    <template #login>
      <div class="w-[100%]">
        <el-button :loading="loading" type="primary" class="w-[100%]" @click="signIn">
          {{ t('login.login') }}
        </el-button>
      </div>
      <!-- <div class="w-[100%] mt-15px">
        <el-button class="w-[100%]" @click="toRegister">
          {{ t('login.register') }}
        </el-button>
      </div> -->
    </template>
    <template #tips>
      <p class="tips">推荐使用谷歌浏览器 </p>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { reactive, ref, unref, watch, onMounted, onUnmounted } from 'vue'
import { useCookies } from 'vue3-cookies'
import { ElButton, ElCheckbox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useCache } from '@/hooks/web/useCache'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { getCode, loginApi } from '@/api/login'
import { getUserInfoApi } from '@/api/sys/user'
import { getMenuList } from '@/api/common'
import { UserType } from '@/api/login/types'
import { FormSchema } from '@/types/form'
import { njxEncode, njxDecode, desEncode } from '@/utils/ancode'
import { Form } from '@/components/Form'

const { cookies } = useCookies()
const { required } = useValidator()
// const emit = defineEmits(['to-register'])
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const { currentRoute, addRoute, replace } = useRouter()
const { wsCache } = useCache()
const { t } = useI18n()
const rules = {
  username: [required()],
  password: [required()],
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
    label: t('login.username'),
    value: '',
    component: 'Input',

    colProps: {
      span: 24
    },
    componentProps: {
      slots: {
        prefix: true
      },
      maxlength: '20',
      placeholder: t('login.usernamePlaceholder')
    },
    formItemProps: {
      rules: [required('请输入用户名')]
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      maxlength: '20',
      isShowPrefix: true,
      slots: {
        prefix: true
      },
      placeholder: t('login.passwordPlaceholder')
    },
    formItemProps: {
      rules: [required('请输入密码')]
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
  // {
  //   field: 'other',
  //   component: 'Divider',
  //   label: t('login.otherLogin'),
  //   componentProps: {
  //     contentPosition: 'center'
  //   }
  // },
  {
    field: 'tips',
    colProps: {
      span: 24
    },
    componentProps: {
      contentPosition: 'center'
    }
  }
])
const loginFlag = ref(true)
// const iconSize = 30
const remember = ref(false)
const { register, elFormRef, methods } = useForm()
const loading = ref(false)
// const iconColor = '#999'
const redirect = ref<string>('')

// const formData = ref({
//   username: '',
//   password: '',
//   code: '',
//   uuid: ''
// })

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
  handleRemember()
  window.addEventListener('keydown', keyDown)
  wsCache.set(wsCache.get('dynamicRouter'), true)
  getCodeImg()
})
onUnmounted(() => {
  window.removeEventListener('keydown', keyDown, false)
})
const formModel = ref<Recordable>({})
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
  cookies.set('Admin-Token', '', 0)
  cookies.set('Admin-Expires-In', '')
  wsCache.set(appStore.getToken, '')
  wsCache.set(appStore.getExpires, '')
  appStore.setUserNickName('')
  wsCache.clear()
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
        // formData.username = desEncode(formData.username)

        const params = {
          ...formData,
          username: desEncode(formData.username),
          password: desEncode(formData.password)
        }
        await loginApi(params)
          .then((res: any) => {
            if (res) {
              cookies.set('Admin-Token', res.data.access_token, 0)
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
          .catch(() => {
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
    appStore.setAvatar(user.avatar)
    wsCache.set(appStore.getUserInfo, user)

    getMenuDataList()
  })
}
const getMenuDataList = async () => {
  permissionStore
    .generateRoutes('none')
    .then(() => {})
    .catch(() => {})
  permissionStore.getAddRouters.forEach((route) => {
    addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
  })
  permissionStore.setIsAddRouters(true)
  setTimeout(() => {
    replace({ path: '/worldMap' })
    // push({ path: redirect.value || permissionStore.getAddRouters[0].path || '/home' })
  }, 100)
  // await getMenuList().then((res) => {
  //   // let routers: any[] = []
  //   // routers = routers.concat(res.data)
  //   // wsCache.set('roleRouters', routers)
  //   // appStore.setDynamicRouter(true)
  // })
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
</script>

<style lang="less" scoped>
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
  // display: flex;
  // align-items: center;
  // .el-input {
  //   flex: 1;
  // }
  // img {
  //   width: 100px;
  //   height: 40px;
  // }
}

.el-form-item__content {
  width: 100%;
}

.tips {
  width: 100%;
  text-align: center;
  color: #888888;
  font-size: 14px;
  position: relative;

  &::before {
    content: '';
    width: 80px;
    height: 1px;
    background: rgba(10, 2, 4, 0.08);
    position: absolute;
    left: 20px;
    top: 19px;
  }

  &::after {
    content: '';
    width: 80px;
    height: 1px;
    background: rgba(10, 2, 4, 0.08);
    position: absolute;
    right: 20px;
    top: 19px;
  }
}
</style>
