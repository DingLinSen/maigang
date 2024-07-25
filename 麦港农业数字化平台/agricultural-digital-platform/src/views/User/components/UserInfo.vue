<script setup lang="ts">
import { ref, reactive, unref, watch } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import router from '@/router'
// import { useForm } from '@/hooks/web/useForm'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useCache } from '@/hooks/web/useCache'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { FormSchema } from '@/types/form'
import { propTypes } from '@/utils/propTypes'
import { updateUserProfileApi } from '@/api/user'
const { emitter } = useEmitt()

const { wsCache } = useCache()

const appStore = useAppStore()

const props = defineProps({
  user: propTypes.object.def({})
})
// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePhone } = useValidator()

const userFormRef = ref<FormExpose>()

const schema = reactive<FormSchema[]>([
  {
    field: 'nickName',
    label: '姓名',
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
      rules: [required()]
    }
  },
  {
    field: 'phonenumber',
    label: '联系方式',
    value: props.user.phonenumber,
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 30,
      clearable: false
    },
    formItemProps: {
      rules: [
        // required(),
        {
          validator: (_: any, value: string, callback: Callback) => {
            if (value) {
              validatePhone(
                value,
                callback,
                '请输入正确的手机号码格式,如18888888888 或 0511-4405222'
              )
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
        // {
        //   pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //   message: '请输入正确的手机号码',
        //   trigger: 'blur'
        // }
      ]
    }
  }
  // {
  //   field: 'email',
  //   label: '邮箱',
  //   value: props.user.email,
  //   component: 'Input',
  //   colProps: {
  //     span: 24
  //   },
  //   componentProps: {
  //     maxlength: 24,
  //     clearable: false
  //   },
  //   formItemProps: {
  //     rules: [
  //       required(),
  //       { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  //     ]
  //   }
  // },
  // {
  //   field: 'sex',
  //   label: '性别',
  //   value: props.user.sex,
  //   component: 'Radio',
  //   componentProps: {
  //     options: [
  //       { value: '0', label: '男' },
  //       { value: '1', label: '女' }
  //     ]
  //   }
  // }
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
        .then(() => {
          ElMessage.success('修改成功')
          const userNew = wsCache.get('userInfo')
          userNew.nickName = userInfo.nickName
          userNew.phonenumber = userInfo.phonenumber
          userNew.email = userInfo.email
          userNew.sex = userInfo.sex
          wsCache.set(appStore.getUserInfo, userNew)
          appStore.setUserNickName(userInfo.nickName)
          emitter.emit('user', 'refresh')
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

watch(
  () => props.user,
  (user) => {
    if (!user) return
    unref(userFormRef)?.setValues({
      nickName: user.nickName,
      phonenumber: user.phonenumber,
      email: user.email,
      sex: user.sex
    })
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<template>
  <Form :schema="schema" ref="userFormRef" class="form-content"/>
  <div class="text-center">
    <ElButton type="primary" @click="submit" :loading="loading">保存</ElButton>
    <ElButton type="danger" @click="close">关闭</ElButton>
  </div>
</template>
