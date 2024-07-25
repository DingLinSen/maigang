<template>
  <div class="upload_box absolute top-0 z-999">
    <div class="upload_header">
      <div class="header_left">{{ props.editId ? '编辑' : '上传文件' }}</div>
      <div class="header_right">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="release(ruleFormRef)">发布</el-button>
      </div>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="form"
      :label-position="'top'"
      :rules="rules"
      class="upload-form"
      :require-asterisk-position="'right'"
    >
      <div class="form-left">
        <el-form-item label="作者" prop="author">
          <el-select
            v-model="form.author"
            filterable
            placeholder="请选择作者名称"
            clearable
            @change="handleAuthor"
          >
            <el-option
              v-for="item in userData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属岗位" prop="postName">
          <el-input v-model="form.postName" placeholder="请填写岗位名称" disabled />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请填写部门名称" disabled />
        </el-form-item>
        <el-form-item label="知识分类" prop="knowledgeTypeList">
          <div class="classification" @click="handleOpenDialog(1)">
            <div class="classification_list">
              <div class="placeholder" v-if="!form.knowledgeTypeList.length">请选择知识分类</div>
              <div class="classification_content">
                <div class="classification_item" v-if="knowledgeName" @click.stop>
                  <span class="item_span">{{ knowledgeName }}</span>
                  <span class="ml-8px classification-close" @click.stop="handleClose(1, null)"
                    >×</span
                  >
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="辅助分类" prop="auxClassList">
          <div class="classification" @click="handleOpenDialog(2)">
            <div class="classification_list">
              <div class="placeholder" v-if="!form.auxClassList.length">请选择辅助分类</div>
              <div
                class="classification_content"
                v-for="(item, index) in form.auxClassList"
                :key="item"
              >
                <div class="classification_item" @click.stop>
                  <span class="item_span">{{ item.knowledgeName }}</span>
                  <span class="ml-8px classification-close" @click.stop="handleClose(2, index)"
                    >×</span
                  >
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="标签" prop="tagTypeList">
          <div class="classification" @click="handleOpenDialog(3)">
            <div class="classification_list">
              <div class="placeholder" v-if="!form.tagTypeList.length">请选择标签</div>
              <div
                class="classification_content"
                v-for="(item, index) in form.tagTypeList"
                :key="item"
              >
                <div class="classification_item" @click.stop>
                  <span class="item_span">{{ item.tagTypeName }}</span>
                  <span class="ml-8px classification-close" @click.stop="handleClose(3, index)"
                    >×</span
                  >
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
      <div class="form-right">
        <el-form-item prop="files">
          <el-upload
            ref="fileUploadRef"
            class="upload-demo"
            drag
            multiple
            accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.txt,.pptx"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :http-request="handleFileUpload"
          >
            <Icon icon="svg-icon:upload_file" class="mr-10px file-icon" />
            <div class="el-upload__text"
              ><span class="upload_text">上传文件,请</span><em>点击上传</em></div
            >
          </el-upload>
          <div class="upload_list">
            <div class="upload_list_content" v-for="(item, index) in form.files" :key="item">
              <div class="content_box">
                <div class="content_left">
                  <svg
                    v-if="/\.pdf/.test(item.name.toLowerCase())"
                    aria-hidden="true"
                    class="fileIcon"
                  >
                    <use xlink:href="#icon-pdf" />
                  </svg>
                  <svg
                    v-else-if="/\.xlsx|\.xls/.test(item.name.toLowerCase())"
                    aria-hidden="true"
                    class="fileIcon"
                  >
                    <use xlink:href="#icon-excel" />
                  </svg>
                  <svg
                    v-else-if="/\.doc|\.docx/.test(item.name.toLowerCase())"
                    aria-hidden="true"
                    class="fileIcon"
                  >
                    <use xlink:href="#icon-word" />
                  </svg>
                  <svg
                    v-else-if="/\.ppt/.test(item.name.toLowerCase())"
                    aria-hidden="true"
                    class="fileIcon"
                  >
                    <use xlink:href="#icon-ppt" />
                  </svg>
                  <svg
                    v-else-if="/\.jpg|\.png|\.gif|\.jpeg/.test(item.name.toLowerCase())"
                    aria-hidden="true"
                    class="fileIcon"
                  >
                    <use xlink:href="#icon-photo" />
                  </svg>
                  <svg v-else aria-hidden="true" class="fileIcon">
                    <use xlink:href="#icon-weizhi3" />
                  </svg>
                  <div class="ml-5px fileName">{{ item.name }}</div>
                  <el-icon class="is-loading" color="#409eff" v-if="item.uploadStatus == 1">
                    <Loading />
                  </el-icon>
                  <el-icon color="#67c23a" v-if="item.uploadStatus == 2">
                    <SuccessFilled />
                  </el-icon>
                  <el-icon color="#f56c6c" v-if="item.uploadStatus == 3">
                    <WarningFilled />
                  </el-icon>
                  <span class="file-status">
                    {{
                      item.uploadStatus == 1
                        ? '上传中...'
                        : item.uploadStatus == 2
                        ? '上传成功'
                        : item.uploadStatus == 3
                        ? '上传失败'
                        : ''
                    }}
                  </span>
                </div>
                <div class="content_right">
                  <span>{{ fileSize(item.size) }}</span>
                  <span class="content_close" @click="removeFileList(index)">×</span>
                </div>
              </div>
              <el-progress
                v-if="item.progress"
                :show-text="false"
                :percentage="item.progress"
                :color="item.customColor"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="摘要" prop="abstracts">
          <el-input
            :autosize="{ minRows: 4 }"
            type="textarea"
            v-model="form.abstracts"
            placeholder="请输入摘要"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
        <div>
          <p class="font-bold">权限</p>
          <div class="line"></div>
        </div>
        <el-form-item label="可阅读者（默认所有人有权限）" prop="searchList">
          <div class="classification" @click="handleAuthDialog(1)">
            <div class="classification_list">
              <div class="placeholder" v-if="!form.searchList.length">请选择可阅读者</div>
              <div
                class="classification_content"
                v-for="(item, index) in form.searchList"
                :key="item"
              >
                <div
                  class="classification_item"
                  :class="
                    item.type == 1
                      ? 'people_background'
                      : item.type == 2
                      ? 'dept_background'
                      : item.type == 3
                      ? 'group_background'
                      : ''
                  "
                  @click.stop
                >
                  <span class="item_span">{{ item.name }}</span>
                  <span
                    class="ml-8px classification-close"
                    @click.stop="handleAuthClose(1, item, index)"
                    >×</span
                  >
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="可编辑者（默认创建人可编辑）" prop="editList">
          <div class="classification" @click="handleAuthDialog(2)">
            <div class="classification_list">
              <div class="placeholder" v-if="!form.editList.length">请选择可编辑者</div>
              <div
                class="classification_content"
                v-for="(item, index) in form.editList"
                :key="item"
              >
                <div
                  class="classification_item"
                  :class="
                    item.type == 1
                      ? 'people_background'
                      : item.type == 2
                      ? 'dept_background'
                      : item.type == 3
                      ? 'group_background'
                      : ''
                  "
                  @click.stop
                >
                  <span class="item_span">{{ item.name }}</span>
                  <span
                    class="ml-8px classification-close"
                    @click.stop="handleAuthClose(2, item, index)"
                    >×</span
                  >
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="可分享者（默认阅读者可分享）" prop="shareList">
          <div class="classification" @click="handleAuthDialog(3)">
            <div class="classification_list">
              <div class="placeholder" v-if="!form.shareList.length">请选择可分享者</div>
              <div
                class="classification_content"
                v-for="(item, index) in form.shareList"
                :key="item"
              >
                <div
                  class="classification_item"
                  :class="
                    item.type == 1
                      ? 'people_background'
                      : item.type == 2
                      ? 'dept_background'
                      : item.type == 3
                      ? 'group_background'
                      : ''
                  "
                  @click.stop
                >
                  <span class="item_span">{{ item.name }}</span>
                  <span
                    class="ml-8px classification-close"
                    @click.stop="handleAuthClose(3, item, index)"
                    >×</span
                  >
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="附件权限（默认阅读者可下载）" prop="downloadList">
          <div class="classification" @click="handleAuthDialog(4)">
            <div class="classification_list">
              <div class="placeholder" v-if="!form.downloadList.length">请选择可下载者</div>
              <div
                class="classification_content"
                v-for="(item, index) in form.downloadList"
                :key="item"
              >
                <div
                  class="classification_item"
                  :class="
                    item.type == 1
                      ? 'people_background'
                      : item.type == 2
                      ? 'dept_background'
                      : item.type == 3
                      ? 'group_background'
                      : ''
                  "
                  @click.stop
                >
                  <span class="item_span">{{ item.name }}</span>
                  <span
                    class="ml-8px classification-close"
                    @click.stop="handleAuthClose(4, item, index)"
                    >×</span
                  >
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
  <!-- 知识分类弹出框 -->
  <KnowledgeDialog ref="knowledgeDialogRef" @handle-knowledge-value="handleKnowledgeValue" />
  <!-- 辅助分类弹出框 -->
  <AuxiliaryDialog ref="auxiliaryDialogRef" @handle-auxiliary-value="handleAuxiliaryValue" />
  <!-- 标签弹出框 -->
  <TagsDialog ref="tagsDialogRef" @handle-tag="handleTag" />
  <!--  选择人员 部门 群组  -->
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
</template>
<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import { Icon } from '@/components/Icon'
import { useValidator } from '@/hooks/web/useValidator'
import KnowledgeDialog from '@/views/Personal/components/KnowledgeDialog.vue'
import AuxiliaryDialog from '@/views/Personal/components/AuxiliaryDialog.vue'
import TagsDialog from '@/views/Personal/components/TagsDialog.vue'
import { useCache } from '@/hooks/web/useCache'
import { fileSize } from '@/utils'
import { ElMessage } from 'element-plus'
import { Loading, SuccessFilled, WarningFilled } from '@element-plus/icons-vue'
import {
  uploadFileApi,
  storeAndParseApi,
  getPostByUserIdApi,
  updateRefCountApi,
  getUploadEditApi,
  editUploadApi
} from '@/api/personal/myUpload'
import { getAllUserListApi } from '@/api/user'
import { getAllDeptListApi } from '@/api/sys/dept'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import emitter from '@/utils/bus'

const { required, notSpace } = useValidator()
const props = defineProps({
  editId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['isShowUpload'])
const { wsCache } = useCache()
const userInfo = ref<any>(wsCache.get('userInfo')) // 登录用户的数据
const accept = ref<any>('.doc,.docx,.pdf,.xlsx,.xls,.ppt,.txt,.pptx') // 允许上传的文件类型
interface form {
  id: number | string
  author: string
  postName: string
  deptName: string
  knowledgeTypeList: any
  knowledgeTypeName: string
  auxClassList: any
  auxClassName: string
  tagTypeList: any
  tagTypeName: string
  files: any
  title: string
  abstracts: string
  searchList: any
  editList: any
  shareList: any
  downloadList: any
  fileAddList: any
  fileDeleteList: any
  filePermissionsList: any
  publicSearch: string
  publicEdit: string
  publicShare: string
  publicCopy: string
}
const form = reactive<form>({
  id: 0,
  author: '', // 作者
  postName: '', // 岗位
  deptName: '', // 部门
  knowledgeTypeList: [], // 知识分类
  knowledgeTypeName: '',
  auxClassList: [], // 辅助分类
  auxClassName: '',
  tagTypeList: [], // 标签
  tagTypeName: '',
  files: [], // 文件列表
  title: '', // 标题
  abstracts: '', // 摘要
  searchList: [], // 搜索权限
  editList: [], // 编辑权限
  shareList: [], // 分享权限
  downloadList: [], // 下载权限
  fileAddList: [], // 编辑时新增的文件
  fileDeleteList: [], // 编辑时删除的文件
  filePermissionsList: [], // 权限的数据
  publicSearch: '1', // 是否默认权限 默认1改变0
  publicEdit: '1',
  publicShare: '1',
  publicCopy: '1'
})
const rules = reactive({
  author: [
    required(),
    {
      validator: (rule: any, value: string, callback: any) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  knowledgeTypeList: [required()],
  tagTypeList: [required()],
  files: [required()],
  title: [
    required(),
    {
      validator: (rule: any, value: string, callback: any) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})
// 点击取消
const cancel = () => {
  emit('isShowUpload', false)
}
const userData = ref<any>([]) // 用户数据
const deptList = ref<any>([]) // 部门数据
// 获取人员数据
const getAllUserList = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    userData.value = data.map((v) => {
      return {
        deptId: v.deptId,
        value: v.userId,
        label: v.nickName
      }
    })
    if (!props.editId) {
      form.author = userInfo.value.nickName
      form.deptName = userInfo.value.dept.deptName
    }
    deptList.value = res.data
  } catch (error) {
    console.log(error)
  }
}
// 获取岗位
const getPost = async (id) => {
  await nextTick()
  const { data } = await getPostByUserIdApi({ id: id })
  let name: any = []
  data.forEach((item: any) => {
    if (item.postName) {
      name.push(item.postName)
    }
  })
  form.postName = name.join(',')
}
// 获取编辑的数据
const getEditData = async () => {
  if (props.editId) {
    const res = await getUploadEditApi({
      id: props.editId
    })
    form.author = res.data.author
    form.postName = res.data.postName
    form.deptName = res.data.deptName
    knowledgeName.value = res.data.knowledgeTypeName
    res.data.knowledgeTypeList.forEach((item) => {
      knowledgeId.value = item.id
    })
    form.knowledgeTypeList = res.data.knowledgeTypeList
    form.auxClassList = res.data.auxClassList
    form.tagTypeList = res.data.tagTypeList
    form.files = res.data.files
    form.title = res.data.title
    form.abstracts = res.data.abstracts
    titleId.value = res.data.id
    res.data.filePermissionsList.forEach((item) => {
      let item0: any = {
        authId: item.authId,
        name: item.name,
        titleId: titleId.value,
        type: item.type // 人员 1   部门 2  群组 3
      }
      if (item.isSearch === '1') {
        form.searchList.push(item0)
      }
      if (item.isEdit == '1') {
        form.editList.push(item0)
      }
      if (item.isShare == '1') {
        form.shareList.push(item0)
      }
      // if (item.isCopy == '1') {
      //   copyArr.value.push(item0)
      // }
      if (item.isDownload == '1') {
        form.downloadList.push(item0)
      }
    })
  }
}
getAllUserList()
if (!props.editId) {
  getPost(userInfo.value.userId)
}
getEditData()
const handleAuthor = async (val) => {
  if (val == '') {
    form.postName = ''
    form.deptName = ''
    form.author = ''
    return
  }
  let author = userData.value.filter((item) => {
    return item.value == form.author
  })
  form.author = author[0].label
  await getPost(val)
  let deptArr = userData.value.filter((item) => {
    return item.value == val
  })
  let id = deptArr[0].deptId
  deptList.value.forEach((item) => {
    if (item.deptId == id) {
      form.deptName = item.deptName
    }
  })
}
const knowledgeDialogRef = ref<any>()
const auxiliaryDialogRef = ref<any>()
const tagsDialogRef = ref<any>()
// 打开弹窗
const handleOpenDialog = (type) => {
  if (type === 1) {
    knowledgeDialogRef.value.openDialog(knowledgeId.value)
  } else if (type === 2) {
    auxiliaryDialogRef.value.openDialog(form.auxClassList)
  } else if (type === 3) {
    tagsDialogRef.value.openDialog(form.tagTypeList)
  }
}
const knowledgeId = ref<any>()
const knowledgeName = ref<string>()
// 删除选择的分类
const handleClose = (type, index) => {
  if (type === 1) {
    form.knowledgeTypeList = []
    knowledgeName.value = ''
    knowledgeId.value = null
  } else if (type === 2) {
    form.auxClassList.splice(index, 1)
  } else if (type === 3) {
    form.tagTypeList.splice(index, 1)
  }
}
// 知识分类点击确定
const handleKnowledgeValue = (data) => {
  if (data) {
    form.knowledgeTypeList = [data]
    knowledgeId.value = data.id
    knowledgeName.value = data.knowledgeName
  }
  ruleFormRef.value?.validateField('knowledgeTypeList')
}
// 辅助分类点击确定
const handleAuxiliaryValue = (data) => {
  form.auxClassList = data
}
// 标签点击确定
const handleTag = (data) => {
  form.tagTypeList = data
  ruleFormRef.value?.validateField('tagTypeList')
}
watch(
  () => form.files.length,
  () => {
    if (!form.files.length) {
      form.title = ''
    }
  },
  {
    immediate: true
  }
)
// 获取uuid的方法
const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
// 允许上传的文件类型
const fileType = ref<any>(['doc', 'docx', 'xls', 'xlsx', 'ppt', 'txt', 'pdf', 'pptx'])
// 上传文件之前的方法
const handleBeforeUpload = (file) => {
  // 判断文件长度
  const nameLength = file.name.length
  if (nameLength > 100) {
    ElMessage.error('上传文件名长度不能超过100个字符!')
    return false
  }
  // 校检文件类型
  if (fileType.value.length) {
    const fileName = file.name.split('.')
    const fileExt = fileName[fileName.length - 1]
    const isTypeOk = fileType.value.indexOf(fileExt.toLowerCase()) >= 0
    if (!isTypeOk) {
      ElMessage.error(`文件格式不正确, 请上传${fileType.value.join('/')}格式文件!`)
      return false
    }
  }
  // 校检文件大小
  const fileSize = file.size / 1024 / 1024 // 转换为MB
  if (fileSize > 100) {
    // 判断文件大小是否超过100
    ElMessage.warning(`${file.name}文件大小超过100MB,请重新选择`)
    return false
  }
}
//触发上传
const handleFileUpload = async (event) => {
  if (!event) {
    return
  }
  // 获取选择的文件
  const file = event.file
  const formData = new FormData()
  formData.append('file', file)
  let time = guid()
  form.files.push({
    progress: 0,
    name: file.name,
    size: file.size,
    flag: time,
    url: '',
    publicCopy: '1',
    publicDownload: '1',
    uploadStatus: null
  })
  ruleFormRef.value?.validateField('files')
  if (form.files.length) {
    // 把文件列表的第一条文件名赋值给标题
    form.title = form.files[0].name.split('.').slice(0, -1).join('.')
  }
  await uploadFileApi(formData, (event) => {
    if (event) {
      let percentComplete = (event.loaded / event.total) * 100
      // 更新正在上传的文件进度
      const updatedFiles = [...form.files]
      const indexToUpdate = updatedFiles.findIndex((f) => f.flag === time)
      if (indexToUpdate !== -1) {
        if (percentComplete >= 93) {
          percentComplete = 95
        } else if (percentComplete >= 95) {
          percentComplete = 98
        }
        updatedFiles[indexToUpdate].progress = percentComplete
        updatedFiles[indexToUpdate].uploadStatus = 1
        updatedFiles[indexToUpdate].customColor = '#409eff'
        form.files = updatedFiles
      }
    }
  }).then((res) => {
    if (res.data.code == '00000') {
      const indexToUpdate = form.files.findIndex((f) => f.flag === time)
      if (indexToUpdate > -1) {
        form.files[indexToUpdate].url = res.data.data.url
        form.files[indexToUpdate].progress = 100
        form.files[indexToUpdate].uploadStatus = 2
        form.files[indexToUpdate].customColor = '#34C724'
      }
    } else {
      const indexToUpdate = form.files.findIndex((f) => f.flag === time)
      if (indexToUpdate > -1) {
        form.files[indexToUpdate].uploadStatus = 3
        form.files[indexToUpdate].customColor = '#f56c6c'
      }
      ElMessage.error(res.data.message)
    }
  })
}
// 删除文件列表
const removeFileList = (index) => {
  if (form.files[index].id && props.editId) {
    form.fileDeleteList.push(form.files[index])
  }
  if (form.fileAddList.length) {
    let addIndex = form.fileAddList.findIndex((item) => item == form.files[index])
    if (addIndex > -1) {
      form.fileAddList.splice(addIndex, 1)
    }
  }
  form.files.splice(index, 1)
  if (index == 0) {
    form.title = form.files[0].name.split('.').slice(0, -1).join('.')
  }
  if (!form.files.length) {
    form.title = ''
    ruleFormRef.value?.validateField('files')
  }
}
const personnelSelectionRef = ref<any>()
const personFlag = ref<number>(0)
// 点击打开选择人员的弹窗
const handleAuthDialog = (flag) => {
  personFlag.value = flag
  let data: any = {}
  if (flag == 1) {
    data = getAuthData(form.searchList)
  } else if (flag == 2) {
    data = getAuthData(form.editList)
  } else if (flag == 3) {
    data = getAuthData(form.shareList)
  } else if (flag == 4) {
    data = getAuthData(form.downloadList)
  }
  personnelSelectionRef.value.openDialog(data)
}
// 人员部门群组数据转换
const getAuthData = (array: any) => {
  let data: any = { userData: [], deptData: [], groupData: [] }
  array.forEach((item: any) => {
    if (item.type == 1) {
      data.userData.push({ userId: item.authId, userName: item.name, titleId: item.titleId })
    } else if (item.type == 2) {
      data.deptData.push({ deptId: item.authId, deptName: item.name, titleId: item.titleId })
    } else if (item.type == 3) {
      data.groupData.push({ id: item.authId, name: item.name, titleId: item.titleId })
    }
  })
  return data
}
const titleId = ref<string>('')
const updateAuthOrNot = ref<string>('') // 改变权限得字段 改变1 没有空
// 选择人员确定事件
const savePerson = (data) => {
  if (props.editId) {
    updateAuthOrNot.value = '1'
  }
  let personList = []
  let deptList = []
  let groupList = []
  // 处理选择人员
  if (data.personalData && data.personalData.userList && data.personalData.userList.length) {
    personList = data.personalData.userList.map((v) => {
      return {
        authId: v.userId,
        name: v.userName,
        type: 1 // 人员 1   部门 2  群组 3
      }
    })
  }
  // 处理选择部门
  if (data.deptData && data.deptData.dept && data.deptData.dept.length) {
    deptList = data.deptData.dept.map((v) => {
      return {
        authId: v.deptId,
        name: v.deptName,
        type: 2 // 人员 1   部门 2  群组 3
      }
    })
  }
  // 处理选择群组
  if (data.groupData && data.groupData.group && data.groupData.group.length) {
    groupList = data.groupData.group.map((v) => {
      return {
        authId: v.id,
        name: v.name,
        type: 3 // 人员 1   部门 2  群组 3
      }
    })
  }
  let allArrList: any = [...personList, ...deptList, ...groupList]
  // 如果选择的是阅读权限
  if (personFlag.value == 1) {
    form.searchList = []
    addData(allArrList, form.searchList)
    editAuthList(allArrList)
    if (allArrList.length) {
      let str = JSON.stringify(form.searchList)
      form.editList = form.editList.filter((item: any) => {
        return str.includes(JSON.stringify(item))
      })
      form.shareList = form.shareList.filter((item: any) => {
        return str.includes(JSON.stringify(item))
      })
      form.downloadList = form.downloadList.filter((item: any) => {
        return str.includes(JSON.stringify(item))
      })
    } else {
      form.editList = []
      form.shareList = []
      form.downloadList = []
    }
  } else if (personFlag.value == 2) {
    // 如果选择的是编辑权限
    form.editList = []
    addData(allArrList, form.editList)
    editAuthList(allArrList)
  } else if (personFlag.value == 3) {
    // 如果选择的是分享权限
    form.shareList = []
    addData(allArrList, form.shareList)
    editAuthList(allArrList)
  } else if (personFlag.value == 4) {
    // 如果选择的是下载权限
    form.downloadList = []
    addData(allArrList, form.downloadList)
    editAuthList(allArrList)
  }
}
// 添加权限
const addData = (arr, data) => {
  arr.forEach((v) => {
    data.push({
      authId: v.authId,
      name: v.name,
      titleId: titleId.value,
      type: v.type // 人员 1   部门 2  群组 3
    })
  })
}
// 选择其他权限默认添加进阅读
const editAuthList = (arr) => {
  let setArr = arr.filter(
    (element) => !form.searchList.map((j) => j.authId).includes(element.authId)
  )
  form.searchList = [...form.searchList, ...setArr]
}
// 删除权限
const handleAuthClose = (flag, item, index) => {
  if (props.editId) {
    updateAuthOrNot.value = '1'
  }
  if (flag == 1) {
    form.searchList.splice(index, 1)
    let editIndex = form.editList.findIndex((v) => v.authId == item.authId)
    if (editIndex != -1) {
      form.editList.splice(editIndex, 1)
    }
    let shareIndex = form.shareList.findIndex((v) => v.authId == item.authId)
    if (shareIndex != -1) {
      form.shareList.splice(shareIndex, 1)
    }
    let downloadIndex = form.downloadList.findIndex((v) => v.authId == item.authId)
    if (downloadIndex != -1) {
      form.downloadList.splice(downloadIndex, 1)
    }
  } else if (flag == 2) {
    form.editList.splice(index, 1)
  } else if (flag == 3) {
    form.shareList.splice(index, 1)
  } else if (flag == 4) {
    form.downloadList.splice(index, 1)
  }
}
const ruleFormRef = ref<any>()
const loading = ref<boolean>(false)
// 发布表单
const release = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 判断文件是否上传完成
      if (form.files.length) {
        let flag = form.files.some((item) => {
          return item.progress < 100
        })
        if (flag) {
          ElMessage.warning('请等待文件上传完成')
          return
        }
      }
      loading.value = true
      if (form.searchList.length) {
        addPermissionsList(1, form.searchList)
        form.publicSearch = '0'
      } else {
        form.publicSearch = '1'
      }
      if (form.editList.length) {
        addPermissionsList(2, form.editList)
        form.publicEdit = '0'
      } else {
        form.publicEdit = '1'
      }
      if (form.shareList.length) {
        addPermissionsList(3, form.shareList)
        form.publicShare = '0'
      } else {
        form.publicShare = '1'
      }
      if (form.downloadList.length) {
        addPermissionsList(4, form.downloadList)
        form.files.forEach((item) => {
          item.publicDownload = '0'
        })
      } else {
        form.files.forEach((item) => {
          item.publicDownload = '1'
        })
      }
      if (form.knowledgeTypeList && form.knowledgeTypeList.length) {
        classificationName(1, form.knowledgeTypeList)
      }
      if (form.auxClassList && form.auxClassList.length) {
        classificationName(2, form.auxClassList)
      }
      if (form.tagTypeList && form.tagTypeList.length) {
        classificationName(3, form.tagTypeList)
      }
      let author = userData.value.filter((item) => {
        return item.value == form.author
      })
      console.log('author=>', author)
      // 是否是编辑
      if (props.editId) {
        // 判断文件是否新增
        form.files.forEach((item) => {
          if (!item.id) {
            form.fileAddList.push(item)
          }
        })
        form.id = titleId.value
        const res = await editUploadApi(form).catch(() => {
          loading.value = false
        })
        if (res) {
          let response = await updateRefCountApi(form.tagTypeList, { titleId: titleId.value })
          if (response && res) {
            ElMessage.success('修改信息成功')
            cancel()
            emitter.emit('resetDetail')
          }
        }
      } else {
        await storeAndParseApi(form)
          .then(async (res) => {
            if (res) {
              let id = res.data.id
              let response = await updateRefCountApi(form.tagTypeList, { titleId: id })
              if (response && res) {
                ElMessage.success('保存信息成功')
                cancel()
                emitter.emit('resetList')
              }
            }
          })
          .catch(() => {
            loading.value = false
          })
      }
    }
  })
}
// 根据选择权限的权限判断
const addPermissionsList = (type, arr) => {
  arr.forEach((item) => {
    let index = form.filePermissionsList.findIndex((item0) => item0.authId == item.authId)
    if (index > -1) {
      if (type === 1) {
        form.filePermissionsList[index].isSearch = '1'
      } else if (type === 2) {
        form.filePermissionsList[index].isEdit = '1'
      } else if (type === 3) {
        form.filePermissionsList[index].isShare = '1'
      } else if (type === 4) {
        form.filePermissionsList[index].isDownload = '1'
      }
    } else {
      form.filePermissionsList.push(
        Object.assign(
          {
            isSearch: type === 1 ? '1' : '',
            isEdit: type === 2 ? '1' : '',
            isShare: type === 3 ? '1' : '',
            isCopy: '',
            isDownload: type === 4 ? '1' : ''
          },
          item
        )
      )
    }
  })
}
// 分类数据名字拼接
const classificationName = (type, data) => {
  let arr: any = []
  if (type === 1 || type === 2) {
    data.forEach((item) => {
      arr.push(item.knowledgeName)
    })
  } else {
    data.forEach((item) => {
      arr.push(item.tagTypeName)
    })
  }
  if (type === 1) {
    form.knowledgeTypeName = arr.join(',')
  } else if (type === 2) {
    form.auxClassName = arr.join(',')
  } else if (type === 3) {
    form.tagTypeName = arr.join(',')
  }
}
</script>
<style lang="less">
.el-input-group__append {
  width: 20px !important;
}
</style>
<style scoped lang="less">
:deep(.el-textarea__inner) {
  font-size: 14px !important;
}
.upload_box {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  .upload_header {
    height: 60px;
    background: #ffffff;
    border-radius: 2px;
    padding: 0 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .header_left {
      font-size: 16px;
    }
    .header_right {
      display: flex;
      .cancel {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 2px;
        border: 1px solid #c9ccd4;
        margin-right: 10px;
        cursor: pointer;
      }
      .release {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 2px;
        background: #00a0e9;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .upload-form {
    margin: 30px auto;
    width: 80%;
    height: 85%;
    background: #ffffff;
    border-radius: 2px;
    display: flex;
    .form-left {
      padding: 45px 60px;
      width: 50%;
      border-right: 1px solid #ecebeb;
    }
    .form-right {
      padding: 45px 60px;
      width: 50%;
      overflow: scroll;
      .line {
        margin-top: 14px;
        margin-bottom: 19px;
        width: 98%;
        height: 1px;
        border: 1px solid #ecebeb;
      }
      .upload_list {
        width: 100%;
        max-height: 280px;
        overflow: auto;
        .upload_list_content {
          margin-top: 6px;
          .content_box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f9f9f9;
            padding: 4px 8px;
            &:hover {
              background: #f1f2f4;
            }
            .content_left {
              display: flex;
              align-items: center;
              svg {
                margin-top: -2px;
                font-size: 16px;
              }
              .fileName {
                width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .file-status {
                margin-left: 5px;
              }
            }
            .content_right {
              color: #777777;
              .content_close {
                display: inline-block;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                cursor: pointer;
                font-size: 20px;
                margin-left: 15px;
                &:hover {
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  line-height: 20px;
                  text-align: center;
                  background: #dde0e5;
                  border-radius: 4px;
                }
              }
            }
          }
        }
      }
    }
    .classification {
      cursor: pointer;
      width: 100%;
      border: 1px solid #e2e2e2;
      background: #f9f9f9;
      .classification_list {
        overflow: auto;
        overflow-x: hidden;
        max-height: 100px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        position: relative;
        box-sizing: border-box;
        text-align: left;
        font-size: 13px;
        padding: 4px 8px;
        gap: 6px;
        min-height: 30px;
        line-height: 24px;
      }
      .placeholder {
        font-family: MicrosoftYaHei;
        position: absolute;
        display: block;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #a8abb2;
      }
      .classification_content {
        .people_background {
          background: rgba(24, 165, 250, 0.15) !important;
          color: #0098f4;
          border: 1px solid #6ac7ff;
          &:hover {
            background: rgba(24, 165, 250, 0.25) !important;
          }
          .classification-close {
            color: #0098f4 !important;
          }
        }
        .dept_background {
          background: rgba(250, 169, 0, 0.15) !important;
          color: #ff9600;
          border: 1px solid #ffc142;
          &:hover {
            background: rgba(250, 169, 0, 0.25) !important;
          }
          .classification-close {
            color: #ff9600 !important;
          }
        }
        .group_background {
          background: rgba(31, 190, 165, 0.15) !important;
          color: #10bea1;
          border: 1px solid #3fdac1;
          &:hover {
            background: rgba(31, 190, 165, 0.25);
          }
          .classification-close {
            color: #10bea1 !important;
          }
        }
        .classification_item {
          display: flex;
          align-items: center;
          background: #e6e6e6;
          padding: 0 8px;
          &:hover {
            background: #dadada;
          }
          .item_span {
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .classification-close {
            font-size: 18px;
            cursor: pointer;
            color: #8a8a8a;
            display: inline-block;
            line-height: 20px;
            text-align: center;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
  .file-icon {
    font-size: 30px !important;
  }
  .upload_text {
    font-weight: bold;
  }
}
:deep(.el-input__count-inner) {
  background: none !important;
}
:deep(.file-btn > span) {
  font-size: 14px !important;
}
:deep(.el-progress .el-progress-bar__outer) {
  height: 4px !important;
}
:deep(.el-input__inner) {
  font-size: 14px !important;
  font-family: 'MicrosoftYaHei' !important;
}
:deep(.el-upload__text em) {
  font-weight: bold;
  text-decoration: underline !important;
}
:deep(.upload-demo) {
  width: 100%;
}
:deep(.el-upload-dragger) {
  padding: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  height: 70px !important;
  border: 2px dashed #e2e2e2;
  &:hover {
    background: #e6f7ff;
    border: 2px dashed #00a0e9;
  }
}
:deep(.el-select) {
  width: 100% !important;
}
</style>