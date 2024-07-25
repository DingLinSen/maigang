<!-- 请假申请详情/审核 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import moment from 'moment'
import { Dialog } from '@/components/Dialog'
import { PointStep } from '../Step'

// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')

const openDrawer = async (row: any) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  flowDatas.value = []
  nextTick(() => {
    detailsId.value = row.id
    ruleForm.value.userName = row.createByName ? row.createByName : ''
    ruleForm.value.goodsName = row.shopName ? row.shopName : ''
    ruleForm.value.price = row.cash ? row.cash : '0'
    ruleForm.value.quantity = row.num ? row.num : '0'
    ruleForm.value.cashValue = row.cashSum ? '-' + row.cashSum : '0'
    ruleForm.value.totalPrice = row.cashSum ? row.cashSum : '0'
    flowDatas.value.push({
      roleName: '申请人',
      createByName: row.createByName,
      step: '提出申请',
      createTime: row.createTime
    })
    if (row.status == '1') {
      flowDatas.value.push({
        roleName: '行政专员',
        createByName: '张璐璐',
        step: '待采购',
        createTime: ''
      })
      flowDatas.value.push({
        roleName: '行政专员',
        createByName: '张璐璐',
        step: '待领取',
        createTime: ''
      })
    } else if (row.status == '2') {
      flowDatas.value.push({
        roleName: '行政专员',
        createByName: row.buyUserName,
        step: '已采购',
        createTime: row.buyDate
      })
      flowDatas.value.push({
        roleName: '行政专员',
        createByName: '张璐璐',
        step: '待领取',
        createTime: ''
      })
    } else if (row.status == '3') {
      flowDatas.value.push({
        roleName: '行政专员',
        createByName: row.buyUserName,
        step: '已采购',
        createTime: row.buyDate
      })
      flowDatas.value.push({
        roleName: '行政专员',
        createByName: row.endUserName,
        step: '已领取',
        createTime: row.endDate
      })
    }
  })
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    userName: '',
    goodsName: '',
    price: '',
    quantity: '',
    cashValue: '',
    totalPrice: ''
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  flowDatas.value = []
  resetForm()
}

//请假类型选择
const selApplyType = (value: any) => {}

//表单数据
const ruleForm = ref<any>({
  userName: '',
  goodsName: '',
  price: '',
  quantity: '',
  cashValue: '',
  totalPrice: ''
})

//表单验证规则
const rules = reactive({})

//审核流程
const flowDatas = ref<any[]>([])

defineExpose({
  openDrawer
})
</script>
<template>
  <Dialog
    ref="elDialogFef"
    width="68%"
    class="cultivate-custom"
    :maxHeight="'auto'"
    v-model="dialogFlag"
    title="积分兑换"
    v-loading="loading"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="flex w-full">
        <div class="left-form-class">
          <el-row>
            <el-col :span="24">
              <el-form-item label="姓名">
                <el-input
                  placeholder="请输入姓名"
                  maxlength="20"
                  v-model="ruleForm.userName"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="商品名称">
                <el-input
                  placeholder="请输入商品名称"
                  maxlength="100"
                  v-model="ruleForm.goodsName"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="单价">
                <el-input
                  placeholder="请输入单价"
                  maxlength="10"
                  v-model="ruleForm.price"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="数量">
                <el-input
                  placeholder="请输入数量"
                  maxlength="10"
                  v-model="ruleForm.quantity"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="总价">
                <el-input placeholder="请输入总价" v-model="ruleForm.totalPrice" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="现金价值">
                <el-input placeholder="请输入现金价值" v-model="ruleForm.cashValue" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="right-form-class">
          <p>兑换记录</p>
          <PointStep :flowDatas="flowDatas" />
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.red {
  color: red;
}

.left-form-class {
  width: 60%;
}
.sel-urgency-class {
  content: ' ';
  display: inline-block;
  margin-right: 0.16rem;
  width: 12px;
  height: 12px;
  vertical-align: text-bottom;
  border-radius: 4px;
}

.sel-urgency-low {
  background-color: #80c36a;
}

.sel-urgency-middle {
  background-color: #eeb915;
}

.sel-urgency-high {
  background-color: #df3c2f;
}
.right-form-class {
  width: 39%;
  padding-left: 30px;
  padding-right: 10px;
  overflow-y: auto;
}

.right-title-p-class {
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 400;
}

.right-title-p-class {
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 400;
}
</style>

