<template>
  <WhiteDialog
    v-model="versionShow"
    class="dialog-bg-class"
    title="当前版本"
    :maxHeight="'auto'"
    width="50%"
    title-align="center"
    @closed="handleClose"
    @toggle-full="toggleFull"
  >
    <div style="width: 100%; height: 100%" :style="{ maxHeight: divHeight + 'px' }">
      <el-form :model="versionInfo" class="version-form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本号：" prop="versionNumber">
              <p>
                {{ versionInfo && versionInfo.versionNumber ? versionInfo.versionNumber : '' }}</p
              >
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发版时间：" prop="publishTime">
              <p> {{ versionInfo && versionInfo.publishTime ? versionInfo.publishTime : '' }}</p>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
            <el-form-item label="创建时间：" prop="createTime">
              <p> {{ versionInfo && versionInfo.createTime ? versionInfo.createTime : '' }}</p>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="创建者：" prop="createByName">
              <p> {{ versionInfo && versionInfo.createByName ? versionInfo.createByName : '' }}</p>
            </el-form-item>
          </el-col> -->

          <el-col :span="24">
            <el-form-item label="版本说明：" prop="versionDescription">
              <div v-html="versionInfo && versionInfo.versionDescription" class="diaContent"> </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <ElButton type="primary" @click="go2VersionPage"> 历史版本</ElButton>
    </template>
  </WhiteDialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WhiteDialog } from '@/components/WhiteDialog'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useCache } from '@/hooks/web/useCache'
import { getVersionDetailApi } from '@/api/version'

//当前版本信息
const { wsCache } = useCache()
const versionInfo = ref<any>()

const appStore = useAppStore()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
// 注册
onMounted(() => {
  resetHeight()
})

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetHeight()
    }
  }
})

const resetHeight = () => {
  divHeight.value = documentClientHeight.value * 0.6
}

const divHeight = ref<number>(300)
const toggleFull = (isFull: boolean) => {
  if (isFull) {
    divHeight.value = documentClientHeight.value - getSearchWrapperHeight() - 70
  } else {
    divHeight.value = documentClientHeight.value * 0.55
  }
}

const getSearchWrapperHeight = (): number => {
  //搜索框加操作栏高度
  let topH = 0
  const searchWrapper = document.querySelector('.el-dialog__header')
  if (searchWrapper) {
    topH = searchWrapper.clientHeight
  }
  return topH
}
const { replace } = useRouter()

const versionShow = ref<boolean>(false)

//前往版本说明页面
const go2VersionPage = () => {
  nextTick()
  versionShow.value = false
  replace('/Version/VersionManage')
}

//打开弹窗
const open = () => {
  versionShow.value = true
  versionInfo.value = wsCache.get('version')
  readVersionInfo()
}

//已读
const readVersionInfo = async () => {
  if (versionInfo.value.readFlag != '1') {
    const res = await getVersionDetailApi(versionInfo.value.id)
    if (res && res.data) {
      versionInfo.value.readFlag = '1'
      wsCache.set('version', versionInfo.value)
    }
  }
}

defineExpose({
  open
})
</script>

<style lang="less" scoped>
.font-version {
  padding: 0px 2vw;
  width: 100%;
  font-size: 14px;
  word-break: break-word;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
}
.diaContent {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px !important;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  img {
    max-width: 100%;
    display: inline-block;
  }
  p {
    font-size: 14px !important;
    font-family: Alibaba PuHuiTi R;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    img {
      display: inline-block !important;
    }
  }
}
.version-form {
  .el-form-item {
    margin-bottom: 1vh !important;
  }
}
</style>