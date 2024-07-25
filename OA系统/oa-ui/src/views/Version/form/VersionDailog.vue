<template>
  <ElDialog
    ref="elDialogRef"
    class="cultivate-custom"
    :width="'50%'"
    :maxHeight="'auto'"
    v-model="dialogFlag"
    :title="props.title"
    @closed="resetFormAfterClose"
  >
    <el-form :model="props.content" class="version-form" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="版本号：" prop="versionNumber">
            <p> {{ props.content.versionNumber ? props.content.versionNumber : '' }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="发版时间：" prop="publishTime">
            <p> {{ props.content.publishTime ? props.content.publishTime : '' }}</p>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="24">
          <el-form-item label="创建时间：" prop="createTime">
            <p> {{ props.content.createTime ? props.content.createTime : '' }}</p>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="创建者：" prop="createByName">
            <p> {{ props.content.createByName ? props.content.createByName : '' }}</p>
          </el-form-item>
        </el-col> -->

        <el-col :span="24">
          <el-form-item label="版本说明：" prop="versionDescription">
            <div v-html="props.content.versionDescription" class="diaContent"> </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { downloadFile } from '@/utils/index'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { ElDialog } from '@/components/ElDialog'

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

const elDialogRef = ref()

const props = defineProps({
  content: propTypes.object.def({}),
  title: propTypes.string.def('版本说明')
})

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

// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
//打开drawer并初始化
const openDrawer = () => {
  divHeight.value = documentClientHeight.value * 0.55
  elDialogRef.value.isFullscreen = false
  dialogFlag.value = true
}

const resetFormAfterClose = () => {
  elDialogRef.value.isFullscreen = false
}

defineExpose({
  openDrawer
})
</script>

<style lang="less" scoped>
.dialog-header-bg-class {
  border-radius: 4px;
  background: white !important;
  font-size: 16px !important;
  font-family: Alibaba PuHuiTi M;
  border-bottom: 1px solid var(--tags-view-border-color);
}
.dialog-body-bg-class {
  padding: 15px !important;
}
.link {
  color: #00a0e9;
  cursor: pointer;
}
.type-class {
  font-size: 14px !important;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  padding: 0 15px;
}
.diaContent {
  white-space: pre-wrap;
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
:deep(ul) {
  list-style: disc !important;
}
:deep(a) {
  color: #00a0e9;
  text-decoration: underline !important;
}
:deep(table) {
  border: 1px solid black;
}
:deep(tr) {
  border: 1px solid black;
}
:deep(th) {
  min-width: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid black;
}
:deep(td) {
  min-width: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid black;
}
:deep(h1) {
  font-size: 22px;
  font-weight: bold;
}
:deep(h2) {
  font-size: 20px;
  font-weight: bold;
}
:deep(h3) {
  font-size: 18px;
  font-weight: bold;
}
:deep(h4) {
  font-size: 16px;
  font-weight: bold;
}
:deep(h5) {
  font-size: 14px;
  font-weight: bold;
}
.version-form {
  .el-form-item {
    margin-bottom: 1vh !important;
  }
}
</style>
<style lang="less">
.diaContent {
  img {
    display: inline-block !important;
  }
}
</style>
