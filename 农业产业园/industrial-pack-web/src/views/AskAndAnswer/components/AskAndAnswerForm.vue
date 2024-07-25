<script setup lang="ts">
import { ref, unref, reactive, getCurrentInstance, nextTick } from 'vue'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import {
  saveAnswerApi,
  editAnswerApi,
  getAnswerDetailApi,
  addAnswerApi,
  getAnswerDetailListApi
} from '@/api/askAndAnswer'
import { FileUpload } from '@/components/FileUpload'

const { proxy } = getCurrentInstance() as any

// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePositiveIntegerN } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 30,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'plantType',
    label: '植物品种',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 10,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'pictureUrl',
    label: '上传图片',
    colProps: {
      span: 24
    }
  },
  {
    field: 'content',
    label: '提问内容',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 100,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'answerContent',
    // label: '回答',
    // component: 'Input',
    colProps: {
      span: 24
    }
    // componentProps: {
    //   maxlength: 500,
    //   type: 'textarea',
    //   rows: 3
    // }
  }
])

const formRef = ref<FormExpose>()

const isShow = ref<boolean>(false)

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})

const loading = ref(false)

//FormItem显示隐藏
const setFormHidden = (field: string, value: boolean) => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: field,
        path: 'hidden',
        value: value
      }
    ])
  })
}
// 上传文件
const uploadFileSuccess = (data) => {
  let pictureUrlArr = []
  let pictureNameArr = []
  data.map((item) => {
    let pictureUrl = item.url
    pictureUrlArr.push(pictureUrl)
    let pictureName = item.name
    pictureNameArr.push(pictureName)
  })
  unref(formRef)?.setValues({
    pictureUrl: pictureUrlArr.join(';'),
    pictureName: pictureNameArr.join(';')
  })
}
const answerContent = ref('')
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as any
      if (!isAnswer.value) {
        addAnswer({ answerContent: answerContent.value, answerId: data.id })
        return
      }
      if (data.id && detailsId.value) {
        editPost(data)
      } else {
        addPost(data)
      }
    }
  })
}
// 添加回答
const addAnswer = async (data: any) => {
  const res = await addAnswerApi(data)
    .catch(() => {})
    .finally(() => {
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getAnswerList', 'edit')
    closeDrawer()
  }
}

//编辑岗位
const editPost = async (data: any) => {
  const res = await editAnswerApi(data)
    .catch(() => {})
    .finally(() => {
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getAnswerList', 'edit')
    closeDrawer()
  }
}

//新增岗位
const addPost = async (data: any) => {
  const res = await saveAnswerApi(data)
    .catch(() => {})
    .finally(() => {
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getAnswerList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')
const isAnswer = ref<boolean>(false)
//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  isShow.value = true
  nextTick(() => {
    //重置表单
    detailsId.value = ''
    setValue(false)
    isSave.value = flag === 'see' ? false : true
    isAnswer.value = flag === 'answer' ? false : true
    changeDisabled(flag === 'see' || flag === 'answer')
    pageTite.value =
      props.title +
      (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : flag === 'answer' ? '回答' : '详情')
    setFormHidden('answerContent', flag === 'answer' ? false : flag === 'see' ? false : true)
    if (id) {
      getDetailsData(id)
    }
  })
}

//关闭drawer
const closeDrawer = () => {
  fileList.value = []
  isShow.value = false
  answerContent.value = ''
}

const resetFormAfterClose = () => {
  fileList.value = []
  answerContent.value = ''
  detailsId.value = ''
  //重置表单
  setValue(true)
}

let postData = reactive<any>({
  title: '',
  plantType: '',
  content: '',
  status: '0'
})
const fileList = ref<any>([])
const answerList = ref<any>([])
//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getAnswerDetailApi(id)
  if (!isSave.value) {
    answerList.value = []
    const data = await getAnswerDetailListApi({ answerId: id })
    data.data.map((item) => {
      answerList.value.push(item)
    })
  }
  if (res && res.data) {
    fileList.value = []
    if (res.data.pictureUrl) {
      let pictureUrl = res.data.pictureUrl
      let pictureName = res.data.pictureName
      let pictureUrlArr = pictureUrl.split(';') // 按字符分割
      let pictureNameArr = pictureName.split(';') // 按字符分割
      pictureUrlArr.map((item, index) => {
        fileList.value.push({
          name: pictureNameArr[index],
          url: item
        })
      })
    }
    postData = res.data
    setValues(postData)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      title: '',
      plantType: '',
      content: '',
      status: '0'
    })
  }
}

const setValues = (form: any) => {
  unref(formRef)?.setValues(form)
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <Dialog v-model="isShow" width="70%" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content">
      <template #pictureUrl>
        <FileUpload
          :model-value="fileList"
          :is-see="!isAnswer || !isSave"
          :fileType="['jpg', 'gif', 'png', 'jpeg']"
          :fileSize="5"
          :limit="3"
          :fileNameLength="70"
          @upload-file-success="uploadFileSuccess"
        />
      </template>
      <template #answerContent>
        <div class="answer" v-if="!isAnswer">
          <p>回答</p>
          <textarea
            v-model="answerContent"
            name=""
            id=""
            cols="30"
            rows="3"
            maxlength="500"
          ></textarea>
        </div>
        <div v-if="!isSave" style="width: 100%">
          <div v-for="(item, index) in answerList" :key="index" class="answer_detail">
            <p>
              <span>回答人:</span>
              <span style="margin-left: 10px">{{ item.answerByName }}</span>
            </p>
            <p>
              <span>回答时间:</span>
              <span style="margin-left: 10px">{{ item.answerTime }}</span>
            </p>
            <div>
              <div>
                回答内容:
                <span style="margin-left: 10px; word-wrap: break-word">{{
                  item.answerContent
                }}</span>
              </div>
            </div>
          </div>
          <div v-if="answerList.length <= 0" style="text-align: center"> 暂无回答 </div>
        </div>
      </template>
      <template #path-append>
        <ElTooltip
          effect="dark"
          content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
      </template>

      <template #component-append>
        <ElTooltip
          effect="dark"
          content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
      </template>
      <template #perms-append>
        <ElTooltip
          effect="dark"
          content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
      </template>

      <template #query-append>
        <ElTooltip
          effect="dark"
          content="访问路由的默认传递参数，如：`{``id``: 1, ``name``: ``ry``}`"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
      </template>
    </Form>
    <template #footer>
      <div class="details-footer">
        <ElButton @click="closeDrawer"> 取消 </ElButton>
        <ElButton v-if="isSave" type="primary" :loading="loading" @click="save"> 保存 </ElButton>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
.answer {
  width: 100%;
}
textarea {
  border: 1px solid #ccc;
  outline: none;
  width: 100%;
}
.answer_detail {
  width: 100%;
  background-color: #f5f7fa;
  margin: 10px 0;
  padding: 10px;
}
</style>
