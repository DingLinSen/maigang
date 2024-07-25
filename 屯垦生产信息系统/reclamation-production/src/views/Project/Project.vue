<script lang="ts" setup>
import { h, reactive, ref, nextTick } from 'vue'

import { ContentWrap } from '@/components/ContentWrap'
import { ElInput, ElButton, ElSelect, ElPagination } from 'element-plus'
import { ProjectForm } from './components/index'
const ProjectFormRef = ref<ComponentRef<typeof ProjectForm>>()

const currentPage4 = ref(4)
const pageSize4 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
//table操作栏按钮事件
const action = (row: any, type: string) => {
  nextTick(() => {
    ProjectFormRef.value?.openDrawer(type, 1)
  })
}
</script>

<template>
  <ContentWrap class="mt-7px mb-10px">
    <div class="search">
      <div>
        <span class="label">项目名称</span>
        <ElInput class="search_input" v-model="input" placeholder="请输入项目名称" />
      </div>
      <div style="margin-left: 10px">
        <span class="label">建设阶段</span>
        <ElSelect
          v-model="value"
          class="m-2 search_select"
          placeholder="请选择建设阶段"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </div>
      <div style="margin-left: 10px">
        <span class="label">建设进度</span>
        <ElSelect
          v-model="value"
          class="m-2 search_select"
          placeholder="请选择建设进度"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </div>
      <ElButton type="primary">
        <Icon icon="ep:search" class="mr-5px" />
        查询
      </ElButton>
      <ElButton class="btn-default">
        <Icon icon="ep:refresh-right" class="mr-5px" />
        重置
      </ElButton>
    </div>
    <div class="project_box">
      <div class="project_list">
        <div class="project_item" v-for="item in 6" :key="item">
          <div class="item_title">
            <div class="title_left"> 养殖 </div>
            <div class="title_content">
              <div class="content_top">生态肉羊养殖基地扶贫项目</div>
              <span class="content_bottom">第一阶段</span>
            </div>
            <div class="title_status"> 正常 </div>
          </div>
          <div class="item_content">
            在盘鳌、广济、万盛、秦家、多悦扶持贫困农户发展年初栏肉羊150只的适度规模生态肉羊养殖场247个...
          </div>
          <div class="item_btn">
            <ElButton type="primary" @click="action(row, 'see')"> 详情 </ElButton>
            <ElButton class="btn-default" @click="action(row, 'edit')"> 编辑 </ElButton>
          </div>
        </div>
      </div>
      <div class="pagination">
        <ElPagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[100, 200, 300, 400]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </ContentWrap>
  <ProjectForm title="" ref="ProjectFormRef" @get-class-room-list="getList()" />
</template>
<style lang="less">
.search_input {
  width: 180px;
  height: 32px;
}
.search_select {
  width: 180px !important;
}
</style>
<style lang="less" scoped>
.search {
  display: flex;
  align-items: center;
}
.label {
  color: #606266;
  font-size: 14px;
  margin-right: 10px;
}
.project_box {
  height: 80vh;
  position: relative;
  .pagination {
    position: absolute;
    bottom: 0px;
    right: 10px;
  }
}
.project_list {
  padding-top: 6px;
  border-top: 1px solid #ccc;
  display: flex;
  flex-wrap: wrap;
  .project_item {
    margin: 5px 10px 0 0;
    padding: 15px;
    border: 1px solid #ccc;
    width: 24%;
    position: relative;
    height: 190px;
    box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
    .item_title {
      display: flex;
      .title_left {
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        background-color: #f8f1e8;
        color: #e2b958;
        margin-right: 10px;
      }
      .title_content {
        .content_top {
          font-weight: bold;
        }
        .content_bottom {
          font-size: 14px;
          border: 1px solid #70b47b;
          color: #74b57e;
        }
      }
      .title_status {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #e5fcea;
        color: #8bde4d;
        font-size: 14px;
        width: 60px;
        text-align: center;
        height: 25px;
        line-height: 25px;
      }
    }
    .item_content {
      margin-top: 10px;
      font-size: 14px;
    }
    .item_btn {
      margin-top: 10px;
    }
  }
}
</style>