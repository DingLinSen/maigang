<template>
  <ContentWrap :style="{ height: height }" Showtitle="个人中心">
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
                <div class="pull-right">{{ state.user.userName || '--' }}</div>
              </li>
              <li class="list-group-item">
                <Icon icon="svg-icon:phone" class="icon-left" />手机号码
                <div class="pull-right">{{ state.user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <Icon icon="svg-icon:email" class="icon-left" />用户邮箱
                <div class="pull-right">{{ state.user.email }}</div>
              </li>
              <li class="list-group-item">
                <Icon icon="svg-icon:tree" class="icon-left" />所属部门
                <div class="pull-right" v-if="state.user.dept"
                  >{{ state.user.dept.deptName }} / {{ state.postGroup }}</div
                >
              </li>
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
import { ContentWrap } from '@/components/ContentWrap'
import { ElRow, ElCol, ElCard, ElTabs, ElTabPane } from 'element-plus'
import { UserAvatar, UserInfo, ResetPwd } from './components/index'
import { useCache } from '@/hooks/web/useCache'
import { computed, onMounted, reactive, ref } from 'vue'
import { getUserProfileApi } from '@/api/user'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const height = ref('auto' as string)

const { emitter } = useEmitt({
  name: 'user',
  callback: (type: string) => {
    if (type === 'refresh') {
      getUser()
    }
  }
})

const { wsCache } = useCache()

const activeTab = ref('userinfo')

const state = ref<any>({
  user: {},
  roleGroup: {},
  postGroup: {}
})
const getUser = async () => {
  await getUserProfileApi().then((response) => {
    state.value.user = response.data.user
    state.value.user.emailReceive = response.data.emailReceive
    state.value.roleGroup = response.data.roleGroup
    state.value.postGroup = response.data.postGroup
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
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout-content-scrollbar')
  // const windowHeight = document.documentElement.offsetHeight
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  //底部高度
  let footerHeight = 0
  const footer = document.querySelector('.v-footer')
  if (footer) {
    footerHeight = footer.clientHeight
  }
  // const documentClientHeight = appStore.getDocumentClientHeight
  height.value = layoutContentH - 20 - footerHeight + 'px'
  console.log('height.value==>', height.value)
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
