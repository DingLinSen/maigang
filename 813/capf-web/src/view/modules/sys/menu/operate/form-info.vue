 <!--
  * @description 菜单管理-编辑界面
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
          <Col :span="12">
            <FormItem label="上级目录" label-position="top" prop="parentName">
              <Input
                type="text"
                v-model="formData.parentName"
                placeholder="请输入上级目录"
                ref="parentName"
                :maxlength="100"
                disabled="disabled"
              />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="类型" label-position="top" prop="type">
              <Select
                v-model="formData.type"
                ref="type"
                :disabled="isSee || isOperate"
                remote
                name="select"
                :clearable = 'false'
                placeholder="请选择类型"
              >
                <Option
                  :value="item.id"
                  v-for="(item, index) in typeData"
                  :key="index"
                  >{{item.name}}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32" index="">
          <Col :span="12">
            <FormItem label="名称" label-position="top" prop="name">
              <Input
                type="text"
                v-model.trim="formData.name"
                placeholder="请输入名称"
                ref="name"
                :maxlength="8"
                :disabled="isSee"
              />
            </FormItem>
          </Col>
          <Col :span="12">
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
          </Col>
          <Col :span="24">
            <FormItem label="图标" label-position="top" prop="icon"  v-if="formData.type === '0'">
              <Input
                type="text"
                v-model.trim="formData.icon"
                placeholder="请输入图标"
                ref="icon"
                :maxlength="30"
                :disabled="isSee"
              />
            </FormItem>
          </Col>
          <Col :span="24" v-if="formData.type === '1'">
            <FormItem label="URL" label-position="top" prop="url">
              <Input
                type="text"
                v-model.trim="formData.url"
                placeholder="请输入URL"
                ref="url"
                :maxlength="100"
                :disabled="isSee"
              />
            </FormItem>
          </Col>
          <Col :span="24" v-if="formData.type === '2'">
            <!-- <FormItem :label="'权限' + prompt" label-position="top" prop="perms"> -->
            <FormItem :label="'权限 例如:sys:user:add'" label-position="top" prop="perms">
              <Input
                type="text"
                v-model.trim="formData.perms"
                placeholder="请输入权限"
                ref="perms"
                :maxlength="100"
                :disabled="isSee"
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
        </Row>
        <Row :gutter="32" index="">
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate">确认{{ !isOperate ? '新增' : '编辑' }}</Button>
        <!-- <Button type="error" class="mar-lft-10" @click.stop="handleResetSub" ghost v-if="isSee">重置信息</Button> -->
        <Button type="default" class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { initMenuDetailsById, operateMenuInfo } from '@/api/sys/api-modules-menu'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      menuCascaderList: [], // 菜单树Data
      menuDataList: [], // 选中的父菜单
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      typeData: [
        {
          id: '0',
          name: '目录'
        },
        {
          id: '1',
          name: '菜单'
        },
        {
          id: '2',
          name: '按钮'
        }
      ],
      prompt: '' // 添加时的提示
    }
  },
  props: {
    isSee: {
      default: false,
      type: Boolean
    },
    isOperate: {
      default: false,
      type: Boolean
    },
    detailsId: {
      default: null,
      type: String
    },
    addTree: {
      default: null,
      type: Boolean
    }
  },
  activated() {
    this.initFormData()
    this.$forceUpdate()
  },
  components: {
    Treeselect
  },
  methods: {
    // 根据id 获取详情 初始化表单
    initFormData() {
      this.handleReset() // 重置表单
      if (this.isOperate) {
        // 编辑
        initMenuDetailsById({ id: this.detailsId }).then(res => {
          if (res.data.status) {
            const data = res.data.data
            if (data == null) {
              this.handleCancleModel()
              return
            }
            this.transFormData(data)
            this.formData = data
            this.formData.parentName = data.parentName
            this.formData.type = data.type + ''
            this.formData.orderNum = data.orderNum + ''
            switch (data.type) {
              case '0':
                this.typeData = [
                  {
                    id: '0',
                    name: '目录'
                  }
                  // {
                  //   id: '1',
                  //   name: '菜单'
                  // }
                  // {
                  //   id: '2',
                  //   name: '按钮'
                  // }
                ]
                this.formData.parentName = this.formData.parentName ? this.formData.parentName : '根目录'
                break
              case '1':
                this.typeData = [
                  // {
                  //   id: '0',
                  //   name: '目录'
                  // },
                  {
                    id: '1',
                    name: '菜单'
                  },
                  {
                    id: '2',
                    name: '按钮'
                  }
                ]
                this.formData.parentName = this.formData.parentName ? this.formData.parentName : '根目录'
                break
              case '2':
                this.typeData = [
                  {
                    id: '2',
                    name: '按钮'
                  }
                ]
                break
              default:
                break
            }
          } else {
            this.formData = FormDataInfo()
          }
        })
      } else {
        // 新增
        this.typeData = []
        this.formData = FormDataInfo()
        this.$forceUpdate()
        if (this.addTree) {
          this.formData.parentId = '0'
          this.formData.parentName = '根目录'
          this.formData.type = '0'
          this.typeData = [
            {
              id: '0',
              name: '目录'
            }
            // {
            //   id: '1',
            //   name: '菜单'
            // }
          ]
        } else {
          if (this.detailsId) {
            initMenuDetailsById({id: this.detailsId}).then(res => {
              if (res.data.status) {
                const data = res.data.data
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                this.formData.parentId = data.menuId
                this.formData.parentName = data.name
                switch (data.type) {
                  case 0:
                    this.typeData = [
                      {
                        id: '0',
                        name: '目录'
                      },
                      {
                        id: '1',
                        name: '菜单'
                      }
                    ]
                    this.formData.type = '1'
                    break
                  case 1:
                    this.typeData = [
                      // {
                      //   id: '0',
                      //   name: '目录'
                      // },
                      // {
                      //   id: '1',
                      //   name: '菜单'
                      // },
                      {
                        id: '2',
                        name: '按钮'
                      }
                    ]
                    this.formData.type = '2'
                    break
                  default:
                    break
                }
                this.$forceUpdate() // 刷新表单
              } else {
                this.formData = FormDataInfo()
              }
            }).catch(() => {
            })
          }
        }
      }
    },
    // 保存信息, 表单提交
    handleSubmit() {
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
      operateMenuInfo(params).then(({ data }) => {
        this.$Spin.hide()
        if (data.status) {
          this.$Message.success('成功保存信息')
          this.handleCancleModel()
          this.$nextTick(() => {
            this.$emit('operateSuccess', params)
          })
        } else {
          this.$Message.error(data.data.msg)
        }
      }).catch(() => {
      })
    },
    // 重置信息按钮事件
    handleReset() {
      this.$refs['formValidate'].resetFields()
    },
    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.initFormData()
    },
    handleResetSub() {
      if(this.isOperate) {
        let parentName = this.formData.parentName
        var type = this.formData.type
        if (this.$refs['formValidate']) {
          this.$refs['formValidate'].resetFields()
        }
        this.formData.parentName = parentName
        this.formData.type = type
      }else{
        let parentName = this.formData.parentName
        if (this.$refs['formValidate']) {
          this.$refs['formValidate'].resetFields()
        }
        this.formData.parentName = parentName
      }
    }

  }
}
</script>
