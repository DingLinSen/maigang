 <!--
  * @description 角色--编辑界面
  * @author yxm
  * @date 2021-10-19
-->
<template>
  <div class="details-container">
    <div class="details-title">
      <p>{{isSee ? '查看' + routerTitle + '信息' : (!isOperate ? '新增' + routerTitle + '信息' : '编辑' + routerTitle + '信息')}}</p><Icon type="md-close" @click.stop="handleCancleModel"/>
    </div>
    <div class="details-content">

      <Form :model="formData" ref="formValidate" :rules="formValidate">
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="角色名称" label-position="top" prop="roleName">
              <Input
                type="text"
                v-model.trim="formData.roleName"
                placeholder="请输入角色名称"
                ref="roleName"
                :disabled="isSee"
                :maxlength="10"
              />
            </FormItem>
          </Col>
          <!-- <Col span="12">
            <FormItem label="排序" label-position="top" prop="orderNum">
              <Input
                type="text"
                v-model.trim="formData.orderNum"
                placeholder="请输入排序"
                ref="orderNum"
                :maxlength="3"
                :disabled="isSee"
              />
            </FormItem>
          </Col> -->
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="角色描述" label-position="top" prop="roleDesc">
              <Input
                type="textarea"
                :row="3"
                v-model="formData.roleDesc"
                placeholder="请输入角色描述"
                ref="roleDesc"
                :disabled="isSee"
                :maxlength="50"
                show-word-limit
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
          <br>
            <Divider class="mar-no" />
            <FormItem label="菜单权限" label-position="top" prop="menuList">
              <!-- :check-strictly="true" -->
              <div style="display:inline-block;width:100%;">
                <Tree :data="menuItems" ref="tree" show-checkbox multiple @on-check-change="treeCheckChange"></Tree>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate"  v-if="!isSee">确认{{ !isOperate ? '新增' : '编辑' }}</Button>
        <Button type="default" class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { initMenuList, initMenuTreeByRoleId } from '@/api/sys/api-modules-menu'
import { operateRoleInfo, initRoleDetailsById } from '@/api/sys/api-modules-role'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
import { treeDataTranslate } from '@/utils'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      menuChecked: [],
      menuItems: [],
      allMenu: [] // 所有菜单数组
    }
  },
  computed: {
    userId: {
      get() {
        return this.$store.state.user.userId
      }
    }
  },
  activated() {
    this.initFormData()
  },
  methods: {
    // 初始化菜单
    initMenu() {
      var _this = this
      this.allMenu = []
      this.menuItems = []
      initMenuList(this.searchParams).then((res) => {
        if(res.status) {
          var dataList = res.data.data
          if (dataList) {
            dataList.forEach(item => {
              _this.allMenu.push({
                menuId: item.menuId,
                title: item.name,
                parentId: item.parentId,
                checked: false
              })
            })
            if (this.isOperate) {
              // 获取本角色选中的值
              initMenuTreeByRoleId({
                id: this.detailsId
              }).then(res => {
                if (res.data.data.length > 0) {
                  this.menuChecked = res.data.data
                  if (this.allMenu.length > 0) {
                    if (_this.menuChecked.length > 0) {
                      for (var i = 0; i < this.allMenu.length; i++) {
                        for (var k = 0; k < this.menuChecked.length; k++) {
                          if (this.allMenu[i].menuId === _this.menuChecked[k].menuId) {
                            this.allMenu[i].checked = true
                          }
                        }
                      }
                    }
                  }
                }
              })
            } else{
              this.formData = FormDataInfo()
            }
            if(this.isSee) {
              for (var i = 0; i < this.allMenu.length; i++) {
                this.allMenu[i].disabled = true
                this.allMenu[i].expand = true
              }
            }
            this.menuItems = treeDataTranslate(this.allMenu, 'menuId')
            this.$forceUpdate()
          }
        }
      }).catch(() => {
      })
    },
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      this.initMenu()
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        if (this.isOperate) {
          initRoleDetailsById(params).then(res => {
            if (res.data.status) {
              const data = res.data
              if (data == null) {
                this.$Message.error('未查询到相关信息')
                this.handleCancleModel()
                return
              }
              this.formData = res.data.data
              this.formData.orderNum = (this.formData.orderNum || this.formData.orderNum === 0) ? String(this.formData.orderNum) : null
            } else {
              this.formData = FormDataInfo()
              // this.$Message.error('获取信息详情时异常，请联系管理员')
            }
          }).catch(() => {
          })
        }
      })
    },
    // 保存信息 （添加和编辑）
    handleSubmit() {
      var menuItem1 = this.$refs.tree.getCheckedAndIndeterminateNodes()
      let menuIds = ''
      var menuItem2 = []
      for (var i = 0; i < menuItem1.length; i++) {
        menuItem2.push(menuItem1[i].menuId)
        if (menuIds === '') {
          menuIds = menuIds + menuItem1[i].menuId
        } else {
          menuIds = menuIds + ',' + menuItem1[i].menuId
        }
      }
      let params = Object.assign(
        { ...this.formData },
        {
          isOperate: this.isOperate
        }
      )
      Object.keys(this.formData).forEach((item, index) => {
        if (!params[item]) {
          if(this.formData[item]) {
            params[item] = ((this.formData[item] || null) + '').trim()
          }
        }
      })
      params.menuIdList = menuItem2
      operateRoleInfo(params).then(({ data }) => {
        this.$Spin.hide()
        if (data.status) {
          this.$Message.success('成功保存信息')
          this.handleCancleModel()
          this.$nextTick(() => {
            this.$emit('operateSuccess', params)
          })
        } else {
          // this.$Message.error('保存信息时系统异常')
        }
      }).catch(() => {
      })
    },
    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.initFormData()
    },
    // 树状点击复选框时触发
    treeCheckChange() {
      this.$refs['formValidate'].fields.forEach(function(e) {
        if (e.prop === 'menuList') {
          e.resetField()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/.ivu-drawer-body {
//   overflow-x: hidden;
// }
/deep/.ivu-tree-title{
  background: #ffffff;
  cursor: auto;
  &:hover{
    background: #ffffff;
  }
}
/deep/.ivu-tree-title-selected{
  background: #ffffff;
  &:hover{
    background: #ffffff;
  }
}
</style>
