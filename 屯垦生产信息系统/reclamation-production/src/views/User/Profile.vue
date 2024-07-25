<template>
  <ContentWrap :style="{ height: height }">
    <ElRow :gutter="20">
      <ElCol :span="6" :xs="24">
        <ElCard class="box-card">
          <template #header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <UserAvatar :user="state.user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <Icon icon="svg-icon:user" class="icon-left" />用户名称
                <div class="pull-right">{{ state.user?.userName || '--' }}</div>
              </li>
              <li class="list-group-item">
                <Icon icon="svg-icon:phone" class="icon-left" />联系方式
                <div class="pull-right">{{ state.user?.phonenumber || '--' }}</div>
              </li>
              <!-- <li class="list-group-item">
                <Icon icon="svg-icon:email" class="icon-left" />用户邮箱
                <div class="pull-right">{{ state.user.email }}</div>
              </li> -->
              <!-- <li class="list-group-item">
                <Icon icon="svg-icon:tree" class="icon-left" />所属部门
                <div class="pull-right" v-if="state.user.dept"
                  >{{ state.user.dept.deptName }} / {{ state.postGroup }}</div
                >
              </li> -->
              <li class="list-group-item">
                <Icon icon="svg-icon:peoples" class="icon-left" />所属角色
                <div class="pull-right">{{ state.roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <Icon icon="svg-icon:date" class="icon-left" />创建日期
                <div class="pull-right">{{ state.user.createTime }}</div>
              </li>
            </ul>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="18" :xs="24">
        <ElCard style="height: 484px">
          <template #header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <ElTabs v-model="activeTab">
            <ElTabPane label="基本资料" name="userinfo">
              <UserInfo :user="state.user" />
            </ElTabPane>
            <ElTabPane label="修改密码" name="resetPwd">
              <ResetPwd />
            </ElTabPane>
          </ElTabs>
        </ElCard>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElRow, ElCol, ElCard, ElTabs, ElTabPane } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { UserAvatar, UserInfo, ResetPwd } from './components/index'
// import { useCache } from '@/hooks/web/useCache'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { getUserProfileApi } from '@/api/user'

const appStore = useAppStore()

const height = ref('auto' as string)

useEmitt({
  name: 'user',
  callback: (type: string) => {
    if (type === 'refresh') {
      getUser()
    }
  }
})

const activeTab = ref('userinfo')

const state = reactive<any>({
  user: {},
  roleGroup: {},
  postGroup: {}
})
const getUser = () => {
  getUserProfileApi().then((response: any) => {
    state.user = response.data.user
    state.roleGroup = response.data.roleGroup
    state.postGroup = response.data.postGroup
  })
}
getUser()

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetPageHeight()
    }
  }
})

const resetPageHeight = () => {
  //底部高度
  let footerHeight = 0
  const footer = document.querySelector('.v-footer')
  if (footer) {
    footerHeight = footer.clientHeight
  }
  const documentClientHeight = appStore.getDocumentClientHeight
  height.value = documentClientHeight - 130 - footerHeight + 'px'
}

onMounted(() => {
  resetPageHeight()
})
</script>

<style lang="less" scoped>
.text-center {
  text-align: center;
}

.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 13px;
}

.pull-right {
  float: right !important;
}

.icon-left {
  margin-right: 5px;
  vertical-align: -2px;
}
</style>
