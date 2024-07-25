<script setup lang="ts">
import { ref, reactive, unref, watch } from 'vue'
import { Form, FormExpose } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
import { any } from 'vue-types'
import { propTypes } from '@/utils/propTypes'
import { ElButton, ElMessage } from 'element-plus'
import { updateUserProfileApi, updateEmailNoticeApi } from '@/api/user'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import router from '@/router'

const { emitter } = useEmitt()

const { wsCache } = useCache()

const appStore = useAppStore()

const props = defineProps({
  user: propTypes.object.def({})
})

type Callback = (error?: string | Error | undefined) => void

const {
  required,
  validatePhone,
  validateEmail,
  notSpace,
  validateSpace,
  validateNormalBySearch,
  validateSpaceFirst,
  validateSpaceLast
} = useValidator()

const userFormRef = ref<FormExpose>()

const schema = reactive<FormSchema[]>([
  {
    field: 'nickName',
    label: '用户昵称',
    value: props.user.nickName,
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validateNormalBySearch(value, callback, '仅支持汉字字母数字'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'phonenumber',
    label: '手机号码',
    value: props.user.phonenumber,
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 11,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) => {
            if (value) {
              validatePhone(value, callback, '请输入正确的手机号码')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'email',
    label: '邮箱',
    value: props.user.email,
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 24,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) => {
            if (value) {
              validateEmail(value, callback, '请输入正确的邮箱格式,如1465555@qq.com')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'sex',
    label: '性别',
    value: props.user.sex,
    component: 'Radio',
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        { value: '0', label: '男' },
        { value: '1', label: '女' }
      ]
    }
  },
  {
    field: 'emailReceive',
    label: '邮箱通知',
    value: props.user.emailReceive,
    component: 'Switch',
    colProps: {
      span: 24
    },
    componentProps: {
      'active-value': '1',
      'inactive-value': '0'
    }
  }
])

const loading = ref(false)

const submit = async () => {
  //表单验证
  const form = unref(userFormRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let user = form?.formModel as Recordable
      const userInfo = Object.assign(props.user, {
        nickName: user.nickName,
        phonenumber: user.phonenumber,
        email: user.email,
        sex: user.sex
      })
      updateUserProfileApi(userInfo)
        .then((response) => {
          // ElMessage.success('修改成功')
          const userNew = wsCache.get('userInfo')
          userNew.nickName = userInfo.nickName
          userNew.phonenumber = userInfo.phonenumber
          userNew.email = userInfo.email
          userNew.sex = userInfo.sex
          wsCache.set(appStore.getUserInfo, userNew)
          appStore.setUserNickName(userInfo.nickName)
          updateEmailNotice(user.emailReceive === '1')
        })
        .finally(() => {
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
    }
  })
}

//修改邮箱通知
const updateEmailNotice = (bool: boolean) => {
  let params = {
    received: bool,
    sendMethod: 2
  }
  updateEmailNoticeApi(params).then((response) => {
    ElMessage.success('修改成功')
    emitter.emit('user', 'refresh')
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

watch(
  () => props.user,
  (user) => {
    if (!user) return
    unref(userFormRef)?.setValues({
      nickName: user.nickName,
      phonenumber: user.phonenumber,
      email: user.email,
      sex: user.sex,
      emailReceive: user.emailReceive ? '1' : '0'
    })
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<template>
  <Form :schema="schema" ref="userFormRef" />
  <div class="text-center">
    <ElButton type="primary" @click="submit" :loading="loading">保存</ElButton>
    <ElButton type="danger" @click="close">关闭</ElButton>
  </div>
</template>
