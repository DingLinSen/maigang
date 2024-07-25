<template>
  <ElDialog ref="elDialogFef" v-model="show" :title="'选择实施人员'" @closed="close()">
    <section
      class="personnel-selection-content flex h-[22.50vw] mx-[1.67vw] pt--[0.16vw] border-1 h-full"
    >
      <div class="content-left w-[24.22vw] h-full pt-2 pb-2">
        <ul class="overflow-auto h-full">
          <li class="cursor-pointer li-active">
            <div class="flex justify-between items-center h-[40px]">
              <div class="flex justify-start items-center">
                <div class="ml-[1.04vw] mr-[0.52vw]">
                  <el-checkbox
                    label=""
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange($event)"
                  />
                </div>
                <p>实施人员</p>
              </div>
            </div>
            <div class="pl-[2.56vw] meuns-content pb-16px">
              <el-checkbox-group v-model="userData" @change="handleUserDataChange($event)">
                <el-checkbox
                  v-for="(item, index) in userListData"
                  :key="index"
                  :label="item.userId"
                >
                  {{ item.nickName }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </li>
        </ul>
      </div>
      <div class="content-right flex-1 h-full border-l-1">
        <div class="h-[2.19vw] mb-[0.26vw] flex justify-between items-center ml-[0.73vw]">
          <span>已选</span>
          <span class="text-sm text-[#ff3939] mr-[0.52vw] cursor-pointer" @click="allDel()"
            >全部删除</span
          >
        </div>
        <ul class="h-[19.20vw] overflow-auto">
          <li
            class="bg-[#F4F4F4] h-[2.19vw] rounded flex items-center justify-between mx-[0.31vw] mb-[0.26vw]"
            v-for="(item, index) in userData"
            :key="index"
          >
            <span class="ml-[0.42vw]">{{ getUserLabel(item) }}</span>
            <Icon icon="ion:close-outline" class="mr-10px cursor-pointer" @click="del(item)" />
          </li>
        </ul>
      </div>
    </section>
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="submit()">提交</el-button>
        <el-button class="mr-[1.67vw]" @click="close()">取消</el-button>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, unref, watch } from 'vue'
import { ElDialog } from '@/components/ElDialog'

const { proxy } = getCurrentInstance() as any

const { implementation } = proxy.useDict('implementation')

const userListData = ref<any>([])

const userData = ref<any[]>([])
const show = ref<boolean>(false)

const dialogFlag = ref<boolean>(false)

const openDialog = (selectUser: any[]) => {
  userListData.value = []
  userData.value = []
  implementation.value.forEach((element: any) => {
    userListData.value.push({ userId: Number(element.value), nickName: element.label })
  })
  loading.value = false
  selectUser.forEach((item: any) => {
    let result = userListData.value.some((v: any) => {
      return v.userId == item
    })
    if (result) {
      userData.value.push(item)
    }
  })
  // userData.value = selectUser
  isIndeterminateFun(userData.value)
  show.value = true
}

const emit = defineEmits(['sureClick'])
const loading = ref(true)

const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(false)

// 全选
const handleCheckAllChange = (val: any) => {
  let arr = unref(userListData).map((v) => v.userId)
  let userArr = unref(userData).map((v) => v)
  if (val) {
    userData.value = Array.from(new Set(userArr.concat(arr)))
  } else {
    userData.value = []
  }
  isIndeterminate.value = false
}

const getUserLabel = (value: string): string => {
  let label = ''
  unref(userListData).map((item: any) => {
    if (value == item.userId) {
      label = item.nickName
    }
  })
  return label
}

// 员工点击
const handleUserDataChange = (val: any) => {
  if (userListData.value && userListData.value.length > 0) {
    let userArr = unref(userData).map((v: any) => v)
    let arr = unref(userListData).map((v: any) => v.userId)
    let arrFlag = arr.filter((element: any) => !val.includes(element))
    if (arrFlag.length) {
      checkAll.value = false
      let flag = userArr.filter((element) => arr.includes(element))
      if (flag.length) {
        isIndeterminate.value = true
      } else {
        isIndeterminate.value = false
      }
    } else {
      isIndeterminate.value = false
      checkAll.value = true
    }
  }
}

//全删
const allDel = () => {
  userData.value = []
  checkAll.value = false
  isIndeterminate.value = false
}

// 删除
const del = (userId: any) => {
  let arr = [userId]
  let userArr = unref(userData).map((v) => v)
  userData.value = userArr.filter((element) => !arr.includes(element))
  if (userData.value.length) {
    if (userData.value.length == userListData.value.length) {
      checkAll.value = true
      isIndeterminate.value = false
    } else {
      checkAll.value = false
      isIndeterminate.value = true
    }
  } else {
    checkAll.value = false
    isIndeterminate.value = false
  }
}

// 全选状态回显
const isIndeterminateFun = (data: any) => {
  let arr = unref(userListData).filter((element: any) => data?.includes(Number(element.userId)))
  if (arr.length) {
    if (arr.length == userListData.value.length) {
      checkAll.value = true
      isIndeterminate.value = false
    } else {
      checkAll.value = false
      isIndeterminate.value = true
    }
  } else {
    checkAll.value = false
    isIndeterminate.value = false
  }
}

// 提交
const submit = () => {
  let arr = unref(userData).map((v) => v)
  show.value = false
  emit('sureClick', arr)
}

// 取消
const close = () => {
  show.value = false
  userData.value = []
}

defineExpose({
  openDialog
})
</script>

<style lang="less" scoped>
.drop-down {
  font-size: 20px !important;
  color: #000000;
}
.drop-down-active {
  transform: rotate(180deg) !important;
}
.li-active {
  background: #f4f4f4;
}
.personnel-selection {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;

  .personnel-selection-main {
    font-family: 'Alibaba PuHuiTi R';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 33.23vw;
    width: 40.625vw;
    background: #fff;
  }
  .btn {
    width: 5.21vw;
    height: 2.19vw;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    text-align: center;
    line-height: 2.19vw;
    font-size: 16px;
  }
}
.meuns-content {
  transition-duration: 0.5s;
}
</style>
<style lang="less">
.personnel-selection {
  .el-checkbox {
    margin-right: 10px !important;
  }
  .el-checkbox__label {
    width: 3.7vw !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
