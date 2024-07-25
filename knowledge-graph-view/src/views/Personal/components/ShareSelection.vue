<template>
  <Dialog
    class="ShareSelectionDialog"
    ref="TagsDialogRef"
    width="41%"
    v-model="ShareSelectionVisible"
    title="选择人员"
    @closed="closed"
  >
    <ul class="ShareNav">
      <li @click="navClick(1)" :class="form.type == 1 ? 'active' : ''">链接分享</li>
      <li @click="navClick(2)" :class="form.type == 2 ? 'active' : ''">发送好友</li>
    </ul>
    <div class="content" v-show="form.type == 1">
      <div v-if="linkFlag">
        <el-form label-width="5.4vw" ref="formRef" :model="form">
          <el-form-item label="提取方式：">
            <el-radio-group
              v-model="form.withCode"
              @change="withCodeChange"
              class="extractionMethod"
            >
              <el-radio :label="0">无提取码</el-radio>
              <el-radio :label="1">有提取码</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" v-if="form.withCode == 1">
            <div class="-mt-14px">
              <input
                class="extractCode"
                maxlength="4"
                @input="extractCodeInput"
                v-model="form.extractCode"
                type="text"
              />
              <p class="tip">支持4位数字或字母</p>
            </div>
          </el-form-item>
          <el-form-item label="有效期：">
            <el-radio-group v-model="form.effectiveDays">
              <el-radio :label="item.value" v-for="(item, index) in validityPeriod" :key="index">{{
                item.label
              }}</el-radio>

              <el-radio :label="-2"
                >自定义<input
                  @input="customDayInput"
                  class="customDay"
                  maxlength="4"
                  v-model="customDay"
                  type="text"
                />天</el-radio
              >
            </el-radio-group>
            <!-- <el-radio v-model="radio1" label="2">{{ item.value }}</el-radio> -->
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-form label-width="5.4vw">
          <el-form-item label="链接：">
            <div class="normalConnection">
              <input class="linkInput" :disabled="true" v-model="linkURL" type="text" />
              <p v-if="form.effectiveDays == -1">链接永久有效</p>
              <p v-else
                >链接{{ form.effectiveDays == -2 ? customDay : form.effectiveDays }}天后失效</p
              >
            </div>
          </el-form-item>
          <el-form-item label="提取码：" v-if="form.extractCode">
            <div class="flex justify-between w-full">
              <input class="extractCode" type="text" :disabled="true" v-model="form.extractCode" />
              <el-button class="copyLink" type="primary" @click="copylink(true)"
                >复制链接及提取码</el-button
              >
            </div>
          </el-form-item>
          <el-button v-else class="copyHref float-right" type="primary" @click="copylink(false)"
            >复制链接</el-button
          >
        </el-form>
      </div>
    </div>
    <div v-show="form.type == 2">
      <div class="contentPersonnel">
        <Personnel :isDeptImg="false" v-model="userData" personnelHeight="22.5vw" />
      </div>
      <div class="personnelValidity">
        <div class="pl-20px w-[5.2vw]">有效期：</div>
        <el-radio-group v-model="form.effectiveDays">
          <el-radio :label="item.value" v-for="(item, index) in validityPeriod" :key="index">{{
            item.label
          }}</el-radio>
          <el-radio :label="-2"
            >自定义<input
              class="customDay"
              @input="customDayInput"
              v-model="customDay"
              maxlength="4"
              type="text"
            />天</el-radio
          >
        </el-radio-group>
      </div>
    </div>

    <template #footer>
      <div class="footer my-20px">
        <!-- <el-button class="footer_btn" type="primary" @click="submit()">提交</el-button> -->
        <el-button
          class="footer_btn"
          :class="(form.type == 1 && linkFlag) || form.type == 2 ? '' : 'mr-[1.67vw]'"
          @click="close()"
          >取消</el-button
        >
        <el-button
          v-if="(form.type == 1 && linkFlag) || form.type == 2"
          :loading="loading"
          class="footer_btn mr-[1.67vw]"
          type="primary"
          @click="share()"
          >分享</el-button
        >
        <!-- <el-button
          v-if="form.type == 1 && !linkFlag"
          v-loading="loading"
          class="footer_btn mr-[1.67vw]"
          type="primary"
          @click="ShareSelectionVisible = false"
          >分享</el-button
        > -->
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { h, reactive, ref, unref, nextTick, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { Dialog } from '@/components/Dialog'
import Personnel from '@/components/PersonnelSelection/src/personnel.vue'
import { ElButton, ElMessage } from 'element-plus'
import { shareApi } from '@/api/personal/myShare'

interface userList {
  userId: String
  userName?: String
}

interface user {
  userList: userList[]
}

interface updata {
  titleId: Number | String
  type: Number | String
  withCode: Number | String
  extractCode: Number | String
  effectiveDays: Number | String
  users?: userList[]
}

const customDay = ref()
const formRef = ref()
const form = ref({
  titleId: 0,
  withCode: 0,
  type: 1, //1链接分享 2发给好友
  extractCode: '', // 提取码
  effectiveDays: -1, //总有效天数 -1为永久有效
  users: []
})
const emit = defineEmits(['shareToSuccess'])
const loading = ref(false)
const withCodeChange = (e) => {
  if (!e) {
    form.value.extractCode = ''
  }
}

const linkFlag = ref<boolean>(true)
const extractCodeInput = (e) => {
  form.value.extractCode = form.value.extractCode.replace(/[^a-zA-Z0-9]/g, '')
}

const customDayInput = () => {
  customDay.value = customDay.value.replace(/[^0-9]/g, '')
}

const close = () => {
  ShareSelectionVisible.value = false
}

const userData = ref<user>()
const validityPeriod = reactive([
  {
    value: -1,
    label: '永久有效'
  },
  {
    value: 365,
    label: '365天'
  },
  {
    value: 30,
    label: '30天'
  },
  {
    value: 7,
    label: '7天'
  },
  {
    value: 1,
    label: '1天'
  }
])
const ShareSelectionVisible = ref(false)
const navClick = (e) => {
  form.value.type = e
  if (e) {
    form.value.withCode = 0
  }
}

const linkURL = ref()
const closed = () => {
  //   selectionList.value = []
}
const openDrawer = (titleId: number) => {
  loading.value = false
  linkURL.value = import.meta.env.VITE_URL + 'myDetail/' + titleId
  form.value.extractCode = ''
  form.value.effectiveDays = -1
  form.value.type = 1
  form.value.withCode = 0
  customDay.value = ''
  linkFlag.value = true
  form.value.titleId = titleId
  ShareSelectionVisible.value = true
}

const shareToSuccess = () => {
  emit('shareToSuccess')
}

const share = () => {
  if (form.value.withCode == 1 && form.value.extractCode.length < 4) {
    ElMessage.error('请输入正确的提取码！')
    return false
  }

  if (form.value.effectiveDays == -2 && (customDay.value <= 0 || !customDay.value)) {
    ElMessage.error('请输入正确的有效期！')
    return false
  }
  // 链接分享
  let data: updata
  if (form.value.type == 1) {
    data = {
      titleId: form.value.titleId,
      type: form.value.type,
      withCode: form.value.withCode,
      extractCode: form.value.extractCode,
      effectiveDays: form.value.effectiveDays == -2 ? customDay.value : form.value.effectiveDays,
      users: []
    }
  } else if (form.value.type == 2) {
    if (!userData.value?.userList.length) {
      ElMessage.error('请选择需要分享的人员！')
      return false
    }

    data = {
      titleId: form.value.titleId,
      type: form.value.type,
      withCode: form.value.withCode,
      extractCode: form.value.extractCode,
      effectiveDays: form.value.effectiveDays == -2 ? customDay.value : form.value.effectiveDays,
      users: userData.value
        ? userData.value.userList.map((v) => {
            return {
              userId: v.userId
            }
          })
        : []
    }
  }
  shareLink(data)
}

const shareLink = async (data) => {
  loading.value = true

  try {
    let res = await shareApi(data)
    if (res && res.code == '00000') {
      if (form.value.type == 1) {
        linkURL.value = linkURL.value + '/uuid/' + res.data
        linkFlag.value = false
      } else {
        ElMessage.success('分享成功！')
        ShareSelectionVisible.value = false
        shareToSuccess()
      }
    } else {
      ElMessage.error(res.message)
    }
    loading.value = false
  } catch {
    loading.value = false
  }
}

// 复制链接
const copylink = (isCode: boolean) => {
  const textarea: any = document.createElement('textarea')
  // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
  textarea.readOnly = 'readonly'
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'

  if (isCode) {
    textarea.value = '链接：' + linkURL.value + '\n' + '提取码：' + form.value.extractCode
  } else {
    textarea.value = '链接：' + linkURL.value
  }
  // 将 textarea 插入到 body 中
  document.body.appendChild(textarea)
  // 选中值并复制
  textarea.select()
  const result = document.execCommand('Copy')
  if (result) {
    ElMessage.success('复制成功')
  }
  document.body.removeChild(textarea)
}

defineExpose({
  openDrawer
})
</script>

<style scoped lang="less">
.tags-dialog {
  :deep(.el-dialog__body) {
    padding: 10px 20px;
  }
}

.ShareNav {
  display: flex;
  li {
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    text-align: left;
    padding-bottom: 5px;
    margin: 10px 10px 2px 0;
  }
  .active {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    border-bottom: 3px solid #00a0e9;
  }
}

.content {
  padding: 60px 5px 0;
  margin: 15px 0 30px;
  width: 100%;
  height: 25.4vw;
  border-radius: 4px 4px 0px 0px;
  border: 1px solid #e2e2e2;
}

.contentPersonnel {
  margin-top: 15px;
  width: 37.5vw;
  height: 22.5vw;
  border-radius: 4px 4px 0px 0px;
  border: 1px solid #e2e2e2;
}

.extractCode,
.linkInput {
  height: 36px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e2e2e2;
  outline: none;
  padding: 14px;
}

.customDay {
  margin: 0 4px;
  width: 60px;
  padding: 0 14px;
  height: 36px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e2e2e2;
  outline: none;
}

.tip {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #999999;
}

.normalConnection {
  width: 30.2vw;
  position: relative;
  .linkInput {
    width: 580px;
    padding-right: 130px;
  }
  p {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
:deep(.linkInput) {
  width: 30.2vw !important;
}

.copyLink {
  width: 140px;
  height: 36px;
  background: #00a0e9;
  border-radius: 4px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
  margin-right: 20px;
}

.copyHref {
  width: 90px;
  height: 36px;
  background: #00a0e9;
  border-radius: 4px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
  margin-right: 32px;
}

.personnelValidity {
  height: 4.48vw;
  display: flex;
  align-items: center;
}

:deep(.extractionMethod) {
  .el-radio-group {
    display: flex;
    flex-direction: column;
  }
  .el-radio {
    width: 100%;
  }
}
</style>

<style>
.ShareSelectionDialog .el-dialog__body {
  padding: 10px 28px 0 !important;
}

.ShareSelectionDialog .el-dialog__header {
  background: #fff !important;
  border-color: #fff !important;
  > div {
    span + div {
      display: none !important;
    }
  }
}
</style>
