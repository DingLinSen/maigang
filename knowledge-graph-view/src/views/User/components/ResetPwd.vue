<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView'
import router from '@/router'
import { Form, FormExpose } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
import { reactive, ref, unref } from 'vue'
import { updateUserPwdApi } from '@/api/user'
import { ElMessage } from 'element-plus'
import { loginOutApi } from '@/api/login'
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'
import { useCache } from '@/hooks/web/useCache'
import { removeRoken } from '@/utils/removeRoken'
import { resetRouter } from '@/router'
const { cookies } = useCookies()
type Callback = (error?: string | Error | undefined) => void

const { required, validatePassword } = useValidator()
const loginClientId = import.meta.env.VITE_WS_BASE_CLIENTID
const loginUrl = import.meta.env.VITE_WS_BASE_LOGIN_URL
const pwdFormRef = ref<FormExpose>()
const { wsCache } = useCache()
const tagsViewStore = useTagsViewStore()
const { replace, push } = useRouter()

const equalToPassword = (rule: any, value: any, callback: Callback) => {
  const form = unref(pwdFormRef)
  let user = form?.formModel as Recordable
  if (!user.newPassword) {
    callback(new Error('请先输入新密码'))
  } else if (user.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const loginOut = async () => {
  const res = await loginOutApi()
  // debugger
  if (res) {
    removeRoken()
    tagsViewStore.delAllViews()

    resetRouter() // 重置静态路由表
    // replace('/login')
    // push({ path: '/login' })
  }
}
const schema = reactive<FormSchema[]>([
  {
    field: 'oldPassword',
    label: '旧密码',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false,
      type: 'password',
      showPassword: true
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'newPassword',
    label: '新密码',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false,
      type: 'password',
      showPassword: true
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validatePassword(value, callback, '密码必须由数字、字母、特殊字符组合,请输入6-16位'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false,
      type: 'password',
      showPassword: true
    },
    formItemProps: {
      rules: [required(), { required: true, validator: equalToPassword, trigger: 'blur' }]
    }
  }
])

const loading = ref(false)

const submit = async () => {
  //表单验证
  const form = unref(pwdFormRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let user = form?.formModel as Recordable
      const userInfo = Object.assign(
        {},
        {
          oldPassword: user.oldPassword,
          newPassword: user.newPassword
        }
      )
      updateUserPwdApi(userInfo)
        .then(async (res) => {
          ElMessage.success('修改成功')

          await loginOut()
        })
        .finally(() => {
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
    }
  })
}

const close = () => {
  useTagsViewStore().delView(router.currentRoute.value)
  const visitedViews = useTagsViewStore().getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    return router.push(latestView.fullPath)
  }
  return router.push('/')
}
</script>

<template>
  <Form :schema="schema" ref="pwdFormRef" />
  <div class="text-center">
    <ElButton type="primary" @click="submit" :loading="loading">保存</ElButton>
    <ElButton type="danger" @click="close">关闭</ElButton>
  </div>
</template>
