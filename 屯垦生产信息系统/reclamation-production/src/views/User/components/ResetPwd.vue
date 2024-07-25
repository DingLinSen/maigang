<script setup lang="ts">
import { reactive, ref, unref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTagsViewStore } from '@/store/modules/tagsView'
import router from '@/router'
import { Form, FormExpose } from '@/components/Form'
// import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { useCache } from '@/hooks/web/useCache'
import { FormSchema } from '@/types/form'

import { updateUserPwdApi } from '@/api/user'
const { wsCache } = useCache()
type Callback = (error?: string | Error | undefined) => void

const { required, validatePassword } = useValidator()

const pwdFormRef = ref<FormExpose>()

const equalToPassword = (_: any, value: any, callback: Callback) => {
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
      maxlength: 16,
      clearable: false,
      type: 'password',
      showPassword: true
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) =>
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
        .then(() => {
          wsCache.clear()
          router.replace({
            path: '/login'
          })
          ElMessage.success('修改成功')
        })
        .finally(() => {
          loading.value = false
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
  <Form :schema="schema" ref="pwdFormRef" class="form-content"/>
  <div class="text-center">
    <ElButton type="primary" @click="submit" :loading="loading">保存</ElButton>
    <ElButton type="danger" @click="close">关闭</ElButton>
  </div>
</template>
