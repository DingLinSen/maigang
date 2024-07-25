<template>
  <div class="upload_table">
    <Breadcrumbs>
      <template #rightContent>
        <ElButton class="no-bg-button" plain @click="AddAction(null)">
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
      </template>
    </Breadcrumbs>
    <div>
      <Table
        :border="false"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        cotentAlign="left"
        headerAlign="left"
        :statisticsList="true"
        :index="true"
        :emptyText="'暂无数据'"
        :height="defaultHeight"
        :isShowFilter="false"
        :selection="false"
      >
        <template #name="{ row }">
          <div v-if="row.isEdit" class="nameContent">
            <div class="nameInput">
              <el-input
                class="namePut"
                :class="!/^\s*$/.test(row.name) && row.name ? '' : 'namePutError'"
                v-model="row.name"
                maxlength="30"
                placeholder="请输入内容"
              ></el-input>
              <span class="ml-2 text-red-500">*</span>
            </div>
            <p class="nameTip" v-if="!row.name">请输入群组名称</p>
            <p class="nameTip" v-if="/^\s*$/.test(row.name) && row.name">不能输入纯空格</p>
          </div>
          <div v-else>
            {{ row.name }}
          </div>
        </template>
        <template #users="{ row }">
          <div class="userTr">
            <div v-if="row.users.length && !row.isEdit" class="userText">{{
              row.users.length ? row.users.map((v) => v.userName).join(',') : ''
            }}</div>
            <div v-if="row.isEdit" class="userTrx">
              <!-- <div v-if="" class="userGroupText" @click="personClick()">{{
              row.users.length ? row.users.map((v) => v.userName).join(',') : ''
            }}</div> -->
              <div
                class="userGroupText"
                :class="row.users.length ? 'userGroupTextBlick' : ''"
                @click="personClick()"
              >
                <div>{{ row.users.length ? row.users.map((v) => v.userName).join(',') : '' }}</div>
                <span class="ml-2 text-red-500 xing"></span>
                <p class="userIcon">
                  <Icon :size="14" icon="svg-icon:addper_icon" color="#7c878e" />
                </p>
              </div>

              <p class="groupTip" v-if="!row.users.length">请选择群组成员</p>
            </div>
          </div>
        </template>
        <template #managerUser="{ row }">
          <div v-if="row.isEdit && row.addUser" class="nameInput createdNameInput">
            <el-select v-model="row.managerUser" filterable placeholder="请选择创建人">
              <el-option
                v-for="item in userData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div v-else>
            {{ row.managerUserName }}
          </div>
        </template>

        <template #action="{ row, $index }">
          <div class="flex justify-center">
            <ElButton
              class="btn-default"
              :text="true"
              v-if="!row.isEdit && wsCache.get('userInfo').userId == row.managerUser"
              size="small"
              @click="AddAction(row, 'edit', $index)"
            >
              编辑
            </ElButton>
            <ElButton
              class="btn-default"
              v-if="row.isEdit"
              :text="true"
              size="small"
              @click="AddAction(row, 'save', $index)"
            >
              保存
            </ElButton>
            <!-- <ElButton v-if="!row.admin" type="success" :text="true" @click="action(row, 'see')">
                            详情
                          </ElButton> -->
            <ElButton
              class="btn-default"
              :text="true"
              size="small"
              v-if="wsCache.get('userInfo').userId == row.managerUser"
              @click="delData(row, false)"
            >
              删除
            </ElButton>
          </div>
        </template>
      </Table>
    </div>
    <PersonnelSelection
      :is-dept="false"
      :is-group="false"
      ref="personnelSelectionRef"
      @sure-click="savePerson"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, h, nextTick } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { Table } from '@/components/Table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Icon } from '@/components/Icon'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { getGroupListApi, groupEditApi, groupSaveApi, delGroupApi } from '@/api/personal/myGroup'
import { ElButton, ElMessage } from 'element-plus'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { useCache } from '@/hooks/web/useCache'
const usersData = ref([])
const { tableObject, methods } = useTable<TableData>({
  getListApi: getGroupListApi,
  delListApi: delGroupApi,
  response: {
    list: 'data',
    total: 'total'
  }
})

const { wsCache } = useCache()

let deptData = ref<any>([])
const filiteDeptData = ref<any>([])
//人员数据
const userData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    deptData.value = res.data
    filiteDeptData.value = res.data.map((v) => {
      return {
        value: v.deptId,
        label: v.deptName
      }
    })
    userData.value = data.map((v) => {
      return {
        value: v.userId,
        label: v.nickName
      }
    })
  } catch (error) {
    console.log(error)
  }
}
getAllUserlist()
// 视窗高度

const getPadding = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH =
      parseFloat(getComputedStyle(checkboxWrapper).paddingBottom) +
      parseFloat(getComputedStyle(checkboxWrapper).paddingTop) +
      parseFloat(getComputedStyle(checkboxWrapper).marginBottom) +
      parseFloat(getComputedStyle(checkboxWrapper).marginTop)
  }
  return topH
}

const defaultHeight = ref<number>(0)
const resetTableHeight = () => {
  const documentClientHeight = getOverViewWrapper('body')
  const overView = getOverViewWrapper('.v-tool-header')
  const tagsHeight: any = getOverViewWrapper('.tags-view-cont')

  const toolHeaderPadding = getPadding('.v-tool-header')
  const uploadTablePadding = getPadding('.upload_table')
  const tagsViewContMargin = getPadding('.tags-view-cont')
  const elPaginationHeight = getOverViewWrapper('.el-pagination')
  const elPaginationPadding = getPadding('.el-pagination')
  const overViewWrapper = getOverViewWrapper('#tags-view-cont')
  nextTick(() => {
    defaultHeight.value =
      documentClientHeight -
      overView -
      tagsHeight -
      elPaginationHeight -
      elPaginationPadding -
      overViewWrapper -
      tagsViewContMargin -
      uploadTablePadding -
      toolHeaderPadding
  })
}
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}

const { getList } = methods

getList()

const getElTagLabel = (value: string): string => {
  let label = '--'
  userData.value.forEach((item: any) => {
    if (Number(value) === Number(item.value)) {
      label = item.label
    }
  })
  return label
}
// 存放表格的数据
const crudSchemas = reactive<any>([
  {
    field: 'name',
    label: '群组名称',
    minWidth: '160px',
    formatter: (row: Recordable) => {
      return h('span', row.title ? row.title : '--')
    }
  },
  {
    field: 'users',
    label: '群组成员',
    minWidth: '700px'
    // formatter: (row: Recordable) => {
    //   return h('span', row.title ? row.title : '--')
    // }
  },
  {
    field: 'managerUser',
    label: '创建人',
    minWidth: '90px'
  },
  {
    field: 'action',
    headerAlign: 'center',
    label: '操怍',
    minWidth: '120px'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const grounpUser = ref([])
const personnelSelectionRef: any = ref(null)
const delLoading = ref(false)
// 删除
const delData = async (row: TableData | null, multiple: boolean) => {
  console.log(row, 9999)

  if (!row.createTime) {
    tableObject.tableList.shift()
    return false
  }

  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()

  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const rowIndex = ref()
const AddAction = async (row, type?, index = null) => {
  if (row) {
    if (type === 'save') {
      if (!row.name || !row.users.length || /^\s*$/.test(row.name)) {
        return false
      }

      if (row.id != undefined) {
        let data: any = {
          name: row.name,
          users: row.users.map((v) => {
            return {
              userId: v.userId
            }
          }),
          managerUserName: getElTagLabel(row.managerUser),
          managerUser: row.managerUser
        }
        data.id = row.id
        let res = await groupEditApi(data)
        if (res) {
          ElMessage.success('编辑成功')
          row.isEdit = false
        }
      } else {
        let data: any = {
          name: row.name,
          users: row.users.map((v) => {
            return {
              userId: v.userId
            }
          }),
          managerUserName: row.managerUserName,
          managerUser: row.managerUser
        }
        let res = await groupSaveApi(data)
        if (res) {
          ElMessage.success('保存成功')
          row.isEdit = false
        }
      }
      usersData.value = []
      getList()
      // getList()
    } else if (type === 'edit') {
      let flag = tableObject.tableList.some((v) => {
        return v.isEdit == true
      })

      if (flag) {
        ElMessage.error('存在未保存的群组内容，请保存后再进行编辑！')
        return false
      }

      grounpUser.value = row.users
      rowIndex.value = index
      usersData.value = []
      row.isEdit = true
      row.addUser = true
    }
  } else {
    let flag = tableObject.tableList.some((v) => {
      return v.isEdit == true
    })

    if (flag) {
      ElMessage.error('存在未保存的群组内容，请保存后再进行新增！')
      return false
    }

    // let a = document.querySelector('.el-scrollbar__wrap')
    // console.log(a.scrollTop)
    grounpUser.value = []
    rowIndex.value = 0
    tableObject.tableList.unshift({
      name: '',
      users: [],
      managerUserName: wsCache.get('userInfo').nickName,
      managerUser: wsCache.get('userInfo').userId,
      isEdit: true,
      addUser: false
    })
  }
}

const savePerson = (data) => {
  console.log(data, 934567)
  usersData.value = data.personalData.userList
  tableObject.tableList[rowIndex.value].users = data.personalData.userList
  grounpUser.value = tableObject.tableList[rowIndex.value].users
}
onMounted(() => {
  resetTableHeight()
})
const personClick = () => {
  console.log(grounpUser.value, 888)
  let data = {
    userData: grounpUser.value
  }
  personnelSelectionRef.value.openDialog(data)
}
</script>
<style scoped lang="less">
.upload_table {
  padding: 20px;
}
.userTr {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.userTrx {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.userText {
  // border: 1px solid #f00;
  width: 100%;
  min-height: 38px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  width: 100%;
  padding: 0 20px 0 0;
  margin-right: 12px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  white-space: pre-wrap;
}

.userGroupText {
  background: #fff;
  border: 1px solid #f00;
  min-height: 38px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  width: 100%;
  padding: 0 30px 0 4px;
  margin-right: 12px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  white-space: pre-wrap;
  position: relative;
  div {
    overflow: hidden;
  }
  span {
    position: absolute;
    right: -15px;
    top: 0;
    &::after {
      content: '*';
    }
  }
}

.userGroupTextBlick {
  border: 1px solid #dcdfe6;
}
.userIcon {
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 38px;
  width: 20px;
  right: 4px;
}

.nameInput {
  display: flex;
  justify-content: center;
}

.nameContent {
  text-align: left;
}
.nameTip {
  font-size: 12px;
  text-align: left;
  color: rgba(255, 0, 0, 0.8);
}

.groupTip {
  width: 100%;
  text-align: left;
  font-size: 12px;
  color: rgba(255, 0, 0, 0.8);
  margin-left: -12px;
}
:deep(.namePut input),
:deep(.nameInput input) {
  text-align: left !important;
}
// .createdNameInput{

// }
</style>

<style lang="less">
.namePutError {
  .el-input__wrapper {
    border: 1px solid #f00 !important;
    box-shadow: 0 !important;
  }
  .el-input__wrapper {
    box-shadow: 0 0 0 0 #fff inset;
  }
}
</style>
