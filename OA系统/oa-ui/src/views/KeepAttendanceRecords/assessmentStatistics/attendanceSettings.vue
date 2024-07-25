<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getConfigApi, auditProjectApi } from '@/api/assessment/statistics'
import { ElDialog } from '@/components/ElDialog'
import { ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
const { notSpace } = useValidator()

const loading = ref(false)
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  DialogFlag.value = true
  getSetting()
}

const getSetting = async () => {
  let res = await getConfigApi()
  if (res && res.data) {
    let data = res.data
    ruleForm.value = {
      startEndDate: [data.startTime ? data.startTime : '', data.endTime ? data.endTime : ''],
      name: data.name,
      status: data.status,
      kqRule: {
        beLate: data.configSubs.filter((v) => v.status == 1)[0].statusValue, // 迟到
        leaveEarly: data.configSubs.filter((v) => v.status == 2)[0].statusValue //早退
      },
      annualLeave: data.configSubs
        .filter((v) => v.status == 4)[0]
        .statusValue.replace(/;(?=[^;]*$)/, '')
        .split(';')
        .map((v) => {
          let obj = {}
          if (v.split(',').length == 3) {
            obj = {
              startYear: v.split(',')[0],
              endYear: v.split(',')[1],
              date: v.split(',')[2]
            }
          } else {
            obj = {
              startYear: v.split(',')[0],
              endYear: '',
              date: v.split(',')[1]
            }
          }
          return obj
        })
    }
  }
}

//表单数据
const ruleForm = ref<any>({
  startEndDate: [],
  name: '',
  kqRule: {
    beLate: '', // 迟到
    leaveEarly: '' //早退
  },
  status: '',
  beLate: '', // 迟到
  leaveEarly: '', //早退
  annualLeave: [
    {
      startYear: '',
      endYear: '',
      date: ''
    }
  ] // 年假
})

const formRef = ref<any>()
const rules = reactive({
  name: [
    { required: true, message: '请输入规则名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  startEndDate: [{ required: true, message: '请选择考勤时间', trigger: 'blur' }],
  kqRule: [
    {
      validator: (rule: any, value: any, callback: Callback) => {
        if (value.beLate && value.leaveEarly) {
          if (
            ((/^[z0-9]+$/gi.test(value.beLate) && value.beLate > 0) || !value.beLate) &&
            ((/^[z0-9]+$/gi.test(value.leaveEarly) && value.leaveEarly > 0) || !value.leaveEarly)
          ) {
            callback()
          } else {
            callback(new Error('请输入大于0且小于1000的整数'))
          }
        } else {
          if (!value.beLate) {
            callback(new Error('请输入迟到规则'))
          }
          if (!value.leaveEarly) {
            callback(new Error('请输入早退规则'))
          }
        }
      }
    }
  ],
  annualLeave: [
    {
      validator: (rule: any, value: any, callback: Callback) => {
        let cz = value.every((v, index) => {
          if (index < value.length - 1 && index >= 0) {
            return v.startYear && v.endYear && v.date
          } else if (index == value.length - 1) {
            return v.startYear && v.date
          } else {
            return true
          }
        })

        if (cz) {
          let endDaYstart = value.every((v, index) => {
            if (index < value.length - 1 && index >= 0) {
              return v.startYear < v.endYear
            } else if (index == value.length - 1) {
              return v.startYear
            } else {
              return true
            }
          })
          if (endDaYstart) {
            let a = value.every((v, index) => {
              if (index < value.length - 1 && index >= 0) {
                return value[index + 1].startYear >= value[index].endYear
              } else if (index == value.length - 1) {
                return (
                  Number(value[value.length - 1].startYear) >=
                  Number(value[value.length - 2].endYear)
                )
              } else {
                return true
              }
            })
            if (a) {
              callback()
            } else {
              callback(new Error('每次的开始年限必须大于等于上一次的结束年限'))
            }
          } else {
            callback(new Error('结束年限必须大于开始年限'))
          }
        } else {
          callback(new Error('请填写年假规则'))
        }
      }
    }
  ]
})

const save = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      let beLate = [
        {
          status: '1',
          statusValue: ruleForm.value.kqRule.beLate
        }
      ]
      let leaveEarly = [
        {
          status: '2',
          statusValue: ruleForm.value.kqRule.leaveEarly
        }
      ]
      let annualLeave: any = [
        {
          status: '4',
          statusValue: ruleForm.value.annualLeave
            .map((v) => {
              if (!v.startYear && !v.endYear && !v.date) {
                return ''
              } else {
                return v.startYear + ',' + (v.endYear ? v.endYear + ',' : '') + v.date + ';'
              }
            })
            .join('')
        }
      ]

      let data = {
        name: ruleForm.value.name,
        configSubs: [...beLate, ...leaveEarly, ...annualLeave],
        endTime: ruleForm.value.startEndDate[1],
        startTime: ruleForm.value.startEndDate[0]
      }

      let res = await auditProjectApi(data)

      if (res && res.data) {
        ElMessage.success({
          message: '保存成功!'
        })
        DialogFlag.value = false
      }
    }
  })
}

//关闭drawer
const closeDrawer = () => {
  // drawerWrap.value.isShow = false
  DialogFlag.value = false
}

const add = () => {
  if (ruleForm.value.annualLeave.length <= 5) {
    ruleForm.value.annualLeave.splice(ruleForm.value.annualLeave.length - 1, 0, {
      startYear: '',
      endYear: '',
      date: ''
    })
  } else {
    ElMessage.error({
      message: '新增年假考勤已达最大，不可继续新增!'
    })
  }
}

const del = (index) => {
  ruleForm.value.annualLeave.splice(index, 1)
}

defineExpose({
  openDrawer
})
</script>

<template>
  <ElDialog
    ref="ElDialogFef"
    class="cultivate-custom"
    v-model="DialogFlag"
    @closed="DialogFlag = false"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="14">
          <el-form-item label="规则名称" prop="name">
            <el-input
              type="input"
              maxlength="20"
              v-model="ruleForm.name"
              placeholder="请输入规则名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="考勤时间" prop="startEndDate">
            <el-time-picker
              is-range
              :clearable="true"
              v-model="ruleForm.startEndDate"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="规则" prop="kqRule">
            <div class="w-full">
              <div class="flex items-center">
                <p>迟到：工作开始后</p>
                <el-input v-model="ruleForm.kqRule.beLate" maxlength="4" class="timer-input" />
                <p>分钟内，则迟到。</p>
              </div>
              <div class="flex items-center">
                <p>早退： 工作结束前</p>
                <el-input v-model="ruleForm.kqRule.leaveEarly" maxlength="4" class="timer-input" />
                <p>分钟内，则早退</p>
              </div>
              <div class="flex items-center">
                <p>迟到超过</p>
                <p class="px-5px">{{ ruleForm.kqRule.beLate ? ruleForm.kqRule.beLate : 0 }}</p>
                <p>分钟，早退超过</p>
                <p class="px-5px">{{
                  ruleForm.kqRule.leaveEarly ? ruleForm.kqRule.leaveEarly : 0
                }}</p>
                <p>分钟，未请假不到岗者则旷工。</p>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="年假" prop="annualLeave">
            <div>
              <div v-for="(item, index) in ruleForm.annualLeave" :key="index">
                <div v-if="index !== ruleForm.annualLeave.length - 1" class="flex items-center">
                  <el-input v-model="item.startYear" maxlength="1" class="timer-input" />
                  <p>&lt;年限&lt;</p>
                  <el-input v-model="item.endYear" maxlength="1" class="timer-input" />
                  <p>年，年假为</p>
                  <el-input v-model="item.date" maxlength="2" class="timer-input" />
                  <p>天；</p>
                  <p
                    v-if="
                      index == ruleForm.annualLeave.length - 2 && ruleForm.annualLeave.length < 5
                    "
                    class="text-blue-500 cursor-pointer mr-4px"
                    @click="add"
                    >添加</p
                  >
                  <p
                    v-if="index < ruleForm.annualLeave.length - 1 && index > 1"
                    class="text-blue-500 cursor-pointer"
                    @click="del(index)"
                    >删除</p
                  >
                </div>
                <div v-else class="flex items-center">
                  <p>&gt;</p>
                  <el-input v-model="item.startYear" maxlength="1" class="timer-input" />
                  <p>年，年假为</p>
                  <el-input v-model="item.date" maxlength="2" class="timer-input" />
                  <p>天；</p>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" :disabled="loading" @click="save"
          >提交</el-button
        >
        <el-button @click="closeDrawer">取消</el-button>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
</style>
<style>
.timer-input {
  width: 4.686vw !important;
  margin: 6px 0.4vw;
  border-radius: 4px;
}
</style>
