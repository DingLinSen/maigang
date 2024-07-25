<!-- 表单列表 -->
<script setup lang="ts">
import { ProjectDetails } from '@/views/Components/ProjectDetails/index'
import { ContentWrap } from '@/components/ContentWrap' // 内容块
import { Search } from '@/components/Search' // 搜索组件
import {
  ElButton,
  ElDialog,
  ElMessageBox,
  ElTag,
  ElMessage,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { Table } from '@/components/Table'
import { ElDesignForm } from '@/components/ElGenerateForm' // 表单设计器
import { Dialog } from '@/components/Dialog'
import { getPostListApi, delPostListApi, exportPostListApi } from '@/api/post'
import { useTable } from '@/hooks/web/useTable'
import { PostData } from '@/api/post/types'
import { getCurrentInstance, h, reactive, ref, unref, computed, onMounted } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'

defineOptions({
  name: 'FormList'
})

// 控制显示弹窗
const formModel = ref<boolean>(false)
// 弹窗名称
const formTitle = ref<string>('表单001')
// 是否为全屏
const fullscreen = ref<boolean>(true)

const appStore = useAppStore()

onMounted(() => {})

// 打开dialog
const showFormDialog = () => {
  formModel.value = true
}

// 关闭弹窗
const closeDialog = () => {
  formModel.value = !unref(formModel).value
}
</script>

<template>
  <ContentWrap class="mb-10px top-wrap">
    <ElButton @click="showFormDialog">表单设计666</ElButton>
    <ElDialog
      v-model="formModel"
      :title="`${formTitle} - 表单设计器`"
      :fullscreen="fullscreen"
      :close-on-click-modal="true"
      :destroy-on-close="true"
      :show-close="true"
      :class="'formListDio'"
    >
      <ElDesignForm />
      <!-- 头部 -->
      <template #header>
        <div class="flex justify-between divide-y">
          <slot name="title">
            <span> {{ formTitle + ' - 表单设计器' }}</span>
          </slot>
          <!-- 全屏按钮 -->
          <!-- <Icon
            v-if="fullscreen"
            class="mr-18px cursor-pointer is-hover mt-2px z-10"
            :icon="fullscreen ? 'zmdi:fullscreen-exit' : 'zmdi:fullscreen'"
            color="var(--el-color-info)"
            @click="closeDialog"
          /> -->
        </div>
      </template>

      <!-- 内容区域 -->
    </ElDialog>
  </ContentWrap>
</template>
