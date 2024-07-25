<!--
 * @description systerminal- 系统管理-终端管理--新增/编辑查看/界面
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
            <FormItem label="设备编号" label-position="top" prop="codeNumber">
              <Input
                type="text"
                v-model.trim="formData.codeNumber"
                placeholder="请输入设备编号"
                ref="codeNumber"
                :disabled="isSee"
                :maxlength="30"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="ip地址" label-position="top" prop="ipAddress">
              <Input
                type="text"
                v-model.trim="formData.ipAddress"
                placeholder="请输入ip地址"
                ref="ipAddress"
                :disabled="isSee"
                :maxlength="20"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="硬件地址" label-position="top" prop="macAddress">
              <Input
                type="text"
                v-model.trim="formData.macAddress"
                placeholder="请输入硬件地址"
                ref="macAddress"
                :disabled="isSee"
                :maxlength="30"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="操作系统" label-position="top" prop="operatingSystem">
              <Input
                type="text"
                v-model.trim="formData.operatingSystem"
                placeholder="请输入操作系统"
                ref="operatingSystem"
                :disabled="isSee"
                :maxlength="30"
              />
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="所属考场" label-position="top" prop="examinationId">
              <Select v-model="formData.examinationId" placeholder="请选择所属考场"
                :disabled="isSee"  style="width:100%" :clearable="false" @on-change="selexamination()">
                <Option :value="item.id" :key="index" v-for="(item, index) in examinationList">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
             <Col span="12">
              <FormItem label="所属单位" label-position="top" prop="deptName">
                <Input
                type="text"
                v-model.trim="formData.deptName"
                placeholder="请输入所属单位"
                ref="location"
                disabled
                maxlength
              />
              </FormItem>
            </Col>
          <Col span="24">
            <FormItem label="所属位置" label-position="top" prop="location">
              <Input
                type="text"
                v-model.trim="formData.location"
                placeholder="请输入所属位置"
                ref="location"
                disabled
                maxlength
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate"  v-if="!isSee">确认{{ !isOperate ? '新增' : '编辑' }}</Button>
        <Button type="error" class="mar-lft-10" @click.stop="handleReset" v-if="!isSee" ghost>重置信息</Button>
        <Button type="default" class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { operateTerminalInfo, initTerminalDetailsById } from '@/api/sys/terminal/api-modules-terminal'
import { OPERATE_PAGE } from '@/libs/mixin'
import { initAllExaminationrRoomList } from '@/api/info/room/api-modules-examinationroom'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      examinationList: [] // 所属考场
    }
  },
  computed: {
  },
  activated() {
    this.initSelect()
    this.initFormData()
  },
  methods: {
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        if (this.isOperate) {
          initTerminalDetailsById(params).then(res => {
            if (res.data.status) {
              const data = res.data.sysTerminalDO
              if (data == null) {
                this.$Message.error('未查询到相关信息')
                this.handleCancleModel()
                return
              }
              this.formData = res.data.sysTerminalDO
              let levelDept = []
              if(data.levelDept) {
                levelDept = data.levelDept.split(',')
                if(levelDept.length && levelDept[0] === '0') {
                }
                if(data.deptId) {
                  levelDept.push(data.deptId)
                  this.formData.dept = levelDept
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
      operateTerminalInfo(params).then(({ data }) => {
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
    initSelect() {
      initAllExaminationrRoomList(this.searchParams).then(res => {
        if (res.data.status) {
          var data = res.data.data
          this.examinationList = data
        }else{

        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 选择考场
    selexamination(value) {
      this.examinationList.forEach(item => {
        if(item.id === this.formData.examinationId) {
          this.formData.deptName = item.deptName
          this.formData.location = item.location
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
