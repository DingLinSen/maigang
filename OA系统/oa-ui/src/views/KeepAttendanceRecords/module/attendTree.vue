<template>
  <ContentWrap
    :isShowtitle="false"
    id="treeContentWarp"
    class="mr-[0.73vw] h-771px overflow-auto treeContentWarp"
  >
    <PersonnelTree
      :data="treedata"
      :maxHeight="treeH"
      @tree="TreeClick"
      @all-tree-data="changeAlltree"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { PersonnelTree } from '@/components/PersonnelTree'
import { nextTick, ref } from 'vue'
import {
  getAllUserListApi // 获取所有用户
} from '@/api/user'
import {
  getAllDeptListApi // 获取所有部门
} from '@/api/sys/dept'
import { useEmitt } from '@/hooks/web/useEmitt'
const emit = defineEmits(['TreeClick'])

const treedata = ref<any>([])
// 获取部门树
const getDeptTreeList = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    treedata.value = res.data.map((v) => {
      return {
        id: v.deptId,
        label: v.deptName,
        children: data
          .filter((j) => j.deptId == v.deptId && j.userId != '1')
          .map((j) => {
            return {
              id: j.userId,
              label: j.nickName
            }
          })
      }
    })
  } catch (err) {
    console.log(err)
  }
}
// // 获取部门树
// const getDeptTreeList = async () => {
//   try {
//     const res = await getUserDeptListApi({ status: '0' }).finally(() => {})
//     treedata.value = res.data
//   } catch (err) {
//     console.log(err)
//   }
// }

getDeptTreeList()

// 全部树形图返回数据
const changeAlltree = (id: any, val: any) => {
  getDeptTreeList()
  emit('TreeClick', id, val.label, '')
}
// 树形图返回数据
let dept = ''
const TreeClick = (id: any, val: any) => {
  if (val.children) {
    dept = val.label
  }
  if (!val.children) {
    treedata.value.forEach((item, index) => {
      if (item.children) {
        if (item.children.some((v) => v.id == id)) {
          item.children.forEach((j, k) => {
            if (j.id == id) {
              dept = item.label
            }
          })
        }
      }
    })
    emit('TreeClick', id, val.label, dept)
  }
}

const treeH = ref<number>(600)
const restTreeHeight = () => {
  nextTick()
  setTimeout(() => {
    let wrapH = 771
    let padding = 20
    let searchH = 45
    const treeWrap = document.getElementById('treeContentWarp')
    if (treeWrap) {
      wrapH = treeWrap.clientHeight
      const cardBody = treeWrap.querySelector('.el-card__body')
      if (cardBody) {
        let computedStyle = getComputedStyle(cardBody, null)
        if (computedStyle) {
          padding = parseFloat(computedStyle.getPropertyValue('padding-top'))
        }
      }
      const searchContent = treeWrap.querySelector('.search-content')
      if (searchContent) {
        searchH = searchContent.clientHeight
        const form = treeWrap.querySelector('.el-form-item--default')
        if (form) {
          let computedStyle = getComputedStyle(form, null)
          if (computedStyle) {
            padding = searchH + parseFloat(computedStyle.getPropertyValue('margin-bottom'))
          }
        }
      }
      treeH.value = wrapH - padding - searchH
      console.log('treeH.value==>', treeH.value)
    }
  }, 500)
}

restTreeHeight()

//监听窗口高度变化
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      restTreeHeight()
    }
  }
})
</script>
