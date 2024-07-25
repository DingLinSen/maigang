<template>
  <div class="body">
    <div class="content">
      <div class="content-title">
        <div class="logo-application">
          <img class="logo-img" src="@/assets/imgs/login/logo.png" />
        </div>
        <div class="info-option">
          <ElDropdown :class="prefixCls" trigger="click">
            <div class="user-info">
              <span>
                <img class="user-info-img" :src="userImg" />
              </span>
              <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
                userName ? userName : null
              }}</span>
            </div>
            <template #dropdown>
              <ElDropdownMenu class="exit-login">
                <ElDropdownItem>
                  <div @click="exitLogin">{{ t('common.loginOut') }}</div>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
      </div>
      <div class="content-body">
        <div class="app-item" v-for="(item, index) in appList" :key="index">
          <div class="app-link" @click="toPushLink(item)">
            <ElImage :src="item.img" class="link-img" fit="cover" />
          </div>
          <div class="app-name" :title="item.name">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="copyright">Copyright ©2021-present 麦港协同办公系统</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElDropdown, ElDropdownMenu, ElMessageBox, ElImage } from 'element-plus'
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { changeList } from '@/api/change/index'
import { useDesign } from '@/hooks/web/useDesign'
import { loginApi, loginOutApi } from '@/api/login'
import getAssetsFile from '@/utils/pubUse' // 引入图片路径
import { useAppStoreWithOut } from '@/store/modules/app' // 引入全局保存的信息
import { useCache } from '@/hooks/web/useCache' // 引入全局保存信息的使用方法
const appList = ref<any>([])
const appStore = useAppStoreWithOut()
const { t } = useI18n()
// 使用路由
const { push } = useRouter()
const { wsCache } = useCache()
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')
// 获取cookies
const { cookies } = useCookies()
// 获取当前的登陆人
const userName = ref('')
// 获取登录人头像
const userImg = ref('')
//查询点击
const initAppliacationList = async () => {
  let params = {}
  await changeList(params).then((res) => {
    if (res.data) {
      const data = res.data
      data.list.forEach((item) => {
        // 默认路径可能为'-'，数据库添加时,
        appList.value.push({
          img: item.icon && item.icon !== '-' ? item.icon : getAssetsFile('home/logo1.png'),
          name: item.name ? item.name : '--',
          defaultRedirectUri: item.defaultRedirectUri ? item.defaultRedirectUri : '--',
          clientId: item.clientId ? item.clientId : '--'
        })
      })
    }
  })
}
// 跳转外部地址
const toPushLink = async (item) => {
  // 获取此项数据，判断是否为后台管理系统或外部系统，
  // 地址应为res中返回的defaultRedirectUrioaManage
  if (item.clientId === 'ssoManage') {
    push({ path: '/ssoManage' })
  } else {
    // 调用获取code接口获取code，获取item的路由，根据defaultRedirectUri中是否有参数来使用不同的方式拼接code并跳转
    const params: any = {
      clientId: item.clientId,
      redirectUri: item.defaultRedirectUri
    }
    // 4549160f5c6a4037ab0a7f6d633580cf为sso后台管理系统，不需要通过code来获取token
    let defaultRedirectUri = item.defaultRedirectUri
    if (item.clientId === '4549160f5c6a4037ab0a7f6d633580cf') {
      window.open(defaultRedirectUri)
    } else {
      await loginApi(params).then((res) => {
        let code = res.data
        let index = defaultRedirectUri.indexOf('?')
        // 地址根据地址中是否已有参数来通过&或？拼接code
        if (index !== -1) {
          window.open(defaultRedirectUri + '&code=' + code)
        } else {
          window.open(defaultRedirectUri + '?code=' + code)
        }
      })
    }
  }
}
// 退出登录
const exitLogin = async () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  }).then(async () => {
    await loginOutApi().then((res) => {
      if (res.message === 'OK') {
        ElMessage.success('退出登录成功')
        cookies.remove('access_token')
        cookies.remove('TGC')
        cookies.remove('user_info')
        cookies.remove('refresh_token')
        cookies.remove('Admin-Expires-In')
        wsCache.set(appStore.getUserInfo, null)
        wsCache.clear()
        push({ path: '/login' })
      }
    })
  })
}
onMounted(() => {
  const useInfo = wsCache.get(appStore.getAgetName)
  userName.value = useInfo
  const useImg = wsCache.get('userInfo').avatar
  userImg.value = useImg ? useImg : '@/assets/imgs/home/loginUser.png'
  initAppliacationList()
})
</script>

<style lang="less" scoped>
.body {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.content {
  margin: auto;
  background: linear-gradient(0deg, #daecfa 0%, #f5f9fd 100%);
  height: 100%;
  width: 100%;
  position: relative;
  flex-direction: column;
  display: flex;
  min-width: 1000px;
  min-height: 550px;

  .content-title {
    margin: 0 auto;
    width: 100%;
    min-width: 800px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 7rem;
    .logo-application {
      width: 280px;
      padding: 2rem 0 0 2.69rem;

      .logo-img {
        display: inline-block;
        vertical-align: middle;
        height: 2.375rem;
        width: 6.245rem;
        margin-right: 5px;
      }

      .logo-name {
        vertical-align: middle;
        color: #2f61db;
        font-size: 24px;
        font-weight: 500;
        font-family: Alibaba PuHuiTi M;
      }
    }

    .info-option {
      justify-content: right;
      padding: 1rem 1.5rem 0 0;

      .user-info {
        cursor: pointer;
        display: inline-block;
        margin-left: 1rem;

        .user-info-img {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 2.25rem;
          display: inline-block;
          margin-right: 8px;
        }

        span {
          display: inline-block;
          vertical-align: middle;
          font-family: Alibaba PuHuiTi R;
          font-size: 1rem;
          line-height: 1rem;
          color: #222222;
        }
      }
    }
  }

  .content-body {
    flex: 1;
    width: 61.2rem;
    margin: 0 auto;
    min-width: 900px;
    display: flex;
    gap: 3rem 2.5rem;
    flex-wrap: wrap;
    align-content: flex-start;
    .app-item {
      height: 9.82rem;
      min-height: 157px;
      .app-link {
        cursor: pointer;
        background: #fff;
        padding: 2.06rem 1.19rem 1.9rem;
        box-shadow: 0px 0px 6px 0px rgba(6, 0, 1, 0.08);
        border-radius: 6px;
        .link-img {
          display: inline-block;
          height: 4.125rem;
          width: 10.625rem;
          min-height: 66px;
          min-width: 160px;
        }
      }
      .app-link:hover {
        background-image: linear-gradient(0deg, #daecfa 0%, #f5f9fd 100%);
      }
      .app-name {
        width: 100%;
        display: inline-block;
        font-size: 1rem;
        line-height: 1rem;
        margin-top: 12px;
        color: #222222;
        font-family: Alibaba PuHuiTi R;
        text-align: center;
        span {
          display: inline-block;
          max-width: 13rem;
          overflow: hidden;
          text-align: center;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
:deep(.el-dropdown-menu__item):hover {
  color: #26a5ec;
  transition: 0.3s;
}
.copyright {
  width: 100%;
  text-align: center;
  color: #666666;
  font-size: 14px;
  line-height: 14px;
  font-family: Alibaba PuHuiTi R;
  padding: 2.5rem 0;
  position: absolute;
  bottom: 0px;
}
</style>
