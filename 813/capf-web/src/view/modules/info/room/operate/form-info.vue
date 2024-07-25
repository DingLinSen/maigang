<!--
 * @description sysexaminationroom- ${comments}--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container">
    <div class="details-title">
      <p>{{isSee ? '查看' + routerTitle + '信息' : (!isOperate ? '新增' + routerTitle + '信息' : '编辑' + routerTitle + '信息')}}</p><Icon type="md-close" @click.stop="handleCancleModel"/>
    </div>
    <div class="details-content">
      <Form :model="formData" ref="formValidate" :rules="formValidate">
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="考场名称" label-position="top" prop="name">
              <Input
                type="text"
                v-model.trim="formData.name"
                placeholder="请输入考场名称"
                ref="name"
                :disabled="isSee"
                :maxlength="10"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="考场地点" label-position="top" prop="location">
              <Input
                type="text"
                v-model.trim="formData.location"
                placeholder="请输入考场地点"
                ref="location"
                :disabled="isSee"
                :maxlength="50"
              />
            </FormItem>
          </Col>
          <Col span="24">
              <FormItem label="所属单位" label-position="top" prop="dept">
                <Cascader :data="deptList" v-model="formData.dept" placeholder="请选择所属单位"
                :disabled="isSee"  @on-change="selDept" style="width:100%" :clearable="false" change-on-select></Cascader>
              </FormItem>
            </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate"  v-if="!isSee">确认{{ !isOperate ? '新增' : '编辑' }}</Button>
        <Button type="error" ghost class="mar-lft-10" @click.stop="handleReset" v-if="!isSee">重置信息</Button>
        <Button type="default" class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { operateExaminationrRoomInfo, initExaminationrRoomDetailsById } from '@/api/info/room/api-modules-examinationroom'
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { treeDataTranslate } from '@/utils'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      deptList: [] // 所属单位
    }
  },
  computed: {
  },
  activated() {
    this.initSelect()
    this.initFormData()
  },
  methods: {
    initSelect() {
      initAllDeptList()
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            // 0正常 1停用
            // let deptList = data.filter(item => item.status === '0')
            let deptList = []
            data.forEach(item => {
              if(item.status === '0') {
                deptList.push({
                  ...item,
                  value: item.deptId,
                  label: item.deptName
                })
              }
            })
            this.deptList = treeDataTranslate(deptList, 'deptId')
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        if (this.isOperate) {
          initExaminationrRoomDetailsById(params).then(res => {
            if (res.data.status) {
              const data = res.data.sysExaminationRoomDO
              if (data == null) {
                this.$Message.error('未查询到相关信息')
                this.handleCancleModel()
                return
              }

              this.formData = res.data.sysExaminationRoomDO
              let levelDept = []
              if(data.levelDept) {
                levelDept = data.levelDept.split(',')
                if(data.deptId) {
                  levelDept.push(data.deptId)
                  if(levelDept.length && levelDept[0] === '0') {
                    levelDept = levelDept.splice(1, levelDept.length - 1)
                    this.formData.dept = levelDept
                  }
                }
              }
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
      operateExaminationrRoomInfo(params).then(({ data }) => {
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
    // 选择部门
    selDept(value) {
      if(value && value.length > 0) {
        // this.$refs['formValidate'].fields.forEach(function (e) {
        //   if (e.prop === 'dept') {
        //     e.resetField()
        //   }
        // })
        this.formData.deptId = value[value.length - 1]
      }else if(value.length === 0) {
        this.formData.deptId = ''
      }else{
        this.formData.deptId = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
